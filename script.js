window.onload = function () {
	// Словарь картинок (общий для обеих игр, так как призы одинаковые)
	const prizeImages = {
		3: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1).png",
		2: "flux-kontext-DGOhT4C1s1jRq6PPq2Vd2-removebg-preview (1)фф.png",
		1: "trophy_78370-345-removebg-preview.png",
	};

	// --- ЛОГИКА ДЛЯ ИГРЫ "ХАКЕР" (УГАДАЙ ЧИСЛО) ---
	let bestLevelGuess = localStorage.getItem("bestLevel");
	if (bestLevelGuess && prizeImages[bestLevelGuess]) {
		let trophyImg = document.getElementById("guess-trophy");
		if (trophyImg) trophyImg.src = prizeImages[bestLevelGuess];
	}

	// --- ЛОГИКА ДЛЯ ИГРЫ "САПЕР" ---
	let bestLevelSaper = localStorage.getItem("saperBestLevel");
	if (bestLevelSaper && prizeImages[bestLevelSaper]) {
		// Убедись, что в HTML хаба у картинки сапера id="saper-trophy"
		let saperImg = document.getElementById("saper-trophy");
		if (saperImg) saperImg.src = prizeImages[bestLevelSaper];
	}
	let bestLevelSnake = localStorage.getItem("snakeBestLevel");
	if (bestLevelSnake && prizeImages[bestLevelSnake]) {
		// Ищем картинку в карточке змейки по ID
		let snakeImg = document.getElementById("snake-trophy");
		if (snakeImg) snakeImg.src = prizeImages[bestLevelSnake];
	}
};
const dbURL = "https://finishwb9-default-rtdb.firebaseio.com/";
const projectID = "DaniilKluev";
const btn = document.querySelector(".heart");

if (localStorage.getItem("voted" + projectID)) {
	btn.classList.add("active-voted");
}
btn.addEventListener("click", async function () {
	console.log("hjd");
	if (localStorage.getItem("voted" + projectID)) {
		alert("Вы уже проголосовали");
		return;
	}
	const responce = await fetch(`${dbURL}/results/${projectID}/likes.json`);
	let currentLikes = (await responce.json()) || 0;

	await fetch(`${dbURL}/results/${projectID}.json`, {
		method: "PATCH",
		body: JSON.stringify({
			likes: currentLikes + 1,
			name: "Клюев Даниил",
		}),
	});

	localStorage.setItem("voted" + projectID, "true");
	btn.classList.add("active-voted");
	document.getElementById("count-heart").innerHTML = currentLikes + 1;
});
