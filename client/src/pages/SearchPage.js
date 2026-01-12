import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookService from '../api/bookService';
import BookCard from '../components/BookCard';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addBookToLibrary, isAuthenticated } = useAuth();

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await bookService.searchBooks(query);
      setResults(data.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a book to library
  const handleSaveBook = async (book) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/search' } });
      return;
    }

    try {
      const bookData = {
        googleBooksId: book.id,
        title: book.title,
        subtitle: book.subtitle || '',
        authors: book.authors || [],
        description: book.description || '',
        thumbnail: book.thumbnail || '',
        previewLink: book.previewLink || '',
        publishedDate: book.publishedDate || '',
        pageCount: book.pageCount || 0,
        categories: book.categories || [],
        averageRating: book.averageRating || 0
      };

      await addBookToLibrary(bookData);
      alert('✅ Book saved to library!');
    } catch (err) {
      console.error('Add to library error:', err);
      alert('❌ ' + (err.response?.data?.message || 'Failed to add book to library'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Books</h1>
          <p className="text-gray-600 mt-2">
            Search for books using the Google Books API
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for books...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results ({results.length})
            </h2>
            {results.map((book) => (
              <BookCard 
                key={book.id}
                book={book}
                isSaved={false}
                onSave={() => handleSaveBook(book)}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">
              No books found for "{query}"
            </h3>
            <p className="mt-1 text-gray-500">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900">
              Search for books
            </h3>
            <p className="mt-1 text-gray-500">
              Try searching by title, author, or keyword
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Example: "Harry Potter", "Stephen King", "Science Fiction"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;