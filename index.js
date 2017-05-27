const gameController = require('./game.js')
const sleepController = require('./timer.js')

const pinController = process.argv[2] || './pins.js'
const secondsToWaitBeforeSleeping = process.argv[3] || (5 * 60)
const ballsPerRound = process.argv[4] || 7

const pins = require(pinController)
const game = gameController(ballsPerRound, pins)
const timer = sleepController(secondsToWaitBeforeSleeping)

game.on('action', params => {
	timer.emit('reset')
	console.log('action', params)
})

game.on('complete', params => {
	pins.emit('restartLight', true)
	console.log('complete', params)
})

game.on('reset', () => {
	timer.emit('reset')
	pins.emit('displayLight', true)
	pins.emit('restartLight', false)
	console.log('reset')
})

pins.on('shutdown', () => {
	timer.emit('shutdown')
})

timer.on('seconds', seconds => {
	console.log('seconds', seconds)
	if (seconds <= 0) {
		game.emit('resetGame')
		pins.emit('displayLight', false)
		pins.emit('restartLight', true)
	}
})
