import { useState, useRef, useEffect } from 'react';
import { dummyUsers, dummyMessages } from '../utils/dummyData';
import UserListItem from '../components/chat/UserListItem';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const handleUserClick = (user) => {
    setIsLoading(true);
    setSelectedUser(user);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      senderId: 'current-user',
      recipientId: selectedUser.id,
      createdAt: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  // Filter messages for selected conversation
  const conversationMessages = messages.filter(
    (msg) =>
      (msg.senderId === selectedUser.id && msg.recipientId === 'current-user') ||
      (msg.senderId === 'current-user' && msg.recipientId === selectedUser.id)
  );

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - User List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {dummyUsers.map((user) => {
            const userMessageCount = messages.filter(
              (msg) =>
                (msg.senderId === user.id && msg.recipientId === 'current-user') ||
                (msg.senderId === 'current-user' && msg.recipientId === user.id)
            ).length;

            return (
              <UserListItem
                key={user.id}
                user={user}
                isSelected={selectedUser.id === user.id}
                onClick={() => handleUserClick(user)}
                messageCount={userMessageCount}
              />
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {selectedUser.username.charAt(0).toUpperCase()}
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
          ) : conversationMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <>
              {conversationMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === 'current-user'}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatPage;