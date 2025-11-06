// JavaScript Number Guessing Game with enhancements

// Global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const timeArr = [];
let userName = "";
let roundStartTime;
let timerInterval;

// DOM element references
const nameInput = document.getElementById("name");
const dateEl = document.getElementById("date");
const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUp");
const guessInput = document.getElementById("guess");
const msg = document.getElementById("msg");
const wins = document.getElementById("wins");
const avgScore = document.getElementById("avgScore");
const roundTimer = document.getElementById("roundTimer");
const fastestTimeEl = document.getElementById("fastestTime");
const avgTimeEl = document.getElementById("avgTime");
const leaderboardItems = document.getElementsByName("leaderboard");

// Update date and time every second with month name and day suffix
function updateDateTime(){
    const d = new Date();
    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    const monthName = monthNames[d.getMonth()];
    const day = d.getDate();
    const suffix = getDaySuffix(day);
    const year = d.getFullYear();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    // pad minutes and seconds
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;
    dateEl.textContent = monthName + " " + day + suffix + ", " + year + " " + hours + ":" + minutes + ":" + seconds;
}
function getDaySuffix(day){
    if(day % 10 === 1 && day !== 11) return "st";
    if(day % 10 === 2 && day !== 12) return "nd";
    if(day % 10 === 3 && day !== 13) return "rd";
    return "th";
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

function toProperCase(str) {
  return str.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(" ");
}

// Start a new game
function play(){
    // capture user name
    userName = toProperCase(nameInput.value.trim());
    score = 0;
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guessInput.disabled = false;
    giveUpBtn.disabled = false;
    // disable level radios and find selected value
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = parseInt(levelArr[i].value);
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = (userName ? userName + ", g" : "G") + "uess a number from 1-" + level;
    answer = Math.floor(Math.random()*level) + 1;
    guessInput.placeholder = "";
    // start round timer
    roundStartTime = Date.now();
    roundTimer.textContent = "Current round time: 0s";
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - roundStartTime)/1000);
        roundTimer.textContent = "Current round time: " + elapsed + "s";
    }, 1000);
}

// Handle user guess
function makeGuess(){
    const userGuess = parseInt(guessInput.value);
    // Validate input
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number 1-" + level;
        guessInput.value = "";
        return;
    }
    score++;
    // too low
    if(userGuess < answer){
        msg.textContent = "Too low! " + getTemperatureHint(answer - userGuess);
    }
    // too high
    else if(userGuess > answer){
        msg.textContent = "Too high! " + getTemperatureHint(userGuess - answer);
    }
    // correct guess
    else{
        const evalMsg = evaluateScore(score);
        msg.textContent = "You got it " + (userName || "Player") + "! It took you " + score + " tries. " + evalMsg + ". Press play to play again.";
        endGame(true);
    }
    guessInput.value = "";
}

// Provide a temperature hint based on the difference
function getTemperatureHint(diff){
    if(diff <= Math.max(1, Math.floor(level * 0.05))){
        return "🔥 Hot!";
    } else if(diff <= Math.max(2, Math.floor(level * 0.2))){
        return "Warm.";
    } else {
        return "Cold.";
    }
}

// Evaluate score as Good/OK/Bad
function evaluateScore(tries){
    if(tries <= Math.ceil(level * 0.1)){
        return "Excellent job";
    } else if(tries <= Math.ceil(level * 0.3)){
        return "Good job";
    } else {
        return "Keep practicing";
    }
}

// When user gives up
function giveUp(){
    msg.textContent = "You gave up! The number was " + answer + ". Press play to try again.";
    // set score equal to level as penalty
    score = level;
    endGame(false);
}

// End game tasks
function endGame(won){
    clearInterval(timerInterval);
    guessBtn.disabled = true;
    guessInput.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    // enable level radios for next game
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
    // update score and leaderboard even if user gave up
    updateScore();
    updateTimeStats();
}

// Update leaderboard and average score
function updateScore(){
    scoreArr.push(score);
    scoreArr.sort((a,b)=>a-b); // ascending order
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    for(let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < leaderboardItems.length){
            leaderboardItems[i].textContent = scoreArr[i];
        }
    }
    const avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

// Update time statistics: fastest and average time
function updateTimeStats(){
    // time spent in seconds
    const timeSpent = (Date.now() - roundStartTime) / 1000;
    timeArr.push(timeSpent);
    // compute fastest
    const fastest = Math.min(...timeArr);
    const total = timeArr.reduce((acc, curr) => acc + curr, 0);
    const avgTime = total / timeArr.length;
    if(fastestTimeEl){
        fastestTimeEl.textContent = "Fastest Game: " + fastest.toFixed(2) + "s";
    }
    if(avgTimeEl){
        avgTimeEl.textContent = "Average Time per Game: " + avgTime.toFixed(2) + "s";
    }
}
