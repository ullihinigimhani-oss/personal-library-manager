import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">📚</span>
            <span className="text-xl font-bold text-blue-600">MyLibrary</span>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                Home
              </Link>
              {user && (
                <>
                  <Link to="/library" className="text-gray-600 hover:text-blue-600 font-medium">
                    My Library
                  </Link>
                  <Link to="/search" className="text-gray-600 hover:text-blue-600 font-medium">
                    Search Books
                  </Link>
                  <Link to="/add-book" className="text-gray-600 hover:text-blue-600 font-medium">
                    Add Book
                  </Link>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:inline font-medium text-gray-700">
                      {user.username || user.email}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">
                      Profile Settings
                    </Link>
                    <Link to="/library" className="block px-4 py-3 text-gray-700 hover:bg-gray-50">
                      My Library
                    </Link>
                    <hr className="border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;