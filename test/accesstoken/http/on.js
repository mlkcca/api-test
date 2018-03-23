const request = require('supertest')
const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function On (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey
  const onWrondAPI = '/on/wrong/' + settings.appId

  describe('GET /on/', function () {
    this.timeout(10000)
    let agent = request.agent(mlkccaEndpoint)
    var accessToken = ''

    before(function (done) {
      agent
      .get(grantURL)
      .end(function (__err, __res) {
        if (__err) return done(__err)
        accessToken = JSON.parse(__res.text).content.access_token
        done()
      })
    })

    it('should return 404 if subscribe unknown api', function (done) {
      agent
      .get(onWrondAPI + '?c=[["http/' + uuid + '/on",0]]')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })
  })

  require('./on/onpush')
  require('./on/onsend')
  require('./on/onset')
}

On(global.uuid)

module.exports = On
