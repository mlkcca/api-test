const WebSocketClient = require('websocket').client
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

const mlkccaEndpoint = settings.websocketEndpoint

function Connect (uuid) {
  const dspath = 'websocket/' + uuid + '/connect'
  describe('client.connect(pushEndpoint)', function () {
    this.timeout(10000)
    it('should issue error if password is incorrect', function (done) {
      const client = new WebSocketClient()
      client.on('connectFailed', function (error) {
        throw error
      })
      client.on('connect', function (connection) {
        connection.on('error', function (error) {
          assert.equal(error.code, 'ECONNRESET')
          connection.close()
          client.abort()
          done()
        })
      })
      client.connect('ws://' + mlkccaEndpoint + '/ws/push/' + settings.appId + '/wrongApiKey?c=' + dspath)
    })
    it('should connect when user/pass are correct', function (done) {
      const client = new WebSocketClient()
      client.on('connectFailed', function (error) {
        throw error
      })
      client.on('connect', function (connection) {
        connection.on('error', function (error) {
          throw error
        })
        if (connection.connected) {
          assert.ok(true)
          connection.close()
          client.abort()
          done()
        }
      })
      client.connect('ws://' + mlkccaEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })
  })
}

Connect(global.uuid || uuidv4())

module.exports = Connect
