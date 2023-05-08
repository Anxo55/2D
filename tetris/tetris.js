const gameBoard = document.querySelector(".game-board");
const scoreElement = document.getElementById("score");

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 20;

let score = 0;

const shapes = [
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 1], [0, 1]],
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

let currentShape = getRandomShape();
let currentRow = 0;
let currentCol = 3;

function getRandomShape() {
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function draw() {
  gameBoard.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.top = row * CELL_SIZE + "px";
      cell.style.left = col * CELL_SIZE + "px";
      if (board[row][col]) {
        cell.classList.add("filled");
      }
      gameBoard.appendChild(cell);
    }
  }

  currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const shapeCell = document.createElement("div");
        shapeCell.className = "cell shape";
        shapeCell.style.top =
          (currentRow + rowIndex) * CELL_SIZE + "px";
        shapeCell.style.left =
          (currentCol + colIndex) * CELL_SIZE + "px";
        gameBoard.appendChild(shapeCell);
      }
    });
  });

  scoreElement.innerText = score;
}

function update() {
  currentRow++;

  if (collision()) {
    currentRow--;
    placeShape();
    clearRows();
    currentShape = getRandomShape();
    currentRow = 0;
    currentCol = 3;
  }

  draw();
}

function collision() {
    for (let row = 0; row < currentShape.length; row++) {
      for (let col = 0; col < currentShape[row].length; col++) {
        if (
          currentShape[row][col] &&
          (currentRow + row >= ROWS ||
            currentCol + col < 0 ||
            currentCol + col >= COLS ||
            board[currentRow + row][currentCol + col])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function placeShape() {
    currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
    if (cell) {
    board[currentRow + rowIndex][currentCol + colIndex] = 1;
    }
    });
    });
    }

    function moveLeft() {
        currentCol--;
        if (collision()) {
          currentCol++;
        }
        draw();
      }

      function moveRight() {
        currentCol++;
        if (collision()) {
          currentCol--;
        }
        draw();
      }

      function rotateClockwise() {
        const newShape = [];
        for (let col = 0; col < currentShape[0].length; col++) {
          const newRow = [];
          for (let row = currentShape.length - 1; row >= 0; row--) {
            newRow.push(currentShape[row][col]);
          }
          newShape.push(newRow);
        }
        currentShape = newShape;
        if (collision()) {
          currentShape = rotateCounterclockwise(newShape);
        }
        draw();
      }
      
      function rotateCounterclockwise(shape) {
        const newShape = [];
        for (let col = shape[0].length - 1; col >= 0; col--) {
          const newRow = [];
          for (let row = 0; row < shape.length; row++) {
            newRow.push(shape[row][col]);
          }
          newShape.push(newRow);
        }
        return newShape;
      }

      function drop() {
        while (!collision()) {
          currentRow++;
        }
        currentRow--;
        placeShape();
        clearRows();
        currentShape = getRandomShape();
        currentRow = 0;
        currentCol = 3;
        draw();
      }

      function clearRows() {
        let rowsCleared = 0;
        for (let row = 0; row < ROWS; row++) {
          if (board[row].every((cell) => cell)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            rowsCleared++;
            score += 10;
          }
        }
        if (rowsCleared == 4) {
          score += 20;
        }
      }

      document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowLeft") {
          moveLeft();
        } else if (event.code === "ArrowRight") {
          moveRight();
        } else if (event.code === "ArrowDown") {
          update();
        } else if (event.code === "KeyZ") {
          rotateCounterclockwise();
        } else if (event.code === "KeyX") {
          rotateClockwise();
        } else if (event.code === "Space") {
          drop();
        }
      });
  