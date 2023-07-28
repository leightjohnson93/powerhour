import React, { useEffect, useState } from 'react';
import { withFirebase } from './Firebase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PowerHour.css';

const PowerHourBase = (props) => {
  const {
    frequency,
    duration,
    handleChange,
    time,
    setTime,
    start,
    setStart,
    id,
    firebase,
    setStartTime,
    startTime,
    setInGame,
  } = props;

  const [gameOver, setGameOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const drinkSize = 1.5;
  const beerSize = 12;
  const totalDrinks = frequency * duration;
  const totalBeers = (totalDrinks * drinkSize) / beerSize;
  const drinksConsumed = totalDrinks - time / (60 / frequency);
  const beersConsumed = (drinksConsumed / 8).toFixed(2);

  const formatSecondsUntilDrink = () => {
    const secondsUntilDrink = Math.round((time - 1) % (60 / frequency));
    if (secondsUntilDrink === null) {
      return 'PowerHour';
    } else if (secondsUntilDrink === 0) {
      return 'DRINK!';
    } else if (secondsUntilDrink > 0) {
      return secondsUntilDrink;
    }
  };

  useEffect(() => {
    let timerId = null;
    if (start && time > 0) {
      document.title = formatSecondsUntilDrink();
      timerId = setInterval(() => {
        startTime
          ? setTime(
              duration * 60 - (firebase.getUnixTime() / 1000 - startTime / 1000)
            )
          : setTime(duration * 60 - 1);
      }, 500);
    } else {
      setGameOver(time <= 0);
      setStart(false);
    }
    return () => clearInterval(timerId);
  }, [start, time]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      {
        <Dialog open={gameOver} onClose={() => setGameOver(false)}>
          <DialogTitle>YOU WIN</DialogTitle>
          <DialogContent>
            <DialogContentText>nice</DialogContentText>
          </DialogContent>
        </Dialog>
      }
      <div className="gameId">
        <h3>Game ID: {id}</h3>
        <Tooltip title="Copy share link">
          <Button onClick={handleCopy}>
            <FontAwesomeIcon icon={copied ? 'check' : 'copy'} />
          </Button>
        </Tooltip>
      </div>
      {start ? (
        <>
          <h1>Game in Progress</h1>
          <h2>{`Drinks: ${Math.floor(drinksConsumed)} 🍺`}</h2>
          <p>{`${beersConsumed} beers drank`}</p>
          <h2>{formatSecondsUntilDrink()}</h2>
        </>
      ) : (
        <>
          <h2>Welcome to Power Hour!</h2>
          <p>
            Be sure to sign into Spotify before starting a game because
            authentication requires a page refresh. Select a playlist from your
            Spotify App and Power Hour will change the song every time you need
            to drink!
          </p>
          <br />
          <p>
            Select a drink frequency and total duration. Make sure you have
            enough beer!
          </p>
          <form className="rules-input">
            <TextField
              type="number"
              name="frequency"
              label="drinks/minute"
              placeholder="1"
              variant="outlined"
              margin="normal"
              value={frequency}
              onChange={handleChange}
            />
            <TextField
              type="number"
              name="duration"
              placeholder="60"
              variant="outlined"
              margin="normal"
              label="total minutes"
              value={duration}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={frequency <= 0 || duration <= 0}
              onClick={(e) => {
                e.preventDefault();
                setStartTime(firebase.startGame(frequency, duration));
                setStart(true);
              }}
            >
              Start
            </Button>
          </form>
        </>
      )}
      <p>
        Total Drinks:{' '}
        {parseFloat((frequency * duration).toString().slice(0, 6))}
      </p>
      <p>
        Beers Required: {parseFloat(totalBeers.toString().slice(0, 6))} (12oz)
      </p>
      <p>
        {start && <Button onClick={() => setStart(false)}>End Game</Button>}
        <Button onClick={() => {setInGame(false) }}>Join a different game</Button>
      </p>
    </>
  );
};

const PowerHour = withFirebase(PowerHourBase);

export default PowerHour;
