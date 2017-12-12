const mqtt = require('mqtt')
const WebSocketClient = require('websocket').client
const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']
const Milkcocoa = require('mlkcca')

function HTTPOn (uuid) {
  let agent = request.agent(settings.endpoint)
  const onPushURL = '/on/push/' + settings.appId + '/' + settings.apiKey

  describe('HTTP subscribe MQTT', function () {
    const dspath = 'multiple/' + uuid + '/http/mqtt'
    var mqttclient
    this.timeout(10000)
    it('should work', function (done) {
      agent
      .get(onPushURL + '?c=[["' + dspath + '",0]]')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result[dspath]
        mqttclient.end()
        res.body = {
          ts: typeof v[0][0],
          id: typeof v[0][1],
          value: v[0][2]
        }
      })
      .expect(200, {
        ts: 'number',
        id: 'string',
        value: 'Hello as push'
      }, done)
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

  describe('HTTP subscribe Websocket', function () {
    const dspath = 'multiple/' + uuid + '/http/websocket'
    var websocketclient, websocketconnection
    this.timeout(10000)
    it('should work', function (done) {
      agent
      .get(onPushURL + '?c=[["' + dspath + '",0]]')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result[dspath]
        websocketconnection.close()
        websocketclient.abort()
        res.body = {
          ts: typeof v[0][0],
          id: typeof v[0][1],
          value: Number(v[0][2])
        }
      })
      .expect(200, {
        ts: 'number',
        id: 'string',
        value: 2
      }, done)
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

  describe('HTTP subscribe JavaScript', function () {
    const dspath = 'multiple/' + uuid + '/http/javascript'
    this.timeout(10000)
    it('should work', function (done) {
      agent
      .get(onPushURL + '?c=[["' + dspath + '",0]]')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result[dspath]
        res.body = {
          ts: typeof v[0][0],
          id: typeof v[0][1],
          value: v[0][2]
        }
      })
      .expect(200, {
        ts: 'number',
        id: 'string',
        value: 1
      }, done)
      setTimeout(function () {
        const milkcocoa = new Milkcocoa({
          host: settings.mqttEndpoint,
          appId: settings.appId,
          uuid: 'uuid-' + uuid + '-multiple-mqtt',
          apiKey: settings.apiKey,
          useSSL: false,
          port: 8000
        })
        const ds = milkcocoa.dataStore(dspath)
        // push 'number'
        ds.push(1, function (err, result) {
          if (err) throw err
        })
      }, 1000)
    })
  })
}

HTTPOn(global.uuid || uuidv4())

module.exports = HTTPOn
