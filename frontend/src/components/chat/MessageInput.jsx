import { useState, useEffect } from 'react';

function MessageInput({ onSendMessage, recipientId, socketService }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      socketService?.emit('typing', {
        recipientId,
        isTyping: true,
      });
    }

    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketService?.emit('typing', {
          recipientId,
          isTyping: false,
        });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      if (isTyping) {
        setIsTyping(false);
        socketService?.emit('typing', {
          recipientId,
          isTyping: false,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            message.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageInput;