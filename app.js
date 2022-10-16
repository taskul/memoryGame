const gameContainer = document.getElementById("game");
let numberOfAttempts = document.getElementById('number-of-attempts');
let countForNumberOfAttempts = 0;
let bestScoreDisplay = document.getElementById('best-score');
const startNewGame = document.getElementById('start-game');
const cardFlipSound = new Audio('sounds/flip.wav');
const correctMatchSound = new Audio('sounds/yes.wav');
const overlay = document.getElementById('overlay');
const userFeedbackGoood = document.getElementById('nice-work');
const userFeedbackBad = document.getElementById('try-again');
let clickingAllowed = true; 

const COLORS = [
  "king.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "king.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png"
];

let numberOfCardPairsLeft = COLORS.length / 2;

if (localStorage.getItem('bestScore')) {
  bestScoreDisplay.textContent = localStorage.getItem('bestScore');
};

startNewGame.addEventListener('click', startGame);

function startGame () {
  countForNumberOfAttempts = 0; 
  numberOfAttempts.textContent = '0';
  numberOfCardPairsLeft = COLORS.length / 2; 
  cardDivs = gameContainer.firstElementChild;
  while (cardDivs) {
    cardDivs.classList.remove('face-up');
    gameContainer.removeChild(cardDivs);
    cardDivs = cardDivs = gameContainer.firstElementChild
  }
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  startNewGame.style.visibility = 'hidden';
  overlay.style.display = 'none';
  document.body.classList.remove('pause');
}
  
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function createDivsForColors(cardArray) {
  for (let card of cardArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(card);
    newDiv.style.content = "url('imgs/card.png')";
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

let firstCardClick = true;
let firstCard = undefined;


function handleCardClick(e) {
  if (!clickingAllowed) return;
  if (!numberOfCardPairsLeft > 0) return;
  if (e.target.tagName === 'DIV') {
    if (firstCardClick) {
      flipCard(e)
      firstCardClick = false; 
      firstCard = e.target; 
    } else {
          if (e.target !== firstCard) { 
              flipCard(e)
              countForNumberOfAttempts++; 
              numberOfAttempts.textContent = countForNumberOfAttempts; 
              if (firstCard.className === e.target.className) {
                  correctMatch(e);
                  clickingAllowed = false;
                  setTimeout(function() {
                      userFeedbackGoood.style.visibility = 'hidden';
                      clickingAllowed = true;
                  },1500)
              }
              else {
                  clickingAllowed = false;
                  userFeedbackBad.style.visibility = 'visible';
                  setTimeout(function(){
                      wrongMatch(e); 
                      firstCardClick = true;
                      userFeedbackBad.style.visibility = 'hidden';
                      clickingAllowed = true;
                  },1500)
                  }
              }
          }
      } 
  } 

document.body.addEventListener('click', function(){
  if (numberOfCardPairsLeft === 0) {
    if (bestScoreDisplay.textContent === '0') updateBestScore(); 
    else if (Number(countForNumberOfAttempts) < Number(bestScoreDisplay.textContent)) updateBestScore(); 
    userFeedbackGoood.style.visibility = 'hidden';
    startNewGame.style.visibility = 'visible';
    overlay.style.display = 'block';
    }
  }
)

function updateBestScore() {
  bestScoreDisplay.textContent = countForNumberOfAttempts;
  localStorage.setItem('bestScore', countForNumberOfAttempts);
}

function flipCard(e) {
    e.target.style.content = `url(imgs/${e.target.className}`;
    e.target.classList.toggle('face-up');
    cardFlipSound.play();
}

function wrongMatch(e) {
    firstCard.style.content = "url('imgs/card.png')";
    e.target.style.content = "url('imgs/card.png')";
    firstCard.classList.toggle('face-up');
    e.target.classList.toggle('face-up'); 
}

function correctMatch(e) {
  correctMatchSound.play();
  firstCard.removeEventListener('click',handleCardClick)
  e.target.removeEventListener('click', handleCardClick)
  numberOfCardPairsLeft--;
  firstCardClick = true; 
  userFeedbackGoood.style.visibility = 'visible'; 
}

