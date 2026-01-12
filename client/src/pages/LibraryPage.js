// client/src/pages/LibraryPage.js - CORRECTED
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

const LibraryPage = () => {
  const { 
    user, 
    isAuthenticated, 
    userBooks, 
    booksLoading, 
    loadUserBooks,
    updateBookInLibrary,  // Added this
    deleteBookFromLibrary // Added this
  } = useAuth();
  
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    console.log('🔍 LibraryPage useEffect triggered');
    console.log('User authenticated:', isAuthenticated);
    console.log('Books loading:', booksLoading);
    console.log('User books count:', userBooks.length);
    
    if (isAuthenticated && initialLoad) {
      console.log('📚 Loading books for authenticated user');
      loadUserBooks();
      setInitialLoad(false);
    }
  }, [isAuthenticated, loadUserBooks, initialLoad, userBooks.length, booksLoading]);

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Please login to view and manage your personal library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Login to View Library
              </button>
              <button
                onClick={() => navigate('/search')}
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300"
              >
                Browse Books First
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (booksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your library...</h3>
          <p className="text-gray-600">Fetching your saved books</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Main library content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, <span className="font-semibold text-blue-600">{user?.username || 'Reader'}</span>! 
              You have <span className="font-bold">{userBooks.length}</span> {userBooks.length === 1 ? 'book' : 'books'} in your collection.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            + Add More Books
          </button>
        </div>

        {userBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Your library is empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your collection by searching for books and saving them to your library.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
            >
              Search Books to Add
            </button>
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">How to get started:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="font-medium text-blue-700">Search</p>
                  <p className="text-sm text-blue-600">Find books you love</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">💾</div>
                  <p className="font-medium text-green-700">Save</p>
                  <p className="text-sm text-green-600">Click "Save to Library"</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-medium text-purple-700">Track</p>
                  <p className="text-sm text-purple-600">Monitor reading progress</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userBooks.map((book) => (
                <BookCard 
                  key={book._id || book.id || book.googleBooksId}
                  book={book}
                  isSaved={true}
                  onUpdate={updateBookInLibrary}
                  onDelete={deleteBookFromLibrary}
                />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/search')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  + Add More Books
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Back to Top
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg inline-block">
                <p className="text-blue-700">
                  <span className="font-bold">{userBooks.length}</span> books in your collection
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;