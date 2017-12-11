const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function MQTT () {
  describe('Connect', function () {
    require('./connect')
  })
}

MQTT()

module.exports = MQTT
