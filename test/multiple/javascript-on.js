const mqtt = require('mqtt')
const WebSocketClient = require('websocket').client
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']
const Milkcocoa = require('mlkcca')

function JavaScriptOn (uuid) {
  let agent = request.agent(settings.endpoint)

  const milkcocoa = new Milkcocoa(settings.jsOptions)

  describe('JavaScript subscribe HTTP', function () {
    const dspath = 'multiple/' + uuid + '/javascript/http'
    this.timeout(10000)
    it('should work', function (done) {
      const ds = milkcocoa.dataStore(dspath)
      ds.on('push', function (payload) {
        assert.deepEqual([typeof payload.id, typeof payload.timestamp, payload.value], ['string', 'number', 2])
        ds.off('push')
        done()
      })
      setTimeout(function () {
        agent
          .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath + '&v=2') // push 'number'
          .end(function () {})
      }, 1000)
    })
  })

  describe('JavaScript subscribe Websocket', function () {
    const dspath = 'multiple/' + uuid + '/javascript/websocket'
    var websocketclient, websocketconnection
    this.timeout(10000)
    it('should work', function (done) {
      const ds = milkcocoa.dataStore(dspath)
      ds.on('push', function (payload) {
        assert.deepEqual([typeof payload.id, typeof payload.timestamp, Number(payload.value)], ['string', 'number', 2])
        ds.off('push')
        websocketconnection.close()
        websocketclient.abort()
        done()
      })
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
      }, 1000)
    })
  })

  describe('JavaScript subscribe MQTT', function () {
    const dspath = 'multiple/' + uuid + '/javascript/mqtt'
    var mqttclient
    this.timeout(10000)
    it('should work', function (done) {
      const ds = milkcocoa.dataStore(dspath)
      ds.on('push', function (payload) {
        assert.deepEqual([typeof payload.id, typeof payload.timestamp, payload.value], ['string', 'number', 'Hello as push'])
        ds.off('push')
        mqttclient.end()
        done()
      })
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
    })
  })
}

JavaScriptOn(global.uuid || uuidv4())

module.exports = JavaScriptOn
