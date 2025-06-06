import React, { useEffect, useState } from 'react';

function Highscore() {
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5080/api/highscores')
      .then(res => res.json())
      .then(data => setHighscores(data));
  }, []);

  return (
    <div>
      <h2>Highscore-lista</h2>
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Tid (ms)</th>
            <th>Antal gissningar</th>
            <th>Ordlängd</th>
            <th>Unika bokstäver</th>
          </tr>
        </thead>
        <tbody>
          {highscores.map((score, i) => (
            <tr key={i}>
              <td>{score.name}</td>
              <td>{score.time}</td>
              <td>{score.guesses.length}</td>
              <td>{score.length}</td>
              <td>{score.allowRepeats ? 'Nej' : 'Ja'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Highscore;