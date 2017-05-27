const EventEmitter = require('events')

const gameController = require('./game.js')
const sleepController = require('./timer.js')
const serverController = require('./server.js')

const pinController = process.argv[2] || './pins.js'
const secondsToWaitBeforeSleeping = process.argv[3] || (5 * 60)
const ballsPerRound = process.argv[4] || 7
const serverPort = process.argv[5] || 3000

const pins = require(pinController)
const game = gameController(ballsPerRound, pins)
const timer = sleepController(secondsToWaitBeforeSleeping)

const emitter = new EventEmitter()

game.on('action', data => {
	timer.emit('reset')
	console.log('action', data)
	emitter.emit('emit', {
		key: 'action',
		data
	})
})

game.on('complete', data => {
	pins.emit('restartLight', true)
	console.log('complete', data)
	emitter.emit('emit', {
		key: 'complete',
		data
	})
})

game.on('reset', () => {
	timer.emit('reset')
	pins.emit('displayLight', true)
	pins.emit('restartLight', false)
	console.log('reset')
	emitter.emit('emit', {
		key: 'reset'
	})
})

pins.on('shutdown', () => {
	timer.emit('shutdown')
	emitter.emit('shutdown')
})

timer.on('seconds', seconds => {
	console.log('seconds', seconds)
	emitter.emit('emit', {
		key: 'seconds',
		data: seconds
	})
	if (seconds <= 0) {
		game.emit('resetGame')
		pins.emit('displayLight', false)
		pins.emit('restartLight', true)
	}
})

serverController(serverPort, emitter)
