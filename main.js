//! VARIABLES
//? CONSTANTS
const letters = ['a','b','c','d','e','f','g','h','i','j']
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

//? VISUAL ASSETS

//? MUSIC & SOUND EFFECTS

//? ELEMENT REFERENCES

//? CLASSES & INSTANCES
class Ship {
    constructor(length, name, owner) {
        this.length = length
        this.name = name
        this.owner = owner
        this.startingPosition = null
        this.orientation = vertical
        this.health = 'healthy'
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


//! FUNCTIONS
// init()

//? GAME SET-UP, PLAYER ACTIONS, STATE TRANSITIONS

function init() {
    createBoards()
    createShips()
}

function selectMode() {

}

function selectDifficulty() {

}

function selectPlayerCountry() {

}

function selectAICountry() {

}

function createBoards() {

}

function createShips() {

}

function hoverShip() {

}

function rotateShip() {

}

function placeShip() {

}

function toggleShip() {

}

function pickTargetCellPlayer() {

}

function toggleTurn() {

}

function restartGame() {

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