const mqtt = require('mqtt')
const request = require('supertest')
const assert = require('assert')
const uuidv4 = require('uuid/v4')
const settings = require('../../settings')[process.env.NODE_ENV || 'production']

function Push (uuid) {
  describe('mqtt.publish(pushPath)', function () {
    this.timeout(10000)
    let agent = request.agent(settings.endpoint)
    const dspath = 'mqtt/' + uuid + '/push'

    it('should publish data and can be received by subscribed topic', function (done) {
      const topic = settings.appId + '/' + dspath + '/_p'
      const client = mqtt.connect('mqtt://' + settings.mqttEndpoint, {
        username: 'k' + settings.apiKey,
        password: settings.appId
      })

      client.on('error', function (e) {
        throw e
      })

      client.on('connect', function (e) {
        client.subscribe(settings.appId + '/' + dspath + '/_p')
        setTimeout(function () {
          client.publish(topic, '2')
        }, 100)
      })

      client.on('message', function (topic, message) {
        assert.deepEqual([topic, message.toString()], [topic, '2'])
        client.end()
        done()
      })
    })

    it('should save data', function (done) {
      agent
      .get('/api/history/' + settings.appId + '/' + settings.apiKey + '?c=' + dspath)
      .expect(function (res) {
        let result = JSON.parse(res.text)
        res.body = {
          err: result.err,
          length: result.content.length,
          id: typeof result.content[0].id,
          v: result.content[0].v,
          t: typeof result.content[0].t
        }
      })
      .expect(200, {
        err: null,
        length: 1,
        id: 'string',
        v: '2',
        t: 'number'
      }, done)
    })
  })
}

Push(global.uuid || uuidv4())

module.exports = Push
