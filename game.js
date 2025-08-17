const doger = document.getElementById("doger");
const obstaclesContainer = document.getElementById("obstacles-container");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const memecoinEl = document.getElementById("memecoin");

let score = 0;
let highscore = 0;
let isJumping = false;
let jumpHeight = 0;
let obstacles = [];
let gameSpeed = 8; // schnelleres Spiel

// Sprung-Mechanik
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
});

function jump() {
    if (isJumping) return;
    isJumping = true;

    let upInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    jumpHeight = 0;
                    doger.style.bottom = "50px";
                }
                jumpHeight -= 10;
                doger.style.bottom = (50 + jumpHeight) + "px";
            }, 20);
        }
        jumpHeight += 10;
        doger.style.bottom = (50 + jumpHeight) + "px";
    }, 20);
}

// Hindernisse erzeugen (weniger häufig)
function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.right = "-50px";
    obstacle.textContent = Math.random() < 0.5 ? "🌵" : "🪨";
    obstaclesContainer.appendChild(obstacle);
    obstacles.push(obstacle);

    setTimeout(createObstacle, 1500 + Math.random() * 1500); // seltener
}
createObstacle();

// Hauptspiel-Loop
function gameLoop() {
    obstacles.forEach((obstacle, index) => {
        let pos = parseInt(obstacle.style.right);
        pos += gameSpeed;
        obstacle.style.right = pos + "px";

        // Kollisionsprüfung
        if (pos > 700 && pos < 750 && jumpHeight < 50) {
            alert("Game Over! Punkte: " + score);
            if (score > highscore) highscore = score;
            highscoreEl.textContent = highscore;

            // Reset
            score = 0;
            scoreEl.textContent = score;
            gameSpeed = 8;
            obstacles.forEach(ob => obstaclesContainer.removeChild(ob));
            obstacles = [];
            createObstacle();
        }

        // Punkte vergeben
        if (pos > 800) {
            obstaclesContainer.removeChild(obstacle);
            obstacles.splice(index, 1);
            score++;
            scoreEl.textContent = score;

            // Geschwindigkeit leicht erhöhen
            gameSpeed += 0.2;

            // Memecoin zufällig wechseln
            memecoinEl.textContent = Math.random() < 0.5 ? "🪙" : "💎";
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
