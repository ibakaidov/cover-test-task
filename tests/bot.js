const { expect } = require('chai')
const bot = require('../src/js/bot')
const { test: { posts } } = require('../config')

describe('bot', () => {
  it('should get likes', async () => {
    const likes = await bot.getLikes(posts)
    
    expect(likes).to.be.a('array')
  })
  
  it('should get user', async () => {
    const user = await bot.getUser(1, [ 'sex' ])
    const { id, sex } = user
    
    expect(user).to.be.a('object')
    expect(id).eq(1)
    expect(sex).eq(2)
  })
})
