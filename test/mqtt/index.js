const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function MQTT () {
  describe('Connect', function () {
    require('./connect')
  })
  describe('Push', function () {
    require('./push')
  })
  describe('Send', function () {
    require('./send')
  })
}

MQTT()

module.exports = MQTT
