const { Bot } = require('botact')

const {token, confirmation} = require(__dirname + '/../../config.json')

const bot = new Bot({
  token,
  confirmation
})

module.exports = bot