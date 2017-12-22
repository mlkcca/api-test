const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function AccessToken () {
  describe('HTTP', function () {
    require('./http')
  })

  describe('Websocket', function () {
    require('./websocket')
  })
}

AccessToken()

module.exports = AccessToken
