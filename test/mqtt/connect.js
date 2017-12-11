const mqtt = require('mqtt')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Connect (uuid) {
  const mlkccaEndpoint = settings.mqttEndpoint

  describe('mqtt.connect(milkcocoaEndpoint)', function () {
    this.timeout(10000)

    it('should issue error if password is incorrect', function (done) {
      const client = mqtt.connect('mqtt://' + mlkccaEndpoint, {
        username: 'k' + settings.apiKey,
        password: 'incorrect'
      })

      client.on('error', function (e) {
        assert.equal(e.message, 'Connection refused: Bad username or password')
        client.end()
        done()
      })

      client.on('connect', function (e) {
        throw e
      })
    })

    it('should connect when user/pass are correct', function (done) {
      const client = mqtt.connect('mqtt://' + mlkccaEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        assert.ok(true)
        client.end()
        done()
      })
    })
  })
}

Connect(global.uuid || uuidv4())

module.exports = Connect
