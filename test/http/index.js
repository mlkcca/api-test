const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function HTTP () {
  describe('Push', function () {
    require('./push')
  })
  describe('DataStoreList', function () {
    require('./ds')
  })
}

HTTP()

module.exports = HTTP
