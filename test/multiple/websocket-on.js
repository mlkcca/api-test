const mqtt = require('mqtt')
const WebSocketClient = require('websocket').client
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']
const Milkcocoa = require('mlkcca')

function WebsocketOn (uuid) {
  let agent = request.agent(settings.endpoint)

  describe('Websocket subscribe HTTP', function () {
    const dspath = 'multiple/' + uuid + '/websocket/http'
    this.timeout(10000)
    it('should work', function (done) {
      const client = new WebSocketClient()
      client.on('connectFailed', function (error) {
        throw error
      })
      client.on('connect', function (connection) {
        connection.on('error', function (error) {
          throw error
        })
        connection.on('message', function (message) {
          // websocket onMessage value is always 'string'
          if (message.type === 'utf8') {
            const result = JSON.parse(message.utf8Data)
            assert.deepEqual([typeof result[0][0], typeof result[0][1], result[0][2]], ['number', 'string', '1'])
            connection.close()
            client.abort()
            done()
          }
        })
        if (connection.connected) {
          setTimeout(function () {
            agent
            .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath + '&v=1') // push 'number'
            .end(function () {})
          }, 1000)
        }
      })
      client.connect(settings.websocketEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })
  })

  describe('Websocket subscribe MQTT', function () {
    const dspath = 'multiple/' + uuid + '/websocket/mqtt'
    this.timeout(10000)
    it('should work', function (done) {
      const client = new WebSocketClient()
      var mqttclient
      client.on('connectFailed', function (error) {
        throw error
      })
      client.on('connect', function (connection) {
        connection.on('error', function (error) {
          throw error
        })
        connection.on('message', function (message) {
          if (message.type === 'utf8') {
            const result = JSON.parse(message.utf8Data)
            assert.deepEqual([typeof result[0][0], typeof result[0][1], result[0][2]], ['number', 'string', 'Hello as push'])
            mqttclient.end()
            connection.close()
            client.abort()
            done()
          }
        })
        if (connection.connected) {
          setTimeout(function () {
            const topic = settings.appId + '/' + dspath + '/_p'
            mqttclient = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
              username: 'k' + settings.apiKey,
              password: settings.appId
            })

            mqttclient.on('error', function (e) {
              throw e
            })

            mqttclient.on('connect', function (e) {
              setTimeout(function () {
                mqttclient.publish(topic, 'Hello as push')
              }, 100)
            })
          }, 1000)
        }
      })
      client.connect(settings.websocketEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })
  })

  describe('Websocket subscribe JavaScript', function () {
    const dspath = 'multiple/' + uuid + '/websocket/javascript'
    this.timeout(10000)
    it('should work', function (done) {
      const client = new WebSocketClient()
      client.on('connectFailed', function (error) {
        throw error
      })
      client.on('connect', function (connection) {
        connection.on('error', function (error) {
          throw error
        })
        connection.on('message', function (message) {
          // websocket onMessage value is always 'string'
          if (message.type === 'utf8') {
            const result = JSON.parse(message.utf8Data)
            assert.deepEqual([typeof result[0][0], typeof result[0][1], result[0][2]], ['number', 'string', '2'])
            connection.close()
            client.abort()
            done()
          }
        })
        if (connection.connected) {
          setTimeout(function () {
            const milkcocoa = new Milkcocoa(settings.jsOptions)
            const ds = milkcocoa.dataStore(dspath)
            // push 'number'
            ds.push(2, function (err, result) {
              if (err) throw err
            })
          }, 1000)
        }
      })
      client.connect(settings.websocketEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })
  })
}

WebsocketOn(global.uuid || uuidv4())

module.exports = WebsocketOn
