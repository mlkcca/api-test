const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../../settings')[process.env.NODE_ENV || 'production']

function OnSend (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const onSendURL = '/on/send/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey

  describe('GET /on/send/', function () {
    this.timeout(30 * 1000)
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
      .get(onSendURL + '?c=[["accesstoken/http/' + uuid + '/on/send",0]]')
      .set('Authorization', 'Bearer wrongAccessToken')
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no c param.', function (done) {
      agent
      .get(onSendURL)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if no c param.', function (done) {
      agent
      .get(onSendURL + '?c=')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 400 if wrong array', function (done) {
      agent
      .get(onSendURL + '?c=["demo1",0]')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 & get sent data’s value', function (done) {
      agent
      .get(onSendURL + '?c=[["accesstoken/http/' + uuid + '/on/send/one",0],["accesstoken/http/' + uuid + '/on/send/two",0]]')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        let v = result['accesstoken/http/' + uuid + '/on/send/one']
        res.body = {
          ts: typeof v[0][0],
          value: v[0][1]
        }
      })
      .expect(200, {
        ts: 'number',
        value: 1
      }, done)
      setTimeout(function () {
        agent
        .get('/api/send/' + settings.appId + '/' + settings.apiKey + '?c=accesstoken/http/' + uuid + '/on/send/one&v=1')
        .end(function () {})
      }, 3000)
    })

    it('should get sent data after ts', function (done) {
      agent
      .get(onSendURL + '?c=[["accesstoken/http/' + uuid + '/on/send/one",0]]')
      .set('Authorization', 'Bearer ' + accessToken)
      .end(function (err, res) {
        if (err) return done(err)
        let result = JSON.parse(res.text)
        let ts = result['accesstoken/http/' + uuid + '/on/send/one'][0][0]
        agent
        .get(onSendURL + '?c=[["accesstoken/http/' + uuid + '/on/send/one",' + ts + ']]')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(function (res) {
          let _result = JSON.parse(res.text)
          let v = _result['accesstoken/http/' + uuid + '/on/send/one']
          res.body = {
            ts: typeof v[0][0],
            value: v[0][1]
          }
        })
        .expect(200, {
          ts: 'number',
          value: 2
        }, done)
        setTimeout(function () {
          agent
          .get('/api/send/' + settings.appId + '/' + settings.apiKey + '?c=accesstoken/http/' + uuid + '/on/send/one&v=2')
          .end(function () {})
        }, 3000)
      })
      setTimeout(function () {
        agent
        .get('/api/send/' + settings.appId + '/' + settings.apiKey + '?c=accesstoken/http/' + uuid + '/on/send/one&v=1')
        .end(function () {})
      }, 3000)
    })
  })
}

OnSend(global.uuid || uuidv4())

module.exports = OnSend
