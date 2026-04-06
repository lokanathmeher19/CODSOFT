const boardElement = document.getElementById('board');
const gameControl = document.querySelector('.game-control');
const boardContainer = document.getElementById('board-container');
const playerBtns = document.querySelectorAll('.player-btn');
const diffBtns = document.querySelectorAll('.diff-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const modalRestartBtn = document.getElementById('modal-restart-btn');
const modalMenuBtn = document.getElementById('modal-menu-btn');
const gameOverModal = document.getElementById('game-over-modal');
const resultMessage = document.getElementById('result-message');
const modalIcon = document.getElementById('modal-icon');
const turnIndicator = document.getElementById('turn-indicator');
const playerNameInput = document.getElementById('player-name');

const scorePlayerEl = document.getElementById('score-player');
const scoreTiesEl = document.getElementById('score-ties');
const scoreAIEl = document.getElementById('score-ai');
const playerScoreLabel = document.getElementById('player-score-label');

const playerScoreCard = document.querySelector('.player-score-card');
const aiScoreCard = document.querySelector('.ai-score-card');

let humanPlayer = 'X';
let aiPlayer = 'O';
let difficulty = 'hard'; // easy, medium, hard
let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = false;
let playerName = 'You';

let scores = {
    player: 0,
    ties: 0,
    ai: 0
};

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Difficulty Selection
diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.diff;
    });
});

// Initialize Player Selection
playerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        humanPlayer = btn.dataset.player;
        aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
    });
});

// Main Menu Return
const returnToMenu = () => {
    gameOverModal.classList.add('hidden');
    boardContainer.classList.add('hidden');
    gameControl.classList.remove('hidden');
    
    // Reset Scores
    scores = { player: 0, ties: 0, ai: 0 };
    updateScoreUI();
};

backBtn.addEventListener('click', returnToMenu);
modalMenuBtn.addEventListener('click', returnToMenu);

// Start Game
startBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'You';
    playerScoreLabel.innerText = playerName;
    
    // Set score border colors based on chosen mark
    playerScoreCard.className = `score-card player-score-card ${humanPlayer.toLowerCase()}-mark`;
    aiScoreCard.className = `score-card ai-score-card ${aiPlayer.toLowerCase()}-mark`;
    
    gameControl.classList.add('hidden');
    boardContainer.classList.remove('hidden');
    
    startGame();
});

// Restart Game
const resetMatch = () => {
    gameOverModal.classList.add('hidden');
    startGame();
};

restartBtn.addEventListener('click', resetMatch);
modalRestartBtn.addEventListener('click', resetMatch);

function startGame() {
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

function updateScoreUI() {
    scorePlayerEl.innerText = scores.player;
    scoreTiesEl.innerText = scores.ties;
    scoreAIEl.innerText = scores.ai;
}

function triggerConfetti() {
    var duration = 3000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff6b81', '#70a1ff', '#1dd1a1', '#feca57']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff6b81', '#70a1ff', '#1dd1a1', '#feca57']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function handleCellClick(index, cellElement) {
    if (!gameActive || board[index] !== null || currentPlayer !== humanPlayer) return;

    // Human makes a move
    makeMove(index, humanPlayer);
    
    if (checkGameEnd()) return;

    // AI's turn
    currentPlayer = aiPlayer;
    updateTurnIndicator();
    setTimeout(makeAIMove, 600); // Slight delay for realism
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

    let move = getAIMoveByDifficulty(difficulty);
    
    makeMove(move, aiPlayer);
    
    if (!checkGameEnd()) {
        currentPlayer = humanPlayer;
        updateTurnIndicator();
    }
}

function getAIMoveByDifficulty(level) {
    // Collect empty spots
    let emptySpots = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) emptySpots.push(i);
    }

    if (level === 'easy') {
        // Random move
        let randomIndex = Math.floor(Math.random() * emptySpots.length);
        return emptySpots[randomIndex];
    } 
    else if (level === 'medium') {
        // 50% chance to play optimally, 50% random
        if (Math.random() < 0.5) {
            let randomIndex = Math.floor(Math.random() * emptySpots.length);
            return emptySpots[randomIndex];
        } else {
            return getBestMove();
        }
    } 
    else {
        // Hard (Unbeatable) - Minimax
        return getBestMove();
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    
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
    return move;
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
        scores.ties++;
        resultMessage.innerText = "It's a Tie!";
        modalIcon.innerText = "🤝";
    } else {
        if (winner === humanPlayer) {
            scores.player++;
            resultMessage.innerText = `${playerName} Win${playerName === 'You' ? '' : 's'}!`;
            modalIcon.innerText = "🎉";
            triggerConfetti();
        } else {
            scores.ai++;
            resultMessage.innerText = "AI Wins!";
            modalIcon.innerText = "🤖";
        }
        
        // Highlight winning cells
        winningLine.forEach(index => {
            boardElement.children[index].classList.add('winning-cell');
        });
    }

    updateScoreUI();

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
