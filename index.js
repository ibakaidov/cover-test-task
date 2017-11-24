
const bot = require('./src/js/bot')
const db = require('./src/js/db').instance
const scheduler = require('./src/js/scheduler')

bot.event('waLL_post_new', (id) => {
  db.addPost(id)
})

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
  let win = null
  let mlike = 0
  for (const key in users) {
    if (users.hasOwnProperty(key)) {
      const element = users[key]
      if (mlike < element) {
        win = key
        mlike = element
      }
    }
  }
})
