const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function WebSocket () {
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

WebSocket()

module.exports = WebSocket
