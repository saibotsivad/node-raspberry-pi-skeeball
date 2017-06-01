const EventEmitter = require('events')
const debouncer = require('debouncer')
const levelup = require('levelup')
const memdown = require('memdown')

const uniqueIdentifier = 'skeeball'
const millisDebounceTimeForAction = 500

module.exports = (ballsPerRound, inputEmitter) => {
	const emitter = new EventEmitter()
	const db = levelup(uniqueIdentifier, { db: memdown })
	const debounce = debouncer(db, { delayTimeMs: millisDebounceTimeForAction })

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

	inputEmitter.on('increment', score => {
		debounce('increment', (err, allowed) => {
			if (allowed) {
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
			}
		})
	})

	inputEmitter.on('reset', () => {
		debounce('reset', (err, allowed) => {
			if (allowed) {
				resetGame()
				emitter.emit('reset')
			}
		})
	})

	emitter.on('resetGame', () => {
		resetGame()
	})

	return emitter
}
