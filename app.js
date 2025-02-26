/************************************************************
 * Global Variables
 ************************************************************/
let score = 0;
let wrongAnswers = 0;
let currentAnswer = '';
let currentDifficulty = 'easy'; // set by user's radio button

// DOM references
const feedbackElement = document.getElementById('feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const keyboardContainer = document.querySelector('.keyboard');

/************************************************************
 * 1) Difficulty Map: prefix -> 'easy' | 'medium' | 'hard'
 *    "prefix" = first 4 tokens from your file name
 *    Example file: "Bass A flat 0 2 Wrong.jpg" => prefix: "Bass A flat 0"
 *
 *    Fill in all your real prefixes below. This is just an example.
 ************************************************************/
const difficultyMap = {
"Middle C natural 0": "hard",
"Middle C sharp 0": "hard",
"Middle C flat 0": "hard",

"Treble D natural 0": "hard",
"Treble C natural 0": "hard",
"Treble B natural 0": "hard",
"Treble A natural 0": "hard",
"Treble G natural 0": "hard",
"Treble F natural 0": "easy",
"Treble E natural 0": "easy",
"Treble D natural 1": "easy",
"Treble C natural 1": "easy",
"Treble B natural 1": "easy",
"Treble A natural 1": "easy",
"Treble G natural 1": "easy",
"Treble F natural 1": "easy",
"Treble E natural 1": "easy",
"Treble D natural 2": "hard",
"Treble C natural 2": "hard",
"Treble B natural 2": "hard",
"Treble A natural 2": "hard",
"Treble G natural 2": "hard",
"Treble F natural 2": "hard",
"Treble E natural 2": "hard",
"Bass A natural 0": "hard",
"Bass G natural 0": "hard",
"Bass F natural 0": "hard",
"Bass E natural 0": "hard",
"Bass D natural 0": "hard",
"Bass C natural 0": "hard",
"Bass B natural 0": "hard",
"Bass A natural 1": "easy",
"Bass G natural 1": "easy",
"Bass F natural 1": "easy",
"Bass E natural 1": "easy",
"Bass D natural 1": "easy",
"Bass C natural 1": "easy",
"Bass B natural 1": "easy",
"Bass A natural 2": "easy",
"Bass G natural 2": "easy",
"Bass F natural 2": "hard",
"Bass E natural 2": "hard",
"Bass A natural 3": "hard",
"Bass G natural 3": "hard",
"Bass F natural 3": "hard",

"Treble D sharp 0": "hard",
"Treble C sharp 0": "hard",
"Treble B sharp 0": "hard",
"Treble A sharp 0": "hard",
"Treble G sharp 0": "hard",
"Treble F sharp 0": "medium",
"Treble E sharp 0": "medium",
"Treble D sharp 1": "medium",
"Treble C sharp 1": "medium",
"Treble B sharp 1": "medium",
"Treble A sharp 1": "medium",
"Treble G sharp 1": "medium",
"Treble F sharp 1": "medium",
"Treble E sharp 1": "medium",
"Treble D sharp 2": "hard",
"Treble C sharp 2": "hard",
"Treble B sharp 2": "hard",
"Treble A sharp 2": "hard",
"Treble G sharp 2": "hard",
"Treble F sharp 2": "hard",
"Treble E sharp 2": "hard",
"Bass A sharp 0": "hard",
"Bass G sharp 0": "hard",
"Bass F sharp 0": "hard",
"Bass E sharp 0": "hard",
"Bass D sharp 0": "hard",
"Bass C sharp 0": "hard",
"Bass B sharp 0": "hard",
"Bass A sharp 1": "medium",
"Bass G sharp 1": "medium",
"Bass F sharp 1": "medium",
"Bass E sharp 1": "medium",
"Bass D sharp 1": "medium",
"Bass C sharp 1": "medium",
"Bass B sharp 1": "medium",
"Bass A sharp 2": "medium",
"Bass G sharp 2": "medium",
"Bass F sharp 2": "hard",
"Bass E sharp 2": "hard",
"Bass A sharp 3": "hard",
"Bass G sharp 3": "hard",
"Bass F sharp 3": "hard",

"Treble D flat 0": "hard",
"Treble C flat 0": "hard",
"Treble B flat 0": "hard",
"Treble A flat 0": "hard",
"Treble G flat 0": "hard",
"Treble F flat 0": "medium",
"Treble E flat 0": "medium",
"Treble D flat 1": "medium",
"Treble C flat 1": "medium",
"Treble B flat 1": "medium",
"Treble A flat 1": "medium",
"Treble G flat 1": "medium",
"Treble F flat 1": "medium",
"Treble E flat 1": "medium",
"Treble D flat 2": "hard",
"Treble C flat 2": "hard",
"Treble B flat 2": "hard",
"Treble A flat 2": "hard",
"Treble G flat 2": "hard",
"Treble F flat 2": "hard",
"Treble E flat 2": "hard",
"Bass A flat 0": "hard",
"Bass G flat 0": "hard",
"Bass F flat 0": "hard",
"Bass E flat 0": "hard",
"Bass D flat 0": "hard",
"Bass C flat 0": "hard",
"Bass B flat 0": "hard",
"Bass A flat 1": "medium",
"Bass G flat 1": "medium",
"Bass F flat 1": "medium",
"Bass E flat 1": "medium",
"Bass D flat 1": "medium",
"Bass C flat 1": "medium",
"Bass B flat 1": "medium",
"Bass A flat 2": "medium",
"Bass G flat 2": "medium",
"Bass F flat 2": "hard",
"Bass E flat 2": "hard",
"Bass A flat 3": "hard",
"Bass G flat 3": "hard",
"Bass F flat 3": "hard"
};

/************************************************************
 * 2) Build arrays for each difficulty
 ************************************************************/
const allPrefixes = Object.keys(difficultyMap);
const easyPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'easy');
const mediumPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'medium');
const hardPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'hard');

/************************************************************
 * Helper function: Return an array of prefixes allowed
 * for a given difficulty (for distractors).
 ************************************************************/
function getAllowedPrefixes(difficulty) {
  if (difficulty === 'easy') {
    return easyPrefixes;
  } else if (difficulty === 'medium') {
    return [...easyPrefixes, ...mediumPrefixes];
  } else {
    // 'hard'
    return [...easyPrefixes, ...mediumPrefixes, ...hardPrefixes];
  }
}

/************************************************************
 * 3) HEAD request to check file existence
 ************************************************************/
async function imageExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok; // true if 200–299
  } catch (err) {
    return false; // network error => treat as non-existent
  }
}

/************************************************************
 * 4) Random integer helper
 ************************************************************/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/************************************************************
 * 5) newQuestion(difficulty) - picks a prefix, checks for
 *    the actual file, and displays it if found.
 ************************************************************/
async function newQuestion(difficulty) {
  const maxTries = 30;
  let tries = 0;

  // Which set of prefixes do we pick from for the question itself?
  // For the question, we pick from the same logic as for distractors:
  let candidatePrefixes = getAllowedPrefixes(difficulty);

  // If no prefixes, show fallback
  if (candidatePrefixes.length === 0) {
    document.getElementById('composer-image').innerHTML =
      '<p style="color:red;">No prefixes found for this difficulty!</p>';
    keyboardContainer.innerHTML = '';
    return;
  }

  while (tries < maxTries) {
    // 1) Pick a random prefix
    const prefix = candidatePrefixes[getRandomInt(0, candidatePrefixes.length - 1)];

    // 2) The 5th token is the number of wrong answers (0–6)
    const wrongIndex = Math.min(wrongAnswers, 6);

    // 3) Build the file name: "<prefix> <wrongIndex> Wrong.jpg"
    const fileName = `${prefix} ${wrongIndex} Wrong.jpg`;
    const imagePath = `note-images/${fileName}`;

    // 4) Check if file exists
    if (await imageExists(imagePath)) {
      // Found a valid file
      document.getElementById('composer-image').innerHTML =
        `<img src="${imagePath}" alt="Note ${prefix}" onerror="handleImageError(this)">`;

      // The correct answer is a user-friendly version of the prefix
      currentAnswer = formatAnswerFromPrefix(prefix);

      // Build the distractor buttons
      buildAnswerButtons(prefix, difficulty);

      return; // done
    }

    tries++;
  }

  // If we get here, no valid image found after maxTries
  document.getElementById('composer-image').innerHTML =
    '<img src="images/default.PNG" alt="No valid image found">';
  keyboardContainer.innerHTML =
    '<p style="color:red;">No valid image found after multiple tries.</p>';
}

/************************************************************
 * 6) Convert prefix to user-facing answer (omitting "natural")
 *    e.g. "Bass A flat 0" => "Bass A flat"
 ************************************************************/
function formatAnswerFromPrefix(prefix) {
  // prefix like "Bass A flat 0"
  const parts = prefix.split(' '); // e.g. ["Bass","A","flat","0"]
  // Remove the last element ("0")
  parts.pop();
  // Optionally remove "natural"
  const i = parts.indexOf('natural');
  if (i >= 0) {
    parts.splice(i, 1);
  }
  // Rejoin
  return parts.join(' ');
}

/************************************************************
 * 7) Build distractor buttons
 *    - Easy => 3 total options
 *    - Medium => 5 total
 *    - Hard => 7 total
 *    - Wrong answers come from the same difficulty set,
 *      and optionally same clef (if you want).
 ************************************************************/
function buildAnswerButtons(correctPrefix, difficulty) {
  // Decide how many total options we want
  let numOptions;
  if (difficulty === 'easy') {
    numOptions = 3;
  } else if (difficulty === 'medium') {
    numOptions = 5;
  } else {
    // 'hard'
    numOptions = 7;
  }

  const correctAnswer = formatAnswerFromPrefix(correctPrefix);

  // We'll store final answers in a Set for uniqueness
  const options = new Set();
  options.add(correctAnswer);

  // If you still want distractors from the same clef only:
  const clef = correctPrefix.split(' ')[0]; // "Treble" or "Bass" or "Middle"
  
  // Among the allowed prefixes for this difficulty:
  const allowedPrefixes = getAllowedPrefixes(difficulty);

  // Filter them to only those that start with the same clef, if desired
  const sameClefAllowed = allowedPrefixes.filter(p => p.startsWith(clef + ' '));

  // Add random distractors from that subset
  while (options.size < numOptions && sameClefAllowed.length > 0) {
    const randomPick = sameClefAllowed[getRandomInt(0, sameClefAllowed.length - 1)];
    const distractor = formatAnswerFromPrefix(randomPick);
    if (distractor !== correctAnswer) {
      options.add(distractor);
    }
  }

  // Convert to array & shuffle
  const answers = Array.from(options);
  for (let i = answers.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  // Render as buttons
  keyboardContainer.innerHTML = '';
  answers.forEach(answerText => {
    const btn = document.createElement('button');
    btn.textContent = answerText;
    btn.dataset.answer = answerText;
    keyboardContainer.appendChild(btn);
  });

  // Store the correct answer globally
  currentAnswer = correctAnswer;
}

/************************************************************
 * 8) Event Delegation for answer clicks
 ************************************************************/
keyboardContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const selected = e.target.dataset.answer;
    if (selected === currentAnswer) {
      // Correct
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      showFeedback('correct', 'Correct!');
      correctSound.play();
    } else {
      // Wrong
      wrongAnswers++;
      showFeedback('wrong', "Sorry, but that's not right.");
      wrongSound.play();
      if (wrongAnswers >= 7) {
        endGame();
        return;
      }
    }

    // Wait for feedback fade, then next question
    setTimeout(async () => {
      await newQuestion(currentDifficulty);
    }, 1500);
  }
});

/************************************************************
 * 9) Feedback system
 ************************************************************/
function showFeedback(type, message) {
  feedbackElement.textContent = message;
  feedbackElement.className = type;
  feedbackElement.style.display = 'block';
  
  void feedbackElement.offsetWidth; // reflow
  feedbackElement.style.animation = 'none';
  feedbackElement.style.animation = 'fadeOut 1.5s forwards';
}

/************************************************************
 * 10) Start Game
 ************************************************************/
document.getElementById('start-game').addEventListener('click', async () => {
  // Which difficulty was chosen?
  const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
  currentDifficulty = selectedRadio ? selectedRadio.value : 'easy';

  score = 0;
  wrongAnswers = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';

  // Load the first question
  await newQuestion(currentDifficulty);
});

/************************************************************
 * 11) End Game Handling
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
 * 12) High Score Logic
 ************************************************************/
function isTop5Score(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (highScores.length < 5) return true;
  return score > highScores[highScores.length - 1].score;
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
  const updated = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(updated));
  nameInput.value = '';
  showHighScores();
});

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const html = highScores
    .map((entry, idx) => `<div>${idx + 1}. ${entry.name}: ${entry.score}</div>`)
    .join('');
  
  document.getElementById('high-scores').innerHTML = html;
  document.getElementById('high-scores').style.display = 'block';
  document.getElementById('high-score-input').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
}

/************************************************************
 * 13) Image Error Fallback
 ************************************************************/
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.src = 'images/default.PNG';
}

/************************************************************
 * 14) Navigation for Instructions
 ************************************************************/
document.getElementById('show-instructions').addEventListener('click', () => {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'block';
});

document.getElementById('back-to-menu').addEventListener('click', () => {
  document.getElementById('instructions-page').style.display = 'none';
  document.getElementById('main-menu').style.display = 'block';
});
