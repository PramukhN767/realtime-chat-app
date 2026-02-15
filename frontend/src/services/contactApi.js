import api from './api';

export const contactApi = {
    
  sendRequest: async (recipientId) => {
    const response = await api.post('/contacts/request', { recipientId });
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/contacts/requests');
    return response.data;
  },

  acceptRequest: async (requestId) => {
    const response = await api.post(`/contacts/accept/${requestId}`);
    return response.data;
  },

  rejectRequest: async (requestId) => {
    const response = await api.post(`/contacts/reject/${requestId}`);
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },
};

export default contactApi;