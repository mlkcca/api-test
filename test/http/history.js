const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function History (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const historyURL = '/api/history/' + settings.appId + '/' + settings.apiKey
  // const historyURLWrongAPIKey = '/api/history/' + settings.appId + '/wrongapikey'

  describe('GET /history/', function () {
    this.timeout(30000)
    let agent = request.agent(mlkccaEndpoint)

    var median = 0

    before(function (done) {
      agent
        .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=http/' + uuid + '/history')
        .end(function (err, res) {
          if (err) return done(err)
        })

      setTimeout(function () {
        agent
          .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v={"val":2}&c=http/' + uuid + '/history')
          .end(function (_err, _res) {
            if (_err) return done(_err)
            done()
          })
      }, 1000)
    })

    // it('should return 403 if apikey is wrong.', function (done) {
    //   agent
    //   .get(historyURLWrongAPIKey + '?c=http/' + uuid + '/history')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if no c param.', function (done) {
    //   agent
    //   .get(historyURL)
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    // it('should return 403 if c param === empty.', function (done) {
    //   agent
    //   .get(historyURL + '?c=')
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 & retrieve all data without options', function (done) {
      agent
      .get(historyURL + '?c=http/' + uuid + '/history')
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
      .get(historyURL + '?c=http/' + uuid + '/history&ts=' + median)
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
      .get(historyURL + '?c=http/' + uuid + '/history&limit=1')
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
      .get(historyURL + '?c=http/' + uuid + '/history&limit=1&order=desc')
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
      .get(historyURL + '?c=http/' + uuid + '/history&limit=1&order=asc')
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
