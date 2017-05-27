const EventEmitter = require('events')

module.exports = secondsToStartWith => {
	const emitter = new EventEmitter()

	let secondsRemaining = secondsToStartWith

	const interval = setInterval(() => {
		if (secondsRemaining <= 0) {
			secondsRemaining = 0
		} else {
			secondsRemaining--
		}
		emitter.emit('seconds', secondsRemaining)
	}, 1000)

	emitter.on('reset', () => {
		secondsRemaining = secondsToStartWith
		emitter.emit('seconds', secondsRemaining)
	})

	emitter.on('shutdown', () =>{
		clearInterval(interval)
	})

	return emitter
}
