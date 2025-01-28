let score = 0;
let wrongAnswers = 0;
let currentNote = '';
let currentClef = '';

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
  
  // **Limit the suffix to the maximum available (e.g., 7)**
  const suffix = Math.min(wrongAnswers + 1, 7); // Adjust '7' based on your available images
  
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
  console.error(`Failed to load image: ${imgElement.src}`);
  alert('An error occurred loading the note image. Please try again.');
  imgElement.onerror = null; // Prevent infinite loop if default image also fails
  imgElement.src = 'images/default.png'; // Path to a default image
}

