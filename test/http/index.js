const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function HTTP () {
  describe('Push', function () {
    require('./push')
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
}

HTTP()

module.exports = HTTP
