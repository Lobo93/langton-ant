// Values
const boardWidth = 200
const boardHeight = 200
const squareSize = 4
const color0 = 'rgba(250,250,250,255)'
const color1 = 'rgba(5,5,5,255)'
let interval = 100
let playing = 1

// Board array
const board = Array(boardHeight).fill(null)
board.forEach((row, index) => board[index] = Array(boardWidth).fill(0))

// Canvas
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

canvas.setAttribute('width', `${boardWidth * squareSize}px`)
canvas.setAttribute('height', `${boardHeight * squareSize}px`)

context.fillStyle = color0
context.fillRect(0, 0, boardWidth * squareSize, boardHeight * squareSize)

// Ants
const ants = []

function Ant(direction, x, y) {
	this.direction = direction
	this.x = x
	this.y = y
}

// Add new ants
canvas.addEventListener('click', ({offsetX, offsetY}) => {
	ants.push(new Ant(
		'up',
		Math.floor(offsetX * canvas.width / canvas.clientWidth / squareSize),
		Math.floor(offsetY * canvas.height / canvas.clientHeight / squareSize)
	))
})

// Cycle
function cycle() {
	if (playing) {
		ants.forEach(ant => {
			// Turn clockwise on white squares
			if (board[ant.y][ant.x] === 0) {
				switch(ant.direction) {
					case 'up': ant.direction = 'right'; break;
					case 'right': ant.direction = 'down'; break;
					case 'down': ant.direction = 'left'; break;
					case 'left': ant.direction = 'up'; break;
				}
			}
	
			// Turn counter-clockwise on black squares
			else {
				switch(ant.direction) {
					case 'up': ant.direction = 'left'; break;
					case 'left': ant.direction = 'down'; break;
					case 'down': ant.direction = 'right'; break;
					case 'right': ant.direction = 'up'; break;
				}
			}
	
			// Change square color
			board[ant.y][ant.x] ^= 1
			board[ant.y][ant.x] === 0 ? context.fillStyle = color0 : context.fillStyle = color1
			context.fillRect(ant.x * squareSize, ant.y * squareSize, squareSize, squareSize)
	
			// Move forward 1 square
			switch(ant.direction) {
				case 'up': ant.y--; break;
				case 'down': ant.y++; break;
				case 'left': ant.x--; break;
				case 'right': ant.x++; break;
			}
	
			// Loop around board
			if (ant.x < 0) ant.x = boardWidth - 1
			if (ant.x >= boardWidth) ant.x = 0
			if (ant.y < 0) ant.y = boardHeight - 1
			if (ant.y >= boardHeight) ant.y = 0
		})
	}

	// Call next cycle
	setTimeout(cycle, interval)
}
cycle()

// Inputs
const speed = document.getElementById('speed')
speed.addEventListener('input', () => {
	interval = 4 * 5 ** (3 - speed.value)
})

const play = document.getElementById('play')
play.addEventListener('click', () => {
	play.textContent = play.textContent === 'Stop' ? 'Play' : 'Stop'
	playing ^= 1
})

const reset = document.getElementById('reset')
reset.addEventListener('click', () => {
	board.forEach((row, index) => board[index] = Array(boardWidth).fill(0))
	ants.length = 0
	context.fillStyle = color0
	context.fillRect(0, 0, boardWidth * squareSize, boardHeight * squareSize)
	play.textContent = 'Stop'
	playing = 1
})