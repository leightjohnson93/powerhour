import React, { useState, useEffect } from "react";
import soundFile from "../dj-airhorn.mp3";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SpotifyPlayer.css";

const SpotifyPlayer = ({ next, spotifyAPI }) => {
  const [name, setName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState({ name: null, artists: null, image: null });
  const [skips, setSkips] = useState(0);
  const [soundEffect, setSoundEffect] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [audio] = useState(new Audio(soundFile));
  const [hasActiveDevice, setHasActiveDevice] = useState(false);

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForActiveDevice();
      getPlaybackState();
      getUserInfo();
    }, 1000);
    if (hasActiveDevice) {
      if (next) {
        spotifyAPI.skipToNext();
        if (soundEffect) audio.play();
      }
    }
    return () => clearInterval(interval);
  }, [skips, next, shuffle]);

  const getPlaybackState = async () => {
    const currentPlaybackState = await spotifyAPI.getMyCurrentPlaybackState();
    const { is_playing, item, shuffle_state } = currentPlaybackState;
    if (!item) return { name: "Nothing Playing" };
    const { name, artists, album } = item;
    const image = album.images[1].url;
    setShuffle(shuffle_state);
    setPlaying(is_playing);
    setSong({
      name,
      artists: artists.map(artist => artist.name).join(", "),
      image
    });
  };

  const checkForActiveDevice = async () => {
    setHasActiveDevice(
      (await spotifyAPI.getMyDevices()).devices.some(
        ({ is_active }) => is_active
      )
    );
  };

  const getUserInfo = async () => {
    const user = await spotifyAPI.getMe();
    return setName(user.display_name);
  };
  const handlePlay = () => {
    playing ? spotifyAPI.pause() : spotifyAPI.play();
    setPlaying(!playing);
  };
  const handleSkip = async e => {
    const { id } = e.target;
    id === "next" ? spotifyAPI.skipToNext() : spotifyAPI.skipToPrevious();
    if (soundEffect) audio.play();
    setPlaying(true);
    setTimeout(() => setSkips(skips + 1), 300);
  };

  const handleShuffle = async () => {
    setShuffle(!shuffle);
    spotifyAPI.setShuffle(!shuffle);
  };

  return (
    <>
      <h2>{name}</h2>
      {hasActiveDevice ? (
        <>
          <img src={song.image} alt={song.name} />
          <div className="controls">
            <Button id="previous" onClick={handleSkip}>
              <FontAwesomeIcon icon="backward" />
            </Button>
            <Button onClick={handlePlay}>
              {playing ? (
                <FontAwesomeIcon icon="pause" />
              ) : (
                <FontAwesomeIcon icon="play" />
              )}
            </Button>
            <Button id="next" onClick={handleSkip}>
              <FontAwesomeIcon icon="forward" />
            </Button>
          </div>
          <div className="now-playing">
            <h3>{song.name}</h3>
            <p>{song.artists}</p>
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    value="shuffle"
                    checked={shuffle}
                    onChange={handleShuffle}
                    color="primary"
                  />
                }
                label="Shuffle Playlist"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="soundEffect"
                    checked={soundEffect}
                    onChange={() => setSoundEffect(!soundEffect)}
                    color="primary"
                  />
                }
                label="Sound Effect"
              />
            </FormControl>
            {soundEffect && (
              <Grid container spacing={2}>
                <Grid item xs>
                  <Slider
                    style={{ width: 200 }}
                    value={volume}
                    onChange={(e, newVolume) => setVolume(newVolume)}
                    max={1}
                    min={0}
                    step={0.001}
                  />
                </Grid>
              </Grid>
            )}
          </div>
        </>
      ) : (
        <h3>Start Playing Spotify from the App</h3>
      )}
    </>
  );
};

export default SpotifyPlayer;
