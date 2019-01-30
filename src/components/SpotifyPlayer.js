import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Spotify from 'spotify-web-api-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SpotifyPlayer.css'

const SpotifyPlayer = ({ accessToken, time, frequency, start }) => {
  const spotifyAPI = new Spotify()
  const [name, setName] = useState('Anonymous')
  const [playing, setPlaying] = useState(false)
  const [song, setSong] = useState({ name: null, artists: null, image: null })
  const [skips, setSkips] = useState(0)

  useEffect(
    () => {
      spotifyAPI.setAccessToken(accessToken)
      getUserInfo().then(user => setName(user))
      getPlaybackState().then(playback => {
        const { playing, name, artists, image } = playback
        setPlaying(playing)
        setSong({ name, artists, image })
      })
      if (start && !(time % (60 / frequency))) {
        spotifyAPI.skipToNext()
      }
    },
    [skips, time]
  )

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
      </div>
    </>
  )
}

export default SpotifyPlayer
