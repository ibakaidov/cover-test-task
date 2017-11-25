
const bot = require('./src/js/bot')
const image = require('./src/js/image')
const db = require('./src/js/db').instance
const scheduler = require('./src/js/scheduler')

const { tmp } = require('./config').image

bot.event('waLL_post_new', db.addPost)

scheduler(async () => {
  let posts = await db.getTodayPosts()
  let ids = posts.map((post) => {
    //delete null posts from db

    return post.id
  })
  let likes = await bot.getLikes(ids)
  let users = {}
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
  for (const key in users) {
    if (users.hasOwnProperty(key)) {
      const element = users[key]
      if (maxlike < element) {
        winid = key
        maxlike = element
      }
    }
  }
  let winner = await bot.getUser(winid, ['photo_100'])
  await image({name: winner.first_name+' '+winner.last_name, likes:maxlike, avatar:winner.photo_100})
  bot.uploadAndSaveCoverPhoto(tmp+'/cover.jpg')  
})
