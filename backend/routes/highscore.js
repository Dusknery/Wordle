const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const highscoresPath = path.join(__dirname, '../database/highscores.json');

// Hämta highscores
router.get('/highscores', (req, res) => {
    let highscores = [];
    if (fs.existsSync(highscoresPath)) {
        highscores = JSON.parse(fs.readFileSync(highscoresPath, 'utf8'));
    }
    res.json(highscores);
});

// Lägg till ny highscore
router.post('/highscores', (req, res) => {
    const { name, time, guesses, length, allowRepeats } = req.body;
    if (!name || !time || !guesses || !length) {
        return res.status(400).json({ error: 'Felaktig data.' });
    }
    let highscores = [];
    if (fs.existsSync(highscoresPath)) {
        highscores = JSON.parse(fs.readFileSync(highscoresPath, 'utf8'));
    }
    const cleanName = name.replace(/[^A-Za-zÅÄÖåäö ]/g, '').slice(0, 30); // max 30 tecken
    const entry = { name: cleanName, time, guesses, length, allowRepeats };
    highscores.push(entry);
    highscores.sort((a, b) => a.time - b.time); // sortera på tid
    fs.writeFileSync(highscoresPath, JSON.stringify(highscores, null, 2));
    res.status(201).json({ message: 'Highscore sparad!' });
});

module.exports = router;