import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');

  // Fetch all users from the API
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
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setCurrentUserId(decodedToken.userId);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };
    fetchUserId();
  }, []);

  // Fetch users with whom the current user has a chat history
  useEffect(() => {
    if (currentUserId) {
      const fetchChatUsers = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/chat/users/${currentUserId}`);
          setChatUsers(response.data);
        } catch (error) {
          console.error('Error fetching chat users:', error);
        }
      };
      fetchChatUsers();
    }
  }, [currentUserId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (currentUserId) {
      const ws = new WebSocket('ws://localhost:3000');
  
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };
  
      ws.onmessage = async (event) => {
        let data;
  
        // Check if the message is a Blob
        if (event.data instanceof Blob) {
          const text = await event.data.text(); // Convert Blob to text
          data = JSON.parse(text);
        } else {
          data = JSON.parse(event.data); // If it's already text, just parse it
        }
  
        console.log('Received message:', data);
  
        // Check if the message is for the currently selected user
        if (
          (data.sender === currentUserId && data.receiver === selectedUser?._id) ||
          (data.sender === selectedUser?._id && data.receiver === currentUserId)
        ) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };
  
      setWs(ws);
  
      return () => {
        ws.close();
      };
    }
  }, [currentUserId, selectedUser]);
  

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (selectedUser && currentUserId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/chat/history/${currentUserId}/${selectedUser._id}`);
          console.log('Chat history:', response.data);
          setMessages(response.data);
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

    console.log('Sending message:', newMessage);

    // Update messages state immediately
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Send the message to the server
      await axios.post('http://localhost:3000/api/chat/message', newMessage);

      // Send the message via WebSocket
      if (ws) {
        ws.send(JSON.stringify(newMessage));
      }

      // Clear the input field
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Helper function to get the last message for a user
  const getLastMessage = (userId: string) => {
    const lastMessage = messages
      .filter(
        (msg) =>
          (msg.sender === currentUserId && msg.receiver === userId) ||
          (msg.sender === userId && msg.receiver === currentUserId)
      )
      .slice(-1)[0];
    return lastMessage ? `${lastMessage.sender === currentUserId ? 'You: ' : ''}${lastMessage.message}` : '';
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with Tabs */}
      <div className="w-1/3 border-r border-gray-300 p-4 bg-gray-100 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 p-2 text-center border border-gray-300 rounded-md ${activeTab === 'chats' ? 'bg-green-500 text-white font-bold' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`w-1/2 p-2 text-center border border-gray-300 rounded-md ${activeTab === 'friends' ? 'bg-green-500 text-white font-bold' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
        </div>

        {activeTab === 'chats' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chats</h2>
            <ul className="list-none p-0">
              {chatUsers.map((user) => (
                <li
                  key={user._id}
                  className={`p-3 border-b border-gray-300 cursor-pointer ${selectedUser?._id === user._id ? 'bg-green-500 text-white' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="font-semibold text-lg">{user.name}</div>
                  <div className="text-gray-500 text-sm">{getLastMessage(user._id)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'friends' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Friends</h2>
            <ul className="list-none p-0">
              {users.map((user) => (
                <li
                  key={user._id}
                  className={`p-2 cursor-pointer ${selectedUser?._id === user._id ? 'bg-green-500 text-white' : ''} border-b border-gray-300`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="font-semibold">{user.name}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Chat Section */}
      {selectedUser && (
        <div className="w-2/3 p-4 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-gray-300 p-4 bg-gray-50">
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.sender === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-300 p-4 bg-gray-50 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-l-md"
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-md ml-2"
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
