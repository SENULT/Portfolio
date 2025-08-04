const express = require('express');
const axios = require('axios');
const router = express.Router();

// AI Service configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Chat with AI Assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, conversation_id, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Forward request to FastAPI AI service
    const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
      message,
      conversation_id,
      context: context || 'portfolio'
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is currently unavailable. Please try again later.'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data?.detail || 'AI service error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process AI request'
    });
  }
});

// Get conversation history
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${AI_SERVICE_URL}/api/conversations/${id}`, {
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Get Conversation Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is currently unavailable'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history'
    });
  }
});

// Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { title, context } = req.body;

    const response = await axios.post(`${AI_SERVICE_URL}/api/conversations`, {
      title: title || 'New Conversation',
      context: context || 'portfolio'
    }, {
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Create Conversation Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is currently unavailable'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Get AI assistant capabilities
router.get('/capabilities', (req, res) => {
  try {
    const capabilities = {
      features: [
        'Portfolio Q&A',
        'Skills Discussion',
        'Project Information',
        'Experience Details',
        'Technical Consultation',
        'Career Guidance'
      ],
      topics: [
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Vision',
        'Data Science',
        'Python Programming',
        'Web Development',
        'Project Management',
        'Career Development'
      ],
      languages: ['English', 'Vietnamese'],
      response_types: [
        'Text responses',
        'Code examples',
        'Technical explanations',
        'Career advice',
        'Project recommendations'
      ]
    };

    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI capabilities'
    });
  }
});

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000
    });

    res.json({
      success: true,
      data: {
        ai_service_status: 'connected',
        ai_service_health: response.data,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      data: {
        ai_service_status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Generate response suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const { context, topic } = req.body;

    const response = await axios.post(`${AI_SERVICE_URL}/api/suggestions`, {
      context: context || 'portfolio',
      topic: topic || 'general'
    }, {
      timeout: 15000
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Generate Suggestions Error:', error.message);
    
    // Fallback suggestions if AI service is unavailable
    const fallbackSuggestions = [
      "Tell me about your AI projects",
      "What machine learning frameworks do you use?",
      "How did you get started in AI?",
      "What services do you offer?",
      "Can you show me your certifications?"
    ];

    res.json({
      success: true,
      data: {
        suggestions: fallbackSuggestions,
        fallback: true
      }
    });
  }
});

module.exports = router;
