import { useEffect, useState } from 'react';
import Die from './Die';
import './App.css';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';



function App() {
  const [dice, setDice] = useState(renderDie());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(() => {
    const storedScore = localStorage.getItem('savedScore');
    if (storedScore) {
      return { ...JSON.parse(storedScore), currentScore: 0 };
    } else {
      return {
        currentScore: 0,
        prevScore: 0,
        bestScore: Number.MAX_SAFE_INTEGER,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('savedScore', JSON.stringify(rolls));
  }, [rolls, dice]);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstvalue = dice[0].value;
    const allSamevalue = dice.every((die) => die.value === firstvalue);
    if (allHeld && allSamevalue) {
      setTenzies(true);
      setRolls((calculateScore) => ({
        ...calculateScore,
        bestScore: calculateScore.bestScore
          ? Math.min(calculateScore.currentScore, calculateScore.bestScore)
          : Math.min(
              calculateScore.bestScore === Number.MAX_SAFE_INTEGER
                ? calculateScore.currentScore
                : calculateScore.prevScore,
              calculateScore.currentScore
            ),
      }));
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
      id: nanoid(),
    };
  }

  function renderDie() {
    const newDice = [];
    const die_count = 10;

    for (let i = 0; i < die_count; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      onClick={() => holdDie(die.id)}
    />
  ));

  function rerollDie() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return !die.isHeld ? generateNewDie() : die;
        })
      );
      setRolls((rollsCount) => ({
        ...rollsCount,
        currentScore: rollsCount.currentScore + 1,
      }));
    } else {
      setTenzies(false);
      setDice(renderDie());
      setRolls((resetCount) => ({
        ...resetCount,
        currentScore: 0,
        prevScore: resetCount.currentScore,
      }));
    }
  }

  function holdDie(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function resetScore() {
    localStorage.clear('savedScore');
    setTenzies(false);
    setDice(renderDie());
    setRolls({
      currentScore: 0,
      prevScore: 0,
      bestScore: Number.MAX_SAFE_INTEGER,
    });
  }
  const { width, height } = useWindowSize(
    window.innerWidth,
    window.innerHeight
  );
  console.log(width);
  return (
    <>
      {tenzies && (
        <Confetti
          width={width}
          height={height}
        />
      )}
      <main>
        <h1>Tenzies</h1>
        <h3>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </h3>
        <div className='die-wrap'>{diceElements}</div>
        {!tenzies ? (
          <button
            className='roll-button'
            onClick={rerollDie}
          >
            Roll
          </button>
        ) : (
          ''
        )}
        {tenzies ? (
          <div className='score'>
            <p>Rolls to Tenzies: {rolls.currentScore}</p>
            <p>Previous Score: {rolls.prevScore}</p>
            <p>Best Score: {rolls.bestScore}</p>
            <button
              className='new-game-button'
              onClick={rerollDie}
            >
              New Game
            </button>
            <button
              className='reset-score-button'
              onClick={resetScore}
            >
              Reset Score
            </button>
          </div>
        ) : (
          ''
        )}
      </main>
    </>
  );
}

export default App;
