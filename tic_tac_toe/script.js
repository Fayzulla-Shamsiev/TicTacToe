// script.js
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const gameModeSelector = document.getElementById('gameMode');

let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameMode = 'twoPlayer'; // Default to two-player mode

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && gameMode === 'singlePlayer' && currentPlayer === 'O') {
        setTimeout(handleBotMove, 1500); // Add a 3-second delay before the bot makes a move
    }
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = '');
}

function handleBotMove() {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const botCell = cells[randomIndex];

    handleCellPlayed(botCell, randomIndex);
    handleResultValidation();
}

function handleGameModeChange() {
    gameMode = gameModeSelector.value;
    handleRestartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
gameModeSelector.addEventListener('change', handleGameModeChange);
