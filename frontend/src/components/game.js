import React, { useState, useEffect } from 'react';
import './styles/game.css';
import { getFeedback } from '../algoritm/feedback';
import { Route } from 'react-router-dom';
import Highscore from './highscore';
import About from './about';

const MAX_GUESSES = 5; 

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
  const [timer, setTimer] = useState(0);

  // Hämta ord från backend när komponenten laddas
  useEffect(() => {
    fetch(`http://localhost:5080/api/word?length=${wordLength}&allowRepeats=${allowRepeats}`)
      .then(res => res.json())
      .then(data => {
        setAnswer(data.word.toUpperCase());
        setLoading(false);
      });
  }, [wordLength, allowRepeats]);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

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
              setTimer(0);
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
          <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '1em', textAlign: 'center' }}>
            Tid: {timer} sekunder
          </div>
          {!gameOver && (
            <div style={{ display: 'flex', gap: '1em', alignItems: 'center', justifyContent: 'center', marginBottom: '1em' }}>
              <input
                type="text"
                value={currentGuess}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={wordLength}
                disabled={gameOver}
                autoFocus
                style={{
                  textTransform: 'uppercase',
                  fontSize: '2em',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  width: `${wordLength * 2}em`
                }}
              />
              <button onClick={handleKeyDown} style={{ fontSize: '1.2em', padding: '0.5em 1.5em' }}>
                Gissa
              </button>
            </div>
          )}
          {gameOver && guesses[guesses.length - 1] === answer && (
            <div style={{ textAlign: 'center', marginTop: '2em' }}>
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
                      time: Date.now() - startTime,
                      guesses,
                      length: wordLength,
                      allowRepeats
                    })
                  }).then(() => alert('Highscore sparad!'));
                }}
                style={{ marginTop: '1em' }}
              >
                <input
                  type="text"
                  placeholder="Ditt namn"
                  value={name}
                  maxLength={30}
                  pattern="[A-Za-zÅÄÖåäö ]+"
                  onChange={e => setName(e.target.value.replace(/[^A-Za-zÅÄÖåäö ]/g, ''))}
                  required
                  style={{ fontSize: '1.1em', marginRight: '1em' }}
                />
                <button type="submit" style={{ fontSize: '1.1em' }}>Spara highscore</button>
              </form>
            </div>
          )}
     {gameOver && guesses[guesses.length - 1] !== answer && (
  <div style={{ textAlign: 'center', marginTop: '2em' }}>
    <h3>Försök igen!</h3>
    <p>Rätt ord var: {answer}</p>
  </div>
)}    
          
          <div className="board">
            {[...Array(MAX_GUESSES)].map((_, rowIdx) => (
              <div className="row" key={rowIdx}>
                {[...Array(wordLength)].map((_, colIdx) => {
                  let letter = '';
                  let color = '';
                  if (guesses[rowIdx]) {
                    letter = guesses[rowIdx][colIdx];
                    color = feedbacks[rowIdx][colIdx];
                  } else if (rowIdx === guesses.length && !gameOver) {
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
        </div>
      )}
    </div>
  );
}

export default Game;