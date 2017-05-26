const filename = process.argv[2]
const emitter = require(filename)

const ballsPerRound = 7

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
		console.log(`ball ${numberOfBalls}, score ${scoreForRound}`)
	}
	if (gameJustCompleted()) {
		console.log(`game over with ${scoreForRound} points`)
	}
	if (!gameIsStillInPlay() && !gameJustCompleted()) {
		console.log('restart the game')
	}
	updateGameCompleteness()
})

emitter.on('reset', () => {
	resetGame()
	console.log('game restarted')
})
