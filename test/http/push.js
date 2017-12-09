const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Push (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const pushURL = '/api/push/' + settings.appId + '/' + settings.apiKey
  // const pushURLWrongAPIKey = '/api/push/' + settings.appId + '/wrongapikey'

  describe('GET /push/', function () {
    let agent = request.agent(mlkccaEndpoint)

    // it('should return 403 if apikey is wrong', function (done) {
    //   agent
    //   .get(pushURLWrongAPIKey + '?c=http/' + uuid + '/push/get&v={"val":10}')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if no datastorePath', function (done) {
    //   agent
    //   .get(pushURL + '?v=1')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if datastorePath === empty', function (done) {
    //   agent
    //   .get(pushURL + '?c=&v=1')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if no v param', function (done) {
    //   agent
    //   .get(pushURL + '?c=http/' + uuid + '/push/get')
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if v === empty', function (done) {
    //   agent
    //   .get(pushURL + '?c=http/' + uuid + '/push/get&v=')
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(pushURL + '?c=http/' + uuid + '/push/get&v={"val":10}')
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

    // it('should return 403 if apikey is wrong', function (done) {
    //   agent
    //   .post(pushURLWrongAPIKey + '?c=http/' + uuid + '/push/post')
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if no datastorePath', function (done) {
    //   agent
    //   .post(pushURL)
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if datastorePath === empty', function (done) {
    //   agent
    //   .post(pushURL + '?c=')
    //   .send({v: 2})
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if no v param', function (done) {
    //   agent
    //   .post(pushURL + '?c=http/' + uuid + '/push/post')
    //   .send({})
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 400 if v === empty', function (done) {
    //   agent
    //   .post(pushURL + '?c=http/' + uuid + '/push/post')
    //   .send({v: ''})
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(pushURL + '?c=http/' + uuid + '/push/post')
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
