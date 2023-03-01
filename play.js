var r = document.querySelector(':root');
var playerLeft = -1;
var playerTop = 99;
var pausable = false;
var started = false;
var timer;
var Germs = [];
var horizontalGrid = [];
var verticalGrid = [];

function setup() {
  let firstLeft = Math.floor(Math.random() * 97);
  let firstTop = Math.floor(Math.random() * 97);
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
  
  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      const newDiv = document.createElement('div');
      newDiv.className = "grid horizontal";
      newDiv.id = "h" + i + "_" + j;
      newDiv.style.left = (i * 2) + '%';
      newDiv.style.top = (j * 2) + '%';
      newDiv.style.display = "none";
      gridContainer.appendChild(newDiv);
    }
  }

  for(let i = 0; i < 50; i++) {
    for(let j = 0; j < 51; j++) {
      const newDiv = document.createElement('div');
      newDiv.className = "grid vertical";
      newDiv.id = "v" + i + "_" + j;
      newDiv.style.left = (j * 2) + '%';
      newDiv.style.top = (i * 2) + '%';
      newDiv.style.display = "none";
      gridContainer.appendChild(newDiv);
    }
  }
}

function startGame() {
  r.style.setProperty('--startBackgroundDisplay', "none");
  pausable = true;
  started = true;
  moveGerms();
}

async function moveGerms() {
  timer = setInterval(move, 20);
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

    germNumberLeft = "--germ" + germ.number + "Left";
    germNumberTop = "--germ" + germ.number + "Top";
    r.style.setProperty(germNumberLeft, germ.left + '%');
    r.style.setProperty(germNumberTop, germ.top + '%');
  }
}

function keyPressed(e) {
  if(started) {
    switch (e.code) {
      case "ArrowRight":
      case "KeyD":

        
        // if((horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2]) != 1 &&
        //    (verticalGrid[(playerTop + 1) / 2][(playerLeft + 3) / 2]) != 1 &&
        //    (verticalGrid[(playerTop - 1) / 2][(playerLeft + 3) / 2]) != 1) {
        // }
          if(isValid("right")) {
            playerLeft = playerLeft + 2;
            r.style.setProperty('--playerLeft', playerLeft + '%');
            if(playerTop != -1 && playerTop != 99) {
              const arrayFound = horizontalGrid[(playerLeft - 1) / 2];
              arrayFound[(playerTop + 1) / 2] = 1;
              //horizontalGrid[(playerLeft - 1) / 2][(playerTop + 1) / 2] = 1;
              let idToFind = "#h" + ((playerLeft - 1) / 2) + "_" + ((playerTop + 1) / 2);
              const divFound = document.querySelector(idToFind);
              divFound.style.setProperty('display', 'block');
              divFound.style.setProperty('background-color', 'red');
            }
          }
        break;

      case "ArrowLeft":
      case "KeyA":
        if(playerLeft > -1) {
          playerLeft = playerLeft - 2;
          r.style.setProperty('--playerLeft', playerLeft + '%');
          let idToFind = "#h" + ((playerLeft + 1) / 2) + "_" + ((playerTop + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('display', 'block');
          divFound.style.setProperty('background-color', 'red');
        }
        break;

      case "ArrowUp":
      case "KeyW":
        if(playerTop > -1) {
          playerTop = playerTop - 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          let idToFind = "#v" + ((playerTop + 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('display', 'block');
          divFound.style.setProperty('background-color', 'red');
        }
        break;

      case "ArrowDown":
      case "KeyS":
        if(playerTop < 99) {
          playerTop = playerTop + 2;
          r.style.setProperty('--playerTop', playerTop + '%');
          let idToFind = "#v" + ((playerTop - 1) / 2) + "_" + ((playerLeft + 1) / 2);
          const divFound = document.querySelector(idToFind);
          divFound.style.setProperty('display', 'block');
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
      if(playerLeft != 99) {
        if(horizontalGrid[(playerLeft + 1) / 2][(playerTop + 1) / 2] == 1) {
          return false;
        }

        if(playerTop != -1) {
          if(verticalGrid[(playerTop - 1) / 2][(playerLeft + 3) / 2] == 1) {
            return false;
          }
        }

        if(playerTop != 99) {
          if(verticalGrid[(playerTop + 1) / 2][(playerLeft + 3) / 2] == 1) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    case "left":
      break;
    case "up":
      break;
    case "down":
      break;
    default:
  }
}

setup();
document.addEventListener('keydown', e => keyPressed(e));