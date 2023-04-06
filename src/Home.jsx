import React from 'react';

export function Home() {
  return (
    <main>
      <div id="homeTopMenu" className="topMenu">
        <div id="homeMainTitle" className="mainTitle">Breadwinner!</div>
        <button id="homePlayButton" className="homeButton" onclick="location.href='play.html';">Play</button>
        <button id="homeTutorialButton" className="homeButton" onclick="location.href='tutorial.html';">Instructions</button>
        <button id="homeLeaderboardButton" className="homeButton" onclick="location.href='leaderboard.html';">Leaderboard</button>
        <button id="homeLogoutButton" onclick="location.href='index.html';">Logout</button>
      </div>
    </main>
  );
}