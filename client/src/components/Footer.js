import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Left Section */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">Personal Library Manager</h2>
            <p className="text-gray-300">
              Manage your book collection with ease
            </p>
          </div>

          {/* Middle Section - Links */}
          <div className="mb-6 md:mb-0">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link to="/search" className="text-gray-300 hover:text-white transition">
                Search
              </Link>
              <Link to="/library" className="text-gray-300 hover:text-white transition">
                Library
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              &copy; {currentYear} Personal Library Manager
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Built with MERN Stack
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            This product uses the Google Books API but is not endorsed or certified by Google.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For educational purposes only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;