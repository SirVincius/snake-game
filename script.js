var mainGrid = document.querySelector("#main-grid");
var cells;

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  setStartingPoint();
});

function generateGrid() {
  for (let i = 0; i <= 39; i++) {
    for (let j = 0; j <= 39; j++) {
      let e = document.createElement("div");
      e.classList.add("cell");
      e.setAttribute("posX", i);
      e.setAttribute("posY", j);
      mainGrid.append(e);
    }
  }
  cells = document.querySelectorAll(".cell");
}

function setStartingPoint() {
  let randomX = Math.floor(Math.random() * 40 + 1);
  let randomY = Math.floor(Math.random() * 40 + 1);
  console.log(`${randomX}, ${randomY}`);

  for (const cell of cells) {
    if (
      cell.getAttribute("posX") == randomX &&
      cell.getAttribute("posY") == randomY
    ) {
      cell.classList.add("dot");
    }
  }
}

document.addEventListener("keydown", function (e) {
  var head = document.getElementsByClassName("dot");
  if (e.key == "q") {
  }
});
