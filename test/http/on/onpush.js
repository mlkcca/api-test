const request = require('supertest')
const uuidv4 = require('uuid/v4')

function OnPush (uuid) {
  const mlkccaEndpoint = 'https://pubsub1.mlkcca.com'
  const onPushURL = '/on/push/demo/demo'
  const onPushURLWrong = '/on/push/demo/wrongapikey'

  describe('GET /on/push/', function () {
    this.timeout(30 * 1000)
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .get(onPushURLWrong + '?c=[["http/' + uuid + '/on/push",0]]')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no c param.', function (done) {
      agent
      .get(onPushURL)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no c param.', function (done) {
      agent
      .get(onPushURL + '?c=')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if wrong array', function (done) {
      agent
      .get(onPushURL + '?c=["demo1",0]')
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 & get pushed data’s value', function (done) {
      agent
      .get(onPushURL + '?c=[["http/' + uuid + '/on/push/one",0],["http/' + uuid + '/on/push/two",0]]')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result['http/' + uuid + '/on/push/one']
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
        .get('/api/push/demo/demo?c=http/' + uuid + '/on/push/one&v=1')
        .end(function () {})
      }, 1000)
    })

    it('should get pushed data after ts', function (done) {
      agent
      .get(onPushURL + '?c=[["http/' + uuid + '/on/push/one",0]]')
      .end(function (err, res) {
        if (err) return done(err)
        let result = JSON.parse(res.text)
        let ts = result['http/' + uuid + '/on/push/one'][0][0]
        agent
        .get(onPushURL + '?c=[["http/' + uuid + '/on/push/one",' + ts + ']]')
        .expect(function (res) {
          let _result = JSON.parse(res.text)
          let v = _result['http/' + uuid + '/on/push/one']
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
          .get('/api/push/demo/demo?c=http/' + uuid + '/on/push/one&v=2')
          .end(function () {})
        }, 1000)
      })
      setTimeout(function () {
        agent
        .get('/api/push/demo/demo?c=http/' + uuid + '/on/push/one&v=1')
        .end(function () {})
      }, 1000)
    })
  })
}

OnPush(global.uuid || uuidv4())

module.exports = OnPush
