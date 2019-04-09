import React, { useState, useEffect } from 'react'
import soundFile from '../dj-airhorn.mp3'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Spotify from 'spotify-web-api-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SpotifyPlayer.css'

const SpotifyPlayer = ({ accessToken, time, frequency, start }) => {
  const spotifyAPI = new Spotify()
  const [name, setName] = useState('Anonymous')
  const [playing, setPlaying] = useState(false)
  const [song, setSong] = useState({ name: null, artists: null, image: null })
  const [skips, setSkips] = useState(0)
  const [soundEffect, setSoundEffect] = useState(false)
  const [shuffle, setShuffle] = useState(false)

  const audio = new Audio(soundFile)

  useEffect(() => {
    spotifyAPI.setAccessToken(accessToken)
    getUserInfo().then(user => setName(user))
    getPlaybackState().then(playback => {
      const { playing, name, artists, image } = playback
      setPlaying(playing)
      setSong({ name, artists, image })
    })
    spotifyAPI.setShuffle(shuffle, {})
    if (start && !(time % (60 / frequency))) {
      spotifyAPI.skipToNext()
      if (soundEffect) audio.play()
    }
  }, [skips, time, shuffle])

  const getPlaybackState = async () => {
    const currentPlaybackState = await spotifyAPI.getMyCurrentPlaybackState()
    const { is_playing, item } = currentPlaybackState
    if (!item) return { name: 'Nothing Playing' }
    const { name, artists, album } = item
    const image = album.images[1].url
    return {
      playing: is_playing,
      name,
      image,
      artists: artists.map(artist => artist.name).join(', ')
    }
  }

  const getUserInfo = async () => {
    const user = await spotifyAPI.getMe()
    return user.display_name
  }
  const handlePlay = () => {
    playing ? spotifyAPI.pause() : spotifyAPI.play()
    setPlaying(!playing)
  }
  const handleSkip = async e => {
    const { id } = e.target
    id === 'next' ? spotifyAPI.skipToNext() : spotifyAPI.skipToPrevious()
    if (soundEffect) audio.play()
    setPlaying(true)
    setTimeout(() => setSkips(skips + 1), 300)
  }

  return (
    <>
      <h2>{name}</h2>
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
                value="soundEffect"
                checked={soundEffect}
                onChange={() => setSoundEffect(!soundEffect)}
                color="primary"
              />
            }
            label="Sound Effect on Next"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="shuffle"
                checked={shuffle}
                onChange={() => setShuffle(!shuffle)}
                color="primary"
              />
            }
            label="Shuffle Playlist"
          />
        </FormControl>
      </div>
    </>
  )
}

export default SpotifyPlayer
