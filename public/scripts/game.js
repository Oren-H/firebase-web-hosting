import firebase from "/firebase/compat/app";
// Required for side-effects
import '/firebase/compat/firestore';
import { initializeApp } from "/firebase/app";
import { getFirestore } from "/firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA1AxN0tc3HBEuh8RXmRcxfQPBm3EELw_U",
    authDomain: "oren-h.firebaseapp.com",
    projectId: "oren-h",
    storageBucket: "oren-h.appspot.com",
    messagingSenderId: "584035320778",
    appId: "1:584035320778:web:6f03fd6c76a35bd7d5c533"
};

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialsForm = document.getElementById("initialsForm");
const initialsInput = document.getElementById("initials");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeImage = new Image();
snakeImage.src = "theiss.png";

const gridSize = 30;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: 5, y: 5 }];
let apple = { x: 10, y: 10 };
let applesEaten = 0;
let score = 0;
let dx = 1;
let dy = 0;
let changingDirection = false;
let gameInterval;
let gameEnded = false;


initialsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const initials = initialsInput.value.trim().toUpperCase();

    if (initials.length !== 3) {
        alert("Please enter 3 letters for your initials.");
        return;
    }

    if (gameEnded) { // Check if the game has ended before storing initials
        // Store the player's initials and score in Firestore
        db.collection("scores").add({
            initials: initials,
            score: score,
        })
        .then(() => {
            alert("Initials and score stored successfully.");
            location.reload(); // Reload the page to play again
        })
        .catch((error) => {
            console.error("Error storing initials and score:", error);
            alert("An error occurred. Please try again.");
        });
    } else {
        alert("The game is still in progress. You can submit your initials after the game ends.");
    }
});

function getRandomCoordinate(max) {
    return Math.floor(Math.random() * max);
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawApple() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const ateApple = snake[0].x === apple.x && snake[0].y === apple.y;
    if (ateApple) {
        score += 10;
        applesEaten++;
        spawnApple();
    } else {
        snake.pop();
    }

    changingDirection = false;
}

function spawnApple() {
    apple = { x: getRandomCoordinate(gridWidth), y: getRandomCoordinate(gridHeight) };
}

function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= gridWidth ||
        snake[0].y < 0 ||
        snake[0].y >= gridHeight
    ) {
        gameEnded = true;
        clearInterval(gameInterval);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("Game Over", 140, canvas.height / 2);
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameEnded = true;
            clearInterval(gameInterval);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("Game Over", 140, canvas.height / 2);
        }
    }
}

function updateGameArea() {
    if (score >= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "14px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Apples Eaten: " + applesEaten, canvas.width - 130, 20);
        drawApple();
        drawSnake();
        moveSnake();
        checkCollision();
    }
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === A_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }

    if (keyPressed === W_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }

    if (keyPressed === D_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }

    if (keyPressed === S_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}


function startGame() {
    score = 0;
    snake = [{ x: 5, y: 5 }];
    dx = 1;
    dy = 0;
    changingDirection = false;
    gameInterval = setInterval(updateGameArea, 100);
}

// Start the game when the page loads
startGame();
