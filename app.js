let score = 0;
let wrongAnswers = 0;
let currentNote = '';
let currentClef = '';


// Add at the top with other DOM references
const feedbackElement = document.getElementById('feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Modify the keyboard input handler
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
    newQuestion();
  });
});

// Add new feedback function
function showFeedback(type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = type;
  feedbackElement.style.display = 'block';
  
  // Reset animation
  void feedbackElement.offsetWidth; // Trigger reflow
  feedbackElement.style.animation = 'none';
  feedbackElement.style.animation = 'fadeOut 1.5s forwards';
}




// Sample high scores (use localStorage in real implementation)
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Start Game
document.getElementById('start-game').addEventListener('click', () => {
  // **Reset game state variables**
  score = 0;
  wrongAnswers = 0;
  currentNote = '';
  currentClef = '';
  
  // **Update score display**
  document.getElementById('score').textContent = `Score: ${score}`;
  
  // **Hide main menu and show game screen**
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  
  // **Generate the first question**
  newQuestion();
});

// Helper Function to Get Image Path
function getImagePath(clef, note, suffix) {
  return `images/${clef}-${note}0(${suffix}).PNG`;
}

// Generate New Question
function newQuestion() {
  currentClef = Math.random() < 0.5 ? 'Trebel' : 'Bass';
  const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  
  // **Cap the suffix to prevent exceeding available images**
  const maxSuffix = 7; // Adjust this number based on your available images
  const suffix = Math.min(wrongAnswers + 1, maxSuffix);
  
  const imagePath = getImagePath(currentClef, currentNote, suffix);
  document.getElementById('composer-image').innerHTML = `<img src="${imagePath}" alt="Note ${currentNote}" onerror="handleImageError(this)">`;
}

// Handle Keyboard Input
document.querySelectorAll('.keyboard button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedNote = e.target.dataset.note;
    if (selectedNote === currentNote) {
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
    } else {
      wrongAnswers++;
      if (wrongAnswers >= 7) endGame();
    }
    newQuestion();
  });
});

// End Game
function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  if (isTop5Score(score)) {
    document.getElementById('high-score-input').style.display = 'block';
  } else {
    showHighScores();
  }
}

// Check for Top 5 Score
function isTop5Score(score) {
  return highScores.length < 5 || score > highScores[highScores.length - 1].score;
}

// Submit High Score
document.getElementById('submit-score').addEventListener('click', () => {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim();
  
  if (name === '') {
    alert('Please enter your name.');
    return;
  }
  
  highScores.push({ name, score });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  
  // **Clear input field**
  nameInput.value = '';
  
  showHighScores();
});

// Display Leaderboard
function showHighScores() {
  const highScoresHTML = highScores.map((entry, index) => 
    `<div>${index + 1}. ${entry.name}: ${entry.score}</div>`
  ).join('');
  document.getElementById('high-scores').innerHTML = highScoresHTML;
  
  // **Show high scores and hide other sections**
  document.getElementById('high-scores').style.display = 'block';
  document.getElementById('high-score-input').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
}

// Handle Image Load Errors
function handleImageError(imgElement) {
  imgElement.onerror = null; // Prevent infinite loop if default image also fails
  imgElement.src = 'images/default.PNG'; // Path to a default image
}

// Show Instructions
document.getElementById('show-instructions').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'block';
});

// Return to Main Menu from Instructions
document.getElementById('back-to-menu').addEventListener('click', () => {
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
});


