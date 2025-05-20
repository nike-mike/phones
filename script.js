const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
];
let dx = 10;
let dy = 0;
let foodX, foodY;
let score = 0;
let changingDirection = false;

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnakePart(part) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'darkgreen';
  ctx.fillRect(part.x, part.y, 10, 10);
  ctx.strokeRect(part.x, part.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === foodX && head.y === foodY) {
    score += 10;
    document.getElementById("score").innerText = score;
    createFood();
  } else {
    snake.pop();
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, canvas.width - 10);
  foodY = randomTen(0, canvas.height - 10);

  snake.forEach(part => {
    if (part.x === foodX && part.y === foodY) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'darkred';
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function changeDirection(key) {
  if (changingDirection) return;
  changingDirection = true;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (key === "LEFT" && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (key === "UP" && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (key === "RIGHT" && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (key === "DOWN" && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

document.addEventListener("keydown", (event) => {
  const directions = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
  };
  changeDirection(directions[event.keyCode]);
});

// Touch buttons
document.getElementById("left").onclick = () => changeDirection("LEFT");
document.getElementById("right").onclick = () => changeDirection("RIGHT");
document.getElementById("up").onclick = () => changeDirection("UP");
document.getElementById("down").onclick = () => changeDirection("DOWN");

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const hitSelf = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hitSelf) return true;
  }

  const hitWall =
    snake[0].x < 0 || snake[0].x >= canvas.width ||
    snake[0].y < 0 || snake[0].y >= canvas.height;

  return hitWall;
}

function main() {
  if (didGameEnd()) {
    alert("Game Over! Refresh to play again.");
    return;
  }

  changingDirection = false;
  setTimeout(() => {
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100);
}

createFood();
main();
