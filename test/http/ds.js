const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function DataStoreList (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const dsURL = '/api/ds/' + settings.appId + '/' + settings.apiKey
  // const dsURLWrongAPIKey = '/api/ds/' + settings.appId + '/wrongapikey'

  describe('GET /ds/', function () {
    let agent = request.agent(mlkccaEndpoint)

    before(function (done) {
      agent
      .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=http/' + uuid + '/ds/one')
      .end(function (err, res) {
        if (err) return done(err)
        else {
          agent
          .get('/api/push/' + settings.appId + '/' + settings.apiKey + '?v=1&c=http/' + uuid + '/ds/another')
          .end(function (_err, _res) {
            if (_err) return done(_err)
            done()
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
      .get(dsURL + '?c=http/' + uuid + '/ds/one')
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
        name: 'http/' + uuid + '/ds/one'
      }, done)
    })

    it('should return 200 & the dataStores matched by forward pattern', function (done) {
      agent
      .get(dsURL + '?c=http/' + uuid + '/ds/')
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
        array: ['http/' + uuid + '/ds/another', 'http/' + uuid + '/ds/one']
      }, done)
    })
  })
}

DataStoreList(global.uuid || uuidv4())

module.exports = DataStoreList
