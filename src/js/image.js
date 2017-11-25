const fs = require('fs-extra')
  , gm = require('gm').subClass({ imageMagick: true })
  , request = require('request-promise')
  , { tmp } = require('../../config').image

module.exports = ({ name, likes, avatar }) => {
  return Promise.all([
    drawText({ name, likes }),
    getAvatar({ avatar })
  ])
    .then(composite)
    .then(clean)
}

function drawText({ name, likes }) {
  new Promise((resolve, reject) => {
    gm(__dirname + '/../mockups/background.jpg')
      .resize(1590, 400)
      .font(__dirname + '/../fonts/ChalkboardSE-Regular.ttf')
      .stroke('#800')
      .fontSize(36)
      .drawText(718, 169, name)
      .fontSize(28)
      .drawText(718, 210, likes + ' ' + declOfNum(likes, ['лайк', 'лайка', 'лаЙков']))
      .write(tmp + '/cover.jpg', (err) => {
        if (err) return reject(err)
        resolve()
      })
  })
}
function getAvatar({ avatar }) {
  return new Promise(async (resolve, reject) => {
    const originalFilePath = tmp + '/avatar.jpg', outputFilePath = tmp + '/avatar.png', output = tmp + '/avatar.png'
    await fs.outputFile(originalFilePath, await request({ url: avatar, encoding: null }))
    let size = 100

    gm(originalFilePath)
      .crop(size, size, 0, 0)
      .resize(size, size)
      .write(outputFilePath, (err) => {
        if (err) return reject(err)
        gm(size, size, 'none')
          .fill(outputFilePath)
          .drawCircle(size / 2, size / 2, size / 2, 0)
          .write(output, (err) => {
            if (err) return reject(err)
            resolve()
          })
      })
  })
}
function composite() {
  return new Promise(async (resolve, reject) => {
    gm(tmp + '/cover.jpg')
      .composite(tmp + '/avatar.png')
      .geometry('+594+150')
      .write(tmp + '/cover.jpg', (err) => {
        if (err) reject(err)
        resolve()
      })
  })
}

async function clean() {
  await fs.remove(tmp + '/avatar.jpg')
  await fs.remove(tmp + '/avatar.png')
}

function declOfNum(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}