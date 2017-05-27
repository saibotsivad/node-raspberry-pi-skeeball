const EventEmitter = require('events')
const gpio = require('rpi-gpio')

const emitter = new EventEmitter()

const scorePinmap = {
	16: 10,
	18: 20,
	22: 30,
	24: 40,
	26: 50
}

const actionPinmap = {
	16: 'increment',
	18: 'increment',
	22: 'increment',
	24: 'increment',
	26: 'increment',
	12: 'reset'
}

const outputPinmap = {
	restartLight: 8,
	displayLight: 10
}

gpio.on('change', function(channel, value) {
	if (actionPinmap[channel]) {
		emitter.emit(actionPinmap[channel], scorePinmap[channel])
	}
})

Object.keys(actionPinmap)
	.forEach(pinNumber => {
		console.log(`watching pin ${pinNumber}`)
		gpio.setup(pinNumber, gpio.DIR_IN, gpio.EDGE_BOTH, err => {
			if (err) {
				console.log('error on pin setup', err)
			}
		})
	})

Object.keys(outputPinmap)
	.forEach(key => {
		const pinNumber = outputPinmap[key]
		console.log(`registering pin ${pinNumber} for output`)
		gpio.setup(pinNumber, gpio.DIR_OUT, err => {
			if (err) {
				console.log('error on pin setup', err)
			}
		})

		emitter.on(key, value => {
			gpio.write(pinNumber, value, err => {
				if (err) {
					console.log(`${key}: error writing '${value}' to pin ${pinNumber}`)
				} else {
					console.log(`${key}: wrote '${value}' to pin ${pinNumber}`)
				}
			})
		})
	})

module.exports = emitter
