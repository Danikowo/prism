let number_comp = Math.floor(Math.random() * 100 + 1);
let attempt = 0;

const prizes = {
	3: {
		name: "Золото",
		src: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1).png",
	},
	2: {
		name: "Серебро",
		src: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1)фф.png",
	},
	1: { name: "Бронза", src: "trophy_78370-345-removebg-preview.png" },
};

window.onload = function () {
	let savedLevel = localStorage.getItem("bestLevel");
	if (savedLevel) {
		showImg("best-prize-img", prizes[savedLevel].src);
	}
};

function enter() {
	let input = document.getElementById("number");
	let value = input.value.trim();
	let textDisplay = document.getElementById("text-game");

	if (!/^\d+$/.test(value)) {
		textDisplay.innerText = "Ошибка! Введите только целое число.";
		return;
	}

	let number_user = parseInt(value);
	if (number_user < 1 || number_user > 100) {
		textDisplay.innerText = "Число должно быть от 1 до 100!";
		return;
	}

	attempt++;

	if (number_user > number_comp) {
		textDisplay.innerText =
			"Твое число больше. Введи меньше [Попыток: " + attempt + "]";
	} else if (number_user < number_comp) {
		textDisplay.innerText =
			"Твое число меньше. Введи больше [Попыток: " + attempt + "]";
	} else {
		let currentLevel = 0;
		if (attempt <= 8) currentLevel = 3;
		else if (attempt <= 15) currentLevel = 2;
		else currentLevel = 1;

		let prize = prizes[currentLevel];
		textDisplay.innerText =
			"Вы угадали за " + attempt + " попыток! Награда: " + prize.name;
		document.getElementById("reset-btn").style.display = "block";

		showImg("prize-img", prize.src);

		let lastLevel = localStorage.getItem("bestLevel") || 0;
		if (currentLevel > lastLevel) {
			localStorage.setItem("bestLevel", currentLevel);
			showImg("best-prize-img", prize.src);
		}
	}
	input.value = "";
}

function showImg(id, src) {
	let img = document.getElementById(id);
	img.src = src;
	img.style.display = "block";
}
function resetGame() {
	number_comp = Math.floor(Math.random() * 100 + 1);

	attempt = 0;

	document.getElementById("text-game").innerText = "Введите число от 1 до 100";
	document.getElementById("number").value = "";

	document.getElementById("prize-img").style.display = "none";
	document.getElementById("reset-btn").style.display = "none";

	document.getElementById("number").focus();
}
