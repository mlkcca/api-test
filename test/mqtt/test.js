var mqtt = require('mqtt')
var assert = require('assert');

const mlkccaEndpoint = 'pubsub1.mlkcca.com'

describe("mqtt", function() {

  describe("push", function() {

    this.timeout(5000)

    it('push message', function (done) {

      var topic = 'demo/apitest-mqtt/_p'

      var client  = mqtt.connect('mqtt://' + mlkccaEndpoint, {
        username: 'kdemo',
        password: 'demo'
      })
      client.on('connect', function (e) {
        client.subscribe(topic)
        setTimeout(function() {
          client.publish(topic, JSON.stringify({content:"Hello"}))
        }, 100)
      })

      client.on('message', function (topic, message) {
        console.log("message", topic, result)
        var str = message.toString();
        var result = JSON.parse(str);
        assert.equal(result.content, "Hello");
        client.end()
        done()
      })

    });

  })

  describe("send", function() {

    this.timeout(5000)

    it('send message', function (done) {

      var topic = 'demo/apitest-mqtt/_s'

      var client  = mqtt.connect('mqtt://' + mlkccaEndpoint, {
        username: 'kdemo',
        password: 'demo'
      })
      client.on('connect', function (e) {
        client.subscribe(topic)
        setTimeout(function() {
          client.publish(topic, JSON.stringify({content:"Hello"}))
        }, 100)
      })

      client.on('message', function (topic, message) {
        console.log("message", topic, result)
        var str = message.toString();
        var result = JSON.parse(str);
        assert.equal(result.content, "Hello");
        client.end()
        done()
      })

    });

  })
})
