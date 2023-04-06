import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <div id="homeTopMenu" className="topMenu">
        <div id="homeMainTitle" className="mainTitle">Breadwinner!</div>
        <button id="homePlayButton" className="homeButton" onClick={() => navigate('/play')}>Play</button>
        <button id="homeTutorialButton" className="homeButton" onClick={() => navigate('/tutorial')}>Instructions</button>
        <button id="homeLeaderboardButton" className="homeButton" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
        <button id="homeLogoutButton" onClick={() => navigate('/')}>Logout</button>
      </div>
    </main>
  );
}