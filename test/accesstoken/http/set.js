const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function Set (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const setURL = '/api/set/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey

  describe('GET /set/', function () {
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
      .get(setURL + '?c=accesstoken/http/' + uuid + '/set/get&v={"val":10}')
      .set('Authorization', 'Bearer wrongAccessToken')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .get(setURL + '?v=1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .get(setURL + '?c=&v=1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .get(setURL + '?c=accesstoken/http/' + uuid + '/set/get')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .get(setURL + '?c=accesstoken/http/' + uuid + '/set/get&v=')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(setURL + '?c=accesstoken/http/' + uuid + '/set/get&id=test1&v={"val":10}')
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

  describe('POST /set/', function () {
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
      .post(setURL + '?c=accesstoken/http/' + uuid + '/set/post')
      .send({v: 2})
      .set('Authorization', 'Bearer wrongAccessToken')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .post(setURL)
      .send({v: 2})
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .post(setURL + '?c=')
      .send({v: 2})
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .post(setURL + '?c=accesstoken/http/' + uuid + '/set/post')
      .send({})
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .post(setURL + '?c=accesstoken/http/' + uuid + '/set/post')
      .send({v: ''})
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(setURL + '?c=accesstoken/http/' + uuid + '/set/post')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        id: 'test2',
        v: '10'
      })
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

Set(global.uuid || uuidv4())

module.exports = Set
