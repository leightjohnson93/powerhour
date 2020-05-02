import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import './PowerHour.css'

const PowerHour = (props) => {
  const { frequency, duration, handleChange, time, setTime, start, setStart } = props

  const [gameOver, setGameOver] = useState(false)

  const drinkSize = 1.5
  const beerSize = 12
  const totalDrinks = frequency * duration
  const totalBeers = (totalDrinks * drinkSize) / beerSize
  const drinksConsumed = totalDrinks - time / (60 / frequency)
  const beersConsumed = (drinksConsumed / 8).toFixed(2)

  useEffect(
    () => {
      let timerId = null
      if (start && time > 0) {
        document.title = (time - 1) % (60 / frequency) || 'PowerHour'
        timerId = setInterval(() => {
          setTime(time - 1)
        }, 950)
      } else {
        setGameOver(time === 0)
        setStart(false)
      }
      return () => clearInterval(timerId)
    },
    [start, time]
  )

  return (
    <>
      {
        <Dialog open={gameOver} onClose={() => setGameOver(false)}>
          <DialogTitle>YOU WIN</DialogTitle>
          <DialogContent>
            <DialogContentText>Congratulations, you're probably an alcoholic.</DialogContentText>
          </DialogContent>
        </Dialog>
      }
      {start ? (
        <>
          <h1>Game in Progress</h1>
          <h2>{`Drinks: ${Math.floor(drinksConsumed)} 🍺`}</h2>
          <p>{`${beersConsumed} beers drank`}</p>
          <h2>{Math.round((time - 1) % (60 / frequency))}</h2>
        </>
      ) : (
        <>
          <h2>Welcome to Power Hour!</h2>
          <p>
            Be sure to sign into Spotify before starting a game because authentication requires a
            page refresh. Select a playlist from your Spotify App and Power Hour will change the
            song every time you need to drink!
          </p>
          <br />
          <p>Select a drink frequency and total duration. Make sure you have enough beer!</p>
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
                e.preventDefault()
                setStart(true)
                setTime(duration * 60)
              }}
            >
              Start
            </Button>
          </form>
        </>
      )}
      <p>Total Drinks: {frequency * duration}</p>
      <p>Beers Required: {parseFloat(totalBeers.toString().slice(0, 6))} (12oz)</p>
    </>
  )
}

export default PowerHour
