const WebSocketClient = require('websocket').client
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

const mlkccaEndpoint = settings.websocketEndpoint

function Push (uuid) {
  const dspath = 'websocket/' + uuid + '/push'
  let agent = request.agent(settings.endpoint)
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
            assert.deepEqual([typeof result[0][0], typeof result[0][1], result[0][2]], ['number', 'string', 'Hello as push'])
            connection.close()
            client.abort()
            done()
          }
        })
        if (connection.connected) {
          setTimeout(function () {
            connection.sendUTF('Hello as push')
          }, 1000)
        }
      })
      client.connect('ws://' + mlkccaEndpoint + '/ws/push/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
    })

    it('should save data', function (done) {
      agent
      .get('/api/history/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          id: typeof result.content[0].id,
          v: result.content[0].v,
          t: typeof result.content[0].t
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        id: 'string',
        v: 'Hello as push',
        t: 'number'
      }, done)
    })
  })
}

Push(global.uuid || uuidv4())

module.exports = Push
