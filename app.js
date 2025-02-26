/************************************************************
 * Global Variables
 ************************************************************/
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

/************************************************************
 * Helper: Check if an image file exists via HEAD request
 ************************************************************/
async function imageExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok; // true if status is 200–299
  } catch (err) {
    // Network or other fetch error => treat as non-existent
    return false;
  }
}

/************************************************************
 * Helper: Return a random integer between min and max (inclusive)
 ************************************************************/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/************************************************************
 * Helper: Format the answer string (omit "natural" for display)
 ************************************************************/
function formatAnswer(clef, note, accidental) {
  // e.g. "Treble A sharp" or "Bass G" (if accidental is "natural")
  return accidental === 'natural'
    ? `${clef} ${note}`
    : `${clef} ${note} ${accidental}`;
}

/************************************************************
 * Shuffle array in place
 ************************************************************/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/************************************************************
 * Get a random valid image path (retry until one exists or maxTries)
 ************************************************************/
async function getRandomValidImagePath() {
  const maxTries = 25;
  let tries = 0;

  while (tries < maxTries) {
    // 1) Pick random clef, note, accidental
    const clef = clefs[getRandomInt(0, clefs.length - 1)];
    const note = notes[getRandomInt(0, notes.length - 1)];
    const accidental = accidentals[getRandomInt(0, accidentals.length - 1)];

    // 2) Pick random variant (0–3), suffix = clamp(wrongAnswers, 0–6)
    const variant = getRandomInt(0, 3);
    const suffix = Math.min(wrongAnswers, 6);

    // 3) Build the path
    //    Make sure it matches exactly how your files are named in note-images/
    const imagePath = `note-images/${clef} ${note} ${accidental} ${variant} ${suffix} Wrong.jpg`;

    // 4) Check if it exists
    if (await imageExists(imagePath)) {
      // If it exists, return info
      return {
        path: imagePath,
        clef,
        note,
        accidental,
      };
    }

    tries++;
  }

  // If we reach here, we never found a valid image in maxTries tries
  return null;
}

/************************************************************
 * Build the distractor buttons, including the correct answer
 ************************************************************/
function buildAnswerButtons(clef, correctAnswer) {
  // We'll keep all answers in a Set for uniqueness
  const options = new Set();
  options.add(correctAnswer);

  // Generate distractor options until we have 7 unique
  while (options.size < 7) {
    const randNote = notes[getRandomInt(0, notes.length - 1)];
    const randAccidental = accidentals[getRandomInt(0, accidentals.length - 1)];
    const distractor = formatAnswer(clef, randNote, randAccidental);
    options.add(distractor);
  }

  // Convert to array and shuffle
  const optionsArray = Array.from(options);
  shuffle(optionsArray);

  // Render the buttons
  keyboardContainer.innerHTML = '';
  optionsArray.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.setAttribute('data-answer', option);
    keyboardContainer.appendChild(button);
  });
}

/************************************************************
 * Create a new question (async, because we do HEAD checks)
 ************************************************************/
async function newQuestion() {
  const imageInfo = await getRandomValidImagePath();
  if (!imageInfo) {
    // Could not find a valid image within maxTries
    // Fallback to a default or show a message
    document.getElementById('composer-image').innerHTML =
      '<img src="images/default.PNG" alt="No valid image found">';
    currentAnswer = '';
    keyboardContainer.innerHTML =
      '<p style="color:red;">No valid image found!</p>';
    return;
  }

  const { path, clef, note, accidental } = imageInfo;
  currentAnswer = formatAnswer(clef, note, accidental);

  // Display the image
  document.getElementById('composer-image').innerHTML =
    `<img src="${path}" alt="Note ${currentAnswer}" onerror="handleImageError(this)">`;

  // Build the 7 answer buttons
  buildAnswerButtons(clef, currentAnswer);
}

/************************************************************
 * Event Delegation for answer clicks
 ************************************************************/
keyboardContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const selectedAnswer = e.target.getAttribute('data-answer');
    if (selectedAnswer === currentAnswer) {
      // Correct answer
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      showFeedback('correct', 'Correct!');
      correctSound.play();
    } else {
      // Wrong answer
      wrongAnswers++;
      showFeedback('wrong', "Sorry, but that's not right.");
      wrongSound.play();
      if (wrongAnswers >= 7) {
        endGame();
        return;
      }
    }
    // Wait for feedback to fade, then next question
    setTimeout(async () => {
      await newQuestion();
    }, 1500);
  }
});

/************************************************************
 * Feedback system
 ************************************************************/
function showFeedback(type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = type;
  feedbackElement.style.display = 'block';
  
  // Reset animation
  void feedbackElement.offsetWidth; // force reflow
  feedbackElement.style.animation = 'none';
  feedbackElement.style.animation = 'fadeOut 1.5s forwards';
}

/************************************************************
 * Start Game
 ************************************************************/
document.getElementById('start-game').addEventListener('click', async () => {
  score = 0;
  wrongAnswers = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  
  // Get first question
  await newQuestion();
});

/************************************************************
 * End Game Handling
 ************************************************************/
function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  if (isTop5Score(score)) {
    document.getElementById('high-score-input').style.display = 'block';
  } else {
    showHighScores();
  }
}

/************************************************************
 * Check if score is in top 5
 ************************************************************/
function isTop5Score(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  return highScores.length < 5 || score > highScores[highScores.length - 1].score;
}

/************************************************************
 * Submit High Score
 ************************************************************/
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

/************************************************************
 * Show High Scores
 ************************************************************/
function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoresHTML = highScores
    .map((entry, index) => `<div>${index + 1}. ${entry.name}: ${entry.score}</div>`)
    .join('');
  
  document.getElementById('high-scores').innerHTML = highScoresHTML;
  document.getElementById('high-scores').style.display = 'block';
  document.getElementById('high-score-input').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
}

/************************************************************
 * Image Error Fallback
 ************************************************************/
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'images/default.PNG';
}

/************************************************************
 * Navigation: Show/Hide Instructions
 ************************************************************/
document.getElementById('show-instructions').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'block';
});

document.getElementById('back-to-menu').addEventListener('click', () => {
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
});
