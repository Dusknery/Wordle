const readline = require('readline');
const { getFeedback } = require('./feedback');

const answer = 'CYKLA'; // Byt ut mot valfritt ord

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function fråga() {
  rl.question('Gissa ordet: ', (guess) => {
    const feedback = getFeedback(guess.toUpperCase(), answer);
    console.log(feedback.map(f => `${f.letter}: ${f.result}`).join(' | '));
    if (guess.toUpperCase() === answer) {
      console.log('Rätt! Du vann!');
      rl.close();
    } else {
      fråga();
    }
  });
}

console.log('Välkommen till Wordle!');
fråga();