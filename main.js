const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const statusMessage = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');
const playHumanButton = document.getElementById('play-human');
const playAIButton = document.getElementById('play-ai');

let isPlayerXTurn = true;
let gameActive = true;
let playingAgainstAI = false;

const X_CLASS = 'X';
const O_CLASS = 'O';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(e) {
    const cell = e.target;
    const currentClass = isPlayerXTurn ? X_CLASS : O_CLASS;
    if (gameActive && !cell.textContent) {
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            highlightWinningCells(currentClass);
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            switchTurns();
            if (playingAgainstAI && !isPlayerXTurn) {
                setTimeout(makeAIMove, 500); // AI makes its move after 500ms
            }
        }
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass;
}

function switchTurns() {
    isPlayerXTurn = !isPlayerXTurn;
    updateStatus();
}

function updateStatus() {
    statusMessage.textContent = isPlayerXTurn ? "Player X's turn" : "Player O's turn";
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].textContent === currentClass;
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.textContent === X_CLASS || cell.textContent === O_CLASS;
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        statusMessage.textContent = "It's a draw!";
    } else {
        statusMessage.textContent = isPlayerXTurn ? "Player X wins!" : "Player O wins!";
    }
}

function restartGame() {
    cellElements.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell'); // Remove the winning highlight
    });
    gameActive = true;
    isPlayerXTurn = true;
    updateStatus();
}

function makeAIMove() {
    const availableCells = [...cellElements].filter(cell => cell.textContent === '');
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const randomCell = availableCells[randomIndex];
        placeMark(randomCell, O_CLASS);
        if (checkWin(O_CLASS)) {
            highlightWinningCells(O_CLASS);
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            switchTurns();
        }
    }
}

function highlightWinningCells(currentClass) {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].textContent === currentClass;
        });
    });
    if (winningCombination) {
        winningCombination.forEach(index => {
            cellElements[index].classList.add('winning-cell');
        });
    }
}

function selectHumanMode() {
    playingAgainstAI = false;
    restartGame();
}

function selectAIMode() {
    playingAgainstAI = true;
    restartGame();
}

cellElements.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

restartButton.addEventListener('click', restartGame);

playHumanButton.addEventListener('click', selectHumanMode);
playAIButton.addEventListener('click', selectAIMode);

updateStatus();