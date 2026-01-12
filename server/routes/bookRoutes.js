// server/routes/bookRoutes.js - UPDATED VERSION
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// In-memory database for books
let books = [];

// GET user's books (protected)
router.get('/', protect, (req, res) => {
  try {
    console.log(`📊 User ${req.user._id} requested books`);
    
    // Filter books by user ID
    const userBooks = books.filter(book => book.userId === req.user._id.toString());
    
    res.json({
      success: true,
      data: userBooks,
      count: userBooks.length,
      stats: {
        total: userBooks.length,
        wantToRead: userBooks.filter(book => book.status === 'Want to Read').length,
        reading: userBooks.filter(book => book.status === 'Reading').length,
        completed: userBooks.filter(book => book.status === 'Completed').length
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get books from library'
    });
  }
});

// Save a book to library (protected)
router.post('/', protect, (req, res) => {
  try {
    const { googleBooksId, title, authors, description, thumbnail, pageCount, publishedDate, publisher, categories, averageRating, previewLink } = req.body;
    
    console.log('💾 User', req.user._id, 'saving book:', title);
    
    // Validation
    if (!googleBooksId) {
      return res.status(400).json({
        success: false,
        message: 'Google Books ID is required to save a book'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Book title is required'
      });
    }
    
    // Check if book already exists in user's library
    const existingBook = books.find(book => 
      book.googleBooksId === googleBooksId && book.userId === req.user._id.toString()
    );
    
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'This book is already in your library'
      });
    }
    
    // Create book object with user ID
    const bookId = Date.now().toString();
    const newBook = {
      id: bookId,
      _id: bookId,
      googleBooksId,
      title,
      subtitle: req.body.subtitle || '',
      authors: authors || [],
      description: description || '',
      thumbnail: thumbnail || 'https://via.placeholder.com/128x196/3b82f6/ffffff?text=No+Cover',
      smallThumbnail: req.body.smallThumbnail || thumbnail || 'https://via.placeholder.com/64x96/3b82f6/ffffff?text=No+Cover',
      pageCount: pageCount || 0,
      publishedDate: publishedDate || '',
      publisher: publisher || 'Unknown Publisher',
      categories: categories || [],
      averageRating: averageRating || 0,
      ratingsCount: req.body.ratingsCount || 0,
      previewLink: previewLink || '',
      
      // Library-specific fields
      status: 'Want to Read',
      rating: 0,
      review: '',
      notes: '',
      
      // User association
      userId: req.user._id.toString(),
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      },
      
      // Metadata
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to books array
    books.push(newBook);
    
    console.log(`✅ Book saved successfully: ${title}`);
    console.log(`📚 Total books for user ${req.user.username}: ${books.filter(b => b.userId === req.user._id.toString()).length}`);
    
    res.status(201).json({
      success: true,
      message: 'Book saved to library successfully',
      data: newBook,
      libraryCount: books.filter(b => b.userId === req.user._id.toString()).length
    });
    
  } catch (error) {
    console.error('Save book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save book to library'
    });
  }
});

// Update a book in library (protected)
router.put('/:id', protect, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`✏️ User ${req.user._id} updating book with ID: ${id}`);
    
    // Find book index (only user's own books)
    const bookIndex = books.findIndex(book => 
      book.id === id && book.userId === req.user._id.toString()
    );
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in your library'
      });
    }
    
    // Fields that can be updated by user
    const allowedUpdates = [
      'status', 'rating', 'review', 'notes'
    ];
    
    // Create updated book object
    const updatedBook = {
      ...books[bookIndex],
      updatedAt: new Date().toISOString()
    };
    
    // Apply allowed updates
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updatedBook[field] = updates[field];
      }
    });
    
    // Update in array
    books[bookIndex] = updatedBook;
    
    console.log(`✅ Book updated successfully: ${updatedBook.title}`);
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
    
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update book'
    });
  }
});

// Delete a book from library (protected)
router.delete('/:id', protect, (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ User ${req.user._id} deleting book with ID: ${id}`);
    
    const initialLength = books.length;
    
    // Find the book first (only user's own books)
    const bookToDelete = books.find(book => 
      book.id === id && book.userId === req.user._id.toString()
    );
    
    if (!bookToDelete) {
      console.log(`❌ Book not found with ID: ${id} for user ${req.user._id}`);
      return res.status(404).json({
        success: false,
        message: 'Book not found in your library'
      });
    }
    
    const bookTitle = bookToDelete.title;
    
    // Remove book from array
    books = books.filter(book => 
      !(book.id === id && book.userId === req.user._id.toString())
    );
    
    console.log(`✅ Book deleted successfully: ${bookTitle}`);
    
    res.json({
      success: true,
      message: 'Book deleted from library successfully',
      deletedBook: bookTitle,
      libraryCount: books.filter(b => b.userId === req.user._id.toString()).length
    });
    
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book'
    });
  }
});

// Get library statistics (protected)
router.get('/stats/overview', protect, (req, res) => {
  try {
    const userBooks = books.filter(book => book.userId === req.user._id.toString());
    
    const stats = {
      totalBooks: userBooks.length,
      booksByStatus: {
        wantToRead: userBooks.filter(book => book.status === 'Want to Read').length,
        reading: userBooks.filter(book => book.status === 'Reading').length,
        completed: userBooks.filter(book => book.status === 'Completed').length
      },
      totalPages: userBooks.reduce((sum, book) => sum + (book.pageCount || 0), 0),
      recentlyAdded: userBooks
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
        .slice(0, 5)
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get library statistics'
    });
  }
});

module.exports = router;