import React, { useState } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../constants'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import Login from './Login'

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      name
      drinks
    }
  }
`

const Online = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_TOKEN))
  return (
    <>
      <Query query={USERS_QUERY}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          return (
            <List className="players">
              {data.users.map(user => (
                <ListItem key={user.id} className="player">
                  <ListItemIcon className="emoji">
                    <span>{user.drinks}</span>
                  </ListItemIcon>
                  {user.name}
                </ListItem>
              ))}
            </List>
          )
        }}
      </Query>
      {authToken ? (
        <Button
          onClick={() => {
            setAuthToken('')
            localStorage.removeItem(AUTH_TOKEN)
          }}
        >
          Logout
        </Button>
      ) : (
        <Login setAuthToken={setAuthToken} />
      )}
    </>
  )
}

export default Online
