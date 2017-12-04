const request = require('supertest')
const uuidv4 = require('uuid/v4')

function History (uuid) {
  const mlkccaEndpoint = 'https://pubsub1.mlkcca.com'
  const historyURL = '/api/history/demo/demo'
  const historyURLWrongAPIKey = '/api/history/demo/wrongapikey'

  describe('GET /history/', function () {
    this.timeout(10000)
    let agent = request.agent(mlkccaEndpoint)

    var dataTime1 = 0
    var pushedDataTime1 = 0
    var dataTime2 = 0
    var pushedDataTime2 = 0

    before(function (done) {
      dataTime1 = new Date().getTime()
      setTimeout(function () {
        agent
          .get('/api/push/demo/demo?v=1&c=http/' + uuid + '/history')
          .end(function (err, res) {
            if (err) return done(err)
            pushedDataTime1 = res.body.content.t
          })
      }, 1000)

      setTimeout(function () {
        dataTime2 = new Date().getTime()
        setTimeout(function () {
          agent
            .get('/api/push/demo/demo?v=2&c=http/' + uuid + '/history')
            .end(function (_err, _res) {
              if (_err) return done(_err)
              pushedDataTime2 = _res.body.content.t
              if (dataTime1 * 1000 < pushedDataTime1 &&
                  pushedDataTime1 < dataTime2 * 1000 &&
                  dataTime2 * 1000 < pushedDataTime2) {
                done()
              }
            })
        }, 1000)
      }, 2000)
    })

    it('should return 403 if apikey is wrong.', function (done) {
      agent
      .get(historyURLWrongAPIKey + '?c=http/' + uuid + '/history')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if no c param.', function (done) {
      agent
      .get(historyURL)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 403 if c param === empty.', function (done) {
      agent
      .get(historyURL + '?c=')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 & retrieve all data without options', function (done) {
      agent
      .get(historyURL + '?c=http/' + uuid + '/history')
      .expect(function (res) {
        let result = JSON.parse(res.text)
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
      .get(historyURL + '?c=http/' + uuid + '/history&ts=' + dataTime2)
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
        value: 2
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
        value: 2
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
