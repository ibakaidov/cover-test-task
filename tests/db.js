const {expect} = require('chai')
const DB = require('../src/js/db')

describe('db', () => {
  before(() => {
    this.db = DB.instance
  })

  it('should add and delete post', (done) => {
    const id = 1
    this.db.addPost({ id }).then((res) => {
      expect(res.id).eq(id)
      this.db.deletePost({id}).then(()=>{
        done()
      }).catch(done)
    }).catch(done)
  })

  it('should find today post', (done)=>{
    const id = 2
    this.db.addPost({ id }).then((res) => {
      expect(res.id).eq(id)
      this.db.getTodayPosts().then((posts)=>{
        expect(posts.length).gt(0)
        done()
      })
    }).catch(done)
  })
})