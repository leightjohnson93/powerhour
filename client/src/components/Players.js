import React, { useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Offline from './Offline'
import Chat from './Chat'
import './Players.css'

const Players = ({ start }) => {
  const [playOnline, setPlayOnline] = useState(false)

  return (
    <div>
      <h2>Players</h2>
      <FormControlLabel
        control={
          <Checkbox
            value="playOnline"
            checked={playOnline}
            onChange={() => setPlayOnline(!playOnline)}
            color="primary"
          />
        }
        label="Play Online"
      />
      {playOnline ? <Chat /> : <Offline start={start} />}
    </div>
  )
}

export default Players
