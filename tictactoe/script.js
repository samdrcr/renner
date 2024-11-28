const gameContainer = document.getElementById('game-container');
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');

const winnerAnnouncement = document.getElementById('winner-announcement');
const winnerText = document.getElementById('winner-text');
const backToHomeButton = document.getElementById('back-to-home');

let currentPlayer = 'X';
let playerNames = { X: 'Player X', O: 'Player O' };
let gameActive = true;
let boardState = Array(9).fill(null);

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

window.addEventListener('load', () => {
    const playerXName = localStorage.getItem('playerX') || 'Player X';
    const playerOName = localStorage.getItem('playerO') || 'Player O';
    playerNames = { X: playerXName, O: playerOName };
    status.textContent = `${playerNames[currentPlayer]}'s turn`;
    createBoard();
});

function createBoard() {
    board.innerHTML = '';
    boardState.forEach((_, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || boardState[index]) return;
    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');
    if (checkWin()) {
        announceWinner(playerNames[currentPlayer]);
    } else if (boardState.every(cell => cell)) {
        announceWinner(null);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `${playerNames[currentPlayer]}'s turn`;
    }
}

function checkWin() {
    return winningCombos.some(combo =>
        combo.every(index => boardState[index] === currentPlayer)
    );
}

function announceWinner(winnerName) {
    if (winnerName) {
        winnerText.textContent = `${winnerName} Wins!`;
    } else {
        winnerText.textContent = `It's a Draw!`;
    }
    winnerAnnouncement.classList.remove('hidden');
    resetButton.classList.add('hidden');
    board.classList.add('hidden');
    status.textContent = '';
    gameActive = false;
}

resetButton.addEventListener('click', resetGame);

function resetGame() {
    boardState = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = `${playerNames[currentPlayer]}'s turn`;
    winnerAnnouncement.classList.add('hidden');
    resetButton.classList.remove('hidden');
    board.classList.remove('hidden');
    createBoard();
}

backToHomeButton.addEventListener('click', () => {
    localStorage.removeItem('playerX');
    localStorage.removeItem('playerO');
    window.location.href = 'index.html';
});
