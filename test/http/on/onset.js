const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function OnSet (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const onSetURL = '/on/set/' + settings.appId + '/' + settings.apiKey
  const onSetURLWrong = '/on/set/' + settings.appId + '/wrongapikey'

  describe('GET /on/set/', function () {
    this.timeout(30 * 1000)
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .get(onSetURLWrong + '?c=[["http/' + uuid + '/on/set",0]]')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no c param.', function (done) {
      agent
      .get(onSetURL)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if c param is empty.', function (done) {
      agent
      .get(onSetURL + '?c=')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if c param is wrong array', function (done) {
      agent
      .get(onSetURL + '?c=["demo1",0]')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 & get seted data’s value', function (done) {
      agent
      .get(onSetURL + '?c=[["http/' + uuid + '/on/set/one",0],["http/' + uuid + '/on/set/two",0]]')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result['http/' + uuid + '/on/set/one']
        res.body = {
          ts: typeof v[0][0],
          id: typeof v[0][1],
          value: v[0][2]
        }
      })
      .expect(200, {
        ts: 'number',
        id: 'string',
        value: 1
      }, done)
      setTimeout(function () {
        agent
        .get('/api/set/' + settings.appId + '/' + settings.apiKey + '?c=http/' + uuid + '/on/set/one&v=1&id=one')
        .end(function () {})
      }, 3000)
    })

    it('should get seted data after ts', function (done) {
      agent
      .get(onSetURL + '?c=[["http/' + uuid + '/on/set/one",0]]')
      .end(function (err, res) {
        if (err) return done(err)
        let result = JSON.parse(res.text)
        let ts = result['http/' + uuid + '/on/set/one'][0][0]
        agent
        .get(onSetURL + '?c=[["http/' + uuid + '/on/set/one",' + ts + ']]')
        .expect(function (res) {
          let _result = JSON.parse(res.text)
          let v = _result['http/' + uuid + '/on/set/one']
          res.body = {
            ts: typeof v[0][0],
            id: typeof v[0][1],
            value: v[0][2]
          }
        })
        .expect(200, {
          ts: 'number',
          id: 'string',
          value: 2
        }, done)
        setTimeout(function () {
          agent
          .get('/api/set/' + settings.appId + '/' + settings.apiKey + '?c=http/' + uuid + '/on/set/one&v=2&id=one')
          .end(function () {})
        }, 3000)
      })
      setTimeout(function () {
        agent
        .get('/api/set/' + settings.appId + '/' + settings.apiKey + '?c=http/' + uuid + '/on/set/one&v=1&id=one')
        .end(function () {})
      }, 3000)
    })
  })
}

OnSet(global.uuid || uuidv4())

module.exports = OnSet
