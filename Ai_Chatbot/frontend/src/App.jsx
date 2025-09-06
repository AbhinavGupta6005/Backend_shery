import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [inputMessage, setInputMessage] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (response) => {
      const botmessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: "ai"  
      }
      setConversationHistory(prev => [...prev, botmessage])
    })

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage = {
      text: "👋 Welcome! How can I assist you today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
    setConversationHistory([welcomeMessage])
  }, []) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message to conversation
    const newMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setConversationHistory(prev => [...prev, newMessage])
    
    // Emit message to socket if socket exists
    if (socket) {
      socket.emit('ai-message', inputMessage)
    }
    
    setInputMessage('') // Clear input after sending
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Chat Assistant</h1>
      </div>

      <div className="chat-messages">
        {conversationHistory.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-timestamp">
              {message.timestamp}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default App
