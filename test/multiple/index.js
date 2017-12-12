const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function Multiple () {
  describe('Websocket subscribe', function () {
    require('./websocket-on')
  })
  describe('MQTT subscribe', function () {
    require('./mqtt-on')
  })
  describe('HTTP subscribe', function () {
    require('./http-on')
  })
  describe('JavaSciprt subscribe', function () {
    require('./javascript-on')
  })
}

Multiple()

module.exports = Multiple
