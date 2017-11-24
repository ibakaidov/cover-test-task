'use strict'

const mongoose = require('mongoose')
const {host, name} = require(__dirname + '/../../config.json').db

mongoose.Promise = Promise

const models = {
  Post: mongoose.model('Post', new mongoose.Schema({
    id: Number,
    date: Date
  }))
}

class Db {

  static get instance() {
    if (this._instance == null) {
      this._instance = new Db()
    }
    return this._instance
  }



  constructor() {
    this.initDB()

  }

  initDB() {
    mongoose.connect(`mongodb://${host}/${name}`) 
  }

  addPost({ id }) {
    let post = new models.Post({ id, date: new Date })
    return post.save(this.connection)
  }
  addLike({ postid, uid }) {
    let post = new models.Like({ postid, uid, date: new Date })
    return post.save(this.connection)
  }
  deletePost({ id }) {
    return this.then(models.Post.find({ id }).remove())
  }

  getTodayPosts() {
    let now = new Date()
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return models.Post.find({ date: { $gte: startOfToday } })
  }



}

module.exports = Db