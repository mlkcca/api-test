const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../../settings')[process.env.NODE_ENV || 'production']

function DataStoreList (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const dsURL = '/api/ds/' + settings.appId
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey
  // const dsURLWrongAPIKey = '/api/ds/' + settings.appId + '/wrongapikey'

  describe('GET /ds/', function () {
    this.timeout(10000)
    let agent = request.agent(mlkccaEndpoint)
    var accessToken = ''

    before(function (done) {
      agent
      .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=accesstoken/http/' + uuid + '/ds/one')
      .end(function (err, res) {
        if (err) return done(err)
        else {
          agent
          .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=accesstoken/http/' + uuid + '/ds/another')
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
        }
      })
    })

    // it('should return 403 if apikey is wrong', function (done) {
    //   agent
    //   .get(dsURLWrongAPIKey)
    //   .expect(403)
    //   .end(function (err, res) {
    //     if (err) return done(err)
    //     done()
    //   })
    // })

    it('should return 200 & all dataStores if no c param', function (done) {
      agent
      .get(dsURL)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          isExist: result.content.length > 1
        }
      })
      .expect(200, {
        err: null,
        isExist: true
      }, done)
    })

    it('should return 200 & all dataStores if c === empty', function (done) {
      agent
      .get(dsURL + '?c=')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          isExist: result.content.length > 1
        }
      })
      .expect(200, {
        err: null,
        isExist: true
      }, done)
    })

    it('should return 200 & the specific dataStorePath', function (done) {
      agent
      .get(dsURL + '?c=accesstoken/http/' + uuid + '/ds/one')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          num: result.content.length === 1,
          name: result.content[0]
        }
      })
      .expect(200, {
        err: null,
        num: true,
        name: 'accesstoken/http/' + uuid + '/ds/one'
      }, done)
    })

    it('should return 200 & the dataStores matched by forward pattern', function (done) {
      agent
      .get(dsURL + '?c=accesstoken/http/' + uuid + '/ds/')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          num: result.content.length === 2,
          array: result.content
        }
      })
      .expect(200, {
        err: null,
        num: true,
        array: ['accesstoken/http/' + uuid + '/ds/another', 'accesstoken/http/' + uuid + '/ds/one']
      }, done)
    })
  })
}

DataStoreList(global.uuid || uuidv4())

module.exports = DataStoreList
