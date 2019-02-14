import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import uniqBy from 'lodash.uniqby'
import { Query, Mutation, Subscription, subscribeToMore } from 'react-apollo'
import TextField from '@material-ui/core/TextField'
import ChatBox from './ChatBox'

const ALL_CHATS_QUERY = gql`
  query ALL_CHATS_QUERY {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`
const CREATE_CHAT_MUTATION = gql`
  mutation CREATE_CHAT_MUTATION($content: String!, $from: String!) {
    createChat(content: $content, from: $from) {
      id
      createdAt
      from
      content
    }
  }
`

const Chat = () => {
  const [from, setFrom] = useState('')
  const [content, setContent] = useState('')

  // useEffect(() => subscribeToNewChats())

  //   const subscribeToNewChats = () => {
  //     subscribeToMore({
  //       document: gql`
  //         subscription {
  //           Chat(filter: { mutation_in: [CREATED] }) {
  //             node {
  //               id
  //               from
  //               content
  //               createdAt
  //             }
  //           }
  //         }
  //       `,
  //       updateQuery: (previous, { subscriptionData }) => {
  //         const newChatLinks = [
  //           ...previous.allChats,
  //           subscriptionData.data.Chat.node
  //         ]
  //         const result = {
  //           ...previous,
  //           allChats: newChatLinks
  //         }
  //         return result
  //       }
  //     })
  //   }

  return (
    <div>
      <TextField
        type="textarea"
        label="Name"
        placeholder={'Enter your name'}
        variant="outlined"
        margin="normal"
        value={from}
        onChange={e => setFrom(e.target.value)}
      />
      <Query query={ALL_CHATS_QUERY}>
        {({ data, error, loading, subscribeToMore }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          return (
            <div>
              {uniqBy(data.allChats, 'id').map(message => (
                <ChatBox
                  key={message.id}
                  message={message}
                  subscribeToNewChats={() => {
                    subscribeToMore({
                      document: gql`
                        subscription {
                          Chat(filter: { mutation_in: [CREATED] }) {
                            node {
                              id
                              from
                              content
                              createdAt
                            }
                          }
                        }
                      `,
                      updateQuery: (previous, { subscriptionData }) => {
                        const newChatLinks = [
                          ...previous.allChats,
                          subscriptionData.data.Chat.node
                        ]
                        const result = {
                          ...previous,
                          allChats: newChatLinks
                        }
                        return result
                      }
                    })
                  }}
                />
              ))}
            </div>
          )
        }}
      </Query>
      <Mutation mutation={CREATE_CHAT_MUTATION} variables={{ content, from }}>
        {(createChat, { loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          return (
            <TextField
              value={content}
              onChange={e => setContent(e.target.value)}
              type="text"
              placeholder="Your Message..."
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  !from && setFrom('anonymous')
                  setTimeout(() => {
                    createChat()
                    setContent('')
                    setFrom('')
                  }, 50)
                }
              }}
            />
          )
        }}
      </Mutation>
    </div>
  )
}

export default Chat
