// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Define interfaces for your data
interface User {
  _id: string;
  name: string;
}

interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
}

interface DecodedToken {
  userId: string;
}

const Main = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch current user ID from token
  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem('token'); // Adjust according to your token storage
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setCurrentUserId(decodedToken.userId); // Adjust field based on your token structure
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };
    fetchUserId();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    if (currentUserId) {
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data as string);
        console.log('Received message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      setWs(ws);

      return () => {
        ws.close();
      };
    }
  }, [currentUserId]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser && currentUserId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/chat/history/${currentUserId}/${selectedUser._id}`);
          console.log('Chat history:', response.data);
          setMessages(response.data); // Display messages in reverse order
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      fetchChatHistory();
    }
  }, [selectedUser, currentUserId]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
  
    const newMessage: Message = {
      sender: currentUserId!,
      receiver: selectedUser._id,
      message,
      timestamp: new Date().toISOString(),
    };
  
    console.log('Sending message:', newMessage); // Log the message object for debugging
  
    try {
      await axios.post('http://localhost:3000/api/chat/message', newMessage);
      if (ws) {
        ws.send(JSON.stringify(newMessage));
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className={`cursor-pointer p-2 ${selectedUser?._id === user._id ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      {selectedUser && (
        <div className="w-2/3 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Chat with {selectedUser.name}</h2>
          <div className="flex-1 overflow-y-auto border border-gray-300 p-4 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.sender === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <small className={`block text-xs ${msg.sender === currentUserId ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
