const ball = document.getElementById("ball");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const gameArea = document.getElementById("gameArea");

let ballX = gameArea.clientWidth / 2;
let ballY = gameArea.clientHeight / 2;
let velocityX = 3;
let velocityY = 3;
let gameInterval = null;

function moveBall() {
    const ballSize = ball.offsetWidth;
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    ballX += velocityX;
    ballY += velocityY;

    if (ballY <= 0 || ballY + ballSize >= areaHeight) {
        velocityY *= -1;
    }

    if (ballX <= 0) {
        score2.textContent = parseInt(score2.textContent) + 1;
        resetBall();
    } else if (ballX + ballSize >= areaWidth) {
        score1.textContent = parseInt(score1.textContent) + 1;
        resetBall();
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function resetBall() {
    ballX = gameArea.clientWidth / 2 - ball.offsetWidth / 2;
    ballY = gameArea.clientHeight / 2 - ball.offsetHeight / 2;

    velocityX *= -1;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

startBtn.addEventListener("click", () => {
    if (!gameInterval) {
        gameInterval = setInterval(moveBall, 16); // ~60 FPS
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    gameInterval = null;

    score1.textContent = "0";
    score2.textContent = "0";

    resetBall();
});

window.addEventListener("load", resetBall);