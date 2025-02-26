/************************************************************
 * Global Variables
 ************************************************************/
let score = 0;
let wrongAnswers = 0;
let currentAnswer = '';
let currentDifficulty = 'easy'; // will be set on Start Game

// DOM references
const feedbackElement = document.getElementById('feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const keyboardContainer = document.querySelector('.keyboard');

/************************************************************
 * 1) Massive dictionary: prefix -> "easy" | "medium" | "hard"
 *    The "prefix" is everything up to (but not including)
 *    the wrong-answer index and "Wrong.jpg".
 * 
 *    For example, if the file is:
 *      "Treble G flat 2 3 Wrong.jpg"
 *    then the prefix is:
 *      "Treble G flat 2"
 *
 *    This is where we label each prefix as easy/medium/hard.
 ************************************************************/
const difficultyMap = {
  // -- Examples from your list. 
  // -- This is *all* the lines you provided, mapped to easy/medium/hard:

  // Middle C
  "Middle C natural 0": "hard",
  "Middle C sharp 0": "hard",
  "Middle C flat 0": "hard",

  // Treble D natural 0–2
  "Treble D natural 0": "hard",
  "Treble D natural 1": "easy",
  "Treble D natural 2": "hard",

  // Treble C natural 0–2
  "Treble C natural 0": "hard",
  "Treble C natural 1": "easy",
  "Treble C natural 2": "hard",

  // Treble B natural 0–2
  "Treble B natural 0": "hard",
  "Treble B natural 1": "easy",
  "Treble B natural 2": "hard",

  // Treble A natural 0–2
  "Treble A natural 0": "hard",
  "Treble A natural 1": "easy",
  "Treble A natural 2": "hard",

  // Treble G natural 0–2
  "Treble G natural 0": "hard",
  "Treble G natural 1": "easy",
  "Treble G natural 2": "hard",

  // Treble F natural 0–2
  "Treble F natural 0": "easy",
  "Treble F natural 1": "easy",
  "Treble F natural 2": "hard",

  // Treble E natural 0–2
  "Treble E natural 0": "easy",
  "Treble E natural 1": "easy",
  "Treble E natural 2": "hard",

  // Bass A natural 0–3
  "Bass A natural 0": "hard",
  "Bass A natural 1": "easy",
  "Bass A natural 2": "easy",
  "Bass A natural 3": "hard",

  // Bass G natural 0–3
  "Bass G natural 0": "hard",
  "Bass G natural 1": "easy",
  "Bass G natural 2": "easy",
  "Bass G natural 3": "hard",

  // Bass F natural 0–3
  "Bass F natural 0": "hard",
  "Bass F natural 1": "easy",
  "Bass F natural 2": "hard",
  "Bass F natural 3": "hard",

  // Bass E natural 0–2
  "Bass E natural 0": "hard",
  "Bass E natural 1": "easy",
  "Bass E natural 2": "hard",

  // Bass D natural 0–1
  "Bass D natural 0": "hard",
  "Bass D natural 1": "easy",

  // Bass C natural 0–1
  "Bass C natural 0": "hard",
  "Bass C natural 1": "easy",
  // (If you have 2 or 3 for these, add them similarly.)

  // Bass B natural 0–1
  "Bass B natural 0": "hard",
  "Bass B natural 1": "easy",

  // Treble D sharp 0–2
  "Treble D sharp 0": "hard",
  "Treble D sharp 1": "medium",
  "Treble D sharp 2": "hard",

  // Treble C sharp 0–2
  "Treble C sharp 0": "hard",
  "Treble C sharp 1": "medium",
  "Treble C sharp 2": "hard",

  // Treble B sharp 0–2
  "Treble B sharp 0": "hard",
  "Treble B sharp 1": "medium",
  "Treble B sharp 2": "hard",

  // Treble A sharp 0–2
  "Treble A sharp 0": "hard",
  "Treble A sharp 1": "medium",
  "Treble A sharp 2": "hard",

  // Treble G sharp 0–2
  "Treble G sharp 0": "hard",
  "Treble G sharp 1": "medium",
  "Treble G sharp 2": "hard",

  // Treble F sharp 0–2
  "Treble F sharp 0": "medium",
  "Treble F sharp 1": "medium",
  "Treble F sharp 2": "hard",

  // Treble E sharp 0–2
  "Treble E sharp 0": "medium",
  "Treble E sharp 1": "medium",
  "Treble E sharp 2": "hard",

  // Bass A sharp 0–3
  "Bass A sharp 0": "hard",
  "Bass A sharp 1": "medium",
  "Bass A sharp 2": "medium",
  "Bass A sharp 3": "hard",

  // Bass G sharp 0–3
  "Bass G sharp 0": "hard",
  "Bass G sharp 1": "medium",
  "Bass G sharp 2": "medium",
  "Bass G sharp 3": "hard",

  // Bass F sharp 0–3
  "Bass F sharp 0": "hard",
  "Bass F sharp 1": "medium",
  "Bass F sharp 2": "hard",
  "Bass F sharp 3": "hard",

  // Bass E sharp 0–2
  "Bass E sharp 0": "hard",
  "Bass E sharp 1": "medium",
  "Bass E sharp 2": "hard",

  // Bass D sharp 0–1
  "Bass D sharp 0": "hard",
  "Bass D sharp 1": "medium",

  // Bass C sharp 0–1
  "Bass C sharp 0": "hard",
  "Bass C sharp 1": "medium",

  // Bass B sharp 0–1
  "Bass B sharp 0": "hard",
  "Bass B sharp 1": "medium",

  // Treble D flat 0–2
  "Treble D flat 0": "hard",
  "Treble D flat 1": "medium",
  "Treble D flat 2": "hard",

  // Treble C flat 0–2
  "Treble C flat 0": "hard",
  "Treble C flat 1": "medium",
  "Treble C flat 2": "hard",

  // Treble B flat 0–2
  "Treble B flat 0": "hard",
  "Treble B flat 1": "medium",
  "Treble B flat 2": "hard",

  // Treble A flat 0–2
  "Treble A flat 0": "hard",
  "Treble A flat 1": "medium",
  "Treble A flat 2": "hard",

  // Treble G flat 0–2
  "Treble G flat 0": "hard",
  "Treble G flat 1": "medium",
  "Treble G flat 2": "hard",

  // Treble F flat 0–2
  "Treble F flat 0": "medium",
  "Treble F flat 1": "medium",
  "Treble F flat 2": "hard",

  // Treble E flat 0–2
  "Treble E flat 0": "medium",
  "Treble E flat 1": "medium",
  "Treble E flat 2": "hard",

  // Bass A flat 0–3
  "Bass A flat 0": "hard",
  "Bass A flat 1": "medium",
  "Bass A flat 2": "medium",
  "Bass A flat 3": "hard",

  // Bass G flat 0–3
  "Bass G flat 0": "hard",
  "Bass G flat 1": "medium",
  "Bass G flat 2": "medium",
  "Bass G flat 3": "hard",

  // Bass F flat 0–3
  "Bass F flat 0": "hard",
  "Bass F flat 1": "medium",
  "Bass F flat 2": "hard",
  "Bass F flat 3": "hard",

  // Bass E flat 0–2
  "Bass E flat 0": "hard",
  "Bass E flat 1": "medium",
  "Bass E flat 2": "hard",

  // Bass D flat 0–1
  "Bass D flat 0": "hard",
  "Bass D flat 1": "medium",

  // Bass C flat 0–1
  "Bass C flat 0": "hard",
  "Bass C flat 1": "medium",

  // Bass B flat 0–1
  "Bass B flat 0": "hard",
  "Bass B flat 1": "medium",

  // ... If there are any additional lines from your list, include them similarly.
};

/************************************************************
 * 2) Build arrays for each difficulty
 ************************************************************/
const allPrefixes = Object.keys(difficultyMap); // every prefix we know
const easyPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'easy');
const mediumPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'medium');
const hardPrefixes = allPrefixes.filter(p => difficultyMap[p] === 'hard');

/************************************************************
 * 3) Check if an image file exists via HEAD request
 ************************************************************/
async function imageExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok; // true if 200–299
  } catch (err) {
    // e.g. network or CORS error
    return false;
  }
}

/************************************************************
 * 4) Random integer helper
 ************************************************************/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/************************************************************
 * 5) newQuestion(difficulty) - picks from the allowed prefixes
 ************************************************************/
async function newQuestion(difficulty) {
  const maxTries = 30;
  let tries = 0;

  // Build an array of possible prefixes for the chosen difficulty
  // Easy => only easy
  // Medium => easy + medium
  // Hard => easy + medium + hard
  let candidatePrefixes = [];
  if (difficulty === 'easy') {
    candidatePrefixes = easyPrefixes;
  } else if (difficulty === 'medium') {
    candidatePrefixes = [...easyPrefixes, ...mediumPrefixes];
  } else {
    // "hard"
    candidatePrefixes = [...easyPrefixes, ...mediumPrefixes, ...hardPrefixes];
  }

  // If for some reason candidatePrefixes is empty, fallback
  if (candidatePrefixes.length === 0) {
    document.getElementById('composer-image').innerHTML =
      '<p style="color:red;">No prefixes available for this difficulty!</p>';
    keyboardContainer.innerHTML = '';
    return;
  }

  while (tries < maxTries) {
    // Pick a random prefix from the candidate list
    const prefix = candidatePrefixes[getRandomInt(0, candidatePrefixes.length - 1)];

    // Suffix is the number of wrong answers (0–6)
    const suffix = Math.min(wrongAnswers, 6);

    // The final file path is e.g.:
    //   "Treble G sharp 1" + " " + suffix + " Wrong.jpg"
    // => "Treble G sharp 1 2 Wrong.jpg"
    const imagePath = `note-images/${prefix} ${suffix} Wrong.jpg`;

    // Check if it exists
    if (await imageExists(imagePath)) {
      // We found a valid file!
      // Show the image
      document.getElementById('composer-image').innerHTML =
        `<img src="${imagePath}" alt="Note ${prefix}" onerror="handleImageError(this)">`;

      // The correct answer is basically the prefix but omitting the "variant" for user display,
      // or do your old "formatAnswer" logic. If you used to parse (clef, note, accidental),
      // do that here. For simplicity, let's just treat the prefix as the answer:
      currentAnswer = formatAnswerFromPrefix(prefix);

      // Now build distractor buttons
      buildAnswerButtons(prefix);

      return; // done
    }

    tries++;
  }

  // If we reach here, we couldn't find an existing file
  document.getElementById('composer-image').innerHTML =
    '<img src="images/default.PNG" alt="No valid image found">';
  keyboardContainer.innerHTML =
    '<p style="color:red;">No valid image found after multiple tries.</p>';
}

/************************************************************
 * 6) Convert prefix -> user-facing answer
 *    e.g. "Treble F natural 1" -> "Treble F natural"
 *    or omit "natural" if you like.
 ************************************************************/
function formatAnswerFromPrefix(prefix) {
  // prefix is like "Treble G natural 1"
  // let's split:
  const parts = prefix.split(' '); 
  // e.g. parts = ["Treble","G","natural","1"]

  // The last part is the "variant" (0,1,2,3).
  const variant = parts[parts.length - 1]; 
  // everything before that is "Treble G natural"
  const clefAndNote = parts.slice(0, parts.length - 1); 
  // e.g. ["Treble","G","natural"]

  // If you want to remove the word "natural" from the display:
  const accidentalIndex = clefAndNote.findIndex(x => x === 'natural');
  if (accidentalIndex >= 0) {
    // remove that element
    clefAndNote.splice(accidentalIndex, 1);
  }

  // Now re-join
  // e.g. "Treble G"
  return clefAndNote.join(' ');
}

/************************************************************
 * 7) Build distractor buttons (like before)
 *    We'll keep the same logic: 7 total buttons
 ************************************************************/
function buildAnswerButtons(correctPrefix) {
  // Parse out the clef from the prefix to keep them consistent
  // For simplicity, let's just say the first word is always the clef
  // (Though note you have "Middle C" as well—handle that if needed.)
  const parts = correctPrefix.split(' ');
  const clef = parts[0]; // e.g. "Treble" or "Bass" or "Middle"

  // Our "correct answer" is what we show to the user
  const correctAnswer = formatAnswerFromPrefix(correctPrefix);

  // We'll create a set of 7 unique answers: 1 correct + 6 distractors
  const options = new Set();
  options.add(correctAnswer);

  // Just pick 6 random from the entire dictionary that share the same clef, for example
  // Or you can do a more advanced approach. For now let's do a simple approach:
  while (options.size < 7) {
    // pick any prefix that starts with the same clef
    const randomPrefix = allPrefixes.find(p => p.startsWith(clef + ' ')) 
      // this .find(...) is not random. We need a random approach. Let's do a filter + random pick:
      // We'll do:
  }

  // Actually let's do a little function:
  const sameClefPrefixes = allPrefixes.filter(p => p.startsWith(clef + ' '));
  while (options.size < 7) {
    const randomPick = sameClefPrefixes[getRandomInt(0, sameClefPrefixes.length - 1)];
    options.add(formatAnswerFromPrefix(randomPick));
  }

  // Now we have 7 answers. Shuffle them into an array.
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
 * 8) Event Delegation for button clicks
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
  // Figure out which difficulty was chosen
  const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
  currentDifficulty = selectedRadio ? selectedRadio.value : 'easy';

  score = 0;
  wrongAnswers = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';

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
