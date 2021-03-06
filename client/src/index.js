import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import Firebase, { FirebaseContext } from './components/Firebase'

const wsLink = new WebSocketLink({
  uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cjs487hob3xfz0102pbvwvpje',
  options: {
    reconnect: true,
  },
})

const httpLink = createHttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjs487hob3xfz0102pbvwvpje',
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </FirebaseContext.Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
