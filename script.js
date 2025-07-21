const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");
const vsFriendBtn = document.getElementById("vsFriendBtn");
const modeSelectDiv = document.getElementById('modeSelect');
const backHomeBtn = document.getElementById('backHomeBtn');

let cellData = Array(9).fill('');
let cellElements = [];
let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;
let currentMusic = null;

function updateStatus() {
  statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
}

function createBoard() {
  board.innerHTML = "";
  cellElements = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cellElements.push(cell);
  }
  cellData = Array(9).fill('');
}

function handleClick(index) {
  if (!gameActive || cellData[index] !== "") return;

  cellData[index] = currentPlayer;
  cellElements[index].textContent = currentPlayer;
  cellElements[index].classList.add("clicked");
  setTimeout(() => cellElements[index].classList.remove("clicked"), 200);

  const winCombo = checkWin(currentPlayer);
  if (winCombo) {
    winCombo.forEach(i => cellElements[i].classList.add("winner"));
    if (vsComputer) {
      if (currentPlayer === "X") {
        statusText.innerHTML = `You Win!`;
      } else {
        statusText.innerHTML = `Computer Wins!`;
      }
    } else {
      statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span> Wins!`;
    }
    gameActive = false;
  } else if (cellData.every(cell => cell !== "")) {
    statusText.textContent = vsComputer ? "It's a Draw!" : "Game ended in a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
  }

  // If vs computer and it's O's turn, make computer move
  if (vsComputer && currentPlayer === 'O' && gameActive) {
    setTimeout(computerMove, 500);
  }
}

// Simple computer move (random empty cell)
function computerMove() {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i++) {
    if (cellData[i] === "") {
      cellData[i] = "O";
      let score = minimax(cellData, 0, false);
      cellData[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== null) {
    handleClick(move);
  }
}

function minimax(board, depth, isMaximizing) {
  const result = getResult(board);
  if (result !== null) {
    const scores = {
      O: 10 - depth,
      X: depth - 10,
      tie: 0
    };
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
function getResult(board) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // returns "X" or "O"
    }
  }

  if (board.every(cell => cell !== "")) {
    return "tie";
  }

  return null;
}
// Check win
function checkWin(player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const combo of winCombos) {
    if (combo.every(i => cellData[i] === player)) {
      return combo;
    }
  }
  return null;
}

restartBtn.addEventListener("click", () => {
  cellData = Array(9).fill('');
  currentPlayer = "X";
  gameActive = true;
  updateStatus();
  createBoard();
});

function showModeSelection() {
  modeSelectDiv.style.display = '';
  statusText.style.display = 'none';
  board.style.display = 'none';
  restartBtn.style.display = 'none';
  backHomeBtn.style.display = 'none';
}

function hideModeSelection() {
  modeSelectDiv.style.display = 'none';
  statusText.style.display = '';
  board.style.display = '';
  restartBtn.style.display = '';
  backHomeBtn.style.display = '';
}

// On page load, show mode selection and hide others
showModeSelection();

vsComputerBtn.addEventListener('click', () => {
  vsComputer = true;
  restartBtn.click();
  hideModeSelection();
  vsComputerBtn.disabled = true;
  vsFriendBtn.disabled = false;
});

vsFriendBtn.addEventListener('click', () => {
  vsComputer = false;
  restartBtn.click();
  hideModeSelection();
  vsComputerBtn.disabled = false;
  vsFriendBtn.disabled = true;
});

function playRandomSong() {
  // Pause all songs first
  for (let i = 1; i <= 8; i++) {
    document.getElementById(`gameMusic${i}`).pause();
    document.getElementById(`gameMusic${i}`).currentTime = 0;
  }
  // Pick a random song
  const randomIndex = Math.floor(Math.random() * 5) + 1;
  const music = document.getElementById(`gameMusic${randomIndex}`);
  music.play();
  return music;
}

document.getElementById('musicBtn').addEventListener('click', function() {
  // If a song is playing, pause it and update button text
  if (currentMusic && !currentMusic.paused) {
    currentMusic.pause();
    this.textContent = 'Play Music';
    return;
  }
  // Pause all songs first
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`gameMusic${i}`).pause();
    document.getElementById(`gameMusic${i}`).currentTime = 0;
  }
  // Play a random song
  currentMusic = playRandomSong();
  this.textContent = 'Pause Music';
  currentMusic.onended = () => { this.textContent = 'Play Music'; };
});

backHomeBtn.addEventListener('click', () => {
  showModeSelection();
  vsComputerBtn.disabled = false;
  vsFriendBtn.disabled = false;
});

updateStatus();
createBoard();


