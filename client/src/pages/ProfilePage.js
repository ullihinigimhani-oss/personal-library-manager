import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <span className="text-2xl text-blue-600">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.username || 'User'}</h2>
            <p className="text-gray-600">{user?.email || 'No email'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Account Information</h3>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          
          <div className="pt-4 border-t">
            <button
              onClick={logout}
              className="btn btn-outline-primary mr-4"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/library')}
              className="btn btn-primary"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;