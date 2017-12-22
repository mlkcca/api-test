const uuidv4 = require('uuid/v4')
global.uuid = uuidv4()

console.log('Milkcocoa API Tests, uuid: ' + global.uuid + '.\n')

describe('HTTP', function () {
  require('./http')
})

describe('MQTT', function () {
  require('./mqtt')
})

describe('Websocket', function () {
  require('./websocket')
})

describe('Access token', function () {
  require('./accesstoken')
})

describe('Multiple API', function () {
  require('./multiple')
})
