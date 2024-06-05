const trebleNotes = ['tC', 'tD', 'tE', 'tF', 'tG', 'tA', 'tB'];
const bassNotes = ['bC', 'bD', 'bE', 'bF', 'bG', 'bA', 'bB'];
const composers = ['bach', 'beethoven', 'mozart', 'schubert', 'tch', 'chopin'];

let score = 0;
let mistakes = 0;
let audioContext;
let currentNote;
let player;

const frequencies = {
    'tC': 523.25,  // C5
    'tD': 587.33,  // D5
    'tE': 659.25,  // E5
    'tF': 698.46,  // F5
    'tG': 783.99,  // G5
    'tA': 880.00,  // A5
    'tB': 987.77,  // B5
    'bC': 261.63,  // C4
    'bD': 293.66,  // D4
    'bE': 329.63,  // E4
    'bF': 349.23,  // F4
    'bG': 392.00,  // G4
    'bA': 440.00,  // A4
    'bB': 493.88   // B4
};

function onYouTubeIframeAPIReady() {
    console.log('YouTube IFrame API Ready');
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'gyqXhf6oOBM', // Replace with your YouTube video ID
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube Player Ready');
    document.getElementById('play-button').onclick = () => {
        event.target.playVideo();
    };
}

function onPlayerError(event) {
    console.error('YouTube Player Error:', event);
}

function generateRandomNote() {
    const allNotes = [...trebleNotes, ...bassNotes];
    const randomIndex = Math.floor(Math.random() * allNotes.length);
    return allNotes[randomIndex];
}

function displayNote() {
    const note = generateRandomNote();
    console.log('Generated note:', note); // Log the generated note
    const noteDisplay = document.getElementById('note-display');
    noteDisplay.innerHTML = `<img src="images/${note}.jpg" alt="${note}">`;
    return note;
}

function createButtons() {
    const buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = '';
    const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    pitches.forEach(pitch => {
        const trebleButton = document.createElement('button');
        trebleButton.textContent = `Treble ${pitch}`;
        trebleButton.onclick = () => handleNoteSelection(`t${pitch}`);
        buttonsDiv.appendChild(trebleButton);

        const bassButton = document.createElement('button');
        bassButton.textContent = `Bass ${pitch}`;
        bassButton.onclick = () => handleNoteSelection(`b${pitch}`);
        buttonsDiv.appendChild(bassButton);
    });
}

function handleNoteSelection(selectedNote) {
    console.log('Selected note:', selectedNote); // Log the selected note
    playNoteAudio(selectedNote);
    checkAnswer(selectedNote);
}

function checkAnswer(selectedNote) {
    const feedback = document.getElementById('feedback');
    if (selectedNote === currentNote) {
        feedback.textContent = 'Correct!';
        score++;
    } else {
        feedback.textContent = 'Try again.';
        mistakes++;
        updateComposerImage();
    }
    console.log('Updated score:', score); // Log the updated score
    updateScore();
    if (mistakes <= composers.length) {
        setTimeout(startGame, 1000); // Call startGame to generate a new note after 1 second
    } else {
        endGame();
    }
}

function updateScore() {
    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
        console.log('Displayed score:', scoreDisplay.textContent); // Log the displayed score
    } else {
        console.error('Score display element not found');
    }
}

function updateComposerImage() {
    if (mistakes <= composers.length) {
        const composer = composers[mistakes - 1];
        const img = document.querySelector(`#composer-${composer}`);
        if (img) {
            img.src = `composer-images/angry-${composer}.webp`;
        } else {
            console.error(`Composer image for ${composer} not found`);
        }
    }
}

function startGame() {
    currentNote = displayNote();
    console.log('Current note:', currentNote); // Log the current note
    createButtons();
    document.getElementById('feedback').textContent = '';
    if (player) {
        console.log('Stopping YouTube video');
        player.stopVideo(); // Stop the YouTube video when the game starts
    }
}

function playNoteAudio(note) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[note]; // Frequency for the note

    oscillator.start();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
    oscillator.stop(audioContext.currentTime + 1);
}

function endGame() {
    document.getElementById('game-content').style.display = 'none';
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over';
    gameOverDiv.innerHTML = `
        <h1>Game Over</h1>
        <p>Your final score is: ${score}</p>
        <button id="play-again-button">Play Again</button>
    `;
    document.body.appendChild(gameOverDiv);
    document.getElementById('play-again-button').onclick = () => {
        gameOverDiv.remove();
        document.getElementById('start-menu').style.display = 'block';
        score = 0;
        mistakes = 0;
        updateScore();
        // Reset all composers to happy images
        composers.forEach(composer => {
            const img = document.querySelector(`#composer-${composer}`);
            if (img) {
                img.src = `composer-images/happy-${composer}.webp`;
            }
        });
    };
}

window.onload = () => {
    const startButton = document.getElementById('start-button');
    startButton.onclick = () => {
        document.getElementById('start-menu').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        startGame();
    };

    // Create a score display element
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.textContent = 'Score: 0';

    // Insert the score display element correctly
    const gameContent = document.getElementById('game-content');
    if (gameContent) {
        gameContent.insertBefore(scoreDisplay, document.getElementById('note-display'));
        console.log('Score display element created and inserted');
    } else {
        console.error('Game content element not found');
    }

    // Add composer images to the game content
    composers.forEach(composer => {
        const img = document.querySelector(`#composer-${composer}`);
        if (!img) {
            console.error(`Composer image element with ID composer-${composer} not found`);
        }
    });
};
