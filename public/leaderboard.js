async function loadScores() {
  let scores = [];

  const response = await fetch(`/api/loadScores`);
  scores = await response.json();

  const tableBodyElement = document.querySelector("#leaderboardTableBody");

  if(scores.length) {
    for (const [i, score] of scores.entries()) {
      const positionElement = document.createElement('td');
      const nameElement = document.createElement('td');
      const levelElement = document.createElement('td');
      const timeElement = document.createElement('td');
      const dateElement = document.createElement('td');
      
      positionElement.textContent = i + 1;
      nameElement.textContent = score.name;
      levelElement.textContent = score.level;
      
      timeScore = Math.floor((score.time / 60)) + ":";
      if(score.time % 60 < 10) {
        timeScore = timeScore + "0";
      }
      timeScore = timeScore + score.time % 60;

      timeElement.textContent = timeScore;
      dateElement.textContent = score.date;

      const rowElement = document.createElement('tr');
      rowElement.appendChild(positionElement);
      rowElement.appendChild(nameElement);
      rowElement.appendChild(levelElement);
      rowElement.appendChild(timeElement);
      rowElement.appendChild(dateElement);

      tableBodyElement.appendChild(rowElement);
    }
  } else {
    document.querySelector("#scoresTableHead").innerHTML = '<div id="noScoresMessage">Play first to start the leaderboard!</div>';
  }
}

loadScores();