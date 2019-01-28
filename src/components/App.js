import React, { Component } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import SpotifyContainer from './SpotifyContainer'
import PowerHour from './PowerHour'
import './App.css'

import {
  faPlay,
  faPause,
  faForward,
  faBackward
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlay)
library.add(faPause)
library.add(faForward)
library.add(faBackward)

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar className="App-header">
          <h2>Power Hour</h2>
        </AppBar>
        <Paper className="Power-hour">
          <PowerHour />
        </Paper>
        <Paper className="Spotify-container">
          <SpotifyContainer />
        </Paper>
      </div>
    )
  }
}

export default App
