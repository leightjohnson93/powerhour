import React, { useState, useEffect } from 'react'
import './SpotifyContainer.css'
import Button from '@material-ui/core/Button'
import ConnectSpotify from './ConnectSpotify'
import SpotifyPlayer from './SpotifyPlayer'

const SpotifyContainer = ({ time, frequency, start }) => {
  const [authentication, setAuthentication] = useState({
    loggedIn: false,
    accessToken: null
  })
  useEffect(() => {
    const accessToken = checkUrlForSpotifyAccessToken()
    if (accessToken) {
      setAuthentication({ loggedIn: true, accessToken })
    }
  }, {})

  const checkUrlForSpotifyAccessToken = () => {
    const params = getHashParams()
    const accessToken = params.access_token
    return accessToken ? accessToken : false
  }
  const getHashParams = () => {
    //helper function to parse the query string that spotify sends back when you log in
    var hashParams = {}
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1)
    // eslint-disable-next-line
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }
    return hashParams
  }
  const logout = () =>
    setAuthentication({
      loggedIn: false,
      accessToken: null
    })
  return (
    <div>
      {authentication.loggedIn ? (
        <>
          <Button onClick={logout}>Logout</Button>
          <SpotifyPlayer
            accessToken={authentication.accessToken}
            time={time}
            frequency={frequency}
            start={start}
          />
        </>
      ) : (
        <ConnectSpotify />
      )}
    </div>
  )
}

export default SpotifyContainer
