const fs = require('fs-extra')
  , gm = require('gm').subClass({ imageMagick: true })
  , request = require('request-promise')

module.exports = ({ name, likes, avatar }) => {
  return Promise.all([
    drawText({ name, likes }),
    getAvatar({ avatar })
  ])
  .then(composite)
  .then(clean)

}





function declOfNum(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
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
      .write('./cover.jpg', (err) => {
        if (err) return reject(err)
        resolve()
     

      })
  })
}
function getAvatar({ avatar }) {
  return new Promise(async (resolve, reject) => {
    const originalFilePath = './avatar.jpg', outputFilePath = './avatar.png', output = './avatar.png'
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
          .write(output, async (err) => {
            if (err) return reject(err)

            resolve()
          })
      })
  })
}
function composite() {
  return new Promise(async (resolve, reject) => {
    gm('./cover.jpg')
      .composite('./avatar.jpg')
      .geometry('+594+150')
      .write('./cover.jpg', function (err) {
        if (err) reject(err)
        resolve()
      })
  })
}

async function  clean(){
  await fs.remove('./avatar.jpg')
  await fs.remove('./avatar.png')
}