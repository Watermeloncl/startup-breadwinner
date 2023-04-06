import React from 'react';
import breadBackground from './breadBackground.jpg'

export function Play() {
  return (
    <main id="playMain">
      <div id="startBackground" className="stoppedBackground">
        <button id="startButton" onclick="start()">Loading</button>
      </div>
      <div id="levelUpBackground" className="stoppedBackground" >
        <div id="congratsText">Congrats!</div>
        <button id="continueButton" onclick="continueGame()">Continue</button>
      </div>
      <div id="endBackground"  className="stoppedBackground" >
        <div id="gameOverText">Game Over!</div>
        <button id="restartButton" onclick="restartGame()">Restart</button>
      </div>
      <div id="scores">
        <table id="playTableID" className="playTable">
          <thead>
            <tr>
              <th className="playTable">Name</th>
              <th className="playTable">Level</th>
              <th className="playTable">Time</th>
            </tr>
          </thead>
          <tbody id="liveScoresBody">
          </tbody>
        </table>
      </div>
      <div id="mainBox">
        <div id="mainHeader">
          <div id="lives" className="topBar"><div id="livesText" className="topBarText">❤: 5</div></div>
          <div id="coverage" className="topBar"><div id="coverageText" className="topBarText">◕: 0%</div></div>
          <div id="level" className="topBar"><div id ="levelText" className="topBarText">Level 1</div></div>
          <div id="timer" className="topBar"><div id ="timerText" className="topBarText">3:00</div></div>
          <div id="playButtonContainer" className="topBar">
            <button id="pauseButton" className="topBarButtons" onclick="pauseGameButton()">
              <div id="playTriangle"></div>
              <div id="pauseLeft" className="pause"></div>
              <div id="pauseRight" className="pause"></div>
            </button>
            <button id="homeButton" className="topBarButtons" onclick="homeButton()">
              <div id="homeSquare" className="homeSymbol"></div>
              <div id="homeTriangle" className="homeSymbol"></div>
            </button>
          </div>
        </div>
        <div id="mainGame">
          <div id="game">
            <div id="gameContainer">
              <div id="dynamicShapeContainer" className="container"></div>
              <div id="germContainer" className="container"></div>
              <img src={ breadBackground } id="backgroundImage" alt=""/>
              <div id="player"></div>
              <div id="germ1" className="germ"></div>
              <div id="gridContainer"></div>
              </div>
          </div>
        </div>
        <div id="mainFooter">Use the arrow keys or WASD to move!</div>
      </div>
    </main>
  );
}