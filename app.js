let score = 0;
let wrongAnswers = 0;
let currentNote = '';
let currentClef = '';

// DOM references
const feedbackElement = document.getElementById('feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Keyboard input handler (REVISED WITH TIMEOUT)
document.querySelectorAll('.keyboard button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedNote = e.target.dataset.note;
    
    if (selectedNote === currentNote) {
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
      if (wrongAnswers >= 7) endGame();
    }

    // Delay new question until feedback animation completes
    setTimeout(() => {
      newQuestion();
    }, 1500); // Matches the 1.5s fadeOut animation
  });
});

// Feedback system
function showFeedback(type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = type;
  feedbackElement.style.display = 'block';
  
  // Reset animation
  void feedbackElement.offsetWidth; // Trigger reflow
  feedbackElement.style.animation = 'none';
  feedbackElement.style.animation = 'fadeOut 1.5s forwards';
}

// Game initialization
document.getElementById('start-game').addEventListener('click', () => {
  score = 0;
  wrongAnswers = 0;
  currentNote = '';
  currentClef = '';
  
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  newQuestion();
});

// Image path helper (FIXED TREBLE SPELLING)
function getImagePath(clef, note, suffix) {
  return `images/${clef}-${note}0(${suffix}).PNG`;
}

// CORRECTED Question generator (keeping "Trebel" spelling)
function newQuestion() {
  currentClef = Math.random() < 0.5 ? 'Trebel' : 'Bass'; // Matches image filenames
  const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  
  const maxSuffix = 7;
  const suffix = Math.min(wrongAnswers + 1, maxSuffix);
  
  const imagePath = getImagePath(currentClef, currentNote, suffix);
  document.getElementById('composer-image').innerHTML = 
    `<img src="${imagePath}" alt="Note ${currentNote}" onerror="handleImageError(this)">`;
}


// CORRECTED helper function (keep "Trebel")
function getImagePath(clef, note, suffix) {
  return `images/${clef}-${note}0(${suffix}).PNG`; // Maintains existing spelling
}

// End game handling
function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  if (isTop5Score(score)) {
    document.getElementById('high-score-input').style.display = 'block';
  } else {
    showHighScores();
  }
}

// Score validation
function isTop5Score(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  return highScores.length < 5 || score > highScores[highScores.length - 1]?.score;
}

// Score submission
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

// Display scores
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

// Image error handling
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'images/default.PNG';
}

// Navigation handlers
document.getElementById('show-instructions').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'block';
});

document.getElementById('back-to-menu').addEventListener('click', () => {
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
});
