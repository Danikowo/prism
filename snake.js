const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const box = 20;

let snake, food, direction, gameInterval, score, gameOver;
let currentSpeed = 150;
let isPaused = false;
let nextDirection; // Для мгновенного отклика

const prizes = {
	1: { name: "Бронза", src: "trophy_78370-345-removebg-preview.png" },
	2: {
		name: "Серебро",
		src: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1)фф.png",
	},
	3: {
		name: "Золото",
		src: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1).png",
	},
};

window.onload = () => {
	let saved = localStorage.getItem("snakeBestLevel");
	if (saved && prizes[saved]) {
		const bestImg = document.getElementById("best-prize-img");
		if (bestImg) {
			bestImg.src = prizes[saved].src;
			bestImg.style.display = "block";
		}
	}
};

window.addEventListener(
	"keydown",
	e => {
		if (
			["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
				e.code,
			) > -1
		)
			e.preventDefault();
		if (e.code === "Space" && !gameOver) togglePause();
	},
	false,
);

function togglePause() {
	isPaused = !isPaused;
	document.getElementById("status").innerText = isPaused
		? "ПАУЗА (Пробел)"
		: "Счет: " + score;
	if (!isPaused) runGame();
	else clearInterval(gameInterval);
}

function startGame() {
	document.getElementById("level-menu").style.display = "none";
	document.getElementById("game-area").style.display = "block";
	document.getElementById("prize-container").style.display = "none";

	score = 0;
	gameOver = false;
	isPaused = false;
	direction = "RIGHT";
	nextDirection = "RIGHT";
	currentSpeed = 150;
	snake = [{ x: 9 * box, y: 10 * box }];
	document.getElementById("status").innerText = "Счет: 0";

	spawnFood();
	runGame();
}

function runGame() {
	clearInterval(gameInterval);
	gameInterval = setInterval(draw, currentSpeed);
}

// Мгновенная регистрация нажатия
document.addEventListener("keydown", e => {
	if (isPaused) return;
	if (e.keyCode == 37 && direction != "RIGHT") nextDirection = "LEFT";
	else if (e.keyCode == 38 && direction != "DOWN") nextDirection = "UP";
	else if (e.keyCode == 39 && direction != "LEFT") nextDirection = "RIGHT";
	else if (e.keyCode == 40 && direction != "UP") nextDirection = "DOWN";
});

function changeDir(newDir) {
	if (isPaused || gameOver) return;
	if (newDir == "LEFT" && direction != "RIGHT") nextDirection = "LEFT";
	else if (newDir == "UP" && direction != "DOWN") nextDirection = "UP";
	else if (newDir == "RIGHT" && direction != "LEFT") nextDirection = "RIGHT";
	else if (newDir == "DOWN" && direction != "UP") nextDirection = "DOWN";
}

function spawnFood() {
	food = {
		x: Math.floor(Math.random() * 19) * box,
		y: Math.floor(Math.random() * 19) * box,
	};
	for (let cell of snake) {
		if (cell.x === food.x && cell.y === food.y) spawnFood();
	}
}

function draw() {
	if (gameOver || isPaused) return;

	direction = nextDirection; // Применяем направление в момент отрисовки

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i == 0 ? "#00ff00" : "#008000";
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}

	ctx.fillStyle = "red";
	ctx.fillRect(food.x, food.y, box, box);

	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	if (direction == "LEFT") snakeX -= box;
	if (direction == "UP") snakeY -= box;
	if (direction == "RIGHT") snakeX += box;
	if (direction == "DOWN") snakeY += box;

	if (snakeX == food.x && snakeY == food.y) {
		score++;
		document.getElementById("status").innerText = "Счет: " + score;
		spawnFood();
		if (currentSpeed > 50) {
			currentSpeed -= 3;
			runGame();
		}
	} else {
		snake.pop();
	}

	let newHead = { x: snakeX, y: snakeY };

	if (
		snakeX < 0 ||
		snakeX >= canvas.width ||
		snakeY < 0 ||
		snakeY >= canvas.height ||
		collision(newHead, snake)
	) {
		clearInterval(gameInterval);
		gameOver = true;
		document.getElementById("status").innerText = "КОНЕЦ! Счет: " + score;
		checkPrizeProgression();
		return;
	}

	snake.unshift(newHead);
}

function collision(head, array) {
	for (let i = 0; i < array.length; i++) {
		if (head.x == array[i].x && head.y == array[i].y) return true;
	}
	return false;
}

function checkPrizeProgression() {
	let levelToSave = 0;
	if (score >= 25) levelToSave = 3;
	else if (score >= 15) levelToSave = 2;
	else if (score >= 5) levelToSave = 1;

	if (levelToSave > 0) {
		let prize = prizes[levelToSave];
		document.getElementById("prize-text").innerText =
			"Ваша награда: " + prize.name;
		document.getElementById("prize-img").src = prize.src;
		document.getElementById("prize-container").style.display = "block";

		let saved = localStorage.getItem("snakeBestLevel") || 0;
		if (levelToSave > parseInt(saved)) {
			localStorage.setItem("snakeBestLevel", levelToSave);
			const bestImg = document.getElementById("best-prize-img");
			if (bestImg) {
				bestImg.src = prize.src;
				bestImg.style.display = "block";
			}
		}
	}
}

function resetToMenu() {
	clearInterval(gameInterval);
	document.getElementById("level-menu").style.display = "block";
	document.getElementById("game-area").style.display = "none";
}
