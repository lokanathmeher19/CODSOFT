const boardElement = document.getElementById('board');
const gameControl = document.querySelector('.game-control');
const boardContainer = document.getElementById('board-container');
const choiceBtns = document.querySelectorAll('.choice-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const modalRestartBtn = document.getElementById('modal-restart-btn');
const gameOverModal = document.getElementById('game-over-modal');
const resultMessage = document.getElementById('result-message');
const turnIndicator = document.getElementById('turn-indicator');
const playerNameInput = document.getElementById('player-name');

let humanPlayer = 'X';
let aiPlayer = 'O';
let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = false;
let playerName = 'You';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Player Selection
choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        choiceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        humanPlayer = btn.dataset.player;
        aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
    });
});

// Start Game
startBtn.addEventListener('click', () => {
    gameControl.classList.add('hidden');
    boardContainer.classList.remove('hidden');
    startGame();
});

// Restart Game
const resetGame = () => {
    gameOverModal.classList.add('hidden');
    gameControl.classList.remove('hidden');
    boardContainer.classList.add('hidden');
};

restartBtn.addEventListener('click', startGame);
modalRestartBtn.addEventListener('click', resetGame);

function startGame() {
    playerName = playerNameInput.value.trim() || 'You';
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    gameOverModal.classList.add('hidden');
    
    updateTurnIndicator();
    renderBoard();

    // If AI is 'X', it goes first
    if (aiPlayer === 'X') {
        setTimeout(makeAIMove, 500);
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (cell) {
            cellElement.classList.add('occupied', cell.toLowerCase());
            cellElement.innerText = cell;
        }
        cellElement.addEventListener('click', () => handleCellClick(index, cellElement));
        boardElement.appendChild(cellElement);
    });
}

function updateTurnIndicator() {
    turnIndicator.innerText = currentPlayer === humanPlayer ? `${playerName}'s Turn` : 'AI Thinking...';
    turnIndicator.className = 'turn-indicator ' + (currentPlayer === 'X' ? 'x-turn' : 'o-turn');
}

function handleCellClick(index, cellElement) {
    if (!gameActive || board[index] !== null || currentPlayer !== humanPlayer) return;

    // Human makes a move
    makeMove(index, humanPlayer);
    
    if (checkGameEnd()) return;

    // AI's turn
    currentPlayer = aiPlayer;
    updateTurnIndicator();
    setTimeout(makeAIMove, 500); // Slight delay for realism
}

function makeMove(index, player) {
    board[index] = player;
    
    // Update DOM directly for faster response instead of full re-render
    const cell = boardElement.children[index];
    cell.classList.add('occupied', player.toLowerCase());
    cell.innerText = player;
}

function makeAIMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;
    
    // Minimax needs to know whose turn it is in the recursion
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, aiPlayer);
    
    if (!checkGameEnd()) {
        currentPlayer = humanPlayer;
        updateTurnIndicator();
    }
}

function checkGameEnd() {
    const winnerData = checkWinner(board);
    if (winnerData) {
        endGame(winnerData.winner, winnerData.line);
        return true;
    }
    if (isBoardFull(board)) {
        endGame('tie');
        return true;
    }
    return false;
}

function endGame(winner, winningLine = []) {
    gameActive = false;
    
    if (winner === 'tie') {
        resultMessage.innerText = "It's a Tie!";
    } else {
        resultMessage.innerText = winner === humanPlayer ? `${playerName} Win${playerName === 'You' ? '' : 's'}!` : "AI Wins!";
        // Highlight winning cells
        winningLine.forEach(index => {
            boardElement.children[index].classList.add('winning-cell');
        });
    }

    setTimeout(() => {
        gameOverModal.classList.remove('hidden');
    }, 1000);
}

// MINIMAX ALGORITHM implementation
function minimax(newBoard, depth, isMaximizing) {
    const result = checkWinner(newBoard);
    if (result) {
        if (result.winner === aiPlayer) return 10 - depth;
        if (result.winner === humanPlayer) return depth - 10;
    } else if (isBoardFull(newBoard)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = aiPlayer;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = humanPlayer;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(currentBoard) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return { winner: currentBoard[a], line: [a, b, c] };
        }
    }
    return null;
}

function isBoardFull(currentBoard) {
    return currentBoard.every(cell => cell !== null);
}
