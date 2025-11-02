// Simple Memory / Concentration game
// Author: generated scaffold for simacodecode-del/card-game

const EMOJIS = ["🐶","🐱","🦊","🐼","🐵","🦁","🐸","🦄"]; // 8 pairs => 16 cards
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const winOverlay = document.getElementById("winOverlay");
const winSummary = document.getElementById("winSummary");
const playAgain = document.getElementById("playAgain");

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let timer = null;
let timeElapsed = 0;
let started = false;

function init(){
  resetState();
  buildDeck();
  renderBoard();
}

function resetState(){
  deck = [];
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  movesEl.textContent = moves;
  clearInterval(timer);
  timer = null;
  timeElapsed = 0;
  timeEl.textContent = formatTime(timeElapsed);
  started = false;
  winOverlay.classList.add("hidden");
}

function buildDeck(){
  deck = [...EMOJIS, ...EMOJIS].map((val, idx) => ({
    id: idx + ":" + val,
    value: val,
    matched: false
  }));
  shuffle(deck);
}

function shuffle(array){
  // Fisher-Yates
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderBoard(){
  boardEl.innerHTML = "";
  deck.forEach((card, index) => {
    const cardEl = document.createElement("button");
    cardEl.className = "card";
    cardEl.setAttribute("data-index", index);
    cardEl.setAttribute("aria-label", "Card");
    cardEl.innerHTML = `
      <div class="cardInner">
        <div class="cardFace face-front">${card.value}</div>
        <div class="cardFace face-back">❓</div>
      </div>
    `;
    cardEl.addEventListener("click", onCardClick);
    boardEl.appendChild(cardEl);
  });
}

function onCardClick(evt){
  const target = evt.currentTarget;
  if(lockBoard) return;
  const idx = Number(target.dataset.index);
  const card = deck[idx];
  if(card.matched) return;
  if(target === firstCard) return; // clicking same card
  // start timer on first user interaction
  if(!started){ startTimer(); started = true; }

  flipCard(target);

  if(!firstCard){
    firstCard = target;
    return;
  }

  secondCard = target;
  lockBoard = true;
  moves += 1;
  movesEl.textContent = moves;

  const firstIdx = Number(firstCard.dataset.index);
  const secondIdx = Number(secondCard.dataset.index);

  if(deck[firstIdx].value === deck[secondIdx].value){
    // match
    deck[firstIdx].matched = true;
    deck[secondIdx].matched = true;
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches += 1;
    resetSelection();
    if(matches === EMOJIS.length){
      win();
    }
  } else {
    // not a match -> flip back
    setTimeout(() => {
      unflipCard(firstCard);
      unflipCard(secondCard);
      resetSelection();
    }, 900);
  }
}

function flipCard(el){
  el.classList.add("flipped");
}

function unflipCard(el){
  el.classList.remove("flipped");
}

function resetSelection(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer(){
  timer = setInterval(() => {
    timeElapsed += 1;
    timeEl.textContent = formatTime(timeElapsed);
  }, 1000);
}

function stopTimer(){
  if(timer) clearInterval(timer);
  timer = null;
}

function formatTime(s){
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

function win(){
  stopTimer();
  // small delay to allow last card animation
  setTimeout(() => {
    winSummary.textContent = `Time: ${formatTime(timeElapsed)} • Moves: ${moves}`;
    winOverlay.classList.remove("hidden");
  }, 450);
}

// controls
restartBtn.addEventListener("click", () => {
  init();
});

playAgain.addEventListener("click", () => {
  init();
});

// initialize first time
init();