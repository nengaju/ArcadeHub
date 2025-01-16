const startBtn = document.getElementById("start-btn");
const characterScreen = document.getElementById("character-screen");
const startScreen = document.getElementById("start-screen");
const gameBoard = document.getElementById("game-board");
const characters = document.querySelectorAll(".character");
const playerName = document.getElementById("player-name");
const playerCardsDiv = document.getElementById("player-cards");
const opponentCardsDiv = document.getElementById("opponent-cards");
const playerPlay = document.getElementById("player-play");
const opponentPlay = document.getElementById("opponent-play");
const turnDisplay = document.getElementById("turn");
const decisionButtons = document.getElementById("decision-buttons");

let player = {};
let opponent = {};
let turn = 1;

// Iniciar o jogo
startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  characterScreen.classList.add("active");
});

// Escolher personagem
characters.forEach((char) => {
  char.addEventListener("click", () => {
    player.name = char.dataset.name;
    player.cards = [5, 7, 9];
    opponent.name = "IA Oponente";
    opponent.cards = [3, 6, 8];

    playerName.textContent = player.name;
    characterScreen.classList.remove("active");
    gameBoard.classList.add("active");

    renderCards();
  });
});

// Renderizar cartas
function renderCards() {
  renderPlayerCards();
  renderOpponentCards();
}

function renderPlayerCards() {
  playerCardsDiv.innerHTML = "";
  player.cards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.textContent = card;
    cardDiv.dataset.index = index;

    cardDiv.addEventListener("click", () => chooseCard(card, index));
    playerCardsDiv.appendChild(cardDiv);
  });
}

function renderOpponentCards() {
  opponentCardsDiv.innerHTML = "";
  opponent.cards.forEach(() => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.textContent = "?";
    opponentCardsDiv.appendChild(cardDiv);
  });
}

function chooseCard(card, index) {
  if (playerPlay.textContent) return;

  const blefButton = document.createElement("button");
  blefButton.textContent = "Blefar";
  blefButton.addEventListener("click", () => playTurn(card, index, true));

  const truthButton = document.createElement("button");
  truthButton.textContent = "Dizer a Verdade";
  truthButton.addEventListener("click", () => playTurn(card, index, false));

  playerPlay.innerHTML = "";
  playerPlay.appendChild(blefButton);
  playerPlay.appendChild(truthButton);
}

function playTurn(card, index, isBlef) {
  playerPlay.textContent = isBlef ? getRandomNumber(1, 10) : card;
  playerPlay.dataset.realValue = card;

  player.cards.splice(index, 1);
  renderPlayerCards();

  setTimeout(opponentTurn, 1000);
}

function opponentTurn() {
  const cardIndex = getRandomIndex(opponent.cards.length);
  const opponentCard = opponent.cards[cardIndex];

  const blefando = Math.random() < 0.5;

  opponentPlay.textContent = blefando ? getRandomNumber(1, 10) : opponentCard;
  opponentPlay.dataset.realValue = opponentCard;

  opponent.cards.splice(cardIndex, 1);
  renderOpponentCards();

  setTimeout(prepareDecision, 1000);
}

function prepareDecision() {
  decisionButtons.innerHTML = `
    <button id="truth-btn">Acreditar</button>
    <button id="lie-btn">Blefe</button>
  `;

  decisionButtons.style.display = "flex";

  document.getElementById("truth-btn").addEventListener("click", () => evaluateRound(false));
  document.getElementById("lie-btn").addEventListener("click", () => evaluateRound(true));
}

function evaluateRound(playerGuessBlefe) {
  decisionButtons.style.display = "none";

  const playerBlefou = playerPlay.textContent != playerPlay.dataset.realValue;
  const opponentBlefou = opponentPlay.textContent != opponentPlay.dataset.realValue;

  let result = "";

  if (playerGuessBlefe === opponentBlefou) {
    result += "Você acertou! Ganhou a carta do oponente. ";
    player.cards.push(Number(opponentPlay.dataset.realValue));
  } else {
    result += "Você errou! O oponente fica com a sua carta. ";
    opponent.cards.push(Number(playerPlay.dataset.realValue));
  }

  alert(result);

  playerPlay.textContent = "";
  opponentPlay.textContent = "";
  turn++;
  turnDisplay.textContent = `Turno: ${turn}`;
  renderCards();

  if (player.cards.length === 0 || opponent.cards.length === 0) {
    alert(player.cards.length === 0 ? "Você perdeu!" : "Você venceu!");
    resetGame();
  }
}

function resetGame() {
  player.cards = [5, 7, 9];
  opponent.cards = [3, 6, 8];
  turn = 1;
  turnDisplay.textContent = "Turno: 1";

  renderCards();
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}
