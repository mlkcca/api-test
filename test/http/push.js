const request = require('supertest')
const uuidv4 = require('uuid/v4')

function Push (uuid) {
  const mlkccaEndpoint = 'https://pubsub1.mlkcca.com'
  const pushURL = '/api/push/demo/demo?c={{dspath}}'
  const pushURLWrongAPIKey = '/api/push/demo/wrongapikey?c={{dspath}}'

  describe('GET /push/', function () {
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .get(pushURLWrongAPIKey.replace(/{{dspath}}/, 'http/' + uuid + '/push/get&v={"val":10}'))
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .get('/api/push/demo/demo?v=1')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .get('/api/push/demo/demo?c=&v=1')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .get(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/get'))
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .get(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/get&v='))
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .get(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/get') + '&v={"val":10}')
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

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .post(pushURLWrongAPIKey.replace(/{{dspath}}/, 'http/' + uuid + '/push/post'))
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no datastorePath', function (done) {
      agent
      .post('/api/push/demo/demo')
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if datastorePath === empty', function (done) {
      agent
      .post('/api/push/demo/demo?c=')
      .send({v: 2})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no v param', function (done) {
      agent
      .post(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/post'))
      .send({})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if v === empty', function (done) {
      agent
      .post(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/post'))
      .send({v: ''})
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 when paramaters are valid', function (done) {
      agent
      .post(pushURL.replace(/{{dspath}}/, 'http/' + uuid + '/push/post'))
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
