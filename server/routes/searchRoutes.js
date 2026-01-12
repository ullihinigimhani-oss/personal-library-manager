const express = require('express');
const router = express.Router();
const axios = require('axios');

// Your Google Books API Key
const GOOGLE_BOOKS_API_KEY = 'AIzaSyB_JNSU9FLHS0D1Ll6OGkQfOPAwxL8fHfY';

// Search books from Google Books API
router.get('/', async (req, res) => {
  try {
    const { q, maxResults = 20 } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    console.log('🔍 Searching Google Books for:', q);
    console.log('Using API Key:', GOOGLE_BOOKS_API_KEY.substring(0, 15) + '...');
    
    try {
      // Make request to Google Books API
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: q.trim(),
          key: GOOGLE_BOOKS_API_KEY,
          maxResults: parseInt(maxResults),
          orderBy: 'relevance',
          printType: 'books',
          langRestrict: 'en'
        },
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalLibraryManager/1.0'
        }
      });
      
      console.log(`✅ Google Books API Success! Found ${response.data.items?.length || 0} books`);
      
      // Process books data
      const books = (response.data.items || []).map(item => {
        const volumeInfo = item.volumeInfo || {};
        
        return {
          id: item.id, // Google Books ID - CRITICAL for saving
          googleBooksId: item.id, // Explicit field for saving
          title: volumeInfo.title || 'Unknown Title',
          subtitle: volumeInfo.subtitle || '',
          authors: volumeInfo.authors || ['Unknown Author'],
          description: volumeInfo.description 
            ? (volumeInfo.description.length > 300 
              ? volumeInfo.description.substring(0, 300) + '...' 
              : volumeInfo.description)
            : 'No description available',
          thumbnail: volumeInfo.imageLinks?.thumbnail 
            ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
            : 'https://via.placeholder.com/128x196/3b82f6/ffffff?text=No+Cover',
          smallThumbnail: volumeInfo.imageLinks?.smallThumbnail 
            ? volumeInfo.imageLinks.smallThumbnail.replace('http://', 'https://')
            : 'https://via.placeholder.com/64x96/3b82f6/ffffff?text=No+Cover',
          pageCount: volumeInfo.pageCount || 0,
          publishedDate: volumeInfo.publishedDate || '',
          publisher: volumeInfo.publisher || 'Unknown Publisher',
          categories: volumeInfo.categories || [],
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
          previewLink: volumeInfo.previewLink || '',
          infoLink: volumeInfo.infoLink || '',
          language: volumeInfo.language || 'en',
          isbn10: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
          isbn13: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || ''
        };
      });
      
      return res.json({
        success: true,
        query: q,
        count: books.length,
        totalResults: response.data.totalItems || 0,
        source: 'google-books-api',
        data: books
      });
      
    } catch (apiError) {
      console.error('❌ Google Books API Error Details:');
      console.error('Status:', apiError.response?.status);
      console.error('Status Text:', apiError.response?.statusText);
      console.error('Error Message:', apiError.response?.data?.error?.message);
      
      // Try without API key as fallback (limited results)
      console.log('🔄 Trying Google Books API without key...');
      try {
        const fallbackResponse = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: q.trim(),
            maxResults: 10, // Limited for no-key access
            printType: 'books'
          },
          timeout: 10000
        });
        
        console.log(`✅ Fallback Success! Found ${fallbackResponse.data.items?.length || 0} books`);
        
        const fallbackBooks = (fallbackResponse.data.items || []).map(item => {
          const volumeInfo = item.volumeInfo || {};
          
          return {
            id: item.id,
            googleBooksId: item.id,
            title: volumeInfo.title || 'Unknown Title',
            subtitle: volumeInfo.subtitle || '',
            authors: volumeInfo.authors || ['Unknown Author'],
            description: volumeInfo.description 
              ? (volumeInfo.description.length > 200 
                ? volumeInfo.description.substring(0, 200) + '...' 
                : volumeInfo.description)
              : 'No description available',
            thumbnail: volumeInfo.imageLinks?.thumbnail 
              ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
              : 'https://via.placeholder.com/128x196/3b82f6/ffffff?text=No+Cover',
            smallThumbnail: volumeInfo.imageLinks?.smallThumbnail 
              ? volumeInfo.imageLinks.smallThumbnail.replace('http://', 'https://')
              : 'https://via.placeholder.com/64x96/3b82f6/ffffff?text=No+Cover',
            pageCount: volumeInfo.pageCount || 0,
            publishedDate: volumeInfo.publishedDate || '',
            publisher: volumeInfo.publisher || 'Unknown Publisher',
            categories: volumeInfo.categories || [],
            averageRating: volumeInfo.averageRating || 0,
            ratingsCount: volumeInfo.ratingsCount || 0,
            previewLink: volumeInfo.previewLink || '',
            infoLink: volumeInfo.infoLink || '',
            language: volumeInfo.language || 'en'
          };
        });
        
        return res.json({
          success: true,
          query: q,
          count: fallbackBooks.length,
          totalResults: fallbackResponse.data.totalItems || 0,
          source: 'google-books-api-no-key',
          note: 'Using Google Books API without key (limited access)',
          data: fallbackBooks
        });
        
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError.message);
        
        // Ultimate fallback: Enhanced mock data
        console.log('📚 Using enhanced mock data as final fallback');
        const mockBooks = getEnhancedMockBooks(q);
        
        return res.json({
          success: true,
          query: q,
          count: mockBooks.length,
          totalResults: mockBooks.length,
          source: 'enhanced-mock-data',
          note: 'Using enhanced mock data with real Google Books IDs',
          data: mockBooks
        });
      }
    }
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// Get book details from Google Books API
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📖 Getting book details for ID:', id);
    
    try {
      // Try with API key first
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
        params: { key: GOOGLE_BOOKS_API_KEY },
        timeout: 10000
      });
      
      const volumeInfo = response.data.volumeInfo || {};
      
      const book = {
        id: response.data.id,
        googleBooksId: response.data.id,
        title: volumeInfo.title || 'Unknown Title',
        subtitle: volumeInfo.subtitle || '',
        authors: volumeInfo.authors || ['Unknown Author'],
        description: volumeInfo.description || 'No description available',
        thumbnail: volumeInfo.imageLinks?.thumbnail 
          ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
          : 'https://via.placeholder.com/128x196/3b82f6/ffffff?text=No+Cover',
        smallThumbnail: volumeInfo.imageLinks?.smallThumbnail 
          ? volumeInfo.imageLinks.smallThumbnail.replace('http://', 'https://')
          : 'https://via.placeholder.com/64x96/3b82f6/ffffff?text=No+Cover',
        pageCount: volumeInfo.pageCount || 0,
        publishedDate: volumeInfo.publishedDate || '',
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        categories: volumeInfo.categories || [],
        averageRating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,
        previewLink: volumeInfo.previewLink || '',
        infoLink: volumeInfo.infoLink || '',
        language: volumeInfo.language || 'en',
        isbn10: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
        isbn13: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || ''
      };
      
      return res.json({
        success: true,
        source: 'google-books-api',
        data: book
      });
      
    } catch (apiError) {
      console.log('Google Books API failed, trying without key...');
      
      // Try without key
      try {
        const fallbackResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
          timeout: 8000
        });
        
        const volumeInfo = fallbackResponse.data.volumeInfo || {};
        
        const book = {
          id: fallbackResponse.data.id,
          googleBooksId: fallbackResponse.data.id,
          title: volumeInfo.title || 'Unknown Title',
          subtitle: volumeInfo.subtitle || '',
          authors: volumeInfo.authors || ['Unknown Author'],
          description: volumeInfo.description || 'No description available',
          thumbnail: volumeInfo.imageLinks?.thumbnail 
            ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
            : 'https://via.placeholder.com/128x196/3b82f6/ffffff?text=No+Cover',
          smallThumbnail: volumeInfo.imageLinks?.smallThumbnail 
            ? volumeInfo.imageLinks.smallThumbnail.replace('http://', 'https://')
            : 'https://via.placeholder.com/64x96/3b82f6/ffffff?text=No+Cover',
          pageCount: volumeInfo.pageCount || 0,
          publishedDate: volumeInfo.publishedDate || '',
          publisher: volumeInfo.publisher || 'Unknown Publisher',
          categories: volumeInfo.categories || [],
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
          previewLink: volumeInfo.previewLink || '',
          infoLink: volumeInfo.infoLink || '',
          language: volumeInfo.language || 'en'
        };
        
        return res.json({
          success: true,
          source: 'google-books-api-no-key',
          data: book
        });
        
      } catch (fallbackError) {
        console.log('Fallback also failed, using mock data');
        
        // Use mock data
        const mockBook = getEnhancedMockBookById(id);
        if (mockBook) {
          return res.json({
            success: true,
            source: 'enhanced-mock-data',
            data: mockBook
          });
        }
        
        res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
    }
    
  } catch (error) {
    console.error('Get book details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get book details'
    });
  }
});

// Enhanced mock data with REAL Google Books IDs
function getEnhancedMockBooks(query) {
  const allBooks = [
    {
      id: 'wuTcjwEACAAJ', // Real Google Books ID for Harry Potter 1
      googleBooksId: 'wuTcjwEACAAJ',
      title: 'Harry Potter and the Philosopher\'s Stone',
      authors: ['J.K. Rowling'],
      description: 'Harry Potter has no idea how famous he is. That\'s because he\'s being raised by his miserable aunt and uncle who are terrified Harry will learn that he\'s really a wizard, just as his parents were.',
      thumbnail: 'https://books.google.com/books/content?id=wuTcjwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      smallThumbnail: 'https://books.google.com/books/content?id=wuTcjwEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
      pageCount: 223,
      publishedDate: '1997-06-26',
      publisher: 'Bloomsbury Publishing',
      categories: ['Fantasy', 'Fiction', 'Young Adult'],
      averageRating: 4.5,
      ratingsCount: 12500,
      previewLink: 'https://books.google.com/books?id=wuTcjwEACAAJ&hl=&source=gbs_api',
      infoLink: 'https://books.google.com/books?id=wuTcjwEACAAJ&hl=&source=gbs_api',
      language: 'en'
    },
    {
      id: 'yl4dILkcqmQC', // Real Google Books ID for Harry Potter 2
      googleBooksId: 'yl4dILkcqmQC',
      title: 'Harry Potter and the Chamber of Secrets',
      authors: ['J.K. Rowling'],
      description: 'Harry Potter\'s summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car!',
      thumbnail: 'https://books.google.com/books/content?id=yl4dILkcqmQC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      smallThumbnail: 'https://books.google.com/books/content?id=yl4dILkcqmQC&printsec=frontcover&img=1&zoom=5&source=gbs_api',
      pageCount: 251,
      publishedDate: '1998-07-02',
      publisher: 'Bloomsbury Publishing',
      categories: ['Fantasy', 'Fiction', 'Young Adult'],
      averageRating: 4.4,
      ratingsCount: 11500,
      previewLink: 'https://books.google.com/books?id=yl4dILkcqmQC&hl=&source=gbs_api',
      infoLink: 'https://books.google.com/books?id=yl4dILkcqmQC&hl=&source=gbs_api',
      language: 'en'
    },
    {
      id: '5iTebBW-w7QC', // Real Google Books ID for Harry Potter 3
      googleBooksId: '5iTebBW-w7QC',
      title: 'Harry Potter and the Prisoner of Azkaban',
      authors: ['J.K. Rowling'],
      description: 'Harry Potter is lucky to reach the age of thirteen, since he has already survived the murderous attacks of the feared Dark Lord on more than one occasion.',
      thumbnail: 'https://books.google.com/books/content?id=5iTebBW-w7QC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      smallThumbnail: 'https://books.google.com/books/content?id=5iTebBW-w7QC&printsec=frontcover&img=1&zoom=5&source=gbs_api',
      pageCount: 317,
      publishedDate: '1999-07-08',
      publisher: 'Bloomsbury Publishing',
      categories: ['Fantasy', 'Fiction', 'Young Adult'],
      averageRating: 4.6,
      ratingsCount: 13500,
      previewLink: 'https://books.google.com/books?id=5iTebBW-w7QC&hl=&source=gbs_api',
      infoLink: 'https://books.google.com/books?id=5iTebBW-w7QC&hl=&source=gbs_api',
      language: 'en'
    }
  ];
  
  if (!query || query.trim() === '') {
    return allBooks;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  return allBooks.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.authors.some(author => author.toLowerCase().includes(lowerQuery)) ||
    book.categories.some(category => category.toLowerCase().includes(lowerQuery))
  );
}

function getEnhancedMockBookById(id) {
  const books = getEnhancedMockBooks('');
  return books.find(book => book.id === id);
}

module.exports = router;