// ========================================
// FRUIT SMASH GAME
// ========================================


// GANTI DENGAN URL GOOGLE APPS SCRIPT
const API_URL = "MASUKKAN_URL_GOOGLE_APPS_SCRIPT";


// ========================================
// ELEMENT
// ========================================

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");

const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const comboDisplay = document.getElementById("combo");


// ========================================
// GAME VARIABLES
// ========================================

let score = 0;
let combo = 0;
let timeLeft = 30;

let gameRunning = false;

let playerName = "";
let playerPhone = "";

let gameTimer;
let spawnTimer;


// ========================================
// DATA BUAH
// ========================================

const fruits = [

    {
        emoji: "🍎",
        points: 10
    },

    {
        emoji: "🍊",
        points: 15
    },

    {
        emoji: "🍓",
        points: 20
    },

    {
        emoji: "🍇",
        points: 25
    },

    {
        emoji: "🍉",
        points: 30
    },

    {
        emoji: "🍍",
        points: 35
    },

    {
        emoji: "🥝",
        points: 40
    }

];


// ========================================
// START GAME
// ========================================

function startGame() {

    playerName =
        document
        .getElementById("username")
        .value
        .trim();


    playerPhone =
        document
        .getElementById("phone")
        .value
        .trim();


    if (playerName === "") {

        alert("😄 Masukkan username kamu dulu!");

        return;
    }


    if (playerPhone === "") {

        alert("📱 Masukkan nomor WhatsApp!");

        return;
    }


    startScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    startNewGame();

}


// ========================================
// START NEW GAME
// ========================================

function startNewGame() {

    clearInterval(gameTimer);
    clearInterval(spawnTimer);


    score = 0;
    combo = 0;
    timeLeft = 30;

    gameRunning = true;


    scoreDisplay.innerText = score;
    comboDisplay.innerText = combo;
    timeDisplay.innerText = timeLeft;


    // HAPUS OBJEK LAMA
    gameArea
        .querySelectorAll(
            ".fruit, .bomb, .point-popup, .explosion"
        )
        .forEach(item => item.remove());


    playSound("start");


    startTimer();


    // SPAWN OBJECT
    spawnTimer = setInterval(() => {

        if (!gameRunning) return;


        // 80% BUAH
        // 20% BOM

        if (Math.random() < 0.8) {

            createFruit();

        } else {

            createBomb();

        }

    }, 650);

}


// ========================================
// TIMER
// ========================================

function startTimer() {

    gameTimer = setInterval(() => {

        timeLeft--;

        timeDisplay.innerText = timeLeft;


        if (timeLeft <= 5 && timeLeft > 0) {

            playSound("warning");

        }


        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);

}


// ========================================
// CREATE FRUIT
// ========================================

function createFruit() {

    if (!gameRunning) return;


    const data =
        fruits[
            Math.floor(
                Math.random() * fruits.length
            )
        ];


    const fruit =
        document.createElement("div");


    fruit.className = "fruit";


    fruit.innerText = data.emoji;


    const maxX =
        gameArea.clientWidth - 70;


    const maxY =
        gameArea.clientHeight - 100;


    const x =
        Math.random() * maxX;


    const y =
        Math.random() * maxY;


    fruit.style.left = x + "px";

    fruit.style.top = y + "px";


    gameArea.appendChild(fruit);


    // HILANG JIKA TIDAK DIKLIK
    const removeTimer = setTimeout(() => {

        if (fruit.parentElement) {

            fruit.remove();

            combo = 0;

            comboDisplay.innerText = combo;

        }

    }, 1800);


    fruit.addEventListener("click", () => {

        if (!gameRunning) return;


        clearTimeout(removeTimer);


        smashFruit(
            fruit,
            data.points
        );

    });

}


// ========================================
// SMASH FRUIT
// ========================================

function smashFruit(fruit, points) {

    combo++;


    let comboBonus = 0;


    // BONUS SETELAH COMBO 5
    if (combo >= 5) {

        comboBonus =
            combo * 2;

    }


    const totalPoints =
        points + comboBonus;


    score += totalPoints;


    scoreDisplay.innerText = score;

    comboDisplay.innerText = combo;


    fruit.classList.add("smash");


    playSound("smash");


    showPoints(

        fruit.offsetLeft,

        fruit.offsetTop,

        "+" + totalPoints,

        false

    );


    // COMBO MESSAGE
    if (combo === 5) {

        showCombo();

        playSound("combo");

    }


    setTimeout(() => {

        fruit.remove();

    }, 350);

}


// ========================================
// CREATE BOMB
// ========================================

function createBomb() {

    if (!gameRunning) return;


    const bomb =
        document.createElement("div");


    bomb.className = "bomb";


    bomb.innerText = "💣";


    const maxX =
        gameArea.clientWidth - 70;


    const maxY =
        gameArea.clientHeight - 100;


    bomb.style.left =
        Math.random() * maxX + "px";


    bomb.style.top =
        Math.random() * maxY + "px";


    gameArea.appendChild(bomb);


    // BOM HILANG
    const bombTimer = setTimeout(() => {

        if (bomb.parentElement) {

            bomb.remove();

        }

    }, 2000);


    // CLICK BOMB
    bomb.addEventListener("click", () => {

        if (!gameRunning) return;


        clearTimeout(bombTimer);


        explodeBomb(bomb);

    });

}


// ========================================
// EXPLODE BOMB
// ========================================

function explodeBomb(bomb) {

    // KURANGI SCORE
    score -= 50;


    // SCORE TIDAK BOLEH MINUS
    if (score < 0) {

        score = 0;

    }


    // RESET COMBO
    combo = 0;


    scoreDisplay.innerText = score;

    comboDisplay.innerText = combo;


    const x =
        bomb.offsetLeft;


    const y =
        bomb.offsetTop;


    bomb.remove();


    // EXPLOSION
    const explosion =
        document.createElement("div");


    explosion.className =
        "explosion";


    explosion.innerText = "💥";


    explosion.style.left =
        (x - 15) + "px";


    explosion.style.top =
        (y - 15) + "px";


    gameArea.appendChild(explosion);


    showPoints(
        x,
        y,
        "-50",
        true
    );


    playSound("bomb");


    setTimeout(() => {

        explosion.remove();

    }, 600);

}


// ========================================
// SHOW POINTS
// ========================================

function showPoints(x, y, text, negative) {

    const popup =
        document.createElement("div");


    popup.className =
        "point-popup";


    if (negative) {

        popup.classList.add("negative");

    }


    popup.innerText = text;


    popup.style.left = x + "px";

    popup.style.top = y + "px";


    gameArea.appendChild(popup);


    setTimeout(() => {

        popup.remove();

    }, 800);

}


// ========================================
// COMBO MESSAGE
// ========================================

function showCombo() {

    const comboMessage =
        document.createElement("div");


    comboMessage.className =
        "point-popup";


    comboMessage.innerText =
        "🔥 AMAZING COMBO! 🔥";


    comboMessage.style.left = "20%";

    comboMessage.style.top = "40%";

    comboMessage.style.fontSize = "32px";


    gameArea.appendChild(comboMessage);


    setTimeout(() => {

        comboMessage.remove();

    }, 1000);

}


// ========================================
// END GAME
// ========================================

function endGame() {

    if (!gameRunning) return;


    gameRunning = false;


    clearInterval(gameTimer);

    clearInterval(spawnTimer);


    gameArea
        .querySelectorAll(
            ".fruit, .bomb"
        )
        .forEach(item => item.remove());


    playSound("gameover");


    gameScreen.classList.add("hidden");

    gameOverScreen.classList.remove("hidden");


    document
        .getElementById("finalScore")
        .innerText = score;


    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    if (score >= 800) {

        resultMessage.innerText =
            "👑 LUAR BIASA! Kamu Raja Fruit Smash!";

    }

    else if (score >= 500) {

        resultMessage.innerText =
            "🌟 HEBAT! Kamu sangat jago!";

    }

    else if (score >= 250) {

        resultMessage.innerText =
            "😎 Bagus sekali! Terus berlatih!";

    }

    else {

        resultMessage.innerText =
            "😊 Jangan menyerah! Coba lagi yuk!";

    }


    // SIMPAN SCORE
    saveScore();

}


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    gameOverScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    startNewGame();

}


// ========================================
// SOUND EFFECT
// ========================================

function playSound(type) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();


        const gain =
            audio.createGain();


        oscillator.connect(gain);

        gain.connect(audio.destination);


        if (type === "smash") {

            oscillator.frequency.value = 500;

            oscillator.type = "sine";

        }

        else if (type === "combo") {

            oscillator.frequency.value = 800;

            oscillator.type = "triangle";

        }

        else if (type === "start") {

            oscillator.frequency.value = 600;

            oscillator.type = "sine";

        }

        else if (type === "warning") {

            oscillator.frequency.value = 250;

            oscillator.type = "square";

        }

        else if (type === "bomb") {

            oscillator.frequency.value = 100;

            oscillator.type = "sawtooth";

        }

        else {

            oscillator.frequency.value = 150;

            oscillator.type = "sawtooth";

        }


        gain.gain.setValueAtTime(
            0.15,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audio.currentTime + 0.3
        );


        oscillator.start();


        oscillator.stop(
            audio.currentTime + 0.3
        );

    }

    catch (error) {

        console.log("Sound tidak didukung");

    }

}


// ========================================
// SAVE SCORE GOOGLE SHEETS
// ========================================

function saveScore() {

    if (
        API_URL ===
        "MASUKKAN_URL_GOOGLE_APPS_SCRIPT"
    ) {

        console.log(
            "Google Sheets belum terhubung"
        );

        return;

    }


    fetch(API_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify({

            username: playerName,

            phone: playerPhone,

            score: score

        })

    })

    .then(() => {

        console.log(
            "Score berhasil disimpan!"
        );

    })

    .catch(error => {

        console.error(
            "Gagal menyimpan:",
            error
        );

    });

}


// ========================================
// SHOW LEADERBOARD
// ========================================

function showLeaderboard() {

    clearInterval(gameTimer);
    clearInterval(spawnTimer);


    gameRunning = false;


    startScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    leaderboardScreen.classList.remove("hidden");


    const list =
        document.getElementById(
            "leaderboardList"
        );


    list.innerHTML =
        `<div class="loading">
            🍎 Memuat data pemain...
        </div>`;


    if (
        API_URL ===
        "MASUKKAN_URL_GOOGLE_APPS_SCRIPT"
    ) {

        list.innerHTML =
            "⚠️ Google Sheets belum dihubungkan.";

        return;

    }


    fetch(API_URL)

        .then(response => response.json())

        .then(data => {


            // URUTKAN SCORE
            data.sort(
                (a, b) =>
                    b.score - a.score
            );


            // TOP 10
            const topPlayers =
                data.slice(0, 10);


            list.innerHTML = "";


            if (topPlayers.length === 0) {

                list.innerHTML =
                    "Belum ada pemain 😄";

                return;

            }


            topPlayers.forEach(
                (player, index) => {


                    let medal;


                    if (index === 0) {

                        medal = "🥇";

                    }

                    else if (index === 1) {

                        medal = "🥈";

                    }

                    else if (index === 2) {

                        medal = "🥉";

                    }

                    else {

                        medal = "🏅";

                    }


                    const rank =
                        document.createElement("div");


                    rank.className =
                        "rank";


                    rank.innerHTML = `

                        <span>
                            ${medal}
                            ${index + 1}.
                            ${player.username}
                        </span>

                        <strong>
                            ⭐ ${player.score}
                        </strong>

                    `;


                    list.appendChild(rank);

                });

        })

        .catch(error => {

            console.error(error);


            list.innerHTML =
                "😢 Gagal memuat leaderboard.";

        });

}


// ========================================
// BACK TO MENU
// ========================================

function backToMenu() {

    clearInterval(gameTimer);
    clearInterval(spawnTimer);


    gameRunning = false;


    gameArea
        .querySelectorAll(
            ".fruit, .bomb, .point-popup, .explosion"
        )
        .forEach(item => item.remove());


    leaderboardScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    startScreen.classList.remove("hidden");

}
