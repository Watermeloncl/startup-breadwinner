import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Tutorial() {
  const navigate = useNavigate();

  const [quote, setQuote] = React.useState('Loading...');
  const [author, setAuthor] = React.useState('');

  React.useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.content);
        setAuthor(data.author);
      })
      .catch();
  }, []);

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
        <div id="quoteBox">
          <p id="quote">{quote}</p>
          <p id="author">{author}</p>
        </div>
        <div id="tutorialButtonContainer">
          <button id="tutorialBackButton" onClick={() => navigate('/home')}>Back</button>
        </div>
      </div>
    </main>
  );
}