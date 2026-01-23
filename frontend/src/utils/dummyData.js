// Fake users for testing
export const dummyUsers = [
  {
    id: '1',
    username: 'Anya Forger',
    email: 'anya@example.com',
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: '2',
    username: 'Loid Forger',
    email: 'loid@example.com',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), 
  },
  {
    id: '3',
    username: 'Yor Forger',
    email: 'yor@example.com',
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: '4',
    username: 'Bond',
    email: 'bond@example.com',
    isOnline: false,
    lastSeen: new Date(Date.now() - 86400000), 
  },
];

// Fake messages for testing
export const dummyMessages = [
  {
    id: '1',
    content: 'Hey, how are you?',
    senderId: '1',
    recipientId: 'current-user',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    content: 'I am good! How about you?',
    senderId: 'current-user',
    recipientId: '1',
    createdAt: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    content: 'Doing great! Working on a new project.',
    senderId: '1',
    recipientId: 'current-user',
    createdAt: new Date(Date.now() - 3000000),
  },
  {
    id: '4',
    content: 'That sounds exciting! Tell me more.',
    senderId: 'current-user',
    recipientId: '1',
    createdAt: new Date(Date.now() - 2500000),
  },
  {
    id: '5',
    content: 'It is a real-time chat app with AI features.',
    senderId: '1',
    recipientId: 'current-user',
    createdAt: new Date(Date.now() - 2000000),
  },
];