const EventEmitter = require('events')

module.exports = ballsPerRound => {
	const emitter = new EventEmitter()

	let numberOfBalls = 0
	let scoreForRound = 0
	let gameIsComplete = false

	function gameIsStillInPlay() {
		return numberOfBalls < ballsPerRound
	}

	function gameIsOver() {
		return numberOfBalls >= ballsPerRound
	}

	function updateGameCompleteness() {
		if (gameIsOver()) {
			gameIsComplete = true
		}
	}

	function gameJustCompleted() {
		return !gameIsComplete && gameIsOver()
	}

	function registerBallScore(score) {
		numberOfBalls++
		scoreForRound += score
	}

	function resetGame() {
		numberOfBalls = 0
		scoreForRound = 0
		gameIsComplete = false
	}

	emitter.on('increment', score => {
		if (gameIsStillInPlay()) {
			registerBallScore(score)
			emitter.emit('action', {
				score: scoreForRound,
				ballsPlayed: numberOfBalls
			})
		}
		if (gameJustCompleted()) {
			emitter.emit('complete', {
				score: scoreForRound
			})
		}
		if (!gameIsStillInPlay() && !gameJustCompleted()) {
			emitter.emit('complete', {
				score: scoreForRound,
				previouslyCompleted: true
			})
		}
		updateGameCompleteness()
	})

	emitter.on('restart', () => {
		resetGame()
		emitter.emit('reset')
	})

	return emitter
}
