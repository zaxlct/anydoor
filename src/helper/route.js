const fs = require('fs')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports = async (req, res, filePath) => {
  const stats = await stat(filePath).catch(ex => {
    res.statusCode = 404
		res.setHeader('Content-Type', 'text/plain')
		res.end(`${filePath} is not a directory or file`)
  })
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  if (stats.isFile()) {
    // fs.readFile(filePath, (err, data) => {
    //   res.end(data)
    // })
    fs.createReadStream(filePath).pipe(res)
  } else if (stats.isDirectory()) {
    const files = await readdir(filePath)
    res.end(files.join(','))
  }
}
