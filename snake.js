export class WebSnake {
    constructor() {
        // Element references
        this.canvas = document.getElementById('game');
        this.context = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.restartButton = document.getElementById('restart-button');
        
        // Constants
        this.box = 32;
        this.canvasSize = 19 * this.box;

        // Game state variables
        this.snake = [{ x: 9 * this.box, y: 10 * this.box }];
        this.food;
        this.direction;
        this.score = 0;
        this.speed = 200;
        this.game;

        // Setup canvas
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;

        // Event listeners
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        this.restartButton.addEventListener('click', this.startGame.bind(this));
    }

    handleKeydown(event) {
        switch (event.keyCode) {
            case 37: if (this.direction !== 'RIGHT') this.direction = 'LEFT'; break;
            case 38: if (this.direction !== 'DOWN') this.direction = 'UP'; break;
            case 39: if (this.direction !== 'LEFT') this.direction = 'RIGHT'; break;
            case 40: if (this.direction !== 'UP') this.direction = 'DOWN'; break;
        }
    }

    createFood() {
        while (true) {
            let foodPosition = {
                x: Math.floor(Math.random() * 17 + 1) * this.box,
                y: Math.floor(Math.random() * 15 + 3) * this.box
            };
            if (!this.snake.some(part => part.x === foodPosition.x && part.y === foodPosition.y)) {
                return foodPosition;
            }
        }
    }
    draw() {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        for (let i = 0; i < this.snake.length; i++) {
            this.context.fillStyle = (i === 0) ? 'green' : 'white';
            this.context.fillRect(this.snake[i].x, this.snake[i].y, this.box, this.box);
            this.context.strokeStyle = 'red';
            this.context.strokeRect(this.snake[i].x, this.snake[i].y, this.box, this.box);
        }

        // Draw food
        this.context.fillStyle = 'red';
        this.context.fillRect(this.food.x, this.food.y, this.box, this.box);

        // Update snake position
        let snakeX = this.snake[0].x;
        let snakeY = this.snake[0].y;
        if (this.direction === 'LEFT') snakeX -= this.box;
        if (this.direction === 'UP') snakeY -= this.box;
        if (this.direction === 'RIGHT') snakeX += this.box;
        if (this.direction === 'DOWN') snakeY += this.box;

        // Check food collision
        if (snakeX === this.food.x && snakeY === this.food.y) {
            this.score++;
            this.scoreElement.innerText = 'Score: ' + this.score;
            this.food = this.createFood();
            this.speed -= 10;
        } else {
            this.snake.pop();  // Remove tail if no food eaten
        }

        // Add new snake head
        let newHead = { x: snakeX, y: snakeY };
        this.snake.unshift(newHead);

        // Check wall collision and self collision
        if (snakeX < 0 || snakeX >= this.canvasSize || snakeY < 0 || snakeY >= this.canvasSize || this.collision(newHead, this.snake)) {
            this.gameOver();
        }

        // Call next frame
        this.game = setTimeout(this.draw.bind(this), this.speed);
    }

    collision(head, array) {
        return array.some((part, index) => index !== 0 && head.x === part.x && head.y === part.y);
    }

    gameOver() {
        clearTimeout(this.game);
        this.gameOverElement.classList.remove('hidden');
        this.restartButton.classList.remove('hidden');
    }

    startGame() {
        clearTimeout(this.game);
        // Reset game state
        this.snake = [{ x: 9 * this.box, y: 10 * this.box }];
        this.food = this.createFood();
        this.direction = undefined;
        this.score = 0;
        this.speed = 200; // Reset the speed
        this.gameOverElement.classList.add('hidden');
        this.restartButton.classList.add('hidden');
        this.scoreElement.innerText = 'Score: 0';

        // Start game loop
        this.draw();
    }
}

