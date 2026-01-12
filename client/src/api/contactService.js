import api from './api';

const contactService = {
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getAllContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  }
};

export default contactService;