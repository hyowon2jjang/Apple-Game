import { useState } from 'react';
import { State } from './variables';
import Main from './components/Main';
import GAME from './components/Game';
import './App.css';
import Apple from './components/Apple';


function App() {
  const [state, setState] = useState(State.MAIN);
  const [score, setScore] = useState(0);
  const [high_score, setHighScore] = useState(0);

  const states = {
    [State.MAIN]: <Main changeState={setState} high_score={high_score} score={score} />,
    [State.GAME]: <GAME changeState={setState} setTotalScore={setScore} setHighScore={setHighScore} high_score={high_score} />
  }

  return (
    <div>
      {states[state]}
    </div>
  );
}

export default App;
