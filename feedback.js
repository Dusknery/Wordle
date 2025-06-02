function getFeedback(guess, answer) {
  const result = [];
  const correctLetters = answer.split('');
  const usedIndexes = new Array(answer.length).fill(false);

  // Markera rätt bokstav på rätt plats
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = { letter: guess[i], result: 'correct' };
      usedIndexes[i] = true;
    }
  }

  // Markera bokstäver som är på fel plats (misplaced)
  for (let i = 0; i < guess.length; i++) {
    if (!result[i]) {
      let found = false;
      for (let j = 0; j < answer.length; j++) {
        if (!usedIndexes[j] && guess[i] === answer[j]) {
          found = true;
          usedIndexes[j] = true;
          break;
        }
      }
      result[i] = {
        letter: guess[i],
        result: found ? 'misplaced' : 'incorrect'
      };
    }
  }

  return result;
}

module.exports = { getFeedback };