const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const box = 20; // Size of each grid square
let score = 0;

let snake;
let food;
let direction;
let game;

function resetGame() {
  score = 0;
  snake = [
    { x: 9 * box, y: 10 * box }
  ];
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
  direction = null;
  document.getElementById('score').textContent = 'Score: 0';
  restartButton.style.display = "none";
  clearInterval(game);
  game = setInterval(draw, 100);
}

resetGame();

restartButton.addEventListener('click', resetGame);

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green';
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Snake movement
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'UP') snakeY -= box;
  if (direction === 'DOWN') snakeY += box;
  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'RIGHT') snakeX += box;

  // Check collision with food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    // Remove last segment if not eating food
    snake.pop();
  }

  // Add new head
  const newHead = { x: snakeX, y: snakeY };

  // Game over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    restartButton.style.display = "block";
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}
