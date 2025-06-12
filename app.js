const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{x: 8, y: 8}];
let direction = {x: 0, y: 0};
let food = randomFood();
let score = 0;
let level = 1;
let speed = 200;
let gameInterval;
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const bgMusic = document.getElementById('bgMusic');

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCell(food.x, food.y, 'red');
  snake.forEach((part, index) => drawCell(part.x, part.y, index === 0 ? 'lime' : 'green'));
}

function move() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width / gridSize || head.y >= canvas.height / gridSize || snake.some(p => p.x === head.x && p.y === head.y)) {
    gameOver();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    eatSound.currentTime = 0;
    eatSound.play();
    score++;
    if (score % 5 === 0) {
      level++;
      speed = Math.max(50, speed - 20);
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
    food = randomFood();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  move();
  draw();
}

function startGame() {
  snake = [{x: 8, y: 8}];
  direction = {x: 0, y: 0};
  food = randomFood();
  score = 0;
  level = 1;
  speed = 200;
  document.getElementById('gameOver').classList.add('hidden');
  bgMusic.volume = 0.4;
  bgMusic.play();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function gameOver() {
  clearInterval(gameInterval);
  bgMusic.pause();
  gameOverSound.play();
  document.getElementById('finalScore').textContent = `Score: ${score}`;
  document.getElementById('gameOver').classList.remove('hidden');
}

document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp': if (direction.y !== 1) direction = {x: 0, y: -1}; break;
    case 'ArrowDown': if (direction.y !== -1) direction = {x: 0, y: 1}; break;
    case 'ArrowLeft': if (direction.x !== 1) direction = {x: -1, y: 0}; break;
    case 'ArrowRight': if (direction.x !== -1) direction = {x: 1, y: 0}; break;
  }
});

document.getElementById('upBtn').addEventListener('click', () => { if (direction.y !== 1) direction = {x:0,y:-1}; });
document.getElementById('downBtn').addEventListener('click', () => { if (direction.y !== -1) direction = {x:0,y:1}; });
document.getElementById('leftBtn').addEventListener('click', () => { if (direction.x !== 1) direction = {x:-1,y:0}; });
document.getElementById('rightBtn').addEventListener('click', () => { if (direction.x !== -1) direction = {x:1,y:0}; });

document.getElementById('restartBtn').addEventListener('click', startGame);

startGame();
