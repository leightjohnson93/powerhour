import React from 'react'
import Button from '@material-ui/core/Button'
import './ConnectSpotify.css'

const ConnectSpotify = () => {
  function redirectUrlToSpotifyForLogin() {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
    const REDIRECT_URI =
      process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SPOTIFY_PRODUCTION_REDIRECT_URI
        : process.env.REACT_APP_SPOTIFY_DEVELOPMENT_REDIRECT_URI
    const scopes = [
      'user-modify-playback-state',
      'user-library-read',
      'user-library-modify',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-playback-state'
    ]
    return (
      'https://accounts.spotify.com/authorize?client_id=' +
      CLIENT_ID +
      '&redirect_uri=' +
      encodeURIComponent(REDIRECT_URI) +
      '&scope=' +
      encodeURIComponent(scopes.join(' ')) +
      '&response_type=token' +
      '&show_dialog=true'
    )
  }
  return (
    <div className="Connect-spotify">
      <p>
        Connect your Spotify account so that Power Hour can control the music!
      </p>
      <a href={redirectUrlToSpotifyForLogin()}>
        <Button variant="outlined" color="primary">
          Connect to Spotify
        </Button>
      </a>
    </div>
  )
}

export default ConnectSpotify
