var numbers = [];
var gameStarted = false;
var startButton = document.getElementById('startButton');
var numbersContainer = document.getElementById('numbersContainer');
var containerWidth = numbersContainer.offsetWidth;
var containerHeight = numbersContainer.offsetHeight;
var startTime;
var elapsedTime;
var timerDisplay = document.getElementById('timer');
var currentNumber;
var timerInterval;

function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    numbersContainer.innerHTML = '';
    currentNumber = 1;
    generateNumbers();
    startTime = Date.now();
    updateTimer();
}

function generateNumbers() {
    numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    shuffleArray(numbers);
    displayNumbers();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayNumbers() {
    var currentNumber = 1;
    startButton.style.visibility = 'hidden';
    numbersContainer.innerHTML = '';
    const usedPositions = [];
    var h1height = document.querySelector("h1").offsetHeight;

    numbers.forEach(number => {
        var numberDiv = document.createElement('div');
        numberDiv.textContent = number;
        numberDiv.classList.add('number');

        var posX, posY;
        do {
            posX = Math.floor(Math.random() * (containerWidth - 60));
            posY = Math.floor(Math.random() * (containerHeight - 60));
        } while (checkOverlap(posX, posY, usedPositions));

        numberDiv.style.left = posX + 'px';
        numberDiv.style.top = posY + h1height + 'px';
        usedPositions.push({ x: posX, y: posY });

        numberDiv.addEventListener('click', () => {
            if (gameStarted && parseInt(numberDiv.textContent) === currentNumber) {
                numberDiv.remove();
                currentNumber++;
                if (currentNumber > 9) {
                    endGame();
                }
            }
        });
        numbersContainer.appendChild(numberDiv);
    });
}

function checkOverlap(posX, posY, positions) {
    for (var position of positions) {
        if (Math.abs(posX - position.x) < 60 && Math.abs(posY - position.y) < 60) {
            return true;
        }
    }
    return false;
}

function endGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    var endTime = Date.now(); 
    elapsedTime = (endTime - startTime) / 1000; 
    timerDisplay.textContent = `Time：${elapsedTime.toFixed(2)}s`;
    startButton.disabled = false;
    startButton.style.visibility = 'visible';
    numbersContainer.innerHTML = `<h2>Game Over!</h2>`;
}

function updateTimer() {
    timerInterval = setInterval(() => {
        if (gameStarted) {
            var currentTime = Date.now();
            elapsedTime = (currentTime - startTime) / 1000; 
            timerDisplay.textContent = `Time：${elapsedTime.toFixed(2)}s`; 
        }
    }, 100);
}

window.addEventListener('resize', debounce(() => {
    containerWidth = numbersContainer.offsetWidth;
    containerHeight = numbersContainer.offsetHeight;
    if (gameStarted) {
        displayNumbers();
    }
}, 200));

startButton.addEventListener('click', startGame);

function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
