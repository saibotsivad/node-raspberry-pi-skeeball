const EventEmitter = require('events')
const keypress = require('keypress')

console.log('this is a mock of the pin input for easier development')
console.log('1-5 for a ball, low->high points, r to reset')

const emitter = new EventEmitter()

keypress(process.stdin)

const scoreKeymap = {
	1: 10,
	2: 20,
	3: 30,
	4: 40,
	5: 50
}

const actionKeymap = {
	1: 'increment',
	2: 'increment',
	3: 'increment',
	4: 'increment',
	5: 'increment',
	r: 'reset'
}

process.stdin.on('keypress', (ch, key) => {
	if (actionKeymap[ch]) {
		emitter.emit(actionKeymap[ch], scoreKeymap[ch])
	}
	if (key && key.ctrl && key.name == 'c') {
		emitter.emit('shutdown')
		process.stdin.pause()
	}
})

process.stdin.setRawMode(true)
process.stdin.resume()

module.exports = emitter
