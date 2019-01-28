import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './PowerHour.css'

const PowerHour = () => {
  const [frequency, setFrequency] = useState(1)
  const [duration, setDuration] = useState(60)
  const [start, setStart] = useState(false)
  const [pregame, setPregame] = useState(3)
  const [time, setTime] = useState(duration * 60 - 60 / frequency)

  const drinkSize = 1.5 // Ounces
  const beerSize = 12 //Ounces
  const totalDrinks = frequency * duration
  const totalBeers = (totalDrinks * drinkSize) / beerSize

  const handleChange = e => {
    const { name, value } = e.target
    name === 'frequency' ? setFrequency(+value) : setDuration(+value)
  }

  useEffect(
    () => {
      let timerId = null
      if (start && pregame) {
        timerId = setInterval(() => {
          setPregame(pregame - 1)
        }, 950)
      } else if (start) {
        timerId = setInterval(() => {
          setTime(time - 1)
        }, 950)
      }
      return () => clearInterval(timerId)
    },
    [start, pregame, time]
  )
  return (
    <>
      {start ? (
        <>
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!totalDrinks}
            onClick={() => {
              setStart(true)
              setTime(duration * 60 - 60 / frequency)
            }}
          >
            Start
          </Button>
          <fieldset>
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
          </fieldset>
        </>
      )}
      <p>Total Drinks: {frequency * duration}</p>
      <p>Beers Required: {totalBeers} (12oz)</p>
    </>
  )
}

export default PowerHour
