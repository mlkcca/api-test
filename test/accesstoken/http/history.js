const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function History (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const historyURL = '/api/history/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey

  describe('GET /history/', function () {
    this.timeout(30000)
    let agent = request.agent(mlkccaEndpoint)
    var accessToken = ''
    var median = 0

    before(function (done) {
      agent
        .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=accesstoken/http/' + uuid + '/history')
        .end(function (err, res) {
          if (err) return done(err)
        })

      setTimeout(function () {
        agent
          .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v={"val":2}&c=accesstoken/http/' + uuid + '/history')
          .end(function (_err, _res) {
            if (_err) return done(_err)
            agent
            .get(grantURL)
            .end(function (__err, __res) {
              if (__err) return done(__err)
              accessToken = JSON.parse(__res.text).content.access_token
              done()
            })
          })
      }, 1000)
    })

    it('should return 403 if access token is wrong.', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history')
      .set('Authorization', 'Bearer wrongAccessToken')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no c param.', function (done) {
      agent
      .get(historyURL)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if c param === empty.', function (done) {
      agent
      .get(historyURL + '?c=')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 & retrieve all data without options', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        median = Math.floor((result.content[0].t + result.content[1].t) / 2)
        res.body = {
          err: result.err,
          length: result.content.length
        }
      })
      .expect(200, {
        err: null,
        length: 2
      }, done)
    })

    it('should return 200 & retrieve the data before ts', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history&ts=' + median)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          value: result.content[0].v
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        value: 1
      }, done)
    })

    it('should return 200 & retrieve a data when limit === 1', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history&limit=1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          value: result.content[0].v
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        value: '{"val":2}'
      }, done)
    })

    it('should return 200 & retrieve the latest data when order === "desc" && limit === 1', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history&limit=1&order=desc')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          value: result.content[0].v
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        value: '{"val":2}'
      }, done)
    })

    it('should return 200 & retrieve the oldest data when order === "asc" && limit === 1', function (done) {
      agent
      .get(historyURL + '?c=accesstoken/http/' + uuid + '/history&limit=1&order=asc')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          value: result.content[0].v
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        value: 1
      }, done)
    })
  })
}

History(global.uuid || uuidv4())

module.exports = History
