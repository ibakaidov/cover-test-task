
const bot = require('./src/js/bot')
const image = require('./src/js/image')
const db = require('./src/js/db').instance
const scheduler = require('./src/js/scheduler')
const { tmp } = require('./config').image

bot.event('waLL_post_new', db.addPost)

scheduler(async () => {
  const posts = await db.getTodayPosts()
  const ids = posts.map((post) => post.id )
  const likes = await bot.getLikes(ids)
  const users = {}

  likes.forEach((post) => {
    post.likes.forEach((user) => {
      if (users[user] == null) {
        users.user = 0
      }
      users[user]++
    })
  })
  
  let winid = null
  let maxlike = 0

  Object.entries(users).forEach(([userid, likes]) => {
    if (maxlike < likes) {
      winid = userid
      maxlike = likes
    }
  })

  let winner = await bot.getUser(winid, ['photo_100'])
  await image({ name: winner.first_name + ' ' + winner.last_name, likes: maxlike, avatar: winner.photo_100 })
  bot.uploadAndSaveCoverPhoto(tmp + '/cover.jpg')
})
