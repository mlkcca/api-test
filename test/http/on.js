const request = require('supertest')
const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function On (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const onWrondAPI = '/on/wrong/' + settings.appId + '/' + settings.apiKey

  describe('GET /on/', function () {
    this.timeout(10000)
    let agent = request.agent(mlkccaEndpoint)

    it('should return 404 if subscribe unknown api', function (done) {
      agent
      .get(onWrondAPI + '?c=[["http/' + uuid + '/on",0]]')
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
