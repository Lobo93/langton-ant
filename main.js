// Values
const boardWidth = 200
const boardHeight = 200
const squareSize = 4
const color0 = '#eee'
let color1 = '#111'
let boardType = 'clean'
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

function Ant(color, direction, x, y) {
	this.color = color
	this.direction = direction
	this.x = x
	this.y = y
}

// Add new ants
canvas.addEventListener('click', ({offsetX, offsetY}) => {
	ants.push(new Ant(
		color1,
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
			context.fillStyle = board[ant.y][ant.x] === 0 ? color0 : ant.color
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

// First cycle
cycle()

// Inputs
const speed = document.getElementById('speed')
speed.addEventListener('input', () => {
	interval = 4 * 5 ** (3 - speed.value)
})

const play = document.getElementById('play')
play.addEventListener('click', () => {
	play.classList.toggle('icon-play')
	play.classList.toggle('icon-pause')
	playing ^= 1
})

const download = document.getElementById('download')
download.addEventListener('click', () => {
	download.href = canvas.toDataURL()
})

const menu = document.getElementById('menu')

const menuButton = document.getElementById('menuButton')
menuButton.addEventListener('click', () => {
	menuButton.classList.toggle('icon-bars')
	menuButton.classList.toggle('icon-close')
	menu.classList.toggle('active')
})

const colorButtons = document.querySelectorAll('.color-button')
colorButtons.forEach(button => {
	button.addEventListener('click', ({target}) => {
		colorButtons.forEach(otherButtons => otherButtons.classList.remove('active'))
		target.classList.add('active')
		color1 = target.dataset.color
	})
})

const boardButtons = document.querySelectorAll('.board-button')
boardButtons.forEach(button => {
	button.addEventListener('click', ({target}) => {
		boardButtons.forEach(otherButtons => otherButtons.classList.remove('active'))
		target.classList.add('active')
		boardType = target.dataset.board
		newBoard()
	})
})

const reset = document.getElementById('reset')
reset.addEventListener('click', newBoard)

function newBoard() {
	board.forEach((row, index) => board[index] = Array(boardWidth).fill(0))
	ants.length = 0
	context.fillStyle = color0
	context.fillRect(0, 0, boardWidth * squareSize, boardHeight * squareSize)
	play.classList.remove('icon-play')
	play.classList.add('icon-pause')
	playing = 1
	if (boardType === 'dots') {
		for (let x = 0; x < boardWidth; x++) {
			for (let y = 0; y < boardHeight; y++) {
				if (x % 2 != 0 && y % 2 != 0) {
					board[y][x] = 1
					context.fillStyle = '#111'
					context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
				}
			}
		}
	}
	else if (boardType === 'lines') {
		for (let x = 0; x < boardWidth; x++) {
			for (let y = 0; y < boardHeight; y++) {
				if ((x - y) % 8 === 0) {
					board[y][x] = 1
					context.fillStyle = '#111'
					context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
				}
			}
		}
	}
	else if (boardType === 'box') {
		for (let x = 0; x < boardWidth; x++) {
			for (let y = 0; y < boardHeight; y++) {
				if (
					y >= Math.floor(boardHeight * 0.2) &&
					y <= Math.floor(boardHeight * 0.8) && (
						x === Math.floor(boardWidth * 0.2) ||
						x === Math.floor(boardWidth * 0.8)
					) ||
					x >= Math.floor(boardWidth * 0.2) &&
					x <= Math.floor(boardWidth * 0.8) && (
						y === Math.floor(boardHeight * 0.2) ||
						y === Math.floor(boardHeight * 0.8)
					)
				) {
					board[y][x] = 1
					context.fillStyle = '#111'
					context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
				}
			}
		}
	}
}
