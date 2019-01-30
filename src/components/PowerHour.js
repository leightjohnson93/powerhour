import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './PowerHour.css'

const PowerHour = props => {
  const {
    frequency,
    duration,
    handleChange,
    time,
    setTime,
    start,
    setStart
  } = props
  const [pregame, setPregame] = useState(3)

  const drinkSize = 1.5 // Ounces
  const beerSize = 12 //Ounces
  const totalDrinks = frequency * duration
  const totalBeers = (totalDrinks * drinkSize) / beerSize

  useEffect(
    () => {
      let timerId = null
      if (start && pregame) {
        timerId = setInterval(() => {
          setPregame(pregame - 1)
        }, 950)
      } else if (start && time) {
        document.title = time % 60 || 'Power Hour'
        timerId = setInterval(() => {
          setTime(time - 1)
        }, 950)
      } else if (start && !time) {
        setStart(false)
        setPregame(3)
      }
      return () => clearInterval(timerId)
    },
    [start, pregame, time]
  )
  return (
    <>
      {start ? (
        <>
          <h1>Game in Progress</h1>
          <h2>
            {pregame
              ? 'GET READY'
              : `Drinks: ${Math.floor(
                  totalDrinks - time / (60 / frequency)
                )} 🍺`}
          </h2>
          <h2>{pregame || time % (60 / frequency)}</h2>
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
              disabled={!totalDrinks}
              onClick={() => {
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
      <p>Beers Required: {totalBeers} (12oz)</p>
    </>
  )
}

export default PowerHour
