// Variablen für den Spielzustand
let secretNum = 0;
let maxTries = 7;
let remainingTries = 7;
let history = [];

// DOM-Elemente
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const restartBtn = document.getElementById('restart-btn');

const attemptsLeftSpan = document.getElementById('attempts-left');
const maxAttemptsSpan = document.getElementById('max-attempts');
const gameMessage = document.getElementById('game-message');
const historyBox = document.getElementById('history-box');
const endMessage = document.getElementById('end-message');

// Spiel starten
startBtn.addEventListener('click', () => {
    maxTries = parseInt(difficultySelect.value);
    remainingTries = maxTries;
    secretNum = Math.floor(Math.random() * 100) + 1;
    history = [];

    attemptsLeftSpan.textContent = remainingTries;
    maxAttemptsSpan.textContent = maxTries;
    guessInput.value = '';
    gameMessage.classList.add('hidden');
    historyBox.textContent = 'Keine Versuche bisher.';

    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    guessInput.focus();
});

// Vorschlag prüfen
guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGuess();
});

function handleGuess() {
    const val = guessInput.value.trim();
    if (val === '') return;

    const guess = parseInt(val);

    // Validierung (verbraucht keinen Versuch bei Fehlern)
    if (isNaN(guess)) {
        showMessage("Fehler: Bitte geben Sie eine gültige ganze Zahl ein. (Dieser Fehler verbraucht keinen Versuch).", "error");
        return;
    }

    if (guess < 1 || guess > 100) {
        showMessage("Fehler: Die Zahl muss zwischen 1 und 100 liegen. (Dieser Fehler verbraucht keinen Versuch).", "error");
        return;
    }

    // Zur Historie hinzufügen
    history.push(guess);
    historyBox.textContent = history.join(', ');

    // Vergleich
    if (guess === secretNum) {
        endGame(true);
    } else if (guess < secretNum) {
        remainingTries--;
        attemptsLeftSpan.textContent = remainingTries;
        if (remainingTries === 0) {
            endGame(false);
        } else {
            showMessage("Too Low (Zu niedrig)!", "info");
        }
    } else {
        remainingTries--;
        attemptsLeftSpan.textContent = remainingTries;
        if (remainingTries === 0) {
            endGame(false);
        } else {
            showMessage("Too High (Zu hoch)!", "info");
        }
    }

    guessInput.value = '';
    guessInput.focus();
}

function showMessage(text, type) {
    gameMessage.textContent = text;
    gameMessage.className = `message ${type}`;
}

function endGame(won) {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');

    if (won) {
        endMessage.innerHTML = `🎉 Herzlichen Glückwunsch!<br>Sie haben die geheime Zahl <strong>${secretNum}</strong> erfolgreich erraten!`;
        endMessage.className = "message success";
    } else {
        endMessage.innerHTML = `❌ Schade! Sie haben alle Ihre Versuche aufgebraucht.<br>Die geheime Zahl lautet: <strong>${secretNum}</strong>`;
        endMessage.className = "message error";
    }
}

// Nochmal spielen
restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
});