import React from 'react';
import Offline from './Offline';
import './Players.css';

const Players = ({ start }) => (
  <div>
    <h2>Players</h2>
    <Offline start={start} />
  </div>
);

export default Players;
