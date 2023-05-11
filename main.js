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
let playerShips
let aiShips
let turnCounter
let winner
let currentSelection
let validTargets
let turn

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
        this.health = 'healthy'
        this.placed = false
    }

    destroyedMessage() {

    }

    statusCheck() {
        let board = boardMatcher(this.owner)
        let positions = this.positionArray()
        if (checkDestroyed(positions, board)) {
            this.health = 'destroyed'
            positions.forEach((position) => {
                board[position[0]][position[1]] = 'd'
            })
        }  
        else if (checkHit(positions, board)) this.health = 'damaged'
        
    }

    positionArray() {
        let positions = []
        let row = this.startingPosition[0]
        let col = this.startingPosition[1]
        if (this.orientation === 'horizontal') {
            for (let i=0; i<this.length; i++) {
                positions.push([row, col+i])
            }
        } else for (let i=0; i<this.length; i++) {
            positions.push([row+i, col])
        }
        return positions
    }

    
}

//! EVENT LISTENERS
// Pick gamemode

// Pick difficulty

// Pick player country

// Pick opponent country

// Place ships

// Select cell to fire on
document.addEventListener('click', function(e) {
    if (!isEnemyCell(e)) return
    if (turn !== 1) return
    let cell = document.getElementById(e.target.id)
    if (validTarget(cell)) {
        fireOnCell(cell)
        postTurn()
        takeTurnEasy()
        postTurn()
    }
})

document.addEventListener('click', function(e) {
    if (!isPlayerCell(e)) return
    if (turn !== 0) return
    if (allShipsPlaced()) return
    placeShip(currentSelection.startingPosition, currentSelection, 'p')
    if (allShipsPlaced()) {
        turn = 1
        console.log('Turn = ', turn)
        return
    }
})

document.addEventListener('mouseover', function(e) {
    if (!isPlayerCell(e)) return
    if (allShipsPlaced()) return
    let cell = e.target
    renderPlayerBoard()
    hoverShip(cell)
})

document.addEventListener('keyup', function(e) {
    if (turn !== 0) return
    if (e.key === 'r' || e.key === 'R') rotateShip(currentSelection)
})


//Restart game

//! PLAY
init()
placeAIShips()
placeShipsRandomly(playerShips, 'p')


//! FUNCTIONS
//? GAME SET-UP, PLAYER ACTIONS, STATE TRANSITIONS

function init() {
    gamemode = null
    difficulty = 'easy'
    countryPlayer = null
    countryAI = null
    playerBoard = []
    aiBoard = []
    ships = []
    initValidTargets()
    turnCounter = 1
    winner = null
    currentSelection = null
    turn = 0
    createBoards()
    createShips('p')
    createShips('c')
    splitShips()

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

function initValidTargets() {
    validTargets = []
    for (let i=0; i<height; i++) {
        for (let j=0; j<width; j++) {
            validTargets.push([i, j])
        }
    }
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

function splitShips() {
    playerShips = ships.filter((ship) => ship.owner === 'p')
    aiShips = ships.filter((ship) => ship.owner === 'c')
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

function findShipByName(player, name) {
    const found = ships.find((ship) => 
    ship.name === name && ship.owner === player)
    return found
}

function getLivePlayerShips() {
    let remainingShips = playerShips.filter(ship => ship.health !== 'destroyed')
    return remainingShips
}

function getLiveAIShips() {
    let remainingShips = aiShips.filter(ship => ship.health !== 'destroyed')
    return remainingShips 
}

function getUnplacedPlayerShips() {
    let unplacedShips = playerShips.filter(ship => ship.placed === false)
    return unplacedShips
}

function allShipsPlaced() {
    let test = getUnplacedPlayerShips()
    if (test.length === 0) return true
    else return false
}

function selectedShip() {
    let availableShips = getUnplacedPlayerShips()
    return availableShips[0]
}

function hoverShip(cell) {
    currentSelection = selectedShip()
    let middle = getCoordsFromCell(cell)
    const adjustment = middleOfArrayIndex(currentSelection.length)
    if (currentSelection.orientation === 'horizontal') {
        currentSelection.startingPosition = [middle[0], middle[1]-adjustment]
        let positions = currentSelection.positionArray()
        positions.forEach((position) => {
            let cell = getCellFromIndex('p',position[0], position[1])
            cell.style.backgroundColor='pink'
        })
    } 
    else {
        currentSelection.startingPosition = [middle[0]-adjustment, middle[1]]
        let positions = currentSelection.positionArray()
        positions.forEach((position) => {
            let cell = getCellFromIndex('p',position[0], position[1])
            cell.style.backgroundColor='pink'
        })
    }
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
            tagCell([row, col+i], player, ship)
        }
    } else if (ship.orientation === 'vertical' && verticalPlacementAllowed(start, ship, board)) {
        ship.placed = true
        ship.startingPosition = start
        for (let i=0; i<ship.length; i++) {
            board[row+i][col] = shipIdentifier
            renderCell([row+i, col], player)
            tagCell([row+i, col], player, ship)
        }
    }
}

function middleOfArrayIndex(arrayLength) {
    return Math.floor((arrayLength-1) / 2)
}

function checkAIShips() {
    aiShips.forEach(function (ship) {
        ship.statusCheck()
    })
}
function postTurn() {
    checkShips()
    checkWin()
    renderBoard()
    toggleTurn()
}

function checkShips() {
    checkAIShips()
    checkPlayerShips()
}

function checkPlayerShips() {
    for (let ship of playerShips) {
        ship.statusCheck()
    }
}

function checkHit(positionArray, board) {
    return positionArray.some((position) => {
        return board[position[0]][position[1]] === 'h'
    })
}

function checkDestroyed(positionArray, board) {
    return positionArray.every((position) => {
        return board[position[0]][position[1]] === 'h'
    })
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
    // The array reversal allows for greater dispersion between the ships, as placing the
    // carrier (5 slot) first restricts the available area for future ship placement
    let shipsSubset = ships.filter((ship) => ship.owner === player).reverse()
    while (shipsSubset.length) {
        shipsSubset[0].orientation = shipOrientations[randomBetween(0,1)]
        placeShip(pickRandomCellIndex(), shipsSubset[0], player)
        if (shipsSubset[0].placed === true) shipsSubset.shift()
    }
    if (player === 'p') turn = 1
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

function getRandomItemFromArray(array) {
    const choice = array[Math.floor(Math.random()*array.length)]
    return choice
}

// Implement as bonus
function toggleShip() {
    
}

function pickTargetCellPlayer() {

}

function toggleTurn() {
    turn *= -1
    console.log('Turn = ',turn)
}

function restartGame() {
    
}

//? RENDERING DOM ELEMENTS
function render() {
    
}

function renderBoard() {
    renderPlayerBoard()
    renderAIBoard()
}

function renderPlayerBoard() {
    for (let row=0; row<height; row++) {
        for (let col=0; col<width; col++) {
            let cell = getCellFromIndex('p', row, col)
            cell.style.backgroundColor = cellStyle.find((obj) => playerBoard[row][col] in obj)[playerBoard[row][col]]
        }
    }
}

function renderAIBoard() {
    for (let row=0; row<height; row++) {
        for (let col=0; col<width; col++) {
            let cell = getCellFromIndex('c', row, col)
            cell.style.backgroundColor = cellStyle.find((obj) => aiBoard[row][col] in obj)[aiBoard[row][col]]
        }
    }
}

function renderCell(index, player) {
    let row = index[0]
    let col = index[1]
    let board = boardMatcher(player)
    let cell = getCellFromIndex(player, row, col)
    cell.style.backgroundColor = cellStyle.find((obj) => board[row][col] in obj)[board[row][col]]
}

function tagCell(location, player, ship) {
    let row = location[0]
    let col = location[1]
    let cell = getCellFromIndex(player, row, col)
    cell.ship = `${ship.name}`
}

function getCellFromIndex(player, row, column) {
    let cell = document.getElementById(`${player}-${indexConverter(row)}${column}`)
    return cell
}

function getCoordsFromCell(cell) {
    let id = cell.id
    let index = []
    index.push(indexConverter(id[2]), Number(id[3]))
    return index
}

function isEnemyCell(e) {
    return e.target.id.slice(0,2) === 'c-' && e.target.id.length === 4
}

function isPlayerCell(e) {
    return e.target.id.slice(0,2) === 'p-' && e.target.id.length === 4
}

function validTarget(cell) {
    let index = getCoordsFromCell(cell)
    let row = index[0]
    let col = index[1]
    let board = getBoardFromCell(cell)
    return (board[row][col] === 0 || board[row][col] === 's')


}

function getBoardFromCell(cell) {
    if (cell.id[0] === 'p') {
        return playerBoard
    } else {
        return aiBoard
    }
}

function getPlayerFromCell(cell) {
    return cell.id[0]
}

function fireOnCell(cell) {
    // No restrictions on firing as this is handled in validTarget()
    let index = getCoordsFromCell(cell)
    let row = index[0]
    let col = index[1]
    let board = getBoardFromCell(cell)
    let player = getPlayerFromCell(cell)
    if (board[row][col] === 0) {
        board[row][col] = 'm'
    } else board[row][col] = 'h'
    renderCell([row, col], player)
}

function checkWin() {
    checkWinPlayer()
    checkWinAI()
}

function checkWinPlayer() {
    let remainingShips = getLiveAIShips()
    if (remainingShips.length === 0) console.log('Victory!')
}

function checkWinAI() {
    let remainingShips = getLivePlayerShips()
    if (remainingShips.length === 0) console.log('Defeat..')
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
function takeTurn(difficulty) {
    switch(difficulty) {
        case 'easy': takeTurnEasy()
        break
        case 'normal': takeTurnNormal()
        break
        case 'hard': takeTurnHard()
        default: takeTurnEasy()
    }
}

function takeTurnEasy() {
    let target = getRandomItemFromArray(validTargets)
    let index = validTargets.indexOf(target)
    validTargets.splice(index, 1)
    fireOnCell(getCellFromIndex('p', target[0], target[1]))
}

function takeTurnNormal() {

}

function takeTurnHard() {

}

function placeAIShips() {
    placeShipsRandomly(ships, 'c')
}

function pickTargetCellAI() {

}

function localHunt() {

}

function estimateDensity() {

}