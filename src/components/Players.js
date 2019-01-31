import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import getRandomEmoji from '../emojis'
import './Players.css'

const Players = () => {
  const [newPlayer, setNewPlayer] = useState('')
  const [players, setPlayers] = useState([])

  const handleAdd = e => {
    e.preventDefault()
    console.log(createPlayer())
    players.push(createPlayer())
    setPlayers(players)
    setNewPlayer('')
  }

  const createPlayer = () =>
    `${
      newPlayer.toLowerCase().includes('alex') ||
      newPlayer.toLowerCase().includes('fig')
        ? '💩'
        : getRandomEmoji()
    } ${newPlayer}`

  return (
    <div>
      <h2>Players</h2>
      <form className="player-input" autoComplete="off">
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
      <List className="players">
        {players.map(player => (
          <ListItem key={player} className="player">
            <ListItemIcon>
              <span>{player.slice(0, 2)}</span>
            </ListItemIcon>
            <ListItemText primary={player.slice(2)} />
            <ListItemIcon
              onClick={() =>
                setPlayers(players.filter(name => player !== name))
              }
            >
              <Button>&times;</Button>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default Players
