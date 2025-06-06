import React from 'react';

function about() {
  return (
    <div>
      <h2>Om Wordle-projektet</h2>
      <p>
        Detta är ett Wordle-inspirerat spel som jag byggt som en skoluppgift. 
        Du kan spela spelet, se highscore-listan och läsa om projektet här.
      </p>
      <p>
        Spelet är byggt med React i frontend och Node.js/Express i backend. 
        Highscore-listan sparas på servern och ord slumpas fram från en ordlista.
      </p>
    </div>
  );
}

export default about;