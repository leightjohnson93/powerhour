import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import getRandomEmoji from "../emojis";
import "./Players.css";

const Offline = ({ start }) => {
  const [newPlayer, setNewPlayer] = useState("");
  const [players, setPlayers] = useState([]);
  const handleAdd = e => {
    e.preventDefault();
    const playerName = createPlayer();
    if (playerName.length > 5) {
      players.push(playerName);
      setPlayers(players);
      setNewPlayer("");
    }
  };

  const createPlayer = () =>
    `${
      newPlayer.toLowerCase().includes("alex") ||
      newPlayer.toLowerCase().includes("fig")
        ? "💩"
        : getRandomEmoji()
    } ${newPlayer} ${start ? "*" : ""}`;

  const latePlayers = () => {
    for (let player of players) {
      if (player.includes("*")) return <p>*Player added after Start of Game</p>;
    }
  };
  return (
    <>
      <form className="player-input" autoComplete="off">
        <TextField
          type="text"
          label="Name"
          placeholder={start ? "Game In Progress" : " Name"}
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
            <ListItemIcon className="emoji">
              <span>{player.slice(0, 2)}</span>
            </ListItemIcon>
            <ListItemText primary={player.slice(2)} />
            <ListItemIcon
              onClick={() =>
                setPlayers(players.filter(name => player !== name))
              }
            >
              <Button>
                <span role="img" aria-label="delete">
                  ❌
                </span>
              </Button>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      {latePlayers()}
    </>
  );
};

export default Offline;
