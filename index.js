const EventEmitter = require('events')
const debouncer = require('debouncer')
const levelup = require('levelup')
const memdown = require('memdown')

const gameController = require('./game.js')
const sleepController = require('./timer.js')
const serverController = require('./server.js')

const pinController = process.argv[2] || './pins.js'
const secondsToWaitBeforeSleeping = parseInt(process.argv[3], 10) || (5 * 60)
const ballsPerRound = parseInt(process.argv[4], 10) || 7
const serverPort = parseInt(process.argv[5], 10) || 3000
const debounceDelayMillis = parseInt(process.argv[6], 10) || 500

const pins = require(pinController)
const game = gameController(ballsPerRound)
const timer = sleepController(secondsToWaitBeforeSleeping)

const emitter = new EventEmitter()
const db = levelup('process-unique-db-name', { db: memdown })
const debounce = debouncer(db, { delayTimeMs: debounceDelayMillis })

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

pins.on('increment', score => {
	debounce('increment', (err, allowed) => {
		if (allowed) {
			game.emit('increment', score)
		}
	})
})

pins.on('reset', () => {
	debounce('reset', (err, allowed) => {
		if (allowed) {
			game.emit('restart')
		}
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
