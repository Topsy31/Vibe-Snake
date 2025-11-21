const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const photoUpload = document.getElementById('photoUpload');
const photoPreview = document.getElementById('photoPreview');
const clearPhotosBtn = document.getElementById('clearPhotos');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;
let userPhotos = [];
let currentFoodImage = null;

highScoreElement.textContent = highScore;

function loadPhotosFromStorage() {
    const stored = localStorage.getItem('userPhotos');
    if (stored) {
        const photoDataArray = JSON.parse(stored);
        photoDataArray.forEach(dataUrl => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                userPhotos.push(img);
                displayPhotoPreview(dataUrl);
            };
        });
    }
}

photoUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                userPhotos.push(img);
                displayPhotoPreview(event.target.result);
                savePhotosToStorage();
            };
        };
        reader.readAsDataURL(file);
    });
});

clearPhotosBtn.addEventListener('click', () => {
    userPhotos = [];
    photoPreview.innerHTML = '';
    localStorage.removeItem('userPhotos');
    currentFoodImage = null;
});

function displayPhotoPreview(dataUrl) {
    const img = document.createElement('img');
    img.src = dataUrl;
    img.className = 'photo-thumb';
    photoPreview.appendChild(img);
}

function savePhotosToStorage() {
    const photoDataArray = userPhotos.map(img => img.src);
    localStorage.setItem('userPhotos', JSON.stringify(photoDataArray));
}

function getRandomPhoto() {
    if (userPhotos.length > 0) {
        return userPhotos[Math.floor(Math.random() * userPhotos.length)];
    }
    return null;
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#2E7D32';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });
}

function drawFood() {
    if (currentFoodImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(
            currentFoodImage,
            food.x * gridSize,
            food.y * gridSize,
            gridSize,
            gridSize
        );
        ctx.restore();
    } else {
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            return;
        }
    }

    currentFoodImage = getRandomPhoto();
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    startBtn.textContent = 'Restart Game';
}

function draw() {
    if (!gamePaused) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawFood();
        moveSnake();
        drawSnake();
    }
}

function startGame() {
    if (!gameRunning) {
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 1, y: 0 };
        score = 0;
        scoreElement.textContent = score;
        gameRunning = true;
        gamePaused = false;
        startBtn.textContent = 'Restart Game';
        placeFood();
        clearInterval(gameLoop);
        gameLoop = setInterval(draw, 100);
    } else {
        clearInterval(gameLoop);
        startGame();
    }
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;

    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y === 0) {
                velocity = { x: 0, y: -1 };
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (velocity.y === 0) {
                velocity = { x: 0, y: 1 };
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) {
                velocity = { x: -1, y: 0 };
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (velocity.x === 0) {
                velocity = { x: 1, y: 0 };
            }
            e.preventDefault();
            break;
    }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

loadPhotosFromStorage();

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'white';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Upload photos and press Start!', canvas.width / 2, canvas.height / 2);
