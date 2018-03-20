const request = require('supertest')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Grant (uuid) {
  const mlkccaEndpoint = settings.endpoint
  const grantURL = '/api/grant/' + settings.appId + '/' + settings.apiKey
  const grantURLWrongAPIKey = '/api/grant/' + settings.appId + '/wrongapikey'

  describe('GET /grant/', function () {
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .get(grantURLWrongAPIKey)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 and default rules & ttl without paramaters', function (done) {
      agent
      .get(grantURL)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 864000,
        rules: {
          '*': ['a']
        }
      }, done)
    })

    it('should return 200 and default rules & ttl with wrong type paramaters', function (done) {
      agent
      .get(grantURL + '?rules=&ttl=hoge')
      .expect(function (res) {
        const result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 864000,
        rules: {
          '*': ['a']
        }
      }, done)
    })

    it('can configure ttl & rules', function (done) {
      agent
      .get(grantURL + '?rules={"demo":["write"],"hoge":["read"]}&ttl=5000')
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 5000,
        rules: {
          'demo': ['write'],
          'hoge': ['read']
        }
      }, done)
    })
  })

  describe('POST /grant/', function () {
    let agent = request.agent(mlkccaEndpoint)

    it('should return 403 if apikey is wrong', function (done) {
      agent
      .post(grantURLWrongAPIKey)
      .send({})
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      })
    })

    it('should return 200 and default rules & ttl without paramaters', function (done) {
      agent
      .post(grantURL)
      .send({})
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 864000,
        rules: {
          '*': ['a']
        }
      }, done)
    })

    it('should return 200 and default rules & ttl with wrong paramaters', function (done) {
      agent
      .post(grantURL)
      .send({
        ttl: 'hoge',
        rules: [['write'],['read']]
      })
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 864000,
        rules: {
          '*': ['a']
        }
      }, done)
    })

    it('can configure ttl & rules', function (done) {
      agent
      .post(grantURL)
      .send({
        ttl: 5000,
        rules: {
          'demo': ['write'],
          'hoge': ['read']
        }
      })
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          typeof_access_token: typeof result.content.access_token,
          ttl: result.content.ttl,
          rules: result.content.rules
        }
      })
      .expect(200, {
        err: null,
        typeof_access_token: 'string',
        ttl: 5000,
        rules: {
          'demo': ['write'],
          'hoge': ['read']
        }
      }, done)
    })
  })
}

Grant(global.uuid || uuidv4())

module.exports = Grant
