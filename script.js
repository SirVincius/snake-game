class Snake {
  constructor(posX, posY) {
    this.body = [{ x: posX, y: posY }];
    this.speed = 1;
    posX > 19 ? (this.direction = "left") : (this.direction = "right");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  var snake = createSnake();
  changeDirection(snake);

  setInterval(() => {
    console.log("0.5 seconds");
  }, 500);
});

function generateGrid() {
  let mainGrid = getMainGrid();
  for (let i = 0; i <= 39; i++) {
    for (let j = 0; j <= 39; j++) {
      let e = document.createElement("div");
      e.classList.add("cell");
      e.setAttribute("posX", i);
      e.setAttribute("posY", j);
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
      cell.getAttribute("posX") == snake.body[0].x &&
      cell.getAttribute("posY") == snake.body[0].y
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
