const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const tileSize = 60;
const mapWidth = 10;
const mapHeight = 10;
const playerMaxHealth = 100;
const enemyMaxHealth = 50;

let player = {
  x: 0,
  y: 0,
  character: '',
  health: playerMaxHealth,
};

let key = {};
let door = {};
let enemies = [];
let characterSelected = false;
let gameRunning = true;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar o mapa
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#808080' : '#A9A9A9';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  if (!characterSelected) return;

  // Desenhar o jogador
  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.fillText(player.character, player.x * tileSize + 15, player.y * tileSize + 45);

  // Desenhar a chave
  if (key.x !== -1) {
    ctx.fillStyle = 'yellow';
    ctx.fillText('🗝️', key.x * tileSize + 15, key.y * tileSize + 45);
  }

  // Desenhar a porta
  if (door.x !== -1) {
    ctx.fillStyle = 'brown';
    ctx.fillText('🚪', door.x * tileSize + 15, door.y * tileSize + 45);
  }

  // Desenhar os inimigos
  enemies.forEach((enemy) => {
    ctx.fillStyle = 'green';
    ctx.fillText(enemy.character, enemy.x * tileSize + 15, enemy.y * tileSize + 45);
  });

  drawUI();
}

function drawUI() {
  const playerStats = document.getElementById('playerStats');
  const gameMessage = document.getElementById('gameMessage');
  playerStats.textContent = `Vida: ${player.health}`;
  if (player.health <= 0) {
    gameMessage.textContent = 'Você foi derrotado!';
    gameRunning = false;
    setTimeout(resetGame, 2000); // Retorna ao menu após 2 segundos
  }
}

function selectCharacter(character) {
  player.character = character;
  player.health = playerMaxHealth; // Reinicia a vida
  characterSelected = true;

  document.getElementById('initialScreen').style.display = 'none';
  canvas.style.display = 'block';
  document.getElementById('ui').style.display = 'flex';

  startNewRoom(); // Começa o primeiro mapa
}

function movePlayer(dx, dy) {
  if (!characterSelected || !gameRunning) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) {
    player.x = newX;
    player.y = newY;
    checkCollisions();
    draw();
  }
}

function createEnemies() {
  enemies = [];
  const enemyTypes = ['🕷️', '🐉', '🦇', '💀', '👹'];

  for (let i = 0; i < 5; i++) {
    let x, y, validPosition;
    do {
      x = Math.floor(Math.random() * mapWidth);
      y = Math.floor(Math.random() * mapHeight);
      validPosition = (x !== player.x || y !== player.y) && (x !== key.x || y !== key.y);
    } while (!validPosition);

    enemies.push({
      x,
      y,
      character: enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
      health: enemyMaxHealth,
    });
  }
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    if (Math.random() < 0.5) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const directionX = dx !== 0 ? dx / Math.abs(dx) : 0;
      const directionY = dy !== 0 ? dy / Math.abs(dy) : 0;

      if (Math.random() < 0.7) enemy.x += directionX;
      if (Math.random() < 0.7) enemy.y += directionY;

      // Colisão com o jogador
      if (player.x === enemy.x && player.y === enemy.y && gameRunning) {
        player.health -= 10;
      }
    }
  });
}

function checkCollisions() {
  // Colisão com a chave
  if (player.x === key.x && player.y === key.y) {
    key = { x: -1, y: -1 };
  }

  // Colisão com a porta
  if (player.x === door.x && player.y === door.y && key.x === -1) {
    startNewRoom(); // Avança para a próxima sala
  }
}

function startNewRoom() {
  // Posiciona jogador, chave e porta de forma válida
  do {
    key = { x: Math.floor(Math.random() * mapWidth), y: Math.floor(Math.random() * mapHeight) };
    door = { x: Math.floor(Math.random() * mapWidth), y: Math.floor(Math.random() * mapHeight) };
  } while (key.x === door.x && key.y === door.y);

  player.x = 0;
  player.y = 0;

  createEnemies();
  draw();
}

function resetGame() {
  location.reload(); // Reinicia o jogo
}

// Controles do teclado
document.addEventListener('keydown', (event) => {
  if (!gameRunning) return;
  switch (event.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
  }
});

// Movimentação contínua dos inimigos
setInterval(() => {
  if (characterSelected && gameRunning) {
    moveEnemies();
    draw();
  }
}, 600); // Inimigos se movem a cada 400ms