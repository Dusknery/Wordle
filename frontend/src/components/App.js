import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Game from './Game';
import Highscore from './highscore';
import About from './about';
import './app.css';
import logo from '../logo.svg'; 

const MAX_GUESSES = 20; 
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="wordle-title">WORDLE</h1>
          <hr className="wordle-hr" />
        </header>
        <nav>
          <Link to="/">Spela</Link> | <Link to="/highscore">Highscore</Link> |{' '}
          <Link to="/about">Om</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/highscore" element={<Highscore />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
