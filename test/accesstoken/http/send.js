const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function Send (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const sendURL = '/api/send/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey
  // const sendURLWrongAPIKey = '/api/send/' + settings.appId + '/wrongapikey'

  describe('GET /send/', function () {
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

    // it('should return 403 if apikey is wrong', function (done) {
    //   agent
    //   .get(sendURLWrongAPIKey + '?c=accesstoken/http/' + uuid + '/send/get&v={"val":10}')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if no datastorePath', function (done) {
    //   agent
    //   .get(sendURL + '?v=1')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if datastorePath === empty', function (done) {
    //   agent
    //   .get(sendURL + '?c=&v=1')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if no v param', function (done) {
    //   agent
    //   .get(sendURL + '?c=accesstoken/http/' + uuid + '/send/get')
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if v === empty', function (done) {
    //   agent
    //   .get(sendURL + '?c=accesstoken/http/' + uuid + '/send/get&v=')
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(sendURL + '?c=accesstoken/http/' + uuid + '/send/get&v={"val":10}')
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

  describe('POST /send/', function () {
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

    // it('should return 403 if apikey is wrong', function (done) {
    //   agent
    //   .post(sendURLWrongAPIKey + '?c=accesstoken/http/' + uuid + '/send/post')
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if no datastorePath', function (done) {
    //   agent
    //   .post(sendURL)
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if datastorePath === empty', function (done) {
    //   agent
    //   .post(sendURL + '?c=')
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if no v param', function (done) {
    //   agent
    //   .post(sendURL + '?c=accesstoken/http/' + uuid + '/send/post')
    //   .send({})
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if v === empty', function (done) {
    //   agent
    //   .post(sendURL + '?c=accesstoken/http/' + uuid + '/send/post')
    //   .send({v: ''})
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(sendURL + '?c=accesstoken/http/' + uuid + '/send/post')
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

Send(global.uuid || uuidv4())

module.exports = Send
