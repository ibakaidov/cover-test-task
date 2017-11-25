const schedule = require('node-schedule')

const { time } = require('../../config')

const [ hour, minute ] = time.split(':')

module.exports = (cb) => {
  schedule.scheduleJob(`${minute} ${hour} * * *`, cb)
}