const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function Push (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const pushURL = '/api/push/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey

  describe('GET /push/', function () {
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

    it('should return 403 if access token is wrong', function (done) {
      agent
      .get(pushURL + '?c=accesstoken/http/' + uuid + '/push/get&v={"val":10}')
      .set('Authorization', 'Bearer wrongAccesstoken')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .get(pushURL + '?v=1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .get(pushURL + '?c=&v=1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .get(pushURL + '?c=accesstoken/http/' + uuid + '/push/get')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .get(pushURL + '?c=accesstoken/http/' + uuid + '/push/get&v=')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(pushURL + '?c=accesstoken/http/' + uuid + '/push/get&v={"val":10}')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err
        }
      })
      .expect(200, {
        err: null
      }, done)
    })
  })

  describe('POST /push/', function () {
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

    it('should return 403 if access token is wrong', function (done) {
      agent
      .post(pushURL + '?c=accesstoken/http/' + uuid + '/push/post')
      .set('Authorization', 'Bearer wrongAccessToken')
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .post(pushURL)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .post(pushURL + '?c=')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .post(pushURL + '?c=accesstoken/http/' + uuid + '/push/post')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .post(pushURL + '?c=accesstoken/http/' + uuid + '/push/post')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({v: ''})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(pushURL + '?c=accesstoken/http/' + uuid + '/push/post')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({v: '{"val":10}'})
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err
        }
      })
      .expect(200, {
        err: null
      }, done)
    })
  })
}

Push(global.uuid || uuidv4())

module.exports = Push
