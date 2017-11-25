const bodyParser = require('body-parser')
const express = require('express')
const { Botact, api } = require('botact')

const { token, confirmation, groupId } = require(__dirname + '/../../config.json')

const bot = new Botact({
  token,
  confirmation
})

bot.getLikes = async  (postids) => {
  let response
  try {
    response  = (await api('execute', { code: `\
    var groupId = ${groupId} ;\
    var posts = [${postids.join(',')}];\
    var i = 0, l = posts.length;\
    var result = [];\
    while (i < l) {   var postid = posts[i];\
      var post = { postid: postid, likes: [] };\
      var offset = 0;\
      var likescount = 0;\
      var likes = API.likes.getList({ type: "post", owner_id: -groupId, item_id: postid, count: 1000, offset: offset });\
      post.likes.push(likes.items);\
      likescount = likescount + likes.items.length;\
      while (likescount < likes.count) {\
        var likes = API.likes.getList({ type: "post", owner_id: -groupId, item_id: postid, count: 1000, offset: offset });\
        offset = offset + 1001;\
        likescount = likescount + likes.items.length;\
        post.likes.push(likes.items);\
      }
      result.push(post);\
      i = i + 1;\
    }
    return result;\
      `, 
     access_token: token })).response

  } catch(e){
    throw e
  }
    return response.filter((el) => el.likes[0].length != 0)
    .map((el) => {
        let likes = []
        el.likes.forEach((sub) => likes.push(...sub))
        el.likes = likes
        return el
    })
}

bot.getUser = async  (uid, fields = []) => {
  let response
  try {
    response = (await api('users.get', { user_ids: uid, fields, access_token: token })).response
  } catch(e) {
    throw e
  }
  if (response.length === 0) throw new Error('User non found')
  return response[0]
}


const app = express()

app.use(bodyParser.json())
app.post('/', bot.listen)
app.listen(process.env.PORT||3123)


module.exports = bot