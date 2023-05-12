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
const playerCellStyle = [
    {0: 'white'},
    {'s': 'grey'},
    {'m': 'lightblue'},
    {'h': 'orange'},
    {'d': 'red'}
]

const aiCellStyle = [
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
let currentSelection
let turn
let turnCounter
let winner

//? FOR AI USE
let validTargets
let gridTargets
let hunting
let huntInfo

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
        takeTurn(difficulty)
        postTurn()
        turnCounter++
    }
})

document.addEventListener('click', function(e) {
    if (!isPlayerCell(e)) return
    if (turn !== 0) return
    if (allShipsPlaced()) return
    placeShip(currentSelection.startingPosition, currentSelection, 'p')
    if (allShipsPlaced()) {
        turn = 1
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
    if (e.key === 'r' || e.key === 'R')
        rotateShip(currentSelection)
})


//Restart game

//! PLAY
init()
placeAIShips()
// placeShipsRandomly(playerShips, 'p')


//! FUNCTIONS
//? GAME SET-UP, PLAYER ACTIONS, STATE TRANSITIONS

function init() {
    gamemode = null
    difficulty = 'normal'
    countryPlayer = null
    countryAI = null
    playerBoard = []
    aiBoard = []
    ships = []
    initValidTargets()
    initGridTargets()
    turnCounter = 1
    winner = null
    currentSelection = null
    turn = 0
    initHuntInfo()
    hunting = false
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
    renderBoard()
    toggleTurn()
    if (checkWin()) return
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

function toggleTurn() {
    turn *= -1
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
            cell.style.backgroundColor = playerCellStyle.find((obj) => playerBoard[row][col] in obj)[playerBoard[row][col]]
        }
    }
}

function renderAIBoard() {
    for (let row=0; row<height; row++) {
        for (let col=0; col<width; col++) {
            let cell = getCellFromIndex('c', row, col)
            cell.style.backgroundColor = aiCellStyle.find((obj) => aiBoard[row][col] in obj)[aiBoard[row][col]]
        }
    }
}

function renderCell(index, player) {
    let row = index[0]
    let col = index[1]
    let board = boardMatcher(player)
    let cell = getCellFromIndex(player, row, col)
    if (player === 'p') cell.style.backgroundColor = playerCellStyle.find((obj) => board[row][col] in obj)[board[row][col]]
    else cell.style.backgroundColor = aiCellStyle.find((obj) => board[row][col] in obj)[board[row][col]]
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
    // No restrictions on firing as this is handled by outer functions
    let index = getCoordsFromCell(cell)
    let row = index[0]
    let col = index[1]
    let board = getBoardFromCell(cell)
    let player = getPlayerFromCell(cell)
    if (board[row][col] === 0) {
        board[row][col] = 'm'
        renderCell([row, col], player)
        return 'miss'
    } else {
        board[row][col] = 'h'
        renderCell([row, col], player)
        let hitShip = getShipFromCoordinates(player, [row, col])
        hitShip.statusCheck()
        return hitShip
    }
}

function coordinateArrayIsElementOfArray(outerArray, coordinateArray) {
    let row = coordinateArray[0]
    let col = coordinateArray[1]
    return (outerArray.some(subarray => {                
        return subarray.every((value, index) => {
            return value === (index === 0 ? row : col)
                })
        })) 
}

function getIndexOfCoordinateArray(outerArray, coordinateArray) {
    let row = coordinateArray[0]
    let col = coordinateArray[1]
    return (outerArray.findIndex(subarray => {                
        return subarray.every((value, index) => {
            return value === (index === 0 ? row : col)
                })
        })) 
}

// BROKE WHEN MAKING FUNCTION ABOVE, TEST LATER
// function getShipFromCoordinates(player, coordinates) {
//     let targetShip = null
//     for (let ship of ships) {
//         if (ship.owner !== player) continue
//         let shipCoordinates = ship.positionArray()
//         if (coordinateArrayIsElementOfArray(shipCoordinates, coordinates)) {
//             targetShip = ship
//         }
//         targetShip = ship
//     }
//     return targetShip
// }

function getShipFromCoordinates(player, coordinates) {
    let row = coordinates[0]
    let col = coordinates[1]
    let targetShip = null
    for (let ship of ships) {
        if (ship.owner !== player) continue
        let shipCoordinates = ship.positionArray()
        if (shipCoordinates.some(subarray => {                
            return subarray.every((value, index) => {
                return value === (index === 0 ? row : col)
                    })
            })) {
                targetShip = ship
            }
    }
    return targetShip
    }

function checkWin() {
    if (checkWinPlayer() || checkWinAI()) {
       return true 
    } else {
        return false
    }
}

function checkWinPlayer() {
    let remainingShips = getLiveAIShips()
    if (remainingShips.length === 0) {
        console.log('Victory!')
        turn = -1
        return true
    }
    return false
}

function checkWinAI() {
    let remainingShips = getLivePlayerShips()
    if (remainingShips.length === 0) { 
        console.log('Defeat..')
        turn = -1
        return true
    }
    return false
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

// Hunting algorithm
// If hit:
//     set hit ship as current ship  
//     semi-edge case -> hit different ship during hunt -> add to ship attack stack 
//     get neighbours that are also in validTargets
//     add to shot order stack
//     when second hit on ship is made its vector is determined, update stack - keep items with same rol/col values
//     otherwise proceed with random targeting 


// let hunting
// let huntedShips
// let targetStack
function getValidNeighbours(coordinates, targetsArray) {
    let neighbours = []
    let row = coordinates[0] 
    let col = coordinates[1]
    if (row + 1 < height && coordinateArrayIsElementOfArray(targetsArray, [row + 1, col])) {
        neighbours.push([row + 1, col]) 
    }
    if (row - 1 >= 0 && coordinateArrayIsElementOfArray(targetsArray, [row - 1, col])) {
        neighbours.push([row - 1, col])
    }
    if (col + 1 < width && coordinateArrayIsElementOfArray(targetsArray, [row, col + 1])) {
        neighbours.push([row, col + 1])
    }
    if (col - 1 >= 0 && coordinateArrayIsElementOfArray(targetsArray, [row, col - 1])) {
        neighbours.push([row, col - 1])
    }
    return neighbours
}

function initHuntInfo() {
    huntInfo = {
    'huntedShips': [[],[],[],[],[]],
    'targetStack': [[],[],[],[],[]],
    'hitArray': [[],[],[],[],[]],
    'huntIndex': 0
    }
}

function hitShipOrientationTracker(hitArray) {
    let rowCounter = {}
    let colCounter = {}
    let duplicate = null
    for (let hit of hitArray) {
        if (rowCounter[hit[0]]) {
            duplicate = ['row', hit[0]]
            break
        }
        if (colCounter[hit[1]]) {
            duplicate = ['col', hit[1]] 
            break
        }
        rowCounter[hit[0]] = true
        colCounter[hit[1]] = true
    }
    return duplicate
}

function cleanTargetStack(index) {
    let info = hitShipOrientationTracker(huntInfo.hitArray[index])
    if (info === null) return
    let toKeep = info[0] //'row' or 'col'
    let keepValue = info[1] //only value of row/col to KEEP
    let removalIndices = []
    if (toKeep === 'row') {
        for (let i=0; i<huntInfo.targetStack[index].length; i++) {
            if (huntInfo.targetStack[index][i][0] !== keepValue) removalIndices.push(i)
        }
        for (let i=removalIndices.length - 1; i >= 0; i--) {
            huntInfo.targetStack[index].splice(removalIndices[i], 1)
        }

    }
    if (toKeep === 'col') {
        for (let i=0; i<huntInfo.targetStack[index].length; i++) {
            if (huntInfo.targetStack[index][i][1] !== keepValue) {
                removalIndices.push(i)
            }
        }
        for (let i=removalIndices.length-1; i >= 0; i--) {
            huntInfo.targetStack[index].splice(removalIndices[i], 1)
        }
    }        
}



function initGridTargets() {
    gridTargets = []
    for (let i=0; i<height; i++) {
        for (let j=0; j<width; j++) {
            if (i % 2 === 0 && j % 2 === 1) gridTargets.push([i, j])
            else if (i % 2 === 1 && j % 2 === 0) gridTargets.push([i, j])
        }
    }
}

function getIndexOfFirstEmptySubarray(huntInfoItem) {
    return huntInfoItem.findIndex(subarray => subarray.length === 0)
}

function getIndexOfFirstNonEmptySubarray(huntInfoItem) {
    return huntInfoItem.findIndex(subarray => subarray.length !== 0)
}



function takeTurnNormal() {
    let hIndex = huntInfo.huntIndex
    let hShip = huntInfo.huntedShips[hIndex]
    let tStack = huntInfo.targetStack[hIndex]
    let hArray = huntInfo.hitArray[hIndex]
    if (hunting === 1) {
        let shotCell = fireOnCell(getCellFromIndex('p', tStack[0][0], tStack[0][1]))
        let indexGrid = getIndexOfCoordinateArray(gridTargets, [tStack[0][0], tStack[0][1]])
        let indexFull = getIndexOfCoordinateArray(validTargets, [tStack[0][0], tStack[0][1]])
        if (indexGrid !== -1) gridTargets.splice(indexGrid, 1)
        validTargets.splice(indexFull, 1)
        if (typeof(shotCell) === 'object') {
            if (shotCell.name === hShip[0].name) {
                hArray.push(tStack[0])
                let newTargets = getValidNeighbours([tStack[0][0], tStack[0][1]], validTargets)
                newTargets.forEach(target => tStack.push(target))
                cleanTargetStack(hIndex)
            } else {
                let index = getIndexOfFirstEmptySubarray(huntInfo.huntedShips)
                huntInfo.huntedShips[index].push(shotCell)
                huntInfo.hitArray[index].push(tStack[0])
                let newTargets = getValidNeighbours([tStack[0][0], tStack[0][1]], validTargets)
                newTargets.forEach(target => huntInfo.targetStack[index].push(target))
            }
        }
        tStack.shift()
        if (hShip[0].health === 'destroyed') {
            tStack.length = 0
            hArray.length = 0
            hShip.shift()
            // Find next huntIndex to switch to, or finish hunting if none exist
            let findNewIndex = getIndexOfFirstNonEmptySubarray(huntInfo.huntedShips)
            if (findNewIndex < 0) {
                huntInfo.huntIndex = 0
                hunting = 0
            } else {
                huntInfo.huntIndex = findNewIndex
            }
        }
            

    }
        
    else {
    // Take random shots at grid targets. Update full grid too for hunting algorithm
    let target = getRandomItemFromArray(gridTargets)
    let indexGrid = gridTargets.indexOf(target)
    let indexFull = getIndexOfCoordinateArray(validTargets, target)
    gridTargets.splice(indexGrid, 1)
    validTargets.splice(indexFull, 1)
    let shotCell = fireOnCell(getCellFromIndex('p', target[0], target[1]))
    // If ship is hit, proceed with hunting algorithm
    if (typeof(shotCell) === 'object') {
        hunting = 1
        hShip.push(shotCell)
        hArray.push(target)
        let newTargets = getValidNeighbours([target[0], target[1]], validTargets)
        newTargets.forEach(target => tStack.push(target))
    }
    }

    }


function takeTurnHard() {
    // First shot is random
    if (turnCounter === 1) { 
        let target = getRandomItemFromArray(validTargets)
        let index = validTargets.indexOf(target)
        validTargets.splice(index, 1)
        fireOnCell(getCellFromIndex('p', target[0], target[1]))
    }
    // If hunting === 0, given known board, run probability density estimation for each square
    // For each non-interacted-with square, check whether remaining ships can be placed
    // vertically or horizontally. If so, iterate ticker value of cells that the ship would occupy
    // Shoot at cell with highest ticker value, reset tickers
    // At most 99*2*5 = 990 cell check operations - doesn't seem computationally taxing

    // If ship is hit, proceed with hunting algorithm

    // After ship destroyed, revert to probabilistic attacks
}

function placeAIShips() {
    placeShipsRandomly(ships, 'c')
}


function estimateDensity() {

}