let currentPlayer = 'cat'; // 猫からスタート
let dataInfo; // ドラッグされた形状を格納
let gameEnded = false; // ゲームが終了したかどうか
// 盤面の状態を多次元配列で表現
function getBoardState() {
  const board = Array.from({ length: 3 }, () => Array(3).fill(''));
  const cells = document.querySelectorAll('.game-cell');
  cells.forEach(cell => {
    const row = parseInt(cell.getAttribute('data-row'), 10);
    const col = parseInt(cell.getAttribute('data-col'), 10);
    const shape = cell.getAttribute('data-shape');
    board[row][col] = shape || ''; // セルが空の場合、空文字を設定
  });
  return board;
}
// 横、縦、斜めで揃っているかの判定
function checkWin(board, player) {
  // 横のチェック
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
      return true;
    }
  }
  // 縦のチェック
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
      return true;
    }
  }
  // 斜めのチェック
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }
  return false;
}
// 引き分け判定
function checkDraw(board) {
  // 全てのセルが埋まっている場合に引き分け
  return board.flat().every(cell => cell !== '');
}
// 勝利時または引き分け時の処理
function handleMove(cell, player) {
  cell.setAttribute('data-shape', player);
  const board = getBoardState();
  if (checkWin(board, player)) {
    const winMessage = document.getElementById('win-message');
    winMessage.textContent = `${player === 'cat' ? '猫' : '犬'}の勝利です！`;
    winMessage.style.display = 'block';
    showResetButton();
    gameEnded = true; // ゲーム終了を設定
    return;
  }
  if (checkDraw(board)) {
    const winMessage = document.getElementById('win-message');
    winMessage.textContent = 'どっちも可愛い～';
    winMessage.style.display = 'block';
    showResetButton();
    gameEnded = true; // ゲーム終了を設定
    return;
  }
  // ターン交代
  currentPlayer = currentPlayer === 'cat' ? 'dog' : 'cat';
  updateTurnDisplay();
}
// 現在のターン表示を更新
function updateTurnDisplay() {
  const turnDisplay = document.getElementById('turn-display');
  turnDisplay.textContent = `現在のターン: ${currentPlayer === 'cat' ? '猫' : '犬'}`;
}
// リセットボタンの表示
function showResetButton() {
  const resetButton = document.getElementById('reset-button');
  resetButton.style.display = 'block';
  resetButton.addEventListener('click', resetGame);
}
// リセット処理
function resetGame() {
  // 盤面初期化
  const cells = document.querySelectorAll('.game-cell');
  cells.forEach(cell => {
    cell.removeAttribute('data-shape');
  });
  // 勝利メッセージとリセットボタンを非表示
  const winMessage = document.getElementById('win-message');
  winMessage.style.display = 'none';
  winMessage.textContent = '';
  const resetButton = document.getElementById('reset-button');
  resetButton.style.display = 'none';
  // ゲーム状態を初期化
  gameEnded = false;
  // ターンを初期化
  currentPlayer = 'cat';
  updateTurnDisplay();
}
// ドラッグ時の処理
const listChoice = document.querySelectorAll('li');
listChoice.forEach(item => {
  item.addEventListener('dragstart', () => {
    // 選んだカードが現在のターンのプレイヤーと一致する場合のみドラッグを許可
    if (item.dataset.shape === currentPlayer) {
      dataInfo = item.dataset.shape;
      dropShape();
    } else {
      dataInfo = null; // 他のターンのカードは無効
    }
  });
});
// ドロップ時の処理
const dropCell = document.getElementsByClassName('game-cell');
function dropShape() {
  for (let i = 0; i < dropCell.length; i++) {
    dropCell[i].addEventListener('drop', (event) => {
      if (!event.target.getAttribute('data-shape') && dataInfo && !gameEnded) {
        event.target.setAttribute('data-shape', dataInfo);
        handleMove(event.target, dataInfo);
      }
    });
  }
}
// ドラッグオーバー許可
document.getElementById('game-area').addEventListener('dragover', (event) => {
  event.preventDefault();
});
// 初期化
updateTurnDisplay();
