import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Game from './game';
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
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/components/app.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
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
