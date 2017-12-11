const mqtt = require('mqtt')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Send (uuid) {
  describe('mqtt.publish(sendPath)', function () {
    this.timeout(10000)
    const dspath = 'mqtt/' + uuid + '/send'

    it('should publish data and can be received by subscribed topic', function (done) {
      const topic = settings.appId + '/' + dspath + '/_s'
      const client = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        client.subscribe(topic)
        setTimeout(function () {
          client.publish(topic, 'Hello as send')
        }, 100)
      })

      client.on('message', function (topic, message) {
        assert.deepEqual([topic, message.toString()], [topic, 'Hello as send'])
        client.end()
        done()
      })
    })
  })
}

Send(global.uuid || uuidv4())

module.exports = Send
