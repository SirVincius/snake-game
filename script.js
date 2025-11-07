class Snake {
  constructor(posX, posY) {
    this.body = [{ x: posX, y: posY }];
    this.speed = 1;
    posX > 19 ? (this.direction = "left") : (this.direction = "right");
  }

  head() {
    return this.body[0];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  var snake = createSnake();
  changeDirection(snake);
  move(snake);
});

function generateGrid() {
  let mainGrid = getMainGrid();
  for (let i = 0; i <= 39; i++) {
    for (let j = 0; j <= 39; j++) {
      let e = document.createElement("div");
      e.classList.add("cell");
      e.setAttribute("posY", i);
      e.setAttribute("posX", j);
      mainGrid.append(e);
    }
  }
}

function createSnake() {
  let randomX = Math.floor(Math.random() * 40);
  let randomY = Math.floor(Math.random() * 40);

  let snake = new Snake(randomX, randomY);

  let gridCells = getGridCells();

  for (const cell of gridCells) {
    if (
      cell.getAttribute("posX") == snake.head().x &&
      cell.getAttribute("posY") == snake.head().y
    ) {
      console.log("Snake created");
      cell.classList.add("dot");
    }
  }
  return snake;
}

document.addEventListener("keydown", function (e) {
  var head = document.getElementsByClassName("dot");
  if (e.key == "q") {
  }
});

function getMainGrid() {
  return document.querySelector("#main-grid");
}

function getGridCells() {
  return document.querySelectorAll(".cell");
}

function moveSnake() {}

function changeDirection(snake) {
  document.addEventListener("keypress", (event) => {
    if (event.key == "w") {
      snake.direction = "up";
    } else if (event.key == "s") {
      snake.direction = "down";
    } else if (event.key == "a") {
      snake.direction = "left";
    } else if (event.key == "d") {
      snake.direction = "right";
    }
    console.log(snake);
  });
}

function findGridCell(posX, posY) {
  let gridCells = getGridCells();
  for (const cell of gridCells) {
    if (
      parseInt(cell.getAttribute("posX")) === posX &&
      parseInt(cell.getAttribute("posY")) === posY
    ) {
      return cell;
    }
  }
  return null;
}

function snakeTransition(snake, shiftX, shiftY) {
  let currentCell = findGridCell(snake.head().x, snake.head().y);
  currentCell.classList.remove("dot");
  snake.head().x += shiftX;
  snake.head().y += shiftY;
  let nextCell = findGridCell(snake.head().x, snake.head().y);
  nextCell.classList.add("dot");
}

function move(snake) {
  setInterval(() => {
    if (snake.direction == "right" && snake.head().x < 39) {
      snakeTransition(snake, 1, 0);
    } else if (snake.direction == "up" && snake.head().y > 0) {
      snakeTransition(snake, 0, -1);
    } else if (snake.direction == "left" && snake.head().x > 0) {
      snakeTransition(snake, -1, 0);
    } else if (snake.direction == "down" && snake.head().y < 39) {
      snakeTransition(snake, 0, 1);
    }
  }, 100);
}
