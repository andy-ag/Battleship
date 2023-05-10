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
const cellStyle = [
    {0: 'white'},
    {'s': 'grey'},
    {'m': 'lightblue'},
    {'h': 'orange'},
    {'d': 'red'}
]

const difficulties = ['easy', 'normal', 'hard']
const gamemodes = ['normal', 'salvo']
const shipHealth = ['healthy', 'damaged', 'destroyed']
const shipOrientations = ['vertical', 'horizontal']

//? BOARD ENCODINGS
const shipIdentifier = 's'
const hitIdentifier = 'h'
const missIdentifier = 'm'
const destroyIdentifier = 'd'

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
const musicButton = null
const soundButton = null
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
        this.placed = false
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
placeShipsRandomly(ships, 'p')
placeAIShips()

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
    createShips('p')
    createShips('c')

}

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
        let newShip = new Ship(ship.length, ship.name, player)
        ships.push(newShip)
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

function boardMatcher(player) {
    let board
    if (player === 'p') {
        board = playerBoard
    } else if (player === 'c') {
        board = aiBoard
    }
    return board
}

function placeShip(start, ship, player) {
    //Start = [row, column]
    if (ship.placed === true) return
    let board = boardMatcher(player)
    let row = start[0]
    let col = start[1]
    if (ship.orientation === 'horizontal' && horizontalPlacementAllowed(start, ship, board)) {
        ship.placed = true
        ship.startingPosition = start
        for (let i=0; i<ship.length; i++) {
            board[row][col+i] = shipIdentifier
            renderCell([row, col+i], player)
        }
    } else if (ship.orientation === 'vertical' && verticalPlacementAllowed(start, ship, board)) {
        ship.placed = true
        ship.startingPosition = start
        for (let i=0; i<ship.length; i++) {
            board[row+i][col] = shipIdentifier
            renderCell([row+i, col], player)
        }
    }
}

function pickRandomCellIndex() {
    let index = []
    index.push(randomBetween(0,height-1))
    index.push(randomBetween(0,width-1))
    return index
}

function randomBetween(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function placeShipsRandomly(ships, player) {
    let shipsSubset = ships.filter((ship) => ship.owner === player).reverse()
    while (shipsSubset.length) {
        shipsSubset[0].orientation = shipOrientations[randomBetween(0,1)]
        placeShip(pickRandomCellIndex(), shipsSubset[0], player)
        if (shipsSubset[0].placed === true) shipsSubset.shift()
    }
}


function horizontalPlacementAllowed(start, ship, board) {
    //Start = [row, column]
    let row = start[0]
    let col = start[1]
    let checkClash = board[row].slice(col, col+ship.length).every((value) => value === 0)
    let checkBounds = (col+ship.length<=width)
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
    renderPlayerBoard()
    renderAIBoard()
}

function renderCell(location, player) {
    let row = location[0]
    let col = location[1]
    let board = boardMatcher(player)
    let cell = getCellFromIndex(player, row, col)
    cell.style.backgroundColor = cellStyle.find((obj) => board[row][col] in obj)[board[row][col]]
}

function getCellFromIndex(player, row, column) {
    let cell = document.getElementById(`${player}-${indexConverter(row)}${column}`)
    return cell
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

function placeAIShips() {
    placeShipsRandomly(ships, 'c')
}

function pickTargetCellAI() {

}

function randomTargeting() {

}

function localHunt() {

}

function estimateDensity() {

}