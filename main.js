//! VARIABLES
//? CONSTANTS
const letters = ['A','B','C','D','E','F','G','H','I','J']
const width = 10
const height = 10
const playerIndicators = ['p', 'c']
const shipInfo = [
    {name: 'carrier', length: 5}, 
    {name: 'battleship', length: 4},
    {name: 'cruiser', length: 3}, 
    {name: 'submarine', length: 3},
    {name: 'destroyer', length: 2}
]
const countries = [
    {name: 'USA', flag: 'src', flagLoss: 'src', anthem: 'src'},
    {name: 'UK', flag: 'src', flagLoss: 'src', anthem: 'src'},
    {name: 'Russia', flag: 'src', flagLoss: 'src', anthem: 'src'},
    {name: 'China', flag: 'src', flagLoss: 'src', anthem: 'src'}
]

const difficulties = ['easy', 'normal', 'hard']
const gamemodes = ['normal', 'salvo']
const shipHealth = ['healthy', 'damaged', 'destroyed']
const shipOrientations = ['vertical', 'horizontal']

//? BOARD ENCODINGS
const shipIdentifier = 's'
const hitIdentifier = 'h'
const missIdentifier = 'm'

//? STATE VARIABLES
let gamemode
let difficulty
let countryPlayer
let countryAI
let playerBoard
let aiBoard
let ships
let turnCounter
let winner
let currentSelection

//? VISUAL ASSETS

//? MUSIC & SOUND EFFECTS

//? ELEMENT REFERENCES
// const musicButton
// const soundButton
const container = document.getElementById('container')

//? CLASSES & INSTANCES
class Ship {
    constructor(length, name, owner) {
        this.length = length
        this.name = name
        this.owner = owner
        this.startingPosition = null
        this.orientation = 'vertical'
        this.health = shipHealth[0]
    }

    destroyedMessage() {

    }

    
}

//! EVENT LISTENERS
// Pick gamemode

// Pick difficulty

// Pick player country

// Pick opponent country

// Place ships

// Select cell to fire on

// Restart game

//! PLAY
init()
placeShip([0,0], ships[0], playerBoard)
placeShip([2,5], rotateShip(ships.find((ship) => ship.name === 'submarine')), playerBoard)

//! FUNCTIONS
//? GAME SET-UP, PLAYER ACTIONS, STATE TRANSITIONS

function init() {
    gamemode = null
    difficulty = null
    countryPlayer = null
    countryAI = null
    playerBoard = []
    aiBoard = []
    ships = []
    turnCounter = 0
    winner = null
    currentSelection = null
    createBoards()
    createShips('player')
    createShips('ai')

}

// to be done as event listeners -> simple variable changes
// function selectMode() {

// }

// function selectDifficulty() {

// }

// function selectPlayerCountry() {

// }

// function selectAICountry() {

// }

function createBoard(player, playerBoard) {
    let board = document.createElement('div')
    board.classList.add('board')
    board.id = `${player}-board`
    for (let i=0; i<height; i++) {
        playerBoard.push([])
        for (let j=0; j<width; j++) {
            let cell = document.createElement('div')
            cell.id = `${player}-${letters[i]}${j}`
            board.appendChild(cell)
            playerBoard[i].push(0)
        }
    }
    container.appendChild(board)
}

function createBoards() {
    createBoard('p', playerBoard)
    createBoard('c', aiBoard)
}

function createShips(player) {
    shipInfo.forEach(ship => {
        let boat = new Ship(ship.length, ship.name, player)
        ships.push(boat)
    })
}

function hoverShip() {

}

function rotateShip(ship) {
    if (ship.orientation === 'vertical') {
        ship.orientation = 'horizontal'
    } else ship.orientation = 'vertical'
    return ship
}

function placeShip(start, ship, board) {
    //Start = [row, column]
    let row = start[0]
    let col = start[1]
    if (ship.orientation === 'horizontal' && horizontalPlacementAllowed(start, ship, board)) {
        for (let i=0; i<ship.length; i++) {
            board[row][col+i] = shipIdentifier
        }
    } else if (ship.orientation === 'vertical' && verticalPlacementAllowed(start, ship, board)) {
        for (let i=0; i<ship.length; i++) {
            board[row+i][col] = shipIdentifier
        }
    }
}

function horizontalPlacementAllowed(start, ship, board) {
    //Start = [row, column]
    let row = start[0]
    let col = start[1]
    let checkClash = board[row].slice(col, col+ship.length).every((value) => value === 0)
    let checkBounds = (col+ship.length<=width)
    console.log(checkClash && checkBounds)
    return (checkClash && checkBounds)
}

function verticalPlacementAllowed(start, ship, board) {
    //Start = [row, column]
    let row = start[0]
    let col = start[1]
    let column = getColumn(board, col)
    let checkClash = column.slice(row, row+ship.length).every((value) => value === 0)
    let checkBounds = (row+ship.length<=height)
    return (checkClash && checkBounds)
}

function getColumn(board, index) {
    let column = []
    for (let i=0; i<height; i++) {
        column.push(board[i][index])
    }
    return column
}

function indexConverter(index) {
    if (typeof(index) === 'number') {
        return letters[index]
    } else if (typeof(index) === 'string') {
        return letters.indexOf(index)
    }
}

function toggleShip() {

}

function pickTargetCellPlayer() {

}

function toggleTurn() {

}

function restartGame() {
    init()
}

//? RENDERING DOM ELEMENTS
function render() {
    
}

function renderBoard() {

}

function winScreen() {
    winMessage()
}

function lossScreen() {
    lossMessage()
}

function hitMessage() {

}

function missMessage() {

}

function destroyedMessage() {

}

function winMessage() {

}

function lossMessage() {

}

function displayMessage() {

}

function toggleMusic() {

}

function toggleAudio() {

}


//? AI

function playEasy() {

}

function playMedium() {

}

function playHard() {

}

function placeAIShips(board, ships) {

}

function pickTargetCellAI() {

}

function randomTargeting() {

}

function localHunt() {

}

function estimateDensity() {

}