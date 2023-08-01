// Element references
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

// Constants
const box = 32;
const canvasSize = 19 * box;

// Game state variables
let snake = [{ x: 9 * box, y: 10 * box }];
let food;
let direction;
let score = 0;
let speed = 200;
let game;

// Setup canvas
canvas.width = canvasSize;
canvas.height = canvasSize;

// Event listeners
document.addEventListener('keydown', handleKeydown);
restartButton.addEventListener('click', startGame);

function handleKeydown(event) {
    switch (event.keyCode) {
        case 37: if (direction !== 'RIGHT') direction = 'LEFT'; break;
        case 38: if (direction !== 'DOWN') direction = 'UP'; break;
        case 39: if (direction !== 'LEFT') direction = 'RIGHT'; break;
        case 40: if (direction !== 'UP') direction = 'DOWN'; break;
    }
}

function createFood() {
    while (true) {
        let foodPosition = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
        if (!snake.some(part => part.x === foodPosition.x && part.y === foodPosition.y)) {
            return foodPosition;
        }
    }
}

function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i === 0) ? 'green' : 'white';
        context.fillRect(snake[i].x, snake[i].y, box, box);
        context.strokeStyle = 'red';
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);

    // Update snake position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Check food collision
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerText = 'Score: ' + score;
        food = createFood();
        speed -= 10;
    } else {
        snake.pop();  // Remove tail if no food eaten
    }

    // Add new snake head
    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // Check wall collision and self collision
    if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
        gameOver();
    }
    

    // Call next frame
    game = setTimeout(draw, speed);
}

function collision(head, array) {
    return array.some((part, index) => index !== 0 && head.x === part.x && head.y === part.y);
}

function gameOver() {
    clearTimeout(game);
    gameOverElement.classList.remove('hidden');
    restartButton.classList.remove('hidden');
}

function startGame() {
    clearTimeout(game); 
    // Reset game state
    snake = [{ x: 9 * box, y: 10 * box }];
    food = createFood();
    direction = undefined;
    score = 0;
    speed = 200; // Reset the speed
    gameOverElement.classList.add('hidden');
    restartButton.classList.add('hidden');
    scoreElement.innerText = 'Score: 0';
  
    // Start game loop
    draw();
}


// Start game on load
startGame();
