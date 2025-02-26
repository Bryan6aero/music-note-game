let score = 0;
let wrongAnswers = 0;
let currentAnswer = '';

// DOM references
const feedbackElement = document.getElementById('feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const keyboardContainer = document.querySelector('.keyboard');

// Possible options for the new questions
const clefs = ['Bass', 'Treble'];
const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const accidentals = ['flat', 'natural', 'sharp'];

// Helper: Format the answer string (omit "natural" for button display)
function formatAnswer(clef, note, accidental) {
  return accidental === 'natural' ? `${clef} ${note}` : `${clef} ${note} ${accidental}`;
}

// Helper: Get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a new question
function newQuestion() {
  // Choose a random clef, note, and accidental
  const clef = clefs[getRandomInt(0, clefs.length - 1)];
  const note = notes[getRandomInt(0, notes.length - 1)];
  const accidental = accidentals[getRandomInt(0, accidentals.length - 1)];

  // Set the correct answer (formatted)
  currentAnswer = formatAnswer(clef, note, accidental);

  // Choose a random variant (0 to 3) and a suffix equal to wrongAnswers (clamped to 6)
  const variant = getRandomInt(0, 3);
  const suffix = wrongAnswers > 6 ? 6 : wrongAnswers; 

  // Build the image path from the new folder and file naming scheme
  const imagePath = `note-images/${clef} ${note} ${accidental} ${variant} ${suffix} Wrong.jpg`;
  document.getElementById('composer-image').innerHTML = 
    `<img src="${imagePath}" alt="Note ${currentAnswer}" onerror="handleImageError(this)">`;

  // Build answer options: include the correct answer and add distractors (all with the same clef)
  const options = new Set();
  options.add(currentAnswer);
  
  // Generate distractor options until we have 7 unique choices
  while(options.size < 7) {
    const randNote = notes[getRandomInt(0, notes.length - 1)];
    const randAccidental = accidentals[getRandomInt(0, accidentals.length - 1)];
    const option = formatAnswer(clef, randNote, randAccidental);
    options.add(option);
  }
  
  // Convert to array and shuffle the options
  const optionsArray = Array.from(options);
  for (let i = optionsArray.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
  }
  
  // Render the buttons dynamically inside the keyboard container
  keyboardContainer.innerHTML = '';
  optionsArray.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.setAttribute('data-answer', option);
    // (Additional inline styling can be removed if your CSS already styles .keyboard button)
    button.style.padding = "15px 30px";
    button.style.fontSize = "1.3rem";
    keyboardContainer.appendChild(button);
  });
}

// Event delegation for answer button clicks
keyboardContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const selectedAnswer = e.target.getAttribute('data-answer');
    if (selectedAnswer === currentAnswer) {
      // Correct answer handling
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      showFeedback('correct', 'Correct!');
      correctSound.play();
    } else {
      // Wrong answer handling
      wrongAnswers++;
      showFeedback('wrong', "Sorry, but that's not right.");
      wrongSound.play();
      if (wrongAnswers >= 7) {
        endGame();
        return;
      }
    }
    // Delay before the next question to allow feedback animation
    setTimeout(() => {
      newQuestion();
    }, 1500);
  }
});

// Feedback system remains the same
function showFeedback(type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = type;
  feedbackElement.style.display = 'block';
  
  // Restart animation
  void feedbackElement.offsetWidth;
  feedbackElement.style.animation = 'none';
  feedbackElement.style.animation = 'fadeOut 1.5s forwards';
}

// Start game initialization (resets score and wrongAnswers, shows game screen, and starts first question)
document.getElementById('start-game').addEventListener('click', () => {
  score = 0;
  wrongAnswers = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  newQuestion();
});

// End game handling (remains as before)
function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  if (isTop5Score(score)) {
    document.getElementById('high-score-input').style.display = 'block';
  } else {
    showHighScores();
  }
}

// Score validation and high score submission remain unchanged
function isTop5Score(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  return highScores.length < 5 || score > highScores[highScores.length - 1]?.score;
}

document.getElementById('submit-score').addEventListener('click', () => {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim();
  
  if (name === '') {
    alert('Please enter your name.');
    return;
  }
  
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push({ name, score });
  highScores.sort((a, b) => b.score - a.score);
  const updatedScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(updatedScores));
  
  nameInput.value = '';
  showHighScores();
});

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoresHTML = highScores.map((entry, index) => 
    `<div>${index + 1}. ${entry.name}: ${entry.score}</div>`
  ).join('');
  
  document.getElementById('high-scores').innerHTML = highScoresHTML;
  document.getElementById('high-scores').style.display = 'block';
  document.getElementById('high-score-input').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
}

// Image error handling (remains similar)
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'images/default.PNG';
}

// Navigation handlers for instructions remain the same
document.getElementById('show-instructions').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'block';
});

document.getElementById('back-to-menu').addEventListener('click', () => {
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
});
