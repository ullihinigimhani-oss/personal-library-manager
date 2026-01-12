const Book = require('../models/Book');
const User = require('../models/User');
const axios = require('axios');

// Save book to user's library
exports.saveBook = async (req, res) => {
  try {
    const { googleBooksId, ...bookData } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!googleBooksId || !bookData.title) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and title are required'
      });
    }

    // Check if book already saved
    const existingBook = await Book.findOne({
      user: userId,
      googleBooksId
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book already saved in your library'
      });
    }

    // Create new book
    const book = new Book({
      user: userId,
      googleBooksId,
      ...bookData,
      savedAt: new Date()
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book saved to library successfully',
      data: book
    });
  } catch (error) {
    console.error('Save book error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book already saved in your library'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save book'
    });
  }
};

// Get user's saved books
exports.getUserBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // Build query
    const query = { user: userId };
    if (status && ['Want to Read', 'Reading', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Get books
    const books = await Book.find(query).sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: await Book.countDocuments({ user: userId }),
      wantToRead: await Book.countDocuments({ user: userId, status: 'Want to Read' }),
      reading: await Book.countDocuments({ user: userId, status: 'Reading' }),
      completed: await Book.countDocuments({ user: userId, status: 'Completed' })
    };

    res.json({
      success: true,
      data: books,
      stats
    });
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get books'
    });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    // Allowed fields for update
    const allowedUpdates = ['status', 'rating', 'review'];
    const updateData = {};
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    // Find and update book
    const book = await Book.findOneAndUpdate(
      { _id: bookId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update book'
    });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findOneAndDelete({
      _id: bookId,
      user: userId
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book'
    });
  }
};

// Get book details from library
exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findOne({
      _id: bookId,
      user: userId
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get book'
    });
  }
};

// Get library statistics
exports.getLibraryStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = {
      totalBooks: await Book.countDocuments({ user: userId }),
      booksByStatus: {
        wantToRead: await Book.countDocuments({ user: userId, status: 'Want to Read' }),
        reading: await Book.countDocuments({ user: userId, status: 'Reading' }),
        completed: await Book.countDocuments({ user: userId, status: 'Completed' })
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get library stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get library statistics'
    });
  }
};