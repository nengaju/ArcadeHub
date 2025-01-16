// Referências principais
const gameArea = document.getElementById('game-area');
const antsContainer = document.getElementById('ants');
const resourcesDisplay = document.getElementById('resources');
const antsCountDisplay = document.getElementById('ants-count');
const timeIcon = document.getElementById('time-icon');
const timeLabel = document.getElementById('time-label');
const clockDisplay = document.getElementById('clock');
const resetWaypointsBtn = document.getElementById('reset-waypoints');

const flowers = document.getElementById('flowers');
const nest = document.getElementById('nest');

let waypoints = [];
const ants = [];
let resources = 10;
let antsCount = 0;
let gameTime = 12 * 60; // Hora fictícia do jogo em minutos (inicia às 12:00)



// Adicionar waypoints
gameArea.addEventListener('click', (event) => {
  const rect = gameArea.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const waypoint = document.createElement('div');
  waypoint.classList.add('waypoint');
  waypoint.style.left = `${x - 5}px`;
  waypoint.style.top = `${y - 5}px`;
  gameArea.appendChild(waypoint);

  waypoints.push({ x, y });
});

// Resetar waypoints
resetWaypointsBtn.addEventListener('click', () => {
  waypoints = [];
  document.querySelectorAll('.waypoint').forEach((wp) => wp.remove());
});

// Adicionar trabalhador
function addWorker() {
  if (resources >= 10) {
    resources -= 10;
    resourcesDisplay.innerText = resources;
    antsCount += 1;
    antsCountDisplay.innerText = antsCount;
    spawnAnt();
  }
}

// Criar formiga
function spawnAnt() {
  const ant = document.createElement('div');
  ant.classList.add('ant');
  ant.textContent = '🐜';
  ant.style.left = `${Math.random() * 500 + 50}px`;
  ant.style.top = `${Math.random() * 300 + 50}px`;
  antsContainer.appendChild(ant);

  ants.push({ element: ant, currentWaypointIndex: 0, carrying: false });
  moveAnt(ants[ants.length - 1]);
}

// Movimentação das formigas
function moveAnt(ant) {
  function moveToNextWaypoint() {
    if (waypoints.length === 0) {
      setTimeout(moveToNextWaypoint, 500);
      return;
    }

    const waypoint = waypoints[ant.currentWaypointIndex];
    const currentX = parseFloat(ant.element.style.left);
    const currentY = parseFloat(ant.element.style.top);

    const dx = (waypoint.x - currentX) * 0.05;
    const dy = (waypoint.y - currentY) * 0.05;

    ant.element.style.left = `${currentX + dx}px`;
    ant.element.style.top = `${currentY + dy}px`;

    if (Math.abs(currentX - waypoint.x) < 5 && Math.abs(currentY - waypoint.y) < 5) {
      ant.currentWaypointIndex = (ant.currentWaypointIndex + 1) % waypoints.length;

      // Ganha recursos ao completar o percurso
      const reachedFlowers = Math.abs(currentX - 50) < 50 && Math.abs(currentY - 80) < 50;
      const reachedNest = Math.abs(currentX - 500) < 50 && Math.abs(currentY - 300) < 50;

      if (ant.carrying && reachedNest) {
        resources += 1;
        resourcesDisplay.innerText = resources;
        ant.carrying = false;
      } else if (!ant.carrying && reachedFlowers) {
        ant.carrying = true;
      }
    }

    setTimeout(moveToNextWaypoint, 50);
  }

  moveToNextWaypoint();
}

// Ajuste o multiplicador de tempo
const timeMultiplier = 10; // Define quantos minutos fictícios passam por segundo real

// Ciclo de dia e noite + relógio
function updateTime() {
  gameTime = (gameTime + timeMultiplier) % 1440; // Um dia tem 1440 minutos

  const hours = Math.floor(gameTime / 60);
  const minutes = gameTime % 60;
  clockDisplay.innerText = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  const isDay = hours >= 6 && hours < 18;
  gameArea.classList.toggle('night', !isDay);
  timeIcon.textContent = isDay ? '☀️' : '🌙';
  timeLabel.innerText = isDay ? 'Day' : 'Night';
}

// Intervalo atualizado para refletir o novo tempo fictício
setInterval(updateTime, 1000); // Atualiza o tempo a cada segundo real