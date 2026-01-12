const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  googleBooksId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  authors: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  previewLink: {
    type: String,
    default: ''
  },
  publishedDate: {
    type: String,
    default: ''
  },
  pageCount: {
    type: Number,
    default: 0
  },
  categories: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Want to Read', 'Reading', 'Completed'],
    default: 'Want to Read'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  review: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't save the same book twice
bookSchema.index({ user: 1, googleBooksId: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);