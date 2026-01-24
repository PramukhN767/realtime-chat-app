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

export const dummyMessages = [
  {
    id: '1',
    content: 'Waku waku!',
    senderId: '1',
    recipientId: 'current-user',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    content: 'Hey Anya! How was school today?',
    senderId: 'current-user',
    recipientId: '1',
    createdAt: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    content: 'I got a stella star!',
    senderId: '1',
    recipientId: 'current-user',
    createdAt: new Date(Date.now() - 3000000),
  },
  {
    id: '4',
    content: 'That is amazing! I am proud of you.',
    senderId: 'current-user',
    recipientId: '1',
    createdAt: new Date(Date.now() - 2500000),
  },
];