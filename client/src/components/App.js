import React, { useState, useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { withFirebase } from './Firebase'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'
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

const AppBase = ({ firebase }) => {
  const [frequency, setFrequency] = useState(1)
  const [duration, setDuration] = useState(60)
  const [start, setStart] = useState(false)
  const [time, setTime] = useState(duration * 60)
  const [inGame, setInGame] = useState(false)
  const [id, setId] = useState('')
  const [startTime, setStartTime] = useState(null)
  const handleChange = (e) => {
    const { name, value } = e.target
    name === 'frequency' ? setFrequency(value) : setDuration(value)
  }

  useEffect(() => {
    let path = window.location.pathname.split('/')[1]
    console.log(path)
    if (path === 'callback') {
      path = localStorage.getItem('gameId')
    }
    joinGame(path)
  }, [])

  const pushGamePath = (id) => {
    const spotifyAuth = window.location.href.split('/#')[1]
    spotifyAuth
      ? window.history.pushState('', 'PowerHour', `/${id}/#${spotifyAuth}`)
      : window.history.pushState('', 'PowerHour', `/${id}`)
  }

  const generateId = () => {
    let result = []
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < 4; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * 26)))
    }
    return result.join('')
  }

  const createGame = () => {
    const id = generateId()
    setId(id)
    setInGame(true)
    pushGamePath(id)
    firebase.createGame(id)
    localStorage.setItem('gameId', id)
  }

  const joinGame = (id) => {
    firebase.getGame(id).then((game) => {
      if (game) {
        setId(id)
        setInGame(true)
        pushGamePath(id)
        if (game.startTime) {
          setStart(true)
          setStartTime(game.startTime)
          setDuration(game.duration)
          setFrequency(game.frequency)
        }
      } else {
        console.log(`Game ${id} does not exist.`)
      }
    })
  }

  return (
    <div className="App">
      <Dialog open={!inGame}>
        <DialogTitle>Get Started</DialogTitle>
        <DialogContent>
          <Button
            variant="outlined"
            color="primary"
            disabled={id.length === 4}
            type="submit"
            onClick={createGame}
          >
            Create Game
          </Button>
          <TextField
            type="text"
            name="gameId"
            label="Game ID"
            variant="outlined"
            margin="normal"
            value={id}
            onChange={(e) => setId(e.target.value.toUpperCase())}
          />
          <Button
            variant="outlined"
            color="primary"
            disabled={!(id.length === 4)}
            type="submit"
            onClick={() => joinGame(id)}
          >
            Join Game
          </Button>
        </DialogContent>
      </Dialog>
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
          startTime={startTime}
          setStartTime={setStartTime}
          id={id}
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
const App = withFirebase(AppBase)

export default App
