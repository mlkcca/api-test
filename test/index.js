const uuidv4 = require('uuid/v4')
global.uuid = uuidv4()

describe('HTTP', function () {
  require('./http')
})
