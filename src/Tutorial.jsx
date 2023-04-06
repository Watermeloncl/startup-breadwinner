import React from 'react';

export function Tutorial() {
  return (
    <main id="tutorialMain">
      <div id="tutorialTopMenu" className="topMenu">
        <h2>Goal</h2>
        <p>You're a germ! Cut off slices of the bread while avoiding
          the other germs. Capture at least 80% of the slice to progress to the next level! You have 3 minutes
          per level, and 5 lives. Good luck!</p>
        <h2>Controls</h2>
        <p>Use the arrow keys to move, or WASD. (For a speed boost, use both!) You are the red diamond,
          the germs are the green circles. Don't let them touch you or your incomplete paths!</p>
        <div id="quoteBox"></div>
        <div id="tutorialButtonContainer">
          <button id="tutorialBackButton" onclick="location.href='home.html';">Back</button>
        </div>
      </div>
    </main>
  );
}