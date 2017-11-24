const {Botact}  = require('botact')

const {token, confirmation} = require(__dirname + '/../../config.json')

const bot = new Botact({
  token,
  confirmation
})

module.exports = bot