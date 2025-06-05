const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5080;

app.use(cors());
app.use(express.json());

// ordlista 
const words = JSON.parse(fs.readFileSync('./words.json', 'utf8'));

// Ladda eller initiera highscore-lista
const highscoresPath = './highscores.json';
let highscores = [];
if (fs.existsSync(highscoresPath)) {
    highscores = JSON.parse(fs.readFileSync(highscoresPath, 'utf8'));
}

// Route: Hämta ett slumpmässigt ord med viss längd
app.get('/api/word', (req, res) => {
    const length = parseInt(req.query.length) || 5;
    const allowRepeats = req.query.allowRepeats === 'true';

    let filtered = words.filter(word => word.length === length);
    if (!allowRepeats) {
        filtered = filtered.filter(word => new Set(word).size === word.length);
    }

    if (filtered.length === 0) {
        return res.status(404).json({ error: 'Inga ord hittades.' });
    }

    const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
    res.json({ word: randomWord });
});

// Route: Hämta highscore-listan
app.get('/api/highscores', (req, res) => {
    res.json(highscores);
});

// Route: Lägg till ny highscore
app.post('/api/highscores', (req, res) => {
    const { name, time, guesses, length, allowRepeats } = req.body;
    if (!name || !time || !guesses || !length) {
        return res.status(400).json({ error: 'Felaktig data.' });
    }
    const entry = { name, time, guesses, length, allowRepeats };
    highscores.push(entry);
    // Sortera efter tid (lägst först)
    highscores.sort((a, b) => a.time - b.time);
    // Spara till fil
    fs.writeFileSync(highscoresPath, JSON.stringify(highscores, null, 2));
    res.status(201).json({ message: 'Highscore sparad!' });
});

app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});