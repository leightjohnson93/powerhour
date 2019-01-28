import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Spotify from 'spotify-web-api-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SpotifyPlayer.css'

const SpotifyPlayer = ({ accessToken }) => {
  const spotifyAPI = new Spotify()
  const [user, setUser] = useState({
    name: 'Anonymous',
    image: 'http://www.chugh.com/wp-content/uploads/2018/03/default_user.jpg'
  })
  const [playing, setPlaying] = useState(false)
  const [song, setSong] = useState({ name: null, artists: null })
  const [skips, setSkips] = useState(0)

  useEffect(
    () => {
      spotifyAPI.setAccessToken(accessToken)
      getUserInfo().then(user => setUser(user))
      getPlaybackState().then(playback => {
        const { playing, name, artists } = playback
        setPlaying(playing)
        setSong({ name, artists })
      })
    },
    [skips]
  )

  const getPlaybackState = async () => {
    const currentPlaybackState = await spotifyAPI.getMyCurrentPlaybackState()
    const { is_playing, item } = currentPlaybackState
    const { name, artists } = item
    return {
      playing: is_playing,
      name,
      artists: artists.map(artist => artist.name).join(', ')
    }
  }

  const getUserInfo = async () => {
    const user = await spotifyAPI.getMe()
    const name = user.display_name
    const image = user.images[0].url
    return { name, image }
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
      <img src={user.image} alt={user.name} />
      <h2>{user.name}</h2>
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
