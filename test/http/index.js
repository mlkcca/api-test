const uuidv4 = require('uuid/v4')
global.uuid = global.uuid || uuidv4()

function HTTP () {
  describe('Push', function () {
    require('./push')
  })
}

HTTP()

module.exports = HTTP
