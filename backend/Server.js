const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5080;

app.use(cors());
app.use(express.json());

// ordlista 
const words = JSON.parse(fs.readFileSync('./routes/data/words.json', 'utf8'));
// Ladda eller initiera highscore-lista
const highscoresPath = './highscores.json';
let highscores = [];
if (fs.existsSync(highscoresPath)) {
    highscores = JSON.parse(fs.readFileSync(highscoresPath, 'utf8'));
}

const GameRoutes = require('./routes/game');
const HighscoreRoutes = require('./routes/highscore');

// API-routes 
app.use('/api', GameRoutes);
app.use('/api', HighscoreRoutes);

// Servera frontend-builden
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});