const { getFeedback } = require('./feedback');

// Test 1 – olika typer av träffar

test('ger korrekt feedback för "HALLÅ" mot "CYKLA"', () => {
  const guess = 'HALLÅ';
  const correct = 'CYKLA';
  const expected = [
    { letter: 'H', result: 'incorrect' },
    { letter: 'A', result: 'misplaced' },
    { letter: 'L', result: 'incorrect' },
    { letter: 'L', result: 'correct' },
    { letter: 'Å', result: 'incorrect' }
  ];

  expect(getFeedback(guess, correct)).toEqual(expected);
});

test('alla bokstäver är correct om orden är samma', () => {
  const guess = 'FISKA';
  const correct = 'FISKA';
  const expected = [
    { letter: 'F', result: 'correct' },
    { letter: 'I', result: 'correct' },
    { letter: 'S', result: 'correct' },
    { letter: 'K', result: 'correct' },
    { letter: 'A', result: 'correct' }
  ];

  expect(getFeedback(guess, correct)).toEqual(expected);
});