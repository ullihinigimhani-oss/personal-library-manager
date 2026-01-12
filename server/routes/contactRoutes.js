const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', contactController.submitContact);

// Protected routes
router.get('/', protect, contactController.getAllContacts);
router.get('/stats', protect, contactController.getContactStats);

module.exports = router;