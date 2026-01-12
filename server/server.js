const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('🔧 Checking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found, loading environment variables...');
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️ .env file not found, using default values...');
  // Create a default .env file
  const defaultEnv = `PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:Lihini123@cluster0.msplvlm.mongodb.net/personal-library-manager?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=personal_library_manager_secret_key_2024
GOOGLE_BOOKS_API_KEY=AIzaSyBL6dcnHzRWBv0fn7mixsNFIJWodaqrqTU
CLIENT_URL=http://localhost:3000`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created default .env file');
  require('dotenv').config({ path: envPath });
}

// Debug environment variables
console.log('\n📊 Environment Variables:');
console.log('PORT:', process.env.PORT || '5000 (default)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development (default)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Loaded' : '✗ Not loaded');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with fallback
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://admin:Lihini123@cluster0.msplvlm.mongodb.net/personal-library-manager?retryWrites=true&w=majority&appName=Cluster0';

console.log('\n🔗 Connecting to MongoDB...');
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const contactRoutes = require('./routes/contactRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    success: true,
    status: 'OK',
    message: 'Personal Library Manager API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: states[mongoState] || 'unknown',
      readyState: mongoState
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Personal Library Manager API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      books: {
        getAll: 'GET /api/books',
        save: 'POST /api/books',
        update: 'PUT /api/books/:id',
        delete: 'DELETE /api/books/:id'
      },
      search: {
        search: 'GET /api/search?q={query}'
      },
      contact: {
        submit: 'POST /api/contact'
      }
    }
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      '/api',
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/books',
      '/api/search?q={query}',
      '/api/contact'
    ]
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  
  🚀 Server Status Summary:
  ========================
  ✅ Server running on port ${PORT}
  ✅ API: http://localhost:${PORT}/api
  ✅ Health: http://localhost:${PORT}/api/health
  ✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
  ✅ Environment: ${process.env.NODE_ENV || 'development'}
  
  📋 Available Endpoints:
  ======================
  • GET  /api           - API documentation
  • GET  /api/health    - Health check
  • POST /api/auth/register - Register user
  • POST /api/auth/login    - Login user
  • GET  /api/auth/me       - Get user profile
  • GET  /api/books         - Get all books
  • POST /api/books         - Save a book
  • PUT  /api/books/:id     - Update a book
  • DELETE /api/books/:id   - Delete a book
  • GET  /api/search?q=...  - Search books
  • POST /api/contact        - Submit contact form
  
  🎉 Server is ready! Test it at: http://localhost:${PORT}/api/health
  `);
});

module.exports = app;