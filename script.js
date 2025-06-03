// Get canvas and 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let enemies = [];       // all enemies currently on screen
let towers = [];        // all towers placed by user
let bullets = [];       // all bullets currently flying
let score = 0;          // current score
let gameOver = false;   // flag to stop the game when lost

// === Spawning ===
// Called every 2 seconds to add a new enemy to the left
function spawnEnemy() {
  if (!gameOver) {
    enemies.push({ x: 0, y: 200, hp: 3 });  // spawn at x=0, center y, 3 hit points
  }
}

// === Drawing Functions ===
// Draw a red square enemy
function drawEnemy(enemy) {
  ctx.fillStyle = 'red';
  ctx.fillRect(enemy.x, enemy.y, 30, 30);
}

// Draw a blue square tower
function drawTower(tower) {
  ctx.fillStyle = 'blue';
  ctx.fillRect(tower.x, tower.y, 20, 20);
}

// Each tower fires a yellow bullet from its center
function shoot(tower) {
  bullets.push({ x: tower.x + 10, y: tower.y + 10, speed: 4 });
}

// Draw a yellow square bullet
function drawBullet(bullet) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bullet.x, bullet.y, 5, 5);
}

// Move all bullets forward (to the right)
function updateBullets() {
  for (let b of bullets) {
    b.x += b.speed;
  }
}

// Handle collisions: check if any bullet hits an enemy
function checkCollisions() {
  for (let b of bullets) {
    for (let e of enemies) {
      const hit = (
        b.x >= e.x && b.x <= e.x + 30 &&
        b.y >= e.y && b.y <= e.y + 30
      );

      if (hit) {
        e.hp -= 1;
        b.hit = true;

        // If enemy is killed, increase score
        if (e.hp <= 0) {
          e.dead = true;
          score += 1;
        }
      }
    }
  }

  // Remove hit bullets and dead enemies
  bullets = bullets.filter(b => !b.hit);
  enemies = enemies.filter(e => !e.dead);
}

// Draw current score in top-left
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Check if any enemy passed the right edge (lose condition)
function checkGameOver() {
  for (let e of enemies) {
    if (e.x > canvas.width) {
      gameOver = true;
    }
  }

  // If game is over, show messages
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText("Click to Restart", canvas.width / 2 - 70, canvas.height / 2 + 30);
  }
}

// === Main Game Loop ===
function updateGame() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw each enemy
    for (let e of enemies) {
      e.x += 1;
      drawEnemy(e);
    }

    // Draw and shoot from each tower
    for (let t of towers) {
      drawTower(t);
      shoot(t);
    }

    // Move bullets and handle collisions
    updateBullets();
    checkCollisions();

    // Draw bullets
    for (let b of bullets) {
      drawBullet(b);
    }

    // Show score and check loss condition
    drawScore();
    checkGameOver();

    // Repeat next frame
    requestAnimationFrame(updateGame);
  } else {
    // Stop all updates, just show Game Over screen
    drawScore();
    checkGameOver();
  }
}

// === Input: Place tower or restart ===
canvas.addEventListener('click', (e) => {
  if (gameOver) {
    resetGame(); // Restart on click after game ends
  } else {
    towers.push({ x: e.offsetX, y: e.offsetY }); // Add tower at click
  }
});

// Reset all game state to start a new run
function resetGame() {
  enemies = [];
  towers = [];
  bullets = [];
  score = 0;
  gameOver = false;
  updateGame();
}

// === Game Initialization ===
setInterval(spawnEnemy, 2000); // spawn enemy every 2 seconds
updateGame(); // start game loop

