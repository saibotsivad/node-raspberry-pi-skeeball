const gpio = require('rpi-gpio')

gpio.on('change', function(channel, value) {
	console.log('channel ' + channel + ' value is now ' + value)
})

gpio.setup(18, gpio.DIR_IN, gpio.EDGE_BOTH, err => {
	console.log('error on setup', err)
})

console.log('watching channel 18')
