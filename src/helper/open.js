const { exec } = require('child_process')

module.exports = url => {
	switch (process.platform) {
	case 'drawin':
		exec(`open ${url}`)
		break
	case 'win32':
		exec(`start ${url}`)
		break
	}
}
