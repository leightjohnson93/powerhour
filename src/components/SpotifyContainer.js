import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import ConnectSpotify from './ConnectSpotify'
import SpotifyPlayer from './SpotifyPlayer'
import Spotify from 'spotify-web-api-js';


const SpotifyContainer = ({ next }) => {
  const spotifyAPI = new Spotify()
  const [authentication, setAuthentication] = useState({
    loggedIn: false,
    accessToken: null,
  })
  useEffect(() => {
    let interval;
    const accessToken = checkUrlForSpotifyAccessToken()
    if (accessToken) {
      spotifyAPI.setAccessToken(accessToken);
      setAuthentication({ loggedIn: true, accessToken })
      interval = setInterval(logoutIfInvalid, 5000)
    }
    return () => clearInterval(interval);
  }, [])
  
  const checkUrlForSpotifyAccessToken = () => {
    const params = getHashParams()
    const accessToken = params.access_token
    return accessToken ? accessToken : false
  }
  const getHashParams = () => {
    //helper function to parse the query string that spotify sends back when you log in
    const hashParams = {}
    let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1)
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }
    return hashParams
  }
  const logout = () =>
  setAuthentication({
    loggedIn: false,
    accessToken: null,
  })
  
  const logoutIfInvalid = async () => {
      spotifyAPI.getMe({}, (error) => error && error.status === 401 && logout())
    }

  return (
    <>
      <h2>Spotify Player</h2>
      {authentication.loggedIn ? (
        <>
          <SpotifyPlayer
            next={next}
            spotifyAPI={spotifyAPI}
          />
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <ConnectSpotify />
      )}
    </>
  )
}

export default SpotifyContainer
