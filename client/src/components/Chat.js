import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import uniqBy from 'lodash.uniqby'
import { Query, Mutation } from 'react-apollo'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import ChatBox from './ChatBox'

const ALL_CHATS_QUERY = gql`
  query ALL_CHATS_QUERY($last: Int, $skip: Int) {
    allChats(last: $last, skip: $skip) {
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
  let messagesEnd
  const [from, setFrom] = useState('')
  const [content, setContent] = useState('')
  const [last, setLast] = useState(10)

  useEffect(() => messagesEnd && messagesEnd.scrollIntoView({ behavior: 'smooth' }), [content])
  useEffect(() => setFrom(localStorage.getItem('from')), [])

  return (
    <>
      <TextField
        type="text"
        label="Name"
        placeholder={'Enter your name'}
        variant="outlined"
        margin="normal"
        value={from || ''}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Query query={ALL_CHATS_QUERY} variables={{ last }}>
        {({ data, error, loading, subscribeToMore }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          messagesEnd && messagesEnd.scrollIntoView({ behavior: 'smooth' })
          return (
            <div className="Chat-box">
              <Button onClick={() => setLast(last + 10)}>More Messages</Button>
              {uniqBy(data.allChats, 'id').map((message) => (
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
                        const newChatLinks = [...previous.allChats, subscriptionData.data.Chat.node]
                        const result = {
                          ...previous,
                          allChats: newChatLinks,
                        }
                        return result
                      },
                    })
                  }}
                />
              ))}
              <div
                key="messagesEnd"
                style={{ float: 'left', clear: 'both' }}
                ref={(el) => {
                  messagesEnd = el
                }}
              />
            </div>
          )
        }}
      </Query>
      <Mutation mutation={CREATE_CHAT_MUTATION} variables={{ content: content.trim(), from }}>
        {(createChat, { loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.message}</p>
          return (
            <TextField
              className="content"
              multiline
              value={content}
              onChange={(e) => setContent(e.target.value.replace('\n', '').replace('\r', ''))}
              type="text"
              placeholder="Your Message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && content.trim()) {
                  if (!from) {
                    setFrom('anonymous')
                    setTimeout(() => {
                      createChat()
                      setContent('')
                      setFrom('')
                    }, 50)
                  } else {
                    createChat()
                    setContent('')
                    localStorage.setItem('from', from)
                  }
                }
              }}
            />
          )
        }}
      </Mutation>
    </>
  )
}

export default Chat
