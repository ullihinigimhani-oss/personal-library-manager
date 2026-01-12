import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/library')}
          className="btn btn-outline-primary mb-8"
        >
          ← Back to Library
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Details</h1>
          <p className="text-gray-600 mb-6">Viewing book ID: {id}</p>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Book Title</h2>
              <p className="text-gray-600">Sample book details will appear here</p>
            </div>
            
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-gray-600">Detailed book view coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;