// client/src/api/bookService.js - UPDATED
import api from './api';

const bookService = {
  searchBooks: async (query) => {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  },

  getUserBooks: async () => {
    try {
      const response = await api.get('/books');
      console.log('📚 getUserBooks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user books:', error);
      throw error;
    }
  },

  saveBook: async (bookData) => {
    try {
      console.log('💾 Saving book:', bookData.title);
      const response = await api.post('/books', bookData);
      console.log('✅ Save book response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error saving book:', error);
      throw error;
    }
  },

  updateBook: async (bookId, updateData) => {
    try {
      console.log('✏️ Updating book:', bookId, updateData);
      const response = await api.put(`/books/${bookId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating book:', error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      console.log('🗑️ Deleting book:', bookId);
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting book:', error);
      throw error;
    }
  }
};

export default bookService;