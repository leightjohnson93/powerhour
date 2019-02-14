import React, { useEffect } from 'react'

const ChatBox = ({ message, subscribeToNewChats }) => {
  useEffect(() => subscribeToNewChats(), [])
  return (
    <div>
      <h5>{message.from}</h5>
      <p>{message.content}</p>
    </div>
  )
}

export default ChatBox
