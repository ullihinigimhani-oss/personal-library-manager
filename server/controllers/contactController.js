const Contact = require('../models/Contact');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact inquiry
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: contact
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get all contact inquiries
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts'
    });
  }
};

// Get contact statistics
exports.getContactStats = async (req, res) => {
  try {
    const stats = {
      total: await Contact.countDocuments(),
      pending: await Contact.countDocuments({ status: 'Pending' }),
      unread: await Contact.countDocuments({ isRead: false })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact statistics'
    });
  }
};