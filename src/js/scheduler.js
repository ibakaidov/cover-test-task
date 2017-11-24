const schedule = require('node-schedule')

let {time} = require('../../config')

time = time.split(':')

const hour = time[0]
const minute = time[1]

module.exports = function (cb){
  schedule.scheduleJob(`${minute} ${hour} * * *`, cb)
}