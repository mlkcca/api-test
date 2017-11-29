var mqtt = require('mqtt')
var assert = require('assert');

const mlkccaEndpoint = 'pubsub1.mlkcca.com'

describe("mqtt connect", function() {

  this.timeout(5000)

  it('password incorrect', function (done) {

    var topic = 'demo/apitest-mqtt/_p'

    var client  = mqtt.connect('mqtt://' + mlkccaEndpoint, {
      username: 'kdemo',
      password: 'demo_incorrect'
    })

    client.on('error', function (e) {
      assert.equal(e.message, 'Connection refused: Bad username or password');
      client.end()
      done()
    })

    client.on('connect', function (e) {
      throw e
    })

  });

})
