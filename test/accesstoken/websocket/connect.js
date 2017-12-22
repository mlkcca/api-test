const WebSocketClient = require('websocket').client
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

const mlkccaEndpoint = settings.websocketEndpoint

function Connect (uuid) {
  const dspath = 'accesstoken/websocket/' + uuid + '/connect'
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey
  let agent = request.agent(settings.endpoint)
  var accessToken = ''

  describe('client.connect(pushEndpoint)', function () {
    this.timeout(10000)
    before(function (done) {
      agent
      .get(grantURL)
      .end(function (__err, __res) {
        if (__err) return done(__err)
        accessToken = JSON.parse(__res.text).content.access_token
        done()
      })
    })
    // it('should issue error if password is incorrect', function (done) {
    //   const client = new WebSocketClient()
    //   client.on('connectFailed', function (error) {
    //     throw error
    //   })
    //   client.on('connect', function (connection) {
    //     connection.on('error', function (error) {
    //       assert.equal(error.code, 'ECONNRESET')
    //       connection.close()
    //       client.abort()
    //       done()
    //     })
    //   })
    //   client.connect(mlkccaEndpoint + '/ws/push/' + settings.appId + '/wrongApiKey?c=' + dspath)
    // })
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
      client.connect(mlkccaEndpoint + '/ws/push/' + settings.appId + '?c=' + dspath + '&at=' + encodeURIComponent(accessToken)) // '+' is convert to 'space' in URL
    })
  })
}

Connect(global.uuid || uuidv4())

module.exports = Connect
