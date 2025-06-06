const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ladda ordlista
const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/words.json'), 'utf8'));

// Route: Hämta ett slumpmässigt ord med viss längd
router.get('/word', (req, res) => {
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

router.post('/feedback', (req, res) => {
    const { guess, answer } = req.body;
    if (!guess || !answer) {
        return res.status(400).json({ error: 'Gissning och svar krävs.' });
    }
    const feedback = getFeedback(guess.toUpperCase(), answer.toUpperCase());
    // Omvandla till färger för frontend
    const colorFeedback = feedback.map(f => {
        if (f.result === 'correct') return 'green';
        if (f.result === 'misplaced') return 'yellow';
        return 'gray';
    });
    res.json({ feedback: colorFeedback });
});

function getFeedback(guess, answer) {
    return Array.from(guess).map((char, i) => ({
        letter: char,
        result: guess[i] === answer[i] ? 'correct' : answer.includes(char) ? 'misplaced' : 'wrong'
    }));
}

module.exports = router;