const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// console.log(playBoard, scoreElement, highScoreElement)
// console.log(controls)

let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let intervalId;
let score = 0;
let gameOver = false;

let highScore = localStorage.getItem("high-score") || 0;

highScoreElement.innerText = `High Score: ${highScore}`

// Управление змейкой

function changeDirection(e) {
    console.log(e.key)
    if (e.code === "KeyW" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code === "KeyS" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code === "KeyA" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code === "KeyD" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Получаем случайную точку для еды

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
}

const handleGameOver = () => {
    clearInterval(intervalId)
    alert("Game Over! Press OK to replay")
    location.reload();
}

// Игровая функция, которую вызываем через интервал
function initGame() {
    // Размешаем еду на экране
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`
    // Когда съедаем еду, позиция меняется на случайную
    if (snakeX === foodX && snakeY == foodY) {
        updateFoodPosition()
        // Добавляем элемент к змейке
        snakeBody.push([foodX, foodY])
        // Добавляем score
        score = score + 1;
        scoreElement.textContent = 'Score: ' + score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = "High Score: " + highScore;
            // Записываем highScore в localhost
            localStorage.setItem("high-score", highScore)
        }
    }

    // меняем расположение змеи
    // Голова
    snakeX += velocityX;
    snakeY += velocityY;

    // Хвост
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]
    }

    // Тело змеи
    snakeBody[0] = [snakeX, snakeY];

    // Проверяем столкновение со стеной
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;

        gameOver = true;
    }

    // Cоздадим div для каждой части змеи
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }


    // Вывод html на экран
    playBoard.innerHTML = html;
}






// Запуск игры

updateFoodPosition();
// Частота обновления кадров
intervalId = setInterval(initGame, 100);
// Управление с клавиатуры
document.addEventListener("keyup", changeDirection);

// События на кнопки под экраном
controls.forEach(button => button.addEventListener("click", () => changeDirection(

    // Создаем объект наподобие event
    { code: button.dataset.key }
)))