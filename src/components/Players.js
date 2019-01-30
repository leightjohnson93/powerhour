import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import './Players.css'

const Players = () => {
  const [newPlayer, setNewPlayer] = useState('')
  const [players, setPlayers] = useState([])

  const handleAdd = e => {
    e.preventDefault()
    players.push(newPlayer)
    setPlayers(players)
    setNewPlayer('')
  }
  return (
    <div>
      <h2>Players</h2>
      <form className="player-input">
        <TextField
          type="text"
          name="name"
          label="name"
          placeholder="name"
          variant="outlined"
          margin="normal"
          value={newPlayer}
          onChange={e => setNewPlayer(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          onClick={handleAdd}
        >
          Add
        </Button>
      </form>
      <List>
        {players.map(player => (
          <ListItemText key={player} primary={player} />
        ))}
      </List>
    </div>
  )
}

export default Players
