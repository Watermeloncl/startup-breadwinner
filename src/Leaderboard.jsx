import React from 'react';

export function Leaderboard() {
  return (
    <main id="scoresMain">
      <div id="scoresTopMenu" className="topMenu">
        <div id="scoresMainTitle" className="mainTitle">Leaderboard</div>
        <div id="scoresTableHead"> 
          <table className="scoresTable">
            <thead>
              <tr>
                <th className="scoresTable">#</th>
                <th className="scoresTable">Name</th>
                <th className="scoresTable">Level</th>
                <th className="scoresTable">Time</th>
                <th className="scoresTable">Date</th>
              </tr>
            </thead>
            <tbody id="leaderboardTableBody">
            </tbody>
          </table>
        </div>
        <button id="scoresBackButton" onclick="location.href='home.html';">Back</button>
      </div>
    </main>
  );
}