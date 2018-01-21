const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/defaultConfig')
const mime = require('../helper/mime')

const tplpath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplpath)
const template = Handlebars.compile(source.toString())

module.exports = async (req, res, filePath) => {
  const stats = await stat(filePath).catch(ex => {
    res.statusCode = 404
		res.setHeader('Content-Type', 'text/plain')
		res.end(`${filePath} is not a directory or file`)
  })
  res.statusCode = 200
  if (stats.isFile()) {
    // fs.readFile(filePath, (err, data) => {
    //   res.end(data)
    // })
    const contentType = mime(filePath)
    res.setHeader('Content-Type', contentType)
    fs.createReadStream(filePath).pipe(res)
  } else if (stats.isDirectory()) {
    const files = await readdir(filePath)
    const dir = path.relative(config.root, filePath)
    const data = {
      files,
      dir: dir && `/${dir}`,
      title: path.basename(filePath),
    }
    res.setHeader('Content-Type', 'text/html')
    res.end(template(data))
  }
}
