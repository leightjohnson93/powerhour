import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { AUTH_TOKEN } from '../constants'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

const Login = ({ setAuthToken }) => {
  const [login, setLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const confirm = async data => {
    const { token } = login ? data.login : data.signup
    setAuthToken(token)
    localStorage.setItem(AUTH_TOKEN, token)
  }

  return (
    <div>
      <h3>{login ? 'Login' : 'SignUp'}</h3>
      <form className="login">
        {!login && (
          <TextField
            value={name}
            label="Name"
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your Name"
            variant="outlined"
          />
        )}
        <TextField
          value={email}
          label="Email"
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Email Address"
          variant="outlined"
        />
        <TextField
          value={password}
          label="Password"
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          variant="outlined"
        />
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={data => confirm(data)}
        >
          {mutation => (
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              onClick={mutation}
            >
              {login ? 'login' : 'create account'}
            </Button>
          )}
        </Mutation>
        <Button className="pointer button" onClick={() => setLogin(!login)}>
          {login ? 'need to create an account?' : 'already have an account?'}
        </Button>
      </form>
    </div>
  )
}

export default Login
