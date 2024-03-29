var r = document.querySelector(':root');
var s = r.style;

const STARTING_TIME = 180;
const STARTING_LIVES = 5;

var loading = true;
var playerLeft = -1;
var playerTop = 99;
var pauseable = false;
var started = false;
var timer;
var Germs = [];
var horizontalGrid = [];
var verticalGrid = [];
var coverGrid = [];
var buttonPressed = false;
var level = 1;
var lives = STARTING_LIVES;
var timeLeft = STARTING_TIME;
var frame = 0;
var timeScore = 0;
var coverage = 0;
var socket;
var playerName = localStorage.getItem("username");
var scores = [];

async function setup(makeGrid) {
  if(makeGrid) {
    configureWebSocket();
  }
  
  let firstLeft = ((Math.floor(Math.random() * 47)) * 2) + 2;
  let firstTop = ((Math.floor(Math.random() * 47)) * 2) + 2;
  r.style.setProperty('--germ1Left', firstLeft + '%');
  r.style.setProperty('--germ1Top', firstTop + '%');

  levelElement = document.querySelector("#levelText").textContent = "Level " + level;
  levelElement = document.querySelector("#livesText").textContent = "❤:  " + lives;

  let timeString = Math.floor(timeLeft / 60) + ":";
  if(timeLeft % 60 < 10) {
    timeString = timeString + "0";
  }
  timeString = timeString + (timeLeft % 60);

  timeElement = document.querySelector("#timerText").textContent = timeString;

  const newGerm = {number: 1, left: firstLeft, top: firstTop, leftDirection: 2, topDirection: 2, flip: 1};

  Germs.push(newGerm);

  createGridArray();
  createCoverArray();
  if(makeGrid) {
    createGrid();
  }

  if(loading) {
    loading = false;
    document.querySelector('#startButton').textContent = 'Start';
  }

}

function createGridArray() {
  horizontalGrid.length = 0;
  verticalGrid.length = 0;
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

function createCoverArray() {
  coverGrid.length = 0;
  for(let i = 0; i < 50; i++) {
    var newArrayH = [];
    newArrayH.length = 50;
    newArrayH.fill(0);
    coverGrid.push(newArrayH);
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

function start() {
  if(!loading) {
    startGame();
  }
}

function startGame() {
  s.setProperty('--startBackgroundDisplay', "none");
  pauseable = true;
  started = true;

  sendEvent(null, 'start', playerName, 0, 0);
  scores.push({ id: null, name: playerName, level: 0, time: 0 });
  displayScores();
  moveGerms();
}

function moveGerms() {
  timer = setInterval(move, 30);
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
  for (const [i, germ] of Germs.entries()) {

    //new rebound
    flipTop = 0;
    flipLeft = 0;
    if((gridValue = horizontalGrid[((germ.left + 1) / 2) + (germ.leftDirection / 4)][(germ.top + 2 + germ.topDirection) / 2]) != 0) {
      if(gridValue == 1) {
        loseLife();
        break;
      }
      germ.topDirection = germ.topDirection * -1;
      flipTop = 1;
    }

    if((gridValue = verticalGrid[((germ.top + 1) / 2) + (germ.topDirection / 4)][(germ.left + 2 + germ.leftDirection) / 2]) != 0) {
      if(gridValue == 1) {
        loseLife();
        break;
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
              break;
            }
            germ.topDirection = germ.topDirection * -1;
            germ.leftDirection = germ.leftDirection * -1;
        }
      }
    }

    germ.left = germ.left + germ.leftDirection;
    germ.top = germ.top + germ.topDirection;

    document.querySelector("#germ" + germ.number).style.setProperty('left', germ.left + '%');
    document.querySelector("#germ" + germ.number).style.setProperty('top', germ.top + '%');
  }
}

function keyPressed(e) {
  if(started) {
    switch (e.code) {
      case "ArrowRight":
      case "KeyD":
        if(validity = isValid("right")) {
          playerLeft = playerLeft + 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          if((validity == 1) || (validity == 2)) {
            horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] = 1;
            let idToFind = "#h" + ((playerLeft - 1) / 2) + "_" + ((playerTop + 1) / 2);
            const divFound = document.querySelector(idToFind).style;
            divFound.setProperty('opacity', '1');
            if(validity == 2) {
              finishBlock();
            }
          }
        }
        break;

      case "ArrowLeft":
      case "KeyA":
        if(validity = isValid("left")) {
          playerLeft = playerLeft - 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          if((validity == 1) || (validity == 2)) {
            horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] = 1;
            let idToFind = "#h" + ((playerLeft + 1) / 2) + "_" + ((playerTop + 1) / 2);
            const divFound = document.querySelector(idToFind).style;
            divFound.setProperty('opacity', '1');
            if(validity == 2) {
              finishBlock();
            }
          }
        }
        break;

      case "ArrowUp":
      case "KeyW":
        if(validity = isValid("up")) {
          playerTop = playerTop - 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          if((validity == 1) || (validity == 2)) {
            verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] = 1;
            let idToFind = "#v" + ((playerTop + 1) / 2) + "_" + ((playerLeft + 1) / 2);
            const divFound = document.querySelector(idToFind).style;
            divFound.setProperty('opacity', '1');
            if(validity == 2) {
              finishBlock();
            }
          }
        }
        break;

      case "ArrowDown":
      case "KeyS":
        if(validity = isValid("down")) {
          playerTop = playerTop + 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          if((validity == 1) || (validity == 2)) {
            verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] = 1;
            let idToFind = "#v" + ((playerTop - 1) / 2) + "_" + ((playerLeft + 1) / 2);
            const divFound = document.querySelector(idToFind).style;
            divFound.setProperty('opacity', '1');
            if(validity == 2) {
              finishBlock();
            }
          }
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
          return 0;
        } else if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] == 2) {
          return 3;
        } else {
          let twoFound = false;
          if(playerLeft < 97) {
            if(horizontalGrid[(playerLeft + 3) / 2][(playerTop + 1) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[(playerLeft + 3) / 2][(playerTop + 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerTop > -1) {
            if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 3) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 3) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerTop < 99) {
            if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 3) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 3) / 2] == 2) {
              return 2;
            }
          }

          if(twoFound) {
            return 2;
          } else {
            return 1;
          }
        }
      } else {
        return 0;
      }
    case "left":
      if(playerLeft > -1) {
        if(horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] == 1) {
          return 0;
        } else if(horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] == 2) {
          return 3;
        } else {
          let twoFound = false;
          if(playerLeft > 1) {
            if(horizontalGrid[(playerLeft - 3) / 2][(playerTop + 1) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[(playerLeft - 3) / 2][(playerTop + 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerTop > -1) {
            if(verticalGrid[(playerTop - 1) / 2][(playerLeft - 1) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop - 1) / 2][(playerLeft - 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerTop < 99) {
            if(verticalGrid[(playerTop + 1) / 2][(playerLeft - 1) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop + 1) / 2][(playerLeft - 1) / 2] == 2) {
              return 2;
            }
          }

          if(twoFound) {
            return 2;
          } else {
            return 1;
          }
        }
      } else {
        return 0;
      }
      break;
    case "up":
      if(playerTop > -1) {
        if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] == 1) {
          return 0;
        } else if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] == 2) {
          return 3;
        } else {
          let twoFound = false;
          if(playerTop > 1) {
            if(verticalGrid[(playerTop - 3) / 2][(playerLeft + 1) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop - 3) / 2][(playerLeft + 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerLeft > -1) {
            if(horizontalGrid[(playerLeft - 1) / 2][(playerTop - 1) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[(playerLeft - 1) / 2][(playerTop - 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerLeft < 99) {
            if(horizontalGrid[(playerLeft + 1) / 2][(playerTop - 1) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[(playerLeft + 1) / 2][(playerTop - 1) / 2] == 2) {
              return 2;
            }
          }

          if(twoFound) {
            return 2;
          } else {
            return 1;
          }
        }
      } else {
        return 0;
      }
      break;
    case "down":
      if(playerTop < 99) {
        if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] == 1) {
          return 0;
        } else if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] == 2) {
          return 3;
        } else {
          let twoFound = false;
          if(playerTop < 97) {
            if(verticalGrid[(playerTop + 3) / 2][(playerLeft + 1) / 2] == 1) {
              return 0;
            } else if(verticalGrid[(playerTop + 3) / 2][(playerLeft + 1) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerLeft > -1) {
            if(horizontalGrid[([playerLeft] - 1) / 2][(playerTop + 3) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[([playerLeft] - 1) / 2][(playerTop + 3) / 2] == 2) {
              twoFound = true;
            }
          }

          if(playerLeft < 99) {
            if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 3) / 2] == 1) {
              return 0;
            } else if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 3) / 2] == 2) {
              return 2;
            }
          }

          if(twoFound) {
            return 2;
          } else {
            return 1;
          }
        }
      } else {
        return 0;
      }
      break;
    default:
  }
}


var currentLeft;
var currentTop;
var initialLeft;
var initialTop;
var shape;
var shape2;
var lastDirection;
var lastDirection2;
var firstDirection;
var turnRightGerm;
var turnLeftGerm;
function finishBlock() {
  pauseGerms();
  started = false;

  initialLeft = playerLeft;
  initialTop = playerTop;
  currentLeft = playerLeft;
  currentTop = playerTop;
  lastDirection = "none";
  firstDirection = "none";
  shape = (currentLeft + 1) + "% " + (currentTop + 1) + "%";
  //console.log("shape1: " + shape);
  let finished = false;
  turnRightGerm = false;
  turnLeftGerm = false;

  for (let [i, germ] of Germs.entries()) {
    coverGrid[germ.left / 2][germ.top / 2] = -1;
    coverGrid[(germ.left + 2) / 2][germ.top / 2] = -1;
    coverGrid[germ.left / 2][(germ.top + 2) / 2] = -1;
    coverGrid[(germ.left + 2) / 2][(germ.top + 2) / 2] = -1;
  }

  for(;;) {
    for(;;) { //search the four, finding the next red line and turning it brown
      if(currentLeft < 99) {
        if(horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] == 1) {
          horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft + 2;
          lastDirection = "right";
          if(firstDirection == "none") {
            firstDirection = "right";
          }
          shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
          break;
        }
      }

      if(currentTop < 99) {
        if(verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2] == 1) {
          verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop + 2;
          lastDirection = "down";
          if(firstDirection == "none") {
            firstDirection = "down";
          }
          shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
          break;
        }
      }

      if(currentLeft > -1) {
        if(horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2] == 1) {
          horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft - 2;
          lastDirection = "left";
          if(firstDirection == "none") {
            firstDirection = "left";
          }
          shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
          break;
        }
      }

      if(currentTop > -1) {
        if(verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2] == 1) {
          verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop - 2;
          lastDirection = "up";
          if(firstDirection == "none") {
            firstDirection = "up";
          }
          shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
          break;
        }
      }

      finishShapeRight(); //shape 2 turns Right
      finishShapeLeft();  //shape (1) turns Left

      finished = true;
      break;
    }

    if(finished) {
      break;
    }

    if(firstDirection == "right") {
      if(lastDirection == "right") {
        coverGridRight();
      }
    } else if(firstDirection == "left") {
      if(lastDirection == "left") {
        coverGridLeft();
      }
    } else if(firstDirection == "up") {
      if(lastDirection == "up") {
        coverGridUp();
      }
    } else {
      if(lastDirection == "down") {
        coverGridDown();
      }
    }
  }

  if(!turnLeftGerm) {
    newDiv1 = document.createElement('div');
    newDiv1.style.setProperty('clip-path', 'polygon(' + shape + ')');
    newDiv1.style.setProperty('background-color', '#bf7e34');
    newDiv1.style.setProperty('width', '100%');
    newDiv1.style.setProperty('height', '100%');
    newDiv1.style.setProperty('top', '0');
    newDiv1.style.setProperty('left', '0');
    newDiv1.style.setProperty('position', 'absolute');
    document.querySelector("#dynamicShapeContainer").appendChild(newDiv1);
  }

  if(!turnRightGerm) {
    newDiv2 = document.createElement('div');
    newDiv2.style.setProperty('clip-path', 'polygon(' + shape2 + ')');
    newDiv2.style.setProperty('background-color', '#bf7e34');
    newDiv2.style.setProperty('width', '100%');
    newDiv2.style.setProperty('height', '100%');
    newDiv2.style.setProperty('top', '0');
    newDiv2.style.setProperty('left', '0');
    newDiv2.style.setProperty('position', 'absolute');
    document.querySelector("#dynamicShapeContainer").appendChild(newDiv2);
  }
  

  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      if(horizontalGrid[i][j] == 3) {
        horizontalGrid[i][j] = 2;
        if((j > 0) && (j < 50)) {
          let idToFind = "#h" + i + "_" + j;
          document.querySelector(idToFind).style.setProperty('background-color', '#522c00');
        }
      }
      if(verticalGrid[i][j] == 3) {
        verticalGrid[i][j] = 2;
        if((j > 0) && (j < 50)) {
          let idToFind = "#v" + i + "_" + j;
          document.querySelector(idToFind).style.setProperty('background-color', '#522c00');
        }
      }
    }
  }

  let currentTaken = coverage;
  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 50; j++) {
      if(coverGrid[i][j] == 2) {
        if(turnLeftGerm) {
          coverGrid[i][j] = 0;
        } else {
          coverGrid[i][j] = 1;
          currentTaken++;
          horizontalGrid[i][j] = 2;
          horizontalGrid[i][j + 1] = 2;
          verticalGrid[j][i] = 2;
          verticalGrid[j][i + 1] = 2;
        }
      } else if(coverGrid[i][j] == 3) {
        if(turnRightGerm) {
          coverGrid[i][j] = 0;
        } else {
          coverGrid[i][j] = 1;
          currentTaken++;
          horizontalGrid[i][j] = 2;
          horizontalGrid[i][j + 1] = 2;
          verticalGrid[j][i] = 2;
          verticalGrid[j][i + 1] = 2;
        }
      } else if(coverGrid[i][j] == -1) {
        coverGrid[i][j] = 0;
      }
    }
  }

  if(coverage != currentTaken) {
    coverage = currentTaken;
    document.querySelector("#coverageText").textContent = "◕: " + ((coverage / 2500) * 100).toFixed(1) + "%";
  }
  
  if(coverage >= 2000) {
    pauseForLevelUp();
  } else {
    moveGerms();
  }
}

function pauseForLevelUp() {
  document.querySelector("#coverageText").style.setProperty('color', '#ad6000');
  document.querySelector("#levelUpBackground").style.setProperty('display', 'flex');

  sendEvent(null, 'update', playerName, level, timeScore + (STARTING_TIME - timeLeft));

  const newScore = { name: playerName, level: level, time: timeScore + (STARTING_TIME - timeLeft) };
  updateScore(newScore);

  displayScores();
}

function finishShapeLeft() {
  let right;
  let left;
  let up;
  let down;
  for(;;) {
    if((currentLeft == initialLeft) && (currentTop == initialTop)) {
      break;
    }

    if(currentLeft < 99) {
      right = horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2];
    } else {
      right = 3;
    }
    
    if(currentLeft > -1) {
      left = horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2];
    } else {
      left = 3;
    }

    if(currentTop > -1) {
      up = verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2];
    } else {
      up = 3;
    }
    
    if(currentTop < 99) {
      down = verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2];
    } else {
      down = 3;
    }

    switch(lastDirection) {
      case "right":
        if(up == 2) {
          verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop - 2;
          lastDirection = "up";
          if(firstDirection == "up") {
            coverGridUp();
          }
        } else if(right == 2) {
          horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft + 2;
          lastDirection = "right";
          if(firstDirection == "right") {
            coverGridRight();
          }
        } else if(down == 2) {
          verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop + 2;
          lastDirection = "down";
          if(firstDirection == "down") {
            coverGridDown();
          }
        }
        shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
        break;
      case "left":
        if(down == 2) {
          verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop + 2;
          lastDirection = "down";
          if(firstDirection == "down") {
            coverGridDown();
          }
        } else if(left == 2) {
          horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft - 2;
          lastDirection = "left";
          if(firstDirection == "left") {
            coverGridLeft();
          }
        } else if(up == 2) {
          verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop - 2;
          lastDirection = "up";
          if(firstDirection == "up") {
            coverGridUp();
          }
        }
        shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
        break;
      case "up":
        if(left == 2) {
          horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft - 2;
          lastDirection = "left";
          if(firstDirection == "left") {
            coverGridLeft();
          }
        } else if(up == 2) {
          verticalGrid[(currentTop - 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop - 2;
          lastDirection = "up";
          if(firstDirection == "up") {
            coverGridUp();
          }
        } else if(right == 2) {
          horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft + 2;
          lastDirection = "right";
          if(firstDirection == "right") {
            coverGridRight();
          }
        }
        
        shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
        break;
      case "down":
        if(right == 2) {
          horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft + 2;
          lastDirection = "right";
          if(firstDirection == "right") {
            coverGridRight();
          }
        } else if(down == 2) {
          verticalGrid[(currentTop + 1) / 2][(currentLeft + 1) / 2] = 3;
          currentTop = currentTop + 2;
          lastDirection = "down";
          if(firstDirection == "down") {
            coverGridDown();
          }
        } else if(left == 2) {
          horizontalGrid[(currentLeft - 1) / 2][(currentTop + 1) / 2] = 3;
          currentLeft = currentLeft - 2;
          lastDirection = "left";
          if(firstDirection == "left") {
            coverGridLeft();
          }
        }
        shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
        break;
      default:
    }
  }
}

var currentTop2;
var currentLeft2;
function finishShapeRight() {
  lastDirection2 = lastDirection;
  shape2 = shape;
  currentLeft2 = currentLeft;
  currentTop2 = currentTop;
  let right;
  let left;
  let up;
  let down;
  for(;;) {
    if((currentLeft2 == initialLeft) && (currentTop2 == initialTop)) {
      break;
    }

    if(currentLeft2 < 99) {
      right = horizontalGrid[(currentLeft2 + 1) / 2][(currentTop2 + 1) / 2];
    } else {
      right = 3;
    }
    
    if(currentLeft2 > -1) {
      left = horizontalGrid[(currentLeft2 - 1) / 2][(currentTop2 + 1) / 2];
    } else {
      left = 3;
    }

    if(currentTop2 > -1) {
      up = verticalGrid[(currentTop2 - 1) / 2][(currentLeft2 + 1) / 2];
    } else {
      up = 3;
    }
    
    if(currentTop2 < 99) {
      down = verticalGrid[(currentTop2 + 1) / 2][(currentLeft2 + 1) / 2];
    } else {
      down = 3;
    }

    switch(lastDirection2) {
      case "right":
        if(down == 2) {
          verticalGrid[(currentTop2 + 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 + 2;
          lastDirection2 = "down";
          if(firstDirection == "down") {
            coverGridDown2();
          }
        } else if(right == 2) {
          horizontalGrid[(currentLeft2 + 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 + 2;
          lastDirection2 = "right";
          if(firstDirection == "right") {
            coverGridRight2();
          }
        } else if(up == 2) {
          verticalGrid[(currentTop2 - 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 - 2;
          lastDirection2 = "up";
          if(firstDirection == "up") {
            coverGridUp2();
          }
        }
        shape2 = shape2 + ", " + (currentLeft2 + 1) + "% " + (currentTop2 + 1) + "%";
        break;
      case "left":
        if(up == 2) {
          verticalGrid[(currentTop2 - 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 - 2;
          lastDirection2 = "up";
          if(firstDirection == "up") {
            coverGridUp2();
          }
        } else if(left == 2) {
          horizontalGrid[(currentLeft2 - 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 - 2;
          lastDirection2 = "left";
          if(firstDirection == "left") {
            coverGridLeft2();
          }
        } else if(down == 2) {
          verticalGrid[(currentTop2 + 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 + 2;
          lastDirection2 = "down";
          if(firstDirection == "down") {
            coverGridDown2();
          }
        }
        shape2 = shape2 + ", " + (currentLeft2 + 1) + "% " + (currentTop2 + 1) + "%";
        break;
      case "up":
        if(right == 2) {
          horizontalGrid[(currentLeft2 + 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 + 2;
          lastDirection2 = "right";
          if(firstDirection == "right") {
            coverGridRight2();
          }
        } else if(up == 2) {
          verticalGrid[(currentTop2 - 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 - 2;
          lastDirection2 = "up";
          if(firstDirection == "up") {
            coverGridUp2();
          }
        } else if(left == 2) {
          horizontalGrid[(currentLeft2 - 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 - 2;
          lastDirection2 = "left";
          if(firstDirection == "left") {
            coverGridLeft2();
          }
        }
        shape2 = shape2 + ", " + (currentLeft2 + 1) + "% " + (currentTop2 + 1) + "%";
        break;
      case "down":
        if(left == 2) {
          horizontalGrid[(currentLeft2 - 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 - 2;
          lastDirection2 = "left";
          if(firstDirection == "left") {
            coverGridLeft2();
          }
        } else if(down == 2) {
          verticalGrid[(currentTop2 + 1) / 2][(currentLeft2 + 1) / 2] = 3;
          currentTop2 = currentTop2 + 2;
          lastDirection2 = "down";
          if(firstDirection == "down") {
            coverGridDown2();
          }
        } else if(right == 2) {
          horizontalGrid[(currentLeft2 + 1) / 2][(currentTop2 + 1) / 2] = 3;
          currentLeft2 = currentLeft2 + 2;
          lastDirection2 = "right";
          if(firstDirection == "right") {
            coverGridRight2();
          }
        }
        shape2 = shape2 + ", " + (currentLeft2 + 1) + "% " + (currentTop2 + 1) + "%";
        break;
      default:
    }
  }
}

function coverGridRight() {
  for(let i = ((currentTop + 1) / 2); i <= 49; i++) {
    if(i != ((currentTop + 1) / 2)) {
      if(horizontalGrid[(currentLeft - 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft - 1) / 2][i] == 0) {
      coverGrid[(currentLeft - 1) / 2][i] = 3;
    } else if(coverGrid[(currentLeft - 1) / 2][i] == -1) {
      turnRightGerm = true;
    }
  }

  for(let i = ((currentTop - 1) / 2); i >= 0; i--) {
    if(i != ((currentTop - 1) / 2)) {
      if(horizontalGrid[(currentLeft - 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft - 1) / 2][i] == 0) {
      coverGrid[(currentLeft - 1) / 2][i] = 2;
    } else if(coverGrid[(currentLeft - 1) / 2][i] == -1) {
      turnLeftGerm = true;
    }
  }
}

function coverGridLeft() {
  for(let i = ((currentTop + 1) / 2); i <= 49; i++) {
    if(i != ((currentTop + 1) / 2)) {
      if(horizontalGrid[(currentLeft + 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft + 1) / 2][i] == 0) {
      coverGrid[(currentLeft + 1) / 2][i] = 2;
    } else if(coverGrid[(currentLeft + 1) / 2][i] == -1) {
      turnLeftGerm = true;
    }
  }

  for(let i = ((currentTop - 1) / 2); i >= 0; i--) {
    if(i != ((currentTop - 1) / 2)) {
      if(horizontalGrid[(currentLeft + 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft + 1) / 2][i] == 0) {
      coverGrid[(currentLeft + 1) / 2][i] = 3;
    } else if(coverGrid[(currentLeft + 1) / 2][i] == -1) {
      turnRightGerm = true;
    }
  }
}

function coverGridUp() {
  for(let i = ((currentLeft + 1) / 2); i <= 49; i++) {
    if(i != ((currentLeft + 1) / 2)) {
      if(verticalGrid[(currentTop + 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop + 1) / 2] == 0) {
      coverGrid[i][(currentTop + 1) / 2] = 3;
    } else if(coverGrid[i][(currentTop + 1) / 2] == -1) {
      turnRightGerm = true;
    }
  }

  for(let i = ((currentLeft - 1) / 2); i >= 0; i--) {
    if(i != ((currentLeft - 1) / 2)) {
      if(verticalGrid[(currentTop + 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop + 1) / 2] == 0) {
      coverGrid[i][(currentTop + 1) / 2] = 2;
    } else if(coverGrid[i][(currentTop + 1) / 2] == -1) {
      turnLeftGerm = true;
    }
  }
}

function coverGridDown() {
  for(let i = ((currentLeft + 1) / 2); i <= 49; i++) {
    if(i != ((currentLeft + 1) / 2)) {
      if(verticalGrid[(currentTop - 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop - 1) / 2] == 0) {
      coverGrid[i][(currentTop - 1) / 2] = 2;
    } else if(coverGrid[i][(currentTop - 1) / 2] == -1) {
      turnLeftGerm = true;
    }
  }

  for(let i = ((currentLeft - 1) / 2); i >= 0; i--) {
    if(i != ((currentLeft - 1) / 2)) {
      if(verticalGrid[(currentTop - 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop - 1) / 2] == 0) {
      coverGrid[i][(currentTop - 1) / 2] = 3;
    } else if(coverGrid[i][(currentTop - 1) / 2] == -1) {
      turnRightGerm = true;
    }
  }
}

function coverGridRight2() {
  for(let i = ((currentTop2 + 1) / 2); i <= 49; i++) {
    if(i != ((currentTop2 + 1) / 2)) {
      if(horizontalGrid[(currentLeft2 - 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft2 - 1) / 2][i] == 0) {
      coverGrid[(currentLeft2 - 1) / 2][i] = 3;
    } else if(coverGrid[(currentLeft2 - 1) / 2][i] == -1) {
      turnRightGerm = true;
    }
  }

  for(let i = ((currentTop2 - 1) / 2); i >= 0; i--) {
    if(i != ((currentTop2 - 1) / 2)) {
      if(horizontalGrid[(currentLeft2 - 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft2 - 1) / 2][i] == 0) {
      coverGrid[(currentLeft2 - 1) / 2][i] = 2;
    } else if(coverGrid[(currentLeft2 - 1) / 2][i] == -1) {
      turnLeftGerm = true;
    }
  }
}

function coverGridLeft2() {
  for(let i = ((currentTop2 + 1) / 2); i <= 49; i++) {
    if(i != ((currentTop2 + 1) / 2)) {
      if(horizontalGrid[(currentLeft2 + 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft2 + 1) / 2][i] == 0) {
      coverGrid[(currentLeft2 + 1) / 2][i] = 2;
    } else if(coverGrid[(currentLeft2 + 1) / 2][i] == -1) {
      turnLeftGerm = true;
    }
  }

  for(let i = ((currentTop2 - 1) / 2); i >= 0; i--) {
    if(i != ((currentTop2 - 1) / 2)) {
      if(horizontalGrid[(currentLeft2 + 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[(currentLeft2 + 1) / 2][i] == 0) {
      coverGrid[(currentLeft2 + 1) / 2][i] = 3;
    } else if(coverGrid[(currentLeft2 + 1) / 2][i] == -1) {
      turnRightGerm = true;
    }
  }
}

function coverGridUp2() {
  for(let i = ((currentLeft2 + 1) / 2); i <= 49; i++) {
    if(i != ((currentLeft2 + 1) / 2)) {
      if(verticalGrid[(currentTop2 + 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop2 + 1) / 2] == 0) {
      coverGrid[i][(currentTop2 + 1) / 2] = 3;
    } else if(coverGrid[i][(currentTop2 + 1) / 2] == -1) {
      turnRightGerm = true;
    }
  }

  for(let i = ((currentLeft2 - 1) / 2); i >= 0; i--) {
    if(i != ((currentLeft2 - 1) / 2)) {
      if(verticalGrid[(currentTop2 + 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop2 + 1) / 2] == 0) {
      coverGrid[i][(currentTop2 + 1) / 2] = 2;
    } else if(coverGrid[i][(currentTop2 + 1) / 2] == -1) {
      turnLeftGerm = true;
    }
  }
}

function coverGridDown2() {
  for(let i = ((currentLeft2 + 1) / 2); i <= 49; i++) {
    if(i != ((currentLeft2 + 1) / 2)) {
      if(verticalGrid[(currentTop2 - 1) / 2][i] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop2 - 1) / 2] == 0) {
      coverGrid[i][(currentTop2 - 1) / 2] = 2;
    } else if(coverGrid[i][(currentTop2 - 1) / 2] == -1) {
      turnLeftGerm = true;
    }
  }

  for(let i = ((currentLeft2 - 1) / 2); i >= 0; i--) {
    if(i != ((currentLeft2 - 1) / 2)) {
      if(verticalGrid[(currentTop2 - 1) / 2][i + 1] != 0) {
        break;
      }
    }

    if(coverGrid[i][(currentTop2 - 1) / 2] == 0) {
      coverGrid[i][(currentTop2 - 1) / 2] = 3;
    } else if(coverGrid[i][(currentTop2 - 1) / 2] == -1) {
      turnRightGerm = true;
    }
  }
}

function keepTime() {
  frame++;
  if(frame >= 33) {
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
  pauseGerms();
  started = false;
  lives--;

  document.querySelector("#livesText").textContent = "❤: " + lives;

  if(lives <= 0) {
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
  pauseGerms();
  started = false;
  pauseable = false;
  document.querySelector("#endBackground").style.setProperty('display', 'flex');
  saveScore();

  sendEvent(null, 'end', playerName, level, timeScore);
  const newScore = { name: playerName, level: level, time: timeScore };
  removeScore(newScore);
  displayScores();
}

function levelUp() {
  level++;
  levelElement = document.querySelector("#levelText").textContent = "Level " + level;
  
  const newGermElement = document.createElement('div');
  newGermElement.className = "germ";
  newGermElement.id = "germ" + level;

  let newLeft = ((Math.floor(Math.random() * 47)) * 2) + 2;
  let newTop = ((Math.floor(Math.random() * 47)) * 2) + 2;
  let changed = true;

  while(changed) {
    changed = false;
    for (const [i, germ] of Germs.entries()) {
      while((newLeft >= germ.left) && (newLeft <= germ.left + 8)) {
        newLeft = ((Math.floor(Math.random() * 47)) * 2) + 2;
        changed = true;
      }
  
      while((newTop >= germ.top) && (newTop <= germ.top + 8)) {
        newTop = ((Math.floor(Math.random() * 47)) * 2) + 2;
        changed = true;
      }
    }
  }

  newGermElement.style.left = newLeft + '%';
  newGermElement.style.top = newTop + '%';

  let newLeftDir = Math.floor(Math.random() * 2);
  let newTopDir = Math.floor(Math.random() * 2);
  if(newLeftDir == 0) {
    newLeftDir = -2;
  } else {
    newLeftDir = 2;
  }

  if(newTopDir == 0) {
    newTopDir = -2;
  } else {
    newTopDir = 2;
  }

  const newGerm = {number: level, left: newLeft, top: newTop, leftDirection: newLeftDir, topDirection: newTopDir, flip: 1};

  Germs.push(newGerm);
  document.querySelector("#germContainer").appendChild(newGermElement);
}

function continueGame() {
  levelUp();

  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      if(horizontalGrid[i][j] != 0) {
        horizontalGrid[i][j] = 0;
        let idToFind = "#h" + i + "_" + j;
        const elementFound = document.querySelector(idToFind).style;
        elementFound.setProperty('opacity', '0');
        elementFound.setProperty('background-color', 'red');
      }
      if(verticalGrid[i][j] != 1) {
        verticalGrid[i][j] = 0;
        let idToFind = "#v" + i + "_" + j;
        const elementFound = document.querySelector(idToFind).style;
        elementFound.setProperty('opacity', '0');
        elementFound.setProperty('background-color', 'red');
      }
    }
  }

  createGridArray();
  createCoverArray();

  timeScore = timeScore + (STARTING_TIME - timeLeft);
  timeLeft = STARTING_TIME;
  frame = 0;
  document.querySelector("#coverageText").style.setProperty('color', 'black');
  document.querySelector("#coverageText").textContent = "◕: 0%";

  let timeString = Math.floor(timeLeft / 60) + ":";
  if(timeLeft % 60 < 10) {
    timeString = timeString + "0";
  }
  timeString = timeString + (timeLeft % 60);

  document.querySelector("#timerText").textContent = timeString;
  document.querySelector("#levelUpBackground").style.setProperty('display', 'none');
  document.querySelector("#dynamicShapeContainer").textContent = "";
  playerLeft = -1;
  playerTop = 99;
  coverage = 0;
  r.style.setProperty('--playerLeft', playerLeft + '%');
  r.style.setProperty('--playerTop', playerTop + '%');
  moveGerms();
}

function restartGame() {
  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      if(horizontalGrid[i][j] != 0) {
        horizontalGrid[i][j] = 0;
        let idToFind = "#h" + i + "_" + j;
        const elementFound = document.querySelector(idToFind).style;
        elementFound.setProperty('opacity', '0');
        elementFound.setProperty('background-color', 'red');
      }
      if(verticalGrid[i][j] != 0) {
        verticalGrid[i][j] = 0;
        let idToFind = "#v" + i + "_" + j;
        const elementFound = document.querySelector(idToFind).style;
        elementFound.setProperty('opacity', '0');
        elementFound.setProperty('background-color', 'red');
      }
    }
  }

  coverage = 0;
  timeLeft = STARTING_TIME;
  level = 1;
  lives = STARTING_LIVES;
  frame = 0;
  timeScore = 0;
  Germs.length = 0;
  playerLeft = -1;
  playerTop = 99;

  sendEvent(null, 'start', playerName, 0, 0);
  scores.push({ id: null, name: playerName, level: 0, time: 0 });
  displayScores();

  Germs.length = 0;
  r.style.setProperty('--playerLeft', playerLeft + '%');
  r.style.setProperty('--playerTop', playerTop + '%');
  document.querySelector("#timerText").style.setProperty("color", "black");
  document.querySelector("#livesText").style.setProperty("color", "black");
  document.querySelector("#coverageText").textContent = "◕: 0%";
  document.querySelector("#dynamicShapeContainer").textContent = "";
  document.querySelector("#germContainer").textContent = "";

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


async function homeButton() {
  sendEvent(null, 'end', playerName, level, timeScore);
  const newScore = { name: playerName, level: level, time: timeScore };
  removeScore(newScore);

  window.location.href='home.html';
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

async function saveScore() {
  const username = localStorage.getItem('username');
  const date = new Date().toLocaleDateString();

  const response = await fetch(`/api/new/score`, {
    method: 'post',
    body: JSON.stringify({ name: username, level: (level - 1), time: timeScore, date: date }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  });
}

function configureWebSocket() {

  let port = window.location.port;

  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  socket.onopen = (event) => {
    console.log("socket open");
  };

  socket.onclose = (event) => {
    console.log("socket closed");
  };

  socket.onmessage = async (event) => {
    const incomingEvent = JSON.parse(await event.data);

    const newScore = { id: incomingEvent, name: incomingEvent.name, level: incomingEvent.level, time: incomingEvent.time };
    if(incomingEvent.type == 'load') {
      scores = incomingEvent.scoresArray;
    } else if(incomingEvent.type == 'start') {
      addScore(newScore);
    } else if(incomingEvent.type == 'end') {
      removeScore(newScore);
    } else if(incomingEvent.type == 'update') {      
      updateScore(newScore);
    }

    displayScores();
  };
}

function addScore(newScore) {
  scores.push(newScore);
}

function updateScore(newScore) {
  for(const [i, score] of scores.entries()) {
    if(score.name == newScore.name) {
      scores.splice(i, 1);
      break;
    }
  }

  let found = false;
  for(const [i, score] of scores.entries()) {
    if ((newScore.level) > score.level) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    } else if((newScore.level) == score.level) {
      if(newScore.timeScore < score.time) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
      }
    }
  }

  if(!found) {
    scores.push(newScore);
  }
}

function removeScore(newScore) {
  for(const [i, score] of scores.entries()) {
    if(newScore.name == score.name) {
      scores.splice(i, 1);
      break;
    }
  }
}

function displayScores() {
  const body = document.querySelector("#liveScoresBody");

  body.textContent = "";

  for(const [i, score] of scores.entries()) {
    const row = document.createElement('tr');
    const nameTd = document.createElement('td');
    const levelTd = document.createElement('td');
    const timeTd = document.createElement('td');

    nameTd.classList.add('playTable');
    levelTd.classList.add('playTable');
    timeTd.classList.add('playTable');

    if(score.name == playerName) {
      nameTd.textContent = "me";
    } else {
      nameTd.textContent = score.name;
    }

    levelTd.textContent = score.level;

    let timeValue = "";

    timeValue = Math.floor(score.time / 60) + ":";
    if(score.time % 60 < 10) {
      timeValue = timeValue + "0";
    }
    timeValue = timeValue + (score.time % 60);

    timeTd.textContent = timeValue;

    row.appendChild(nameTd);
    row.appendChild(levelTd);
    row.appendChild(timeTd);
    body.appendChild(row);
    if(i == 4) {
      break;
    }
  }
}

function sendEvent(id, type, name, level, time) {
  const event = {
    id: id,
    type: type,
    name: name,
    level: level,
    time: time,
  };

  socket.send(JSON.stringify(event));
}

setup(true);
document.addEventListener('keyup', e => keyPressed(e));