import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = React.useState([]);

  function FindTable() {
    React.useEffect(() => {
      fetch('/api/loadScores')
        .then((response) => response.json())
        .then((scores) => {
          setScores(scores);
        })
        .catch(() => {});
    }, []);
  
    const rows = [];
    if(scores.length) {

      for(const [i, score] of scores.entries()) {
  
        let timeScore = "";
        timeScore = Math.floor((score.time / 60)) + ":";
        if(score.time % 60 < 10) {
          timeScore = timeScore + "0";
        }
        timeScore = timeScore + score.time % 60;
  
        rows.push(
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{score.name}</td>
            <td>{score.level}</td>
            <td>{timeScore}</td>
            <td>{score.date}</td>
          </tr>
        );
      }

      return (
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
            <tbody id="leaderboardTableBody">{rows}</tbody>
          </table>
        </div>
      )
      
    } else {
      return (
        <div id="noScoresMessage">Play first to start the leaderboard!</div>
      );
    }
  }
  
  return (
    <main id="scoresMain">
      <div id="scoresTopMenu" className="topMenu">
        <div id="scoresMainTitle" className="mainTitle">Leaderboard</div>
          <FindTable/>
        <button id="scoresBackButton" onClick={() => navigate('/home')}>Back</button>
      </div>
    </main>
  );
}