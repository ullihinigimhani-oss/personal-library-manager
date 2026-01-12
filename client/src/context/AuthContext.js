// client/src/context/AuthContext.js - UPDATED
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../api/authService';
import bookService from '../api/bookService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBooks, setUserBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        console.log('🔄 Initializing auth, stored user:', storedUser);
        
        if (storedUser) {
          setUser(storedUser);
          // Don't load books here - let LibraryPage handle it
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };
    
    initAuth();
  }, []);

  // Load user's books
  const loadUserBooks = useCallback(async () => {
    if (!user) {
      console.log('⚠️ No user, skipping book load');
      setUserBooks([]);
      return;
    }
    
    setBooksLoading(true);
    console.log('📚 Starting to load books for user:', user.username);
    
    try {
      const response = await bookService.getUserBooks();
      console.log('📚 Books API response:', response);
      
      if (response && response.success) {
        setUserBooks(response.data || []);
        console.log('✅ Books loaded successfully:', (response.data || []).length, 'books');
      } else {
        console.error('❌ Failed to load books - invalid response:', response);
        setUserBooks([]);
      }
    } catch (err) {
      console.error('❌ Error loading books:', err);
      setUserBooks([]);
    } finally {
      setBooksLoading(false);
      console.log('✅ Books loading complete');
    }
  }, [user]);

  // Register
  const register = async (userData) => {
    try {
      console.log('👤 Registering user:', userData.username);
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setUserBooks([]); // Start with empty books
        console.log('✅ Registration successful');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Registration error:', err);
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      console.log('🔑 Logging in user:', credentials.email);
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setUserBooks([]); // Clear old books first
        await loadUserBooks(); // Load books after login
        console.log('✅ Login successful');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    console.log('🚪 Logging out user');
    authService.logout();
    setUser(null);
    setUserBooks([]);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Add book to library
  const addBookToLibrary = async (bookData) => {
    try {
      console.log('💾 Adding book to library:', bookData.title);
      const result = await bookService.saveBook(bookData);
      
      if (result.success) {
        setUserBooks(prev => {
          const newBooks = [result.data, ...prev];
          console.log('✅ Book added, total books:', newBooks.length);
          return newBooks;
        });
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error adding book:', err);
      throw err;
    }
  };

  // Update book
  const updateBookInLibrary = async (bookId, updateData) => {
    try {
      console.log('✏️ Updating book:', bookId);
      const result = await bookService.updateBook(bookId, updateData);
      
      if (result.success) {
        setUserBooks(prev => 
          prev.map(book => 
            (book._id === bookId || book.id === bookId) ? { ...book, ...updateData } : book
          )
        );
        console.log('✅ Book updated successfully');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error updating book:', err);
      throw err;
    }
  };

  // Delete book
  const deleteBookFromLibrary = async (bookId) => {
    try {
      console.log('🗑️ Deleting book:', bookId);
      const result = await bookService.deleteBook(bookId);
      
      if (result.success) {
        setUserBooks(prev => {
          const newBooks = prev.filter(book => 
            book._id !== bookId && book.id !== bookId
          );
          console.log('✅ Book deleted, remaining books:', newBooks.length);
          return newBooks;
        });
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error deleting book:', err);
      throw err;
    }
  };

  // Refresh books
  const refreshUserBooks = async () => {
    console.log('🔄 Refreshing user books');
    await loadUserBooks();
  };

  const value = {
    user,
    loading,
    userBooks,
    booksLoading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    addBookToLibrary,
    updateBookInLibrary,
    deleteBookFromLibrary,
    loadUserBooks,
    refreshUserBooks
  };

  console.log('🔄 AuthContext value updated:', {
    user: user?.username,
    isAuthenticated: !!user,
    booksLoading,
    userBooksCount: userBooks.length
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};