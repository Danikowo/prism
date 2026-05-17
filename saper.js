let board = [],
	size = 0,
	mines = 0,
	gameOver = false,
	firstClick = true,
	currentLevel = 0;

let touchTimer;
let isLongPress = false; // Флаг, чтобы отличить зажатие от клика

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

window.onload = function () {
	let savedLevel = localStorage.getItem("saperBestLevel");
	if (savedLevel && prizes[savedLevel]) {
		const bestImg = document.getElementById("best-prize-img");
		if (bestImg) {
			bestImg.src = prizes[savedLevel].src;
			bestImg.style.display = "block";
		}
	}
};

function startGame(level) {
	currentLevel = level;
	const levels = { 1: 8, 2: 12, 3: 16 };
	size = levels[level];

	let minP = level === 3 ? 0.24 : 0.15;
	let maxP = level === 3 ? 0.28 : 0.22;
	mines = Math.floor(size * size * (Math.random() * (maxP - minP) + minP));

	gameOver = false;
	firstClick = true;

	document.getElementById("level-menu").style.display = "none";
	document.getElementById("mine-info").style.display = "block";
	document.getElementById("mines-count").innerText = mines;
	document.getElementById("game-board").style.display = "grid";
	document.getElementById("reset-btn").style.display = "inline-block";
	document.getElementById("status").innerText = "Удачи!";

	const prizeCont = document.getElementById("prize-container");
	if (prizeCont) prizeCont.style.display = "none";

	const boardElement = document.getElementById("game-board");
	boardElement.innerHTML = "";
	boardElement.style.gridTemplateColumns = `repeat(${size}, 30px)`;

	createEmptyBoard();
}

function createEmptyBoard() {
	board = [];
	const boardElement = document.getElementById("game-board");
	for (let r = 0; r < size; r++) {
		board[r] = [];
		for (let c = 0; c < size; c++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");

			// Обработка клика
			cell.addEventListener("click", e => {
				if (isLongPress) {
					isLongPress = false; // Сбрасываем флаг и ничего не делаем
					return;
				}
				handleCellClick(r, c);
			});

			cell.oncontextmenu = e => {
				e.preventDefault();
				toggleFlag(r, c);
			};

			const startPress = () => {
				if (gameOver || board[r][c].revealed) return;
				isLongPress = false;
				touchTimer = setTimeout(() => {
					toggleFlag(r, c);
					isLongPress = true; // Помечаем, что это было зажатие
					touchTimer = null;
				}, 600);
			};

			const endPress = () => {
				if (touchTimer) {
					clearTimeout(touchTimer);
					touchTimer = null;
				}
			};

			cell.addEventListener("mousedown", startPress);
			cell.addEventListener("mouseup", endPress);
			cell.addEventListener("mouseleave", endPress);
			cell.addEventListener("touchstart", e => {
				startPress();
			});
			cell.addEventListener("touchend", endPress);

			boardElement.appendChild(cell);
			board[r][c] = { mine: false, revealed: false, el: cell };
		}
	}
}

function toggleFlag(r, c) {
	if (gameOver || board[r][c].revealed) return;
	const cellEl = board[r][c].el;
	if (!cellEl.classList.contains("flag")) {
		cellEl.classList.add("flag");
		cellEl.innerText = "🚩";
	} else {
		cellEl.classList.remove("flag");
		cellEl.innerText = "";
	}
}

function handleCellClick(r, c) {
	if (
		gameOver ||
		board[r][c].revealed ||
		board[r][c].el.classList.contains("flag")
	)
		return;
	if (firstClick) {
		placeMines(r, c);
		firstClick = false;
	}
	reveal(r, c);
}

function placeMines(exR, exC) {
	let placed = 0;
	while (placed < mines) {
		let r, c;
		if (currentLevel === 3 && placed > 0 && Math.random() > 0.5) {
			let mineList = [];
			for (let rr = 0; rr < size; rr++)
				for (let cc = 0; cc < size; cc++)
					if (board[rr][cc].mine) mineList.push({ rr, cc });
			let base = mineList[Math.floor(Math.random() * mineList.length)];
			r = base.rr + Math.floor(Math.random() * 3) - 1;
			c = base.cc + Math.floor(Math.random() * 3) - 1;
		} else {
			r = Math.floor(Math.random() * size);
			c = Math.floor(Math.random() * size);
		}

		if (
			r >= 0 &&
			r < size &&
			c >= 0 &&
			c < size &&
			!board[r][c].mine &&
			(Math.abs(r - exR) > 1 || Math.abs(c - exC) > 1)
		) {
			board[r][c].mine = true;
			placed++;
		}
	}
}

function reveal(r, c) {
	if (r < 0 || r >= size || c < 0 || c >= size || board[r][c].revealed) return;
	const cell = board[r][c];
	cell.revealed = true;
	cell.el.classList.add("revealed");

	if (cell.mine) {
		cell.el.innerText = "💣";
		cell.el.classList.add("mine");
		gameOver = true;
		document.getElementById("status").innerText = "БАБАХ!";
		revealAll();
		return;
	}

	let count = 0;
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) if (board[r + dr]?.[c + dc]?.mine) count++;
	}

	if (count > 0) {
		cell.el.innerText = count;
		cell.el.style.color = [
			"",
			"blue",
			"green",
			"red",
			"darkblue",
			"brown",
			"cyan",
			"black",
			"#777",
		][count];
	} else {
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
		}
	}
	checkWin();
}

function revealAll() {
	board.flat().forEach(c => {
		if (c.mine) {
			c.el.innerText = "💣";
			c.el.classList.add("mine");
		}
	});
}

function checkWin() {
	const revealedCount = board.flat().filter(c => c.revealed).length;
	if (revealedCount === size * size - mines && !gameOver) {
		gameOver = true;
		document.getElementById("status").innerText = "ПОБЕДА! 🎉";

		const currentPrize = prizes[currentLevel];
		document.getElementById("prize-text").innerText =
			"Награда: " + currentPrize.name;
		document.getElementById("prize-img").src = currentPrize.src;
		document.getElementById("prize-container").style.display = "block";

		let lastBest = localStorage.getItem("saperBestLevel") || 0;
		if (currentLevel > parseInt(lastBest)) {
			localStorage.setItem("saperBestLevel", currentLevel);
			const bestImg = document.getElementById("best-prize-img");
			if (bestImg) {
				bestImg.src = currentPrize.src;
				bestImg.style.display = "block";
			}
		}
	}
}

function resetGame() {
	document.getElementById("level-menu").style.display = "block";
	document.getElementById("game-board").style.display = "none";
	document.getElementById("mine-info").style.display = "none";
	document.getElementById("reset-btn").style.display = "none";
	document.getElementById("status").innerText = "";
	document.getElementById("prize-container").style.display = "none";
}
