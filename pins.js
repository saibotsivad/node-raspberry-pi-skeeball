const EventEmitter = require('events')
const gpio = require('rpi-gpio')

const emitter = new EventEmitter()

gpio.on('change', function(channel, value) {
	emitter.emit('change', { channel, value })
})

gpio.setup(18, gpio.DIR_IN, gpio.EDGE_BOTH, err => {
	if (err) {
		console.log('error on pin setup', err)
	}
})

console.log('watching channel 18')

module.exports = emitter
