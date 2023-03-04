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
var coverGrid = [];
var buttonPressed = false;
var level = 1;
var lives = 3;
var timeLeft = 120;
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
  createCoverArray();
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

function createCoverArray() {
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

function startGame() {
  s.setProperty('--startBackgroundDisplay', "none");
  pauseable = true;
  started = true;
  moveGerms();
}

function moveGerms() {
  timer = setInterval(move, 200);  //Change to an update/redraw function? //20
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
var shape;
function finishBlock() {
  pauseGerms();
  started = false;

  let initialLeft = playerLeft;
  let initialTop = playerTop;
  currentLeft = playerLeft;
  currentTop = playerTop;
  let lastDirection = "none";
  var firstDirection = "none";
  shape = (currentLeft + 1) + "% " + (currentTop + 1) + "%";
  let finished = false;

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
          let idToFind = "#h" + ((currentLeft + 1) / 2) + "_" + ((currentTop + 1) / 2);
          document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
          let idToFind = "#v" + ((currentTop + 1) / 2) + "_" + ((currentLeft + 1) / 2);
          document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
          let idToFind = "#h" + ((currentLeft - 1) / 2) + "_" + ((currentTop + 1) / 2);
          document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
          let idToFind = "#v" + ((currentTop - 1) / 2) + "_" + ((currentLeft + 1) / 2);
          document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
          currentTop = currentTop - 2;
          lastDirection = "up";
          if(firstDirection == "none") {
            firstDirection = "up";
          }
          shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
          break;
        }
      }

      var currentEdge = getCurrentToEdge(firstDirection);
      var initialEdge = getInitialToEdge(firstDirection);

      finished = true;
      break;
    }

    if(finished) {
      
      break;
    }

    if(firstDirection == "right") {
      if(lastDirection == "right") {
        for(let i = ((currentTop + 1) / 2); i <= 49; i++) {
          if(i != ((currentTop + 1) / 2)) {
            if((horizontalGrid[(currentLeft - 1) / 2][i] == 3) || (horizontalGrid[(currentLeft - 1) / 2][i] == 1)) {
              break;
            }
          }

          if(coverGrid[(currentLeft - 1) / 2][i] == 0) {
            coverGrid[(currentLeft - 1) / 2][i] = 2;
          } else if(coverGrid[(currentLeft - 1) / 2][i] == -1) {
            //HIT GERM
          }
        }
      }
    } else if(firstDirection == "left") {
      if(lastDirection == "left") {
        for(let i = ((currentTop + 1) / 2); i <= 49; i++) {
          if(i != ((currentTop + 1) / 2)) {
            if((horizontalGrid[(currentLeft + 1) / 2][i] == 3) || (horizontalGrid[(currentLeft + 1) / 2][i] == 1)) { //error HERE
              break;
            }
          }

          if(coverGrid[(currentLeft + 1) / 2][i] == 0) {
            coverGrid[(currentLeft + 1) / 2][i] = 2;
          } else if(coverGrid[(currentLeft + 1) / 2][i] == -1) {
            //HIT GERM
          }
        }
      }
    } else if(firstDirection == "up") {
      if(lastDirection == "up") {
        for(let i = ((currentLeft + 1) / 2); i <= 49; i++) {
          if(i != ((currentLeft + 1) / 2)) {
            if((verticalGrid[(currentTop + 1) / 2][i] == 3)  || (verticalGrid[(currentTop + 1) / 2][i] == 1)) {
              break;
            }
          }

          if(coverGrid[i][(currentTop + 1) / 2] == 0) {
            coverGrid[i][(currentTop + 1) / 2] = 2;
          } else if(coverGrid[(currentLeft + 1) / 2][i] == -1) {
            //HIT GERM
          }
        }
      }
    } else {  //down
      if(lastDirection == "down") {
        for(let i = ((currentLeft + 1) / 2); i <= 49; i++) {
          if(i != ((currentLeft + 1) / 2)) {
            if((verticalGrid[(currentTop - 1) / 2][i] == 3) || (verticalGrid[(currentTop - 1) / 2][i] == 1)) {
              break;
            }
          }

          if(coverGrid[i][(currentTop - 1) / 2] == 0) {
            coverGrid[i][(currentTop - 1) / 2] = 2;
          } else if(coverGrid[i][(currentTop - 1) / 2] == -1) {
            //HIT GERM
          }
        }
      }
    }

  }

  newDiv = document.createElement('div');
  newDiv.style.setProperty('clip-path', 'polygon(' + shape + ')');
  newDiv.style.setProperty('background-color', '#bf7e34');
  newDiv.style.setProperty('width', '100%');
  newDiv.style.setProperty('height', '100%');
  newDiv.style.setProperty('top', '0');
  newDiv.style.setProperty('left', '0');
  newDiv.style.setProperty('position', 'absolute');
  
  document.querySelector("#gridContainer").appendChild(newDiv);
  
  moveGerms();
}

function getCurrentToEdge(firstDirection) {
  if(currentLeft == -1) {
    return "left";
  }

  if(currentLeft == 99) {
    return "right";
  }

  if(currentTop == -1) {
    return "top";
  }

  if(currentTop == 99) {
    return "bottom";
  }

  /*for(;;) { //search the four, finding the next red line and turning it brown
    if(currentLeft < 99) {
      if(horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] == 1) {
        horizontalGrid[(currentLeft + 1) / 2][(currentTop + 1) / 2] = 3;
        let idToFind = "#h" + ((currentLeft + 1) / 2) + "_" + ((currentTop + 1) / 2);
        document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
        let idToFind = "#v" + ((currentTop + 1) / 2) + "_" + ((currentLeft + 1) / 2);
        document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
        let idToFind = "#h" + ((currentLeft - 1) / 2) + "_" + ((currentTop + 1) / 2);
        document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
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
        let idToFind = "#v" + ((currentTop - 1) / 2) + "_" + ((currentLeft + 1) / 2);
        document.querySelector(idToFind).style.setProperty('background-color', '#bf7e34');
        currentTop = currentTop - 2;
        lastDirection = "up";
        if(firstDirection == "none") {
          firstDirection = "up";
        }
        shape = shape + ", " + (currentLeft + 1) + "% " + (currentTop + 1) + "%";
        break;
      }
    }

    finished = true;
    break;
  }*/
}

function getInitialToEdge(firstDirection) {

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