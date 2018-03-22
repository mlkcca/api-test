const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Send (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const sendURL = '/api/send/' + settings.appId + '/' + settings.apiKey
  const sendURLWrongAPIKey = '/api/send/' + settings.appId + '/wrongapikey'

  describe('GET /send/', function () {
    this.timeout(5000)
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .get(sendURLWrongAPIKey + '?c=http/' + uuid + '/send/get&v={"val":10}')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .get(sendURL + '?v=1')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .get(sendURL + '?c=&v=1')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .get(sendURL + '?c=http/' + uuid + '/send/get')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .get(sendURL + '?c=http/' + uuid + '/send/get&v=')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(sendURL + '?c=http/' + uuid + '/send/get&v={"val":10}')
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

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .post(sendURLWrongAPIKey + '?c=http/' + uuid + '/send/post')
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .post(sendURL)
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .post(sendURL + '?c=')
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .post(sendURL + '?c=http/' + uuid + '/send/post')
      .send({})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .post(sendURL + '?c=http/' + uuid + '/send/post')
      .send({v: ''})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(sendURL + '?c=http/' + uuid + '/send/post')
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
