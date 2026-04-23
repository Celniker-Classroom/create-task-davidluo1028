const gameArea = document.getElementById("gameArea");
const paddleLeft = document.getElementById("paddleLeft");
const paddleRight = document.getElementById("paddleRight");
const ball = document.getElementById("ball");

const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const moreModesBtn = document.getElementById("moreModesBtn");
const modesBox = document.getElementById("modesBox");
const vsAiBtn = document.getElementById("vsAiBtn");
const difficultyPanel = document.getElementById("difficultyPanel");
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const regularModeBtn = document.getElementById("regularModeBtn");
const instructionsText = document.getElementById("instructionsText");
const backToRegularBtn = document.getElementById("backToRegularBtn");

let scores = [0, 0];

let leftY = 160;
let rightY = 160;

let ballX = 391;
let ballY = 191;

let baseSpeed = 4;
let ballSpeedX = baseSpeed;
let ballSpeedY = baseSpeed;

let gameRunning = false;

const paddleSpeed = 12;
const paddleHeight = 80;
const ballSize = 18;

let gameWidth = 800;
let gameHeight = 400;
let paddleWidth = 12;

let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

function resetGame() {
    gameRunning = false;
    scores = [0, 0];
    score1.textContent = 0;
    score2.textContent = 0;
    updateMetrics();
    leftY = rightY = (gameHeight - paddleHeight) / 2;
    paddleLeft.style.top = leftY + "px";
    paddleRight.style.top = rightY + "px";
    resetBall();
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function selectDifficulty(diff) {
    difficulty = diff;
    // Remove selected from all
    document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('selected'));
    // Add to current
    if (diff === 'easy') easyBtn.classList.add('selected');
    else if (diff === 'medium') mediumBtn.classList.add('selected');
    else if (diff === 'hard') hardBtn.classList.add('selected');
    // Reset game
    resetGame();
}

function updateMetrics() {
    gameWidth = gameArea.clientWidth;
    gameHeight = gameArea.clientHeight;
    paddleWidth = paddleLeft.clientWidth;
}


document.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

function movePaddle(side, dir) {
    if (side === "left") {
        leftY += dir * paddleSpeed;
        if (leftY < 0) leftY = 0;
        if (leftY > gameHeight - paddleHeight) leftY = gameHeight - paddleHeight;
        paddleLeft.style.top = leftY + "px";
    }

    if (side === "right") {
        rightY += dir * paddleSpeed;
        if (rightY < 0) rightY = 0;
        if (rightY > gameHeight - paddleHeight) rightY = gameHeight - paddleHeight;
        paddleRight.style.top = rightY + "px";
    }
}

function resetBall() {
    updateMetrics();

    ballX = (gameWidth - ballSize) / 2;
    ballY = (gameHeight - ballSize) / 2;

    ballSpeedX = baseSpeed * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = baseSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function initGame() {
    updateMetrics();

    leftY = rightY = (gameHeight - paddleHeight) / 2;
    paddleLeft.style.top = leftY + "px";
    paddleRight.style.top = rightY + "px";

    resetBall();
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function speedUp() {
    if (ballSpeedX > 0) {
        ballSpeedX += 0.5;
    } else {
        ballSpeedX -= 0.5;
    }

    if (ballSpeedY > 0) {
        ballSpeedY += 0.5;
    } else {
        ballSpeedY -= 0.5;
    }
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    updateMetrics();

    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }

    if (ballY + ballSize >= gameHeight) {
        ballY = gameHeight - ballSize;
        ballSpeedY *= -1;
    }

    const leftPaddleRight = 20 + paddleWidth;
    const rightPaddleLeft = gameWidth - 20 - paddleWidth;

    if (
        ballSpeedX < 0 &&
        ballX <= leftPaddleRight &&
        ballX + ballSize >= 20 &&
        ballY + ballSize > leftY &&
        ballY < leftY + paddleHeight
    ) {
        ballX = leftPaddleRight;
        ballSpeedX *= -1;
        speedUp();
    }

    if (
        ballSpeedX > 0 &&
        ballX + ballSize >= rightPaddleLeft &&
        ballX <= gameWidth - 20 &&
        ballY + ballSize > rightY &&
        ballY < rightY + paddleHeight
    ) {
        ballX = rightPaddleLeft - ballSize;
        ballSpeedX *= -1;
        speedUp();
    }

    if (ballX + ballSize < 0) {
        scores[1]++;
        score2.textContent = scores[1];
        resetBall();
    }

    if (ballX > gameWidth) {
        scores[0]++;
        score1.textContent = scores[0];
        resetBall();
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}

function aiMove() {
    // Miss chance
    let missChance = 0.3; // medium default
    if (difficulty === 'easy') missChance = 0.5;
    if (difficulty === 'hard') missChance = 0.15;

    if (Math.random() < missChance) return; // miss this opportunity

    let aiSpeed = paddleSpeed; // same as player

    // Simple AI: move towards ball's y position
    let targetY = ballY + ballSize / 2 - paddleHeight / 2;

    // Clamp target
    targetY = Math.max(0, Math.min(gameHeight - paddleHeight, targetY));

    if (rightY < targetY - 5) {
        movePaddle("right", 1);
    } else if (rightY > targetY + 5) {
        movePaddle("right", -1);
    }
}

function loop() {
    if (!gameRunning) return;

    if (keys.w) movePaddle("left", -1);
    if (keys.s) movePaddle("left", 1);

    if (mode === 'pvp') {
        if (keys.ArrowUp) movePaddle("right", -1);
        if (keys.ArrowDown) movePaddle("right", 1);
    } else {
        if (keys.ArrowUp) movePaddle("left", -1);
        if (keys.ArrowDown) movePaddle("left", 1);
        aiMove();
    }

    updateBall();
    requestAnimationFrame(loop);
}

startBtn.onclick = function () {
    if (!gameRunning) {
        gameRunning = true;
        loop();
    }
};

pauseBtn.onclick = function () {
    gameRunning = false;
};

resetBtn.onclick = function () {
    resetGame();
};

moreModesBtn.onclick = function () {
    modesBox.classList.toggle("show");
};

vsAiBtn.onclick = function () {
    mode = 'ai';
    modesBox.classList.remove("show");
    difficultyPanel.classList.add("show");
    selectDifficulty('medium'); // Default to medium
    updateInstructions();
};

easyBtn.onclick = function () {
    selectDifficulty('easy');
};

mediumBtn.onclick = function () {
    selectDifficulty('medium');
};

hardBtn.onclick = function () {
    selectDifficulty('hard');
};

regularModeBtn.onclick = function () {
    mode = 'pvp';
    difficultyPanel.classList.remove("show");
    updateInstructions();
};

backToRegularBtn.onclick = function () {
    mode = 'pvp';
    difficultyPanel.classList.remove("show");
    updateInstructions();
};

function updateInstructions() {
    if (mode === 'ai') {
        instructionsText.textContent = "Use W and S keys (or Up/Down arrows) to move your paddle. Beat the AI by scoring more points!";
    } else {
        instructionsText.textContent = "Player 1 uses W and S keys to move, while Player 2 uses Up and Down arrow keys.";
    }
}

initGame();
updateInstructions();
