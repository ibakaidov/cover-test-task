const {expect} = require('chai')
const bot = require('../src/js/bot')
const {test} = require('../config')

describe('bot', () => {
  it('should get likes', (done)=>{
    bot.getLikes(test.posts).then((likes)=>{
      expect(likes).to.be.a('array')
      done()
    }).catch(done)
  })
})