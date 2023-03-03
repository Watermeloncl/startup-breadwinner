var r = document.querySelector(':root');
var s = r.style;
var playerLeft = -1;
var playerTop = 99;
var pauseable = false;
var started = false;
var timer;
var Germs = [];
var horizontalGrid = [];
var verticalGrid = [];
var buttonPressed = false;
var level = 1;
var lives = 3;
var timeLeft = 10;
var frame = 0;
var timeScore = 0;

function setup(makeGrid) {
  let firstLeft = ((Math.floor(Math.random() * 47)) * 2) + 2;
  let firstTop = ((Math.floor(Math.random() * 47)) * 2) + 2;
  r.style.setProperty('--germ1Left', firstLeft + '%');
  r.style.setProperty('--germ1Top', firstTop + '%');

  levelElement = document.querySelector("#levelText").textContent = "Level " + level;

  const newGerm = {number: 1, left: firstLeft, top: firstTop, leftDirection: 2, topDirection: 2, flip: 1};

  Germs.push(newGerm);

  createGridArray();
  if(makeGrid) {
    createGrid();
  }
}

function createGridArray() {
  for(let i = 0; i < 50; i++) {
    var newArrayH = [];
    var newArrayV = [];
    newArrayH.length = 51;
    newArrayV.length = 51;
    newArrayH.fill(0);
    newArrayV.fill(0);
    newArrayH[0] = 2;
    newArrayH[50] = 2;
    newArrayV[0] = 2;
    newArrayV[50] = 2;
    horizontalGrid.push(newArrayH);
    verticalGrid.push(newArrayV);
  }
}

function createGrid() {
  const gridContainer = document.querySelector('#gridContainer');
  const gridContainer2 = document.createElement('div');

  gridContainer2.id = "gridContainer2";

  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      const newDiv = document.createElement('div');
      newDiv.className = "grid horizontal";
      newDiv.id = "h" + i + "_" + j;
      newDiv.style.left = (i * 2) + '%';
      newDiv.style.top = (j * 2) + '%';
      gridContainer2.appendChild(newDiv);
    }
  }

  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      const newDiv = document.createElement('div');
      newDiv.className = "grid vertical";
      newDiv.id = "v" + i + "_" + j;
      newDiv.style.left = (j * 2) + '%';
      newDiv.style.top = (i * 2) + '%';
      gridContainer2.appendChild(newDiv);
    }
  }

  gridContainer.appendChild(gridContainer2);
}

function startGame() {
  s.setProperty('--startBackgroundDisplay', "none");
  pauseable = true;
  started = true;
  moveGerms();
}

function moveGerms() {
  timer = setInterval(move, 20);  //Change to an update/redraw function?
  started = true;
}

function pauseGerms() {
  clearInterval(timer);
}

function move() {
  keepTime();

  let flipTop;
  let flipLeft;
  let gridValue;
  let gridValue2;
  for (let [i, germ] of Germs.entries()) {

    //new rebound
    flipTop = 0;
    flipLeft = 0;
    if((gridValue = horizontalGrid[((germ.left + 1) / 2) + (germ.leftDirection / 4)][(germ.top + 2 + germ.topDirection) / 2]) != 0) {
      if(gridValue == 1) {
        loseLife();
      }
      germ.topDirection = germ.topDirection * -1;
      flipTop = 1;
    }

    if((gridValue = verticalGrid[((germ.top + 1) / 2) + (germ.topDirection / 4)][(germ.left + 2 + germ.leftDirection) / 2]) != 0) {
      if(gridValue == 1) {
        loseLife();
      }
      germ.leftDirection = germ.leftDirection * -1;
      flipLeft = 1;
    }

    if((flipTop == 0) && (flipLeft == 0)) {
      if((germ.left > 0) && (germ.left < 96) && (germ.top > 0) && (germ.top < 96)) {
        if(((gridValue = horizontalGrid[((germ.left + 1) / 2) + (germ.leftDirection * 0.75)][(germ.top + 2 + germ.topDirection) / 2]) != 0) &&
          ((gridValue2 = verticalGrid[((germ.top + 1) / 2) + (germ.topDirection * 0.75)][(germ.left + 2 + germ.leftDirection) / 2]) != 0)) {
            if((gridValue == 1) || gridValue2 == 1) {
              loseLife();
            }
            germ.topDirection = germ.topDirection * -1;
            germ.leftDirection = germ.leftDirection * -1;
        }
      }
    }

    germ.left = germ.left + germ.leftDirection;
    germ.top = germ.top + germ.topDirection;

    s.setProperty("--germ" + germ.number + "Left", germ.left + '%');
    s.setProperty("--germ" + germ.number + "Top", germ.top + '%');
  }
}

function keyPressed(e) {
  if(started) {
    switch (e.code) {
      case "ArrowRight":
      case "KeyD":
        if(isValid("right")) {
          playerLeft = playerLeft + 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] = 1;
          let idToFind = "#h" + ((playerLeft - 1) / 2) + "_" + ((playerTop + 1) / 2);
          const divFound = document.querySelector(idToFind).style;
          divFound.setProperty('opacity', '1');
        }
        break;

      case "ArrowLeft":
      case "KeyA":
        if(isValid("left")) {
          playerLeft = playerLeft - 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] = 1;
          let idToFind = "#h" + ((playerLeft + 1) / 2) + "_" + ((playerTop + 1) / 2);
          const divFound = document.querySelector(idToFind).style;
          divFound.setProperty('opacity', '1');
        }
        break;

      case "ArrowUp":
      case "KeyW":
        if(isValid("up")) {
          playerTop = playerTop - 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] = 1;
          let idToFind = "#v" + ((playerTop + 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind).style;
          divFound.setProperty('opacity', '1');
        }
        break;

      case "ArrowDown":
      case "KeyS":
        if(isValid("down")) {
          playerTop = playerTop + 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] = 1;
          let idToFind = "#v" + ((playerTop - 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind).style;
          divFound.setProperty('opacity', '1');
        }
        break;

      default:
    }
  }
}

function isValid(direction) {
  switch(direction) {
    case "right":
      if(playerLeft < 99) {
        if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] == 1) {
          return false;
        } else {
          if(playerLeft < 97) {
            if(horizontalGrid[(playerLeft + 3) / 2][(playerTop + 1) / 2] == 1) {
              return false;
            }
          }

          if(playerTop > -1) {
            if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 3) / 2] == 1) {
              return false;
            }
          }

          if(playerTop < 99) {
            if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 3) / 2] == 1) {
              return false;
            }
          }

          return true;
        }
      } else {
        return false;
      }
    case "left":
      if(playerLeft > -1) {
        if(horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] == 1) {
          return false;
        } else {
          if(playerLeft > 1) {
            if(horizontalGrid[(playerLeft - 3) / 2][(playerTop + 1) / 2] == 1) {
              return false;
            }
          }

          if(playerTop > -1) {
            if(verticalGrid[(playerTop - 1) / 2][(playerLeft - 1) / 2] == 1) {
              return false;
            }
          }

          if(playerTop < 99) {
            if(verticalGrid[(playerTop + 1) / 2][(playerLeft - 1) / 2] == 1) {
              return false;
            }
          }

          return true;
        }
      } else {
        return false;
      }
      break;
    case "up":
      if(playerTop > -1) {
        if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] == 1) {
          return false;
        } else {
          if(playerTop > 1) {
            if(verticalGrid[(playerTop - 3) / 2][(playerLeft + 1) / 2] == 1) {
              return false;
            }
          }

          if(playerLeft > -1) {
            if(horizontalGrid[(playerLeft - 1) / 2][(playerTop - 1) / 2] == 1) {
              return false;
            }
          }

          if(playerLeft < 99) {
            if(horizontalGrid[(playerLeft + 1) / 2][(playerTop - 1) / 2] == 1) {
              return false;
            }
          }

          return true;
        }
      } else {
        return false;
      }
      break;
    case "down":
      if(playerTop < 99) {
        if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] == 1) {
          return false;
        } else {
          if(playerTop < 97) {
            if(verticalGrid[(playerTop + 3) / 2][(playerLeft + 1) / 2] == 1) {
              return false;
            }
          }

          if(playerLeft > -1) {
            if(horizontalGrid[([playerLeft] - 1) / 2][(playerTop + 3) / 2] == 1) {
              return false;
            }
          }

          if(playerLeft < 99) {
            if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 3) / 2] == 1) {
              return false;
            }
          }

          return true;
        }
      } else {
        return false;
      }
      break;
    default:
  }
}

function keepTime() {
  frame++;
  if(frame >= 35) {
    frame = 0;
    timeLeft = timeLeft - 1;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let timeLeftFormatted = minutes + ":";
    if(seconds < 10) {
      timeLeftFormatted = timeLeftFormatted + "0";
    }
    timeLeftFormatted = timeLeftFormatted + seconds;

    document.querySelector("#timerText").textContent = timeLeftFormatted;
    
    if(timeLeft == 0) {
      document.querySelector("#timerText").style.setProperty('color', 'red');
      pauseGerms();
      started = false;
      gameOver();
    }
  }
}

function loseLife() {
  pauseGerms(); // stop germs
  started = false;  //player input
  lives--;

  document.querySelector("#livesText").textContent = "❤: " + lives;

  if(lives == 0) {
    document.querySelector("#livesText").style.setProperty('color', 'red');
    gameOver();
  } else {
    playerLeft = -1;
    playerTop = 99;
    r.style.setProperty('--playerLeft', playerLeft + '%');
    r.style.setProperty('--playerTop', playerTop + '%');
  
    for(let i = 0; i < 50; i++) {
      for(let j = 0; j < 51; j++) {
        if(horizontalGrid[i][j] == 1) {
          horizontalGrid[i][j] = 0;
          let idToFind = "#h" + i + "_" + j;
          document.querySelector(idToFind).style.setProperty('opacity', '0');
        }
        if(verticalGrid[i][j] == 1) {
          verticalGrid[i][j] = 0;
          let idToFind = "#v" + i + "_" + j;
          document.querySelector(idToFind).style.setProperty('opacity', '0');
        }
      }
    }

    moveGerms();
  }
}

function gameOver() {
  pauseable = false;
  document.querySelector("#endBackground").style.setProperty('display', 'flex');
  saveScore();
}

function restartGame() {
  horizontalGrid.length = 0;
  verticalGrid.length = 0;
  timeLeft = 120;
  level = 1;
  lives = 3;
  frame = 0;
  timeScore = 0;
  Germs.length = 0;
  playerLeft = -1;
  playerTop = 99;
  r.style.setProperty('--playerLeft', playerLeft + '%');
  r.style.setProperty('--playerTop', playerTop + '%');
  document.querySelector("#timerText").textContent = "2:00";
  document.querySelector("#timerText").style.setProperty("color", "black");
  document.querySelector("#livesText").style.setProperty("color", "black");
  document.querySelector("#coverageText").textContent = "◕: 0%";
  document.querySelector("#livesText").textContent = "❤: 3";
  setup(false);
  document.querySelector("#endBackground").style.setProperty("display", "none");
  pauseable = true;
  started = true;
  moveGerms();
}

function pauseGameButton() {
  if(pauseable) {
    if(started) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
}

function pauseGame() {
  pauseGerms();
  started = false;

  document.querySelector("#pauseButton").style.setProperty("background-color", "#66fc03");
  document.querySelector("#pauseLeft").style.setProperty("display", "none");
  document.querySelector("#pauseRight").style.setProperty("display", "none");
  document.querySelector("#playTriangle").style.setProperty("display", "block");
}

function resumeGame() {
  document.querySelector("#pauseButton").style.setProperty("background-color", "#4da4fa");
  document.querySelector("#pauseLeft").style.setProperty("display", "block");
  document.querySelector("#pauseRight").style.setProperty("display", "block");
  document.querySelector("#playTriangle").style.setProperty("display", "none");

  moveGerms();
}

function saveScore() {
  const userName = localStorage.getItem('userName');
  const date = new Date().toLocaleDateString();
  let scores = [];
  const scoresText = localStorage.getItem('scores');
  if (scoresText) {
    scores = JSON.parse(scoresText);
  }
  const newScore = { name: userName, level: (level - 1), time: timeScore, date: date };

  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (level > prevScore.level) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    } else if(level == prevScore.level) {
      if(timeScore < prevScore.time) {
        scores.splice(i, 0, newScore());
        found = true;
        break;
      }
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 5) {
    scores.length = 5;
  }

  localStorage.setItem('scores', JSON.stringify(scores));
}

setup(true);
document.addEventListener('keyup', e => keyPressed(e));   //TODO: change to "keyup"