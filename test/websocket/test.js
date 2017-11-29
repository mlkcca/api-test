const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
const assert = require('assert');

const mlkccaEndpoint = 'pubsub1.mlkcca.com'

describe('websocket', function() {
  this.timeout(10000)

  it('push message', function (done) {
    client.on('connectFailed', function(error) {
      throw error
    });

    client.on('connect', function (connection) {
      connection.on('error', function(error) {
        throw error
      })
      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          const result = JSON.parse(message.utf8Data)
          assert.equal(result[0][2], 'Hello')
          connection.close()
          client.abort()
          done()
        }
      })

      if (connection.connected) {
        setTimeout(function () {
          connection.sendUTF('Hello')
        }, 1000);
      }
    })
    client.connect('wss://' + mlkccaEndpoint + '/ws/push/demo/demo?c=apitest')
  })
})