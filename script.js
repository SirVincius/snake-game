const INITIAL_SPEED = 200;
const MAX_SPEED = 400;
const MIN_SPEED = 10;
const POWER_UP_LIST = ["speed-up", "speed-down"];
const CONSUMMABLE = ["food", "speed-up", "speed-down"];
var gameOver = false;
var gameScore = 0;
var currentFoodValue = 100;
var foodValueBonus = 100;

class Snake {
  constructor(posX, posY) {
    this.body = [{ x: posX, y: posY }];
    this.speed = INITIAL_SPEED;
    this.direction = posX > 19 ? "left" : "right";
  }

  head() {
    return this.body[0];
  }

  tail() {
    return this.body[this.body.length - 1];
  }

  setSpeed(speedModifier) {
    this.speed += speedModifier;
    if (this.speed < MIN_SPEED) this.speed = MIN_SPEED;
    if (this.speed > MAX_SPEED) this.speed = MAX_SPEED;
  }
}

var snake;

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  snake = createSnake();
  generateFood();
  changeDirection();
  move();
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

function changeDirection() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "w") snake.direction = "up";
    else if (event.key === "s") snake.direction = "down";
    else if (event.key === "a") snake.direction = "left";
    else if (event.key === "d") snake.direction = "right";
    else if (event.key === "t") {
      snake.setSpeed(10);
      console.log(snake.speed);
    } else if (event.key === "y") {
      snake.setSpeed(-10);
      console.log(snake.speed);
    }
  });
}

function findGridCell(posX, posY) {
  return document.querySelector(`[posX="${posX}"][posY="${posY}"]`);
}

function getSnakeHeadCellInfos() {
  let cell = findGridCell(snake.head().x, snake.head().y);
  return cell;
}

function checkSnakeCollision() {
  if (getSnakeHeadCellInfos().classList.contains("body-segment")) {
    gameOver = true;
  }
}

function eats() {
  let cell = getSnakeHeadCellInfos();
  return cell && CONSUMMABLE.some((c) => cell.classList.contains(c));
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

function generatePowerUP(powerUpName) {
  let rng = Math.random();

  if (rng < 0.75) {
    const availableCells = document.querySelectorAll(
      ".cell:not(.body-segment):not(.head):not(.food)"
    );
    const foodCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    foodCell.classList.add(powerUpName);

    //Remove the power up after 10 seconds
    setTimeout(() => {
      foodCell.classList.remove(powerUpName);
    }, 10000);
  }
}

function getNumberOfFoodCells() {
  const foodCells = document.querySelectorAll(".food");
  return foodCells.length;
}

function generateFood() {
  if (getNumberOfFoodCells() == 0) {
    const availableCells = document.querySelectorAll(
      ".cell:not(.body-segment):not(.head):not(.food)"
    );
    const foodCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    foodCell.classList.add("food");
  }
}

function findFood() {
  return document.querySelector(".food");
}

function checkPowerUp() {
  let cellToCheck = getSnakeHeadCellInfos();
  if (cellToCheck.classList.contains("speed-up")) {
    snake.setSpeed(-10);
  } else if (cellToCheck.classList.contains("speed-down")) {
    snake.setSpeed(10);
  }
}

function getRandomPowerUp() {
  let randomIndex = Math.floor(Math.random * POWER_UP_LIST.length);
  return POWER_UP_LIST[randomIndex];
}

function UpdateScore() {
  document.getElementById("game-score").innerHTML = `Score : ${gameScore}`;
}

function reduceBonus() {
  if (currentFoodValue > 50) {
    currentFoodValue--;
  }
}

function consummeFood() {
  let food = findGridCell(snake.head().x, snake.head().y);
  if (food.classList.contains("food")) {
    gameScore += currentFoodValue;
    foodValueBonus++;
    currentFoodValue = foodValueBonus;
    UpdateScore();
  }
  CONSUMMABLE.forEach((c) => food.classList.remove(c));
}

function growSnake() {
  let tail = snake.tail();
  snake.body.push({ x: tail.x, y: tail.y });
}

function drawSnake() {
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

function updateSnakePosition() {
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

function move() {
  function moveInternal() {
    updateSnakePosition();
    checkSnakeCollision();
    reduceBonus();

    if (gameOver) {
      return;
    }

    if (eats()) {
      checkPowerUp();
      consummeFood();
      generatePowerUP(POWER_UP_LIST[1]);
      growSnake();
      generateFood();
    }

    drawSnake();
    setTimeout(moveInternal, snake.speed);
  }
  moveInternal();
}
