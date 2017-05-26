const EventEmitter = require('events')
const keypress = require('keypress')

console.log('1-4 for a ball, low->high points, r to reset')

const emitter = new EventEmitter()

keypress(process.stdin)

const scoreKeymap = {
	1: 50,
	2: 100,
	3: 150,
	4: 200
}

const actionKeymap = {
	1: 'increment',
	2: 'increment',
	3: 'increment',
	4: 'increment',
	r: 'reset'
}

process.stdin.on('keypress', (ch, key) => {
	if (actionKeymap[ch]) {
		emitter.emit(actionKeymap[ch], scoreKeymap[ch])
	}
	if (key && key.ctrl && key.name == 'c') {
		process.stdin.pause()
	}
})

process.stdin.setRawMode(true)
process.stdin.resume()

module.exports = emitter
