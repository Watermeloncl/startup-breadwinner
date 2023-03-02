var r = document.querySelector(':root');
var s = r.style;
var playerLeft = -1;
var playerTop = 99;
var pausable = false;
var started = false;
var timer;
var Germs = [];
var horizontalGrid = [];
var verticalGrid = [];
var buttonPressed = false;

function setup() {
  let firstLeft = Math.floor(Math.random() * 96);
  let firstTop = Math.floor(Math.random() * 96);
  r.style.setProperty('--germ1Left', firstLeft + '%');
  r.style.setProperty('--germ1Top', firstTop + '%');

  const newGerm = {number: 1, left: firstLeft, top: firstTop, leftDirection: 1, topDirection: 1}

  Germs.push(newGerm);

  createGrid();
}

function createGrid() {
  for(let i = 0; i < 50; i++) {
    var newArrayH = [];
    var newArrayV = [];
    newArrayH.length = 51;
    newArrayV.length = 51;
    newArrayH.fill(0);
    newArrayV.fill(0);
    horizontalGrid.push(newArrayH);
    verticalGrid.push(newArrayV);
  }

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
  pausable = true;
  started = true;
  moveGerms();
}

function moveGerms() {
  timer = setInterval(move, 30);  //Change to an update/redraw function
  started = true;
}

function move() {
  for (let [i, germ] of Germs.entries()) {

    germ.left = germ.left + germ.leftDirection;
    germ.top = germ.top + germ.topDirection;

    //rebound
    if(germ.left >= 96 || germ.left <= 0) {
      germ.leftDirection = germ.leftDirection * -1;
    }

    if(germ.top >= 96 || germ.top <= 0) {
      germ.topDirection = germ.topDirection * -1;
    }

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
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('opacity', '1');
          divFound.style.setProperty('background-color', 'red');
        }
        break;

      case "ArrowLeft":
      case "KeyA":
        if(isValid("left")) {
          playerLeft = playerLeft - 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] = 1;
          let idToFind = "#h" + ((playerLeft + 1) / 2) + "_" + ((playerTop + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('opacity', '1');
          divFound.style.setProperty('background-color', 'red');
        }
        break;

      case "ArrowUp":
      case "KeyW":
        if(isValid("up")) {
          playerTop = playerTop - 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          verticalGrid[(playerTop + 1) / 2][(playerLeft + 1) / 2] = 1;
          let idToFind = "#v" + ((playerTop + 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('opacity', '1');
          divFound.style.setProperty('background-color', 'red');
        }
        break;

      case "ArrowDown":
      case "KeyS":
        if(isValid("down")) {
          playerTop = playerTop + 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          verticalGrid[(playerTop - 1) / 2][(playerLeft + 1) / 2] = 1;
          let idToFind = "#v" + ((playerTop - 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('opacity', '1');
          divFound.style.setProperty('background-color', 'red');
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
      return true;
      break;
    case "down":
      return true;
      break;
    default:
  }
}

setup();
document.addEventListener('keydown', e => keyPressed(e));   //TODO: change to "keyup"