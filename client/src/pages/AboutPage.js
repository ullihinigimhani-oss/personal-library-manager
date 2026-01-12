import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Personal Library Manager</h1>
            <p className="text-xl text-gray-600">Your digital companion for book lovers</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Personal Library Manager was created to help book enthusiasts organize, track, and discover books in their reading journey. 
              We believe that every book tells a story, and we want to help you keep track of all the stories that matter to you.
            </p>
            <p className="text-gray-700">
              With integration to Google Books API, you can search millions of titles, save them to your personal library, 
              and track your reading progress with ease.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Search millions of books using Google Books API</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Create and manage your personal digital library</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track reading status (Want to Read, Reading, Completed)</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add personal reviews and ratings</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure authentication with JWT</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Responsive design for all devices</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">Frontend</h3>
                <ul className="space-y-1">
                  <li>React.js with Hooks</li>
                  <li>Tailwind CSS for styling</li>
                  <li>React Router for navigation</li>
                  <li>Axios for API calls</li>
                  <li>Context API for state management</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Backend</h3>
                <ul className="space-y-1">
                  <li>Node.js & Express.js</li>
                  <li>MongoDB with Mongoose</li>
                  <li>JWT for authentication</li>
                  <li>Google Books API integration</li>
                  <li>Bcryptjs for password hashing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;