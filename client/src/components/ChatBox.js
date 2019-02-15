import React, { useEffect } from 'react'
import moment from 'moment'

const ChatBox = ({ message, subscribeToNewChats }) => {
  useEffect(() => subscribeToNewChats(), [])
  return (
    <div>
      <h5>{message.from}</h5>
      <span>{moment(message.createdAt).fromNow()}</span>
      <p>{message.content}</p>
    </div>
  )
}

export default ChatBox
