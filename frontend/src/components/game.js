import React, { useState, useEffect } from 'react';
import './styles/game.css';
import { getFeedback } from '../algoritm/feedback';
import { Route } from 'react-router-dom';
import Highscore from './highscore';
import About from './about';

const MAX_GUESSES = 20; 

function Game() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [wordLength, setWordLength] = useState(5);
  const [allowRepeats, setAllowRepeats] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Hämta ord från backend när komponenten laddas
  useEffect(() => {
    fetch(`http://localhost:5080/api/word?length=${wordLength}&allowRepeats=${allowRepeats}`)
      .then(res => res.json())
      .then(data => {
        setAnswer(data.word.toUpperCase());
        setLoading(false);
      });
  }, [wordLength, allowRepeats]);

  function getFeedback(guess, answer) {
    return guess.split('').map((letter, i) => {
      if (letter === answer[i]) return 'green';
      if (answer.includes(letter)) return 'yellow';
      return 'gray';
    });
  }

  function handleChange(e) {
    if (e.target.value.length <= wordLength) {
      setCurrentGuess(e.target.value.toUpperCase());
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && currentGuess.length === wordLength && !gameOver) {
      const feedback = getFeedback(currentGuess, answer);
      setGuesses([...guesses, currentGuess]);
      setFeedbacks([...feedbacks, feedback]);
      setCurrentGuess('');
      if (currentGuess === answer) setGameOver(true);
      if (guesses.length + 1 === MAX_GUESSES) setGameOver(true);
    }
  }

  if (loading) return <div>Laddar ord...</div>;

  return (
    <div>
      <h2>Wordle</h2>
      {!gameStarted && (
        <div>
          <input
            type="text"
            placeholder="Ditt namn"
            value={name}
            maxLength={30}
            pattern="[A-Za-zÅÄÖåäö ]+"
            onChange={e => setName(e.target.value.replace(/[^A-Za-zÅÄÖåäö ]/g, ''))}
            required
          />
          <form
            onSubmit={e => {
              e.preventDefault();
              setStartTime(Date.now());
              setGameStarted(true);
              setLoading(true);
              fetch(`http://localhost:5080/api/word?length=${wordLength}&allowRepeats=${allowRepeats}`)
                .then(res => res.json())
                .then(data => {
                  setAnswer(data.word.toUpperCase());
                  setLoading(false);
                  setStartTime(Date.now());
                });
            }}
            style={{ marginBottom: '1em' }}
          >
            <label>
              Ordlängd:
              <input
                type="number"
                min={3}
                max={10}
                value={wordLength}
                onChange={e => setWordLength(Number(e.target.value))}
                required
                style={{ width: 50, marginLeft: 5, marginRight: 15 }}
              />
            </label>
            <label>
              Tillåt upprepade bokstäver:
              <input
                type="checkbox"
                checked={allowRepeats}
                onChange={e => setAllowRepeats(e.target.checked)}
                style={{ marginLeft: 5 }}
              />
            </label>
            <button type="submit" style={{ marginLeft: 15 }}>Starta spel</button>
          </form>
        </div>
      )}
      {gameStarted && (
        <div>
          <div className="board">
            {[...Array(MAX_GUESSES)].map((_, rowIdx) => (
              <div className="row" key={rowIdx}>
                {[...Array(wordLength)].map((_, colIdx) => {
                  let letter = '';
                  let color = '';
                  if (guesses[rowIdx]) {
                    letter = guesses[rowIdx][colIdx];
                    color = feedbacks[rowIdx][colIdx];
                  } else if (rowIdx === guesses.length) {
                    letter = currentGuess[colIdx] || '';
                  }
                  return (
                    <div className={`cell ${color}`} key={colIdx}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {!gameOver && (
            <input
              type="text"
              value={currentGuess}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={wordLength}
              disabled={gameOver}
              style={{ textTransform: 'uppercase', marginTop: '1em' }}
            />
          )}
          {gameOver && guesses[guesses.length - 1] === answer && (
            <div>
              <h3>Du vann!</h3>
              <p>Rätt ord var: {answer}</p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  fetch('http://localhost:5080/api/highscores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name,
                      time: Date.now() - startTime, // startTime = när spelet startade
                      guesses,
                      length: wordLength,
                      allowRepeats
                    })
                  }).then(() => alert('Highscore sparad!'));
                }}
              >
                <input
                  type="text"
                  placeholder="Ditt namn"
                  value={name}
                  maxLength={30}
                  pattern="[A-Za-zÅÄÖåäö ]+"
                  onChange={e => setName(e.target.value.replace(/[^A-Za-zÅÄÖåäö ]/g, ''))}
                  required
                />
                <button type="submit">Spara highscore</button>
              </form>
            </div>
          )}
          {gameOver && guesses[guesses.length - 1] !== answer && (
            <div>
              <h3>Försök igen!</h3>
              <p>Rätt ord var: {answer}</p>
            </div>
          )}
        </div>
      )}
      <Route path="/" element={<Game />} />
      <Route path="/highscore" element={<Highscore />} />
      <Route path="/about" element={<About />} />
    </div>
  );
}

export default Game;