class Snake {
  constructor(posX, posY) {
    this.body = [{ x: posX, y: posY }];
    this.speed = 1;
    this.direction = posX > 19 ? "left" : "right";
  }

  head() {
    return this.body[0];
  }

  tail() {
    return this.body[this.body.length - 1];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  let snake = createSnake();
  generateFood(snake);
  changeDirection(snake);
  move(snake);
});

function generateGrid() {
  let mainGrid = getMainGrid();
  for (let y = 0; y < 40; y++) {
    for (let x = 0; x < 40; x++) {
      let e = document.createElement("div");
      e.classList.add("cell");
      e.setAttribute("posY", y);
      e.setAttribute("posX", x);
      mainGrid.append(e);
    }
  }
}

function createSnake() {
  let randomX = Math.floor(Math.random() * 40);
  let randomY = Math.floor(Math.random() * 40);

  let snake = new Snake(randomX, randomY);

  findGridCell(randomX, randomY).classList.add("head");
  return snake;
}

function getMainGrid() {
  return document.querySelector("#main-grid");
}

function getGridCells() {
  return document.querySelectorAll(".cell");
}

function changeDirection(snake) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "w") snake.direction = "up";
    else if (event.key === "s") snake.direction = "down";
    else if (event.key === "a") snake.direction = "left";
    else if (event.key === "d") snake.direction = "right";
  });
}

function findGridCell(posX, posY) {
  return document.querySelector(`[posX="${posX}"][posY="${posY}"]`);
}

function eats(snake) {
  let cell = findGridCell(snake.head().x, snake.head().y);
  return cell && cell.classList.contains("food");
}

function getAllCells() {
  let allCells = [];
  for (let y = 0; y < 40; y++) {
    for (let x = 0; x < 40; x++) {
      allCells.push({ x, y });
    }
  }
  return allCells;
}

function generateFood(snake) {
  let allCells = getAllCells();
  const availableCells = allCells.filter(
    (c) => !snake.body.some((b) => b.x === c.x && b.y === c.y)
  );
  const foodCell =
    availableCells[Math.floor(Math.random() * availableCells.length)];
  findGridCell(foodCell.x, foodCell.y).classList.add("food");
}

function findFood() {
  return document.querySelector(".food");
}

function consummeFood() {
  let food = findFood();
  if (food) food.classList.remove("food");
}

function growSnake(snake) {
  let tail = snake.tail();
  snake.body.push({ x: tail.x, y: tail.y });
}

function drawSnake(snake) {
  document.querySelectorAll(".head, .body-segment").forEach((cell) => {
    cell.classList.remove("head", "body-segment");
  });

  snake.body.forEach((segment, index) => {
    let cell = findGridCell(segment.x, segment.y);
    if (cell) {
      cell.classList.add(index === 0 ? "head" : "body-segment");
    }
  });
}

function updateSnakePosition(snake) {
  let dx = 0,
    dy = 0;

  if (snake.direction === "right") dx = 1;
  else if (snake.direction === "left") dx = -1;
  else if (snake.direction === "up") dy = -1;
  else if (snake.direction === "down") dy = 1;

  const newHead = {
    x: (snake.head().x + dx + 40) % 40,
    y: (snake.head().y + dy + 40) % 40,
  };

  for (let i = snake.body.length - 1; i > 0; i--) {
    snake.body[i] = { ...snake.body[i - 1] };
  }
  snake.body[0] = newHead;
}

function move(snake) {
  setInterval(() => {
    updateSnakePosition(snake);

    if (eats(snake)) {
      consummeFood();
      growSnake(snake);
      generateFood(snake);
    }

    drawSnake(snake);
  }, 100);
}
