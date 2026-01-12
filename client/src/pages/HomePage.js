import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Personal Library</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Organize your book collection, track your reading journey, and discover new adventures in the world of literature.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/library" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium"
                >
                  📖 Go to My Library
                </Link>
                <Link 
                  to="/search" 
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-lg font-medium"
                >
                  🔍 Search Books
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium"
                >
                  🚀 Get Started Free
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-lg font-medium"
                >
                  🔑 Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need for your reading journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-6 text-blue-600">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Book Search</h3>
            <p className="text-gray-600">
              Search millions of books using Google Books API. Find exactly what you're looking for with advanced filters.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-6 text-purple-600">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Digital Bookshelf</h3>
            <p className="text-gray-600">
              Organize your books with custom shelves. Track reading status, add reviews, and rate your favorite books.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-6 text-green-600">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reading Insights</h3>
            <p className="text-gray-600">
              Visualize your reading habits with detailed statistics. Set goals and celebrate your reading achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-blue-100">Books to Discover</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Free Forever</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Access Anywhere</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">📱</div>
              <div className="text-blue-100">Mobile Friendly</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to organize your reading life?
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of readers who use Personal Library to track their books and discover new favorites.
        </p>
        {!user && (
          <Link 
            to="/register" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium"
          >
            📚 Start Your Free Journey
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;