const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function HTTP () {
  describe('Push', function () {
    require('./push')
  })
  describe('Send', function () {
    require('./send')
  })
  describe('Set', function () {
    require('./set')
  })
  describe('DataStoreList', function () {
    require('./ds')
  })
  describe('History', function () {
    require('./history')
  })
  describe('On', function () {
    require('./on')
  })
  describe('Grant', function () {
    require('./grant')
  })
}

HTTP()

module.exports = HTTP
