const express = require('express')
const socketio = require('socket.io')

module.exports = (port, emitter) => {
	const app = express()

	app.use(express.static('public'))

	const io = socketio.listen(app.listen(port, () => {
		console.log(`server started on port ${port}`)
	}))

	emitter.on('emit', data => {
		io.sockets.emit('message', data)
	})
}
