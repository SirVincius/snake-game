const INITIAL_SPEED = 100;
const MAX_SPEED = 400;
const MIN_SPEED = 10;
const BASE_FOOD_VALUE_MULTIPLIER = 3;
const GRID_SIDE_DIMENSION = 20;
const POWER_UP_LIST = [
  "speed-up",
  "speed-down",
  "feast",
  "invincibility",
  "bonus-points",
];
const CONSUMMABLE = [
  "food",
  "speed-up",
  "speed-down",
  "feast",
  "invincibility",
  "bonus-points",
];
var gameOver = false;
var gameScore = 0;
var currentFoodValue = 100;
var foodValueBonus = 100;
var foodValueMultiplier = 1;
var invincible = false;
var newDirection = null;

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
  setPreviousScore();
  generateGrid();
  snake = createSnake();
  generateFood();
  changeDirection();
  move();
  startScorePenalty();
});

function setPreviousScore() {
  document.getElementById(
    "previous-score"
  ).innerHTML = `Previous score : ${getBestScore()}`;
}

function generateGrid() {
  let mainGrid = getMainGrid();
  for (let y = 0; y < GRID_SIDE_DIMENSION; y++) {
    for (let x = 0; x < GRID_SIDE_DIMENSION; x++) {
      let e = document.createElement("div");
      e.classList.add("cell");
      e.setAttribute("posY", y);
      e.setAttribute("posX", x);
      mainGrid.append(e);
    }
  }
}

function createSnake() {
  let randomX = Math.floor(Math.random() * GRID_SIDE_DIMENSION);
  let randomY = Math.floor(Math.random() * GRID_SIDE_DIMENSION);

  let snake = new Snake(randomX, randomY);

  findGridCell(randomX, randomY).classList.add("head");
  return snake;
}

function startScorePenalty() {
  function runScorePenalty() {
    currentFoodValue--;

    setTimeout(runScorePenalty, 1000);
  }

  runScorePenalty();
}

function getMainGrid() {
  return document.querySelector("#main-grid");
}

function getGridCells() {
  return document.querySelectorAll(".cell");
}

function changeDirection() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "w" && snake.direction !== "down") newDirection = "up";
    else if (event.key === "s" && snake.direction !== "up")
      newDirection = "down";
    else if (event.key === "a" && snake.direction !== "right")
      snake.direction = "left";
    else if (event.key === "d" && snake.direction !== "left")
      newDirection = "right";
    else if (event.key === "t") {
      snake.setSpeed(5);
      console.log(snake.speed);
    } else if (event.key === "y") {
      snake.setSpeed(-5);
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
  if (
    getSnakeHeadCellInfos().classList.contains("body-segment") &&
    invincible == false
  ) {
    gameOver = true;
  }
}

function eats() {
  let cell = getSnakeHeadCellInfos();
  return cell && CONSUMMABLE.some((c) => cell.classList.contains(c));
}

function getAllCells() {
  let allCells = [];
  for (let y = 0; y < GRID_SIDE_DIMENSION; y++) {
    for (let x = 0; x < GRID_SIDE_DIMENSION; x++) {
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

function generateMultipleFood(numberOfFoodPiece) {
  for (let i = 0; i < numberOfFoodPiece; i++) {
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
    snake.setSpeed(-5);
  } else if (cellToCheck.classList.contains("speed-down")) {
    snake.setSpeed(5);
  } else if (cellToCheck.classList.contains("feast")) {
    generateMultipleFood(5);
  } else if (cellToCheck.classList.contains("invincibility")) {
    invincible = true;
    setTimeout(() => {
      invincible = false;
    }, 10000);
  } else if (cellToCheck.classList.contains("bonus-points")) {
    foodValueMultiplier = BASE_FOOD_VALUE_MULTIPLIER;
    setTimeout(() => {
      foodValueMultiplier = 1;
    }, 30000);
  }
}

function getRandomPowerUp() {
  let randomIndex = Math.floor(Math.random() * POWER_UP_LIST.length);
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
    gameScore += currentFoodValue * foodValueMultiplier;
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
    x: (snake.head().x + dx + GRID_SIDE_DIMENSION) % GRID_SIDE_DIMENSION,
    y: (snake.head().y + dy + GRID_SIDE_DIMENSION) % GRID_SIDE_DIMENSION,
  };

  for (let i = snake.body.length - 1; i > 0; i--) {
    snake.body[i] = { ...snake.body[i - 1] };
  }
  snake.body[0] = newHead;
}

function getBestScore() {
  const storedScore = localStorage.getItem("bestSnakeScores");
}

function addScore() {
  let bestScores = JSON.parse(getBestScore());
  bestScores.push(gameScore);
  return bestScores;
}

function sortBestScores(bestScores) {
  bestScores.sort((a, b) => b - a);
}

function getTenBestScores() {
  let bestScores = sortBestScores();
}

function setBestScore() {}

function move() {
  function moveInternal() {
    if (newDirection) {
      snake.direction = newDirection;
      newDirection = null;
    }
    updateSnakePosition();
    checkSnakeCollision();

    if (gameOver) {
      setBestScore();
      return;
    }

    if (eats()) {
      checkPowerUp();
      consummeFood();
      generatePowerUP(getRandomPowerUp());
      growSnake();
      generateFood();
    }

    drawSnake();
    setTimeout(moveInternal, snake.speed);
  }
  moveInternal();
}
