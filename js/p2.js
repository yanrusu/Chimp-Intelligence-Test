var numbers = [];
var gameStarted = false;
var startButton = document.getElementById("startButton");
var numbersContainer = document.getElementById("numbersContainer");
var containerWidth = numbersContainer.offsetWidth;
var containerHeight = numbersContainer.offsetHeight;
var startTime;
var elapsedTime;
var timerDisplay = document.getElementById("time");
var besttime = document.getElementById('besttime2');
var currentnumber;
var timerInterval;
var clickstart = startGame;
var clickready = changenumberbackground;
var checkready = false;

function startGame() {
    gameStarted = true;
    // startButton.disabled = true;
    numbersContainer.innerHTML = "";
    generateNumbers();
    currentnumber = 0; 
    startTime = Date.now();
    updateTimer();
    startButton.removeEventListener("click",clickstart);
}

function generateNumbers() {
    var allNumbers = Array.from({ length: 9 }, (_, i) => i + 1); 
    shuffleArray(allNumbers); 
    numbers = allNumbers.slice(0, 5); 
    numbers.sort((a, b) => a - b); 
    displayNumbers();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function changenumberbackground(){
    var elements = document.getElementsByClassName("number");
    for(var i=0;i<elements.length;i++){
        elements[i].style.color = "rgb(42, 36, 36)";
    }
    startButton.disabled = true;
    startButton.style.visibility = "hidden";
    checkready = true;
    startButton.removeEventListener("click",clickready);
}

function displayNumbers() {
    // startButton.style.visibility = "hidden";
    startButton.innerHTML = "Ready";
    startButton.addEventListener("click", changenumberbackground);
    numbersContainer.innerHTML = "";
    const usedPositions = [];

    numbers.forEach(number => {
        var numberDiv = document.createElement("div");
        numberDiv.textContent = number;
        numberDiv.classList.add("number");

        var posX, posY;
        do {
            posX = Math.floor(Math.random() * (containerWidth - 65));
            posY = Math.floor(Math.random() * (containerHeight - 65));
        } while (checkOverlap(posX, posY, usedPositions));

        numberDiv.style.left = posX + "px";
        numberDiv.style.top = posY + "px";
        usedPositions.push({ x: posX, y: posY });

        numberDiv.addEventListener("click", () => {
            if (gameStarted && checkready && parseInt(numberDiv.textContent) === numbers[currentnumber]) {
                numberDiv.remove();
                currentnumber++;
                if (currentnumber >= numbers.length) { // 检查是否点击了所有数字
                    endGame();
                }
            }
        });
        numbersContainer.appendChild(numberDiv);
    });
}

function checkOverlap(posX, posY, positions) {
    for (var position of positions) {
        if (Math.abs(posX - position.x) < 70 && Math.abs(posY - position.y) < 70) {
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
    updateBestTime(elapsedTime);
    timerDisplay.textContent = `Time：${elapsedTime.toFixed(2)}s`;
    startButton.disabled = false;
    startButton.style.visibility = "visible";
    startButton.innerHTML = "Start Game";
    startButton.addEventListener("click",clickstart);
    checkready = false;
    numbersContainer.innerHTML = `<h2>Game Over</h2>`;
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

function getBestTime() {
    return localStorage.getItem("besttime2");
}

function saveBestTime(time) {
    localStorage.setItem("besttime2", time);
}

function displayBestTime() {
    var time = getBestTime();
    if (time == null) {
        besttime.textContent = "Best Time：0s";
    } else {
        besttime.textContent = `Best Time：${time}s`;
    }
}

function updateBestTime(elapsedTime) {
    var time = getBestTime();
    if (time == null || elapsedTime < parseFloat(time)) {
        saveBestTime(elapsedTime.toFixed(2));
        displayBestTime();
    }
}

window.addEventListener("resize", debounce(() => {
    containerWidth = numbersContainer.offsetWidth;
    containerHeight = numbersContainer.offsetHeight;
    if (gameStarted) {
        displayNumbers();
    }
}, 200));

startButton.addEventListener("click", startGame);
displayBestTime();

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}
