const WebSocketClient = require('websocket').client
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

const mlkccaEndpoint = settings.websocketEndpoint

function Send (uuid) {
  const dspath = 'websocket/' + uuid + '/send'
  describe('client.sendUTF()', function () {
    this.timeout(10000)
    it('should publish data and can be received by subscribed topic', function (done) {
      const client = new WebSocketClient()
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
            assert.deepEqual([typeof result[0][0], result[0][1]], ['number', 'Hello as send'])
            connection.close()
            client.abort()
            done()
          }
        })
        if (connection.connected) {
          setTimeout(function () {
            connection.sendUTF('Hello as send')
          }, 1000)
        }
      })
      client.connect(mlkccaEndpoint + '/ws/send/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })
  })
}

Send(global.uuid || uuidv4())

module.exports = Send
