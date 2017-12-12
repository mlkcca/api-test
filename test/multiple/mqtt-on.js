const mqtt = require('mqtt')
const WebSocketClient = require('websocket').client
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']
const Milkcocoa = require('mlkcca')

function MQTTOn (uuid) {
  describe('MQTT subscribe HTTP', function () {
    this.timeout(10000)
    const agent = request.agent(settings.endpoint)
    const dspath = 'multiple/' + uuid + '/mqtt/http'

    it('should work', function (done) {
      const client = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        client.subscribe(settings.appId + '/' + dspath + '/_p')
        setTimeout(function () {
          agent
            .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath + '&v=1') // push 'number'
            .end(function () {})
        }, 100)
      })

      client.on('message', function (topic, message) {
        assert.deepEqual([topic, parseInt(message, 2)], [topic, 1])
        client.end()
        done()
      })
    })
  })

  describe('MQTT subscribe Websocket', function () {
    this.timeout(10000)
    const dspath = 'multiple/' + uuid + '/mqtt/websocket'
    var websocketclient, websocketconnection

    it('should work', function (done) {
      const client = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        client.subscribe(settings.appId + '/' + dspath + '/_p')
        setTimeout(function () {
          websocketclient = new WebSocketClient()
          websocketclient.on('connectFailed', function (error) {
            throw error
          })
          websocketclient.on('connect', function (connection) {
            websocketconnection = connection
            websocketconnection.on('error', function (error) {
              throw error
            })
            if (websocketconnection.connected) {
              setTimeout(function () {
                websocketconnection.sendUTF(2) // auto convert to string
              }, 100)
            }
          })
          websocketclient.connect(settings.websocketEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
        }, 100)
      })

      client.on('message', function (topic, message) {
        // message is string
        assert.deepEqual([topic, Number(message)], [topic, 2])
        websocketconnection.close()
        websocketclient.abort()
        client.end()
        done()
      })
    })
  })

  describe('MQTT subscribe JavaScript', function () {
    this.timeout(10000)
    const dspath = 'multiple/' + uuid + '/mqtt/javascript'

    it('should work', function (done) {
      const client = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        client.subscribe(settings.appId + '/' + dspath + '/_p')
        setTimeout(function () {
          const milkcocoa = new Milkcocoa(settings.jsOptions)
          const ds = milkcocoa.dataStore(dspath)
          // push 'number'
          ds.push(1, function (err, result) {
            if (err) throw err
          })
        }, 100)
      })

      client.on('message', function (topic, message) {
        assert.deepEqual([topic, parseInt(message, 2)], [topic, 1])
        client.end()
        done()
      })
    })
  })
}

MQTTOn(global.uuid || uuidv4())

module.exports = MQTTOn
