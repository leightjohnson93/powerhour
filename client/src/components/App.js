import React, { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import SpotifyContainer from './SpotifyContainer'
import PowerHour from './PowerHour'
import Players from './Players'
import './App.css'

import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlay)
library.add(faPause)
library.add(faForward)
library.add(faBackward)
library.add(faInfoCircle)

const App = () => {
  const [frequency, setFrequency] = useState(1)
  const [duration, setDuration] = useState(60)
  const [start, setStart] = useState(false)
  const [time, setTime] = useState(duration * 60)
  const handleChange = (e) => {
    const { name, value } = e.target
    name === 'frequency' ? setFrequency(value) : setDuration(value)
  }
  return (
    <div className="App">
      <AppBar className="App-header" position="absolute">
        <h2>Power Hour</h2>
      </AppBar>
      <Paper className="Power-hour">
        <PowerHour
          frequency={frequency}
          duration={duration}
          handleChange={handleChange}
          time={time}
          setTime={setTime}
          start={start}
          setStart={setStart}
        />
      </Paper>
      <Paper className="Spotify-container">
        <SpotifyContainer time={time} frequency={frequency} start={start} />
      </Paper>
      <Paper className="Players">
        <Players start={start} />
      </Paper>
    </div>
  )
}

export default App
