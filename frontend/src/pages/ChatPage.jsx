import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import contactApi from '../services/contactApi';
import { Link } from 'react-router-dom';
import socketService from '../services/socket';
import UserListItem from '../components/chat/UserListItem';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';

function ChatPage() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      console.log('Connecting to socket...');
      socketService.connect(token);

      socketService.on('receive_message', (message) => {
        console.log('Received message:', message);
        handleReceiveMessage(message);
      });

      socketService.on('message_sent', (message) => {
        console.log('Message sent confirmed:', message);
        handleMessageSent(message);
      });

      socketService.on('user_status_changed', handleUserStatusChange);
      socketService.on('user_typing', handleUserTyping);

      return () => {
        socketService.off('receive_message', handleReceiveMessage);
        socketService.off('message_sent', handleMessageSent);
        socketService.off('user_status_changed', handleUserStatusChange);
        socketService.off('user_typing', handleUserTyping);
      };
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const contacts = await contactApi.getContacts();
      setUsers(contacts);
      if (contacts.length > 0) {
        setSelectedUser(contacts[0]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async (userId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiveMessage = (message) => {
    if (selectedUser) {
      const isRelevant = 
        (message.senderId === selectedUser.id && message.recipientId === user.id) ||
        (message.senderId === user.id && message.recipientId === selectedUser.id);
      
      if (isRelevant) {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    }
  };

  const handleMessageSent = (message) => {
    setMessages((prev) => 
      prev.map(m => 
        typeof m.id === 'string' && m.id.startsWith('temp-') && m.content === message.content
          ? message
          : m
      )
    );
  };

  const handleUserStatusChange = ({ userId, isOnline }) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isOnline } : user
      )
    );

    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => ({ ...prev, isOnline }));
    }
  };

  const handleUserTyping = ({ userId, isTyping }) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async (content) => {
    if (!selectedUser) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content,
      senderId: user.id,
      recipientId: selectedUser.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    socketService.emit('send_message', {
      recipientId: selectedUser.id,
      content,
    });
  };

  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingUsers) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-xl font-bold text-white">Messages</h2>
          </div>
          <div className="flex-1 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 mb-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-600">No contacts yet. Add some contacts to start chatting!</p>
        <Link
          to="/find-contacts"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Find Contacts
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar --- User List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <p className="text-sm text-blue-100">{user?.username}</p>
            </div>
            <div className="flex gap-2">
              {/* Add Contacts Button */}
              <Link
                to="/find-contacts"
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition"
              >
                + Add
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          ) : (
            filteredUsers.map((chatUser) => (
              <UserListItem
                key={chatUser.id}
                user={chatUser}
                isSelected={selectedUser?.id === chatUser.id}
                onClick={() => handleUserClick(chatUser)}
                messageCount={0}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Chatting Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                {selectedUser.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedUser.username}</h3>
                <p className="text-sm text-gray-500">
                  {selectedUser.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwnMessage={message.senderId === user.id}
                    />
                  ))}
                  
                  {/* Typing Indicator */}
                  {typingUsers.has(selectedUser?.id) && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <MessageInput 
              onSendMessage={handleSendMessage} 
              recipientId={selectedUser.id} 
              socketService={socketService}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Chat App
            </h3>
            <p className="text-gray-600 mb-4">
              Select a conversation from the sidebar to start messaging
            </p>
            <p className="text-sm text-gray-500">
              {users.length} {users.length === 1 ? 'user' : 'users'} available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;