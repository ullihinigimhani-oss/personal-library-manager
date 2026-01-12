import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, isSaved = false, onSave, onUpdate, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [review, setReview] = useState(book.review || '');
  const [status, setStatus] = useState(book.status || 'Want to Read');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please login to save books');
      return;
    }

    setLoading(true);
    try {
      await onSave(book);
      alert('✅ Book saved to library!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to save book'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!book._id) return;
    
    setLoading(true);
    try {
      await onUpdate(book._id, { review, status });
      setShowEditForm(false);
      alert('✅ Book updated successfully!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to update book'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book._id || !window.confirm('Are you sure you want to remove this book from your library?')) return;
    
    setLoading(true);
    try {
      await onDelete(book._id);
      alert('✅ Book removed from library!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to delete book'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reading': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Want to Read': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-1/4 mb-6 md:mb-0 md:mr-6">
            <div className="relative">
              <img
                src={book.thumbnail || 'https://via.placeholder.com/300x400?text=No+Cover'}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                }}
              />
              {book.pageCount > 0 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {book.pageCount} pages
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h3>
                {book.subtitle && (
                  <p className="text-gray-600 italic mb-2">{book.subtitle}</p>
                )}
                <p className="text-gray-700">
                  <span className="font-medium">By:</span> {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || 'Unknown'}
                </p>
                
                {book.publishedDate && (
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="font-medium">Published:</span> {book.publishedDate}
                  </p>
                )}
                
                {book.averageRating > 0 && (
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(book.averageRating))}
                      {'☆'.repeat(5 - Math.floor(book.averageRating))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">
                      {book.averageRating} ({book.ratingsCount || 0} ratings)
                    </span>
                  </div>
                )}
              </div>

              {isSaved ? (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Save to Library</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 line-clamp-3">
                {book.description || 'No description available.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>📖</span>
                    <span>Preview on Google Books</span>
                  </a>
                )}
                
                {isSaved && (
                  <>
                    <button
                      onClick={() => setShowEditForm(!showEditForm)}
                      disabled={loading}
                      className="text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-1 transition-colors"
                    >
                      <span>{showEditForm ? '❌' : '✏️'}</span>
                      <span>{showEditForm ? 'Cancel Edit' : 'Edit Review/Status'}</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 transition-colors"
                    >
                      <span>🗑️</span>
                      <span>Remove from Library</span>
                    </button>
                  </>
                )}
              </div>
              
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.categories.slice(0, 3).map((category, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Form */}
            {showEditForm && isSaved && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Update Book Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reading Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="Want to Read">📚 Want to Read</option>
                      <option value="Reading">📖 Currently Reading</option>
                      <option value="Completed">✅ Completed</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Share your thoughts about this book..."
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Display Review if exists */}
            {isSaved && book.review && !showEditForm && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">📝 Your Review:</h4>
                <p className="text-blue-700 italic">"{book.review}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;