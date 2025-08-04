// Socket.io service for real-time communication
const axios = require('axios');

let io;
const connectedUsers = new Map();
const activeConversations = new Map();

const setupSocketHandlers = (socketIO) => {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Handle user registration
    socket.on('register', (userData) => {
      connectedUsers.set(socket.id, {
        ...userData,
        connectedAt: new Date(),
        lastActive: new Date()
      });
      
      console.log(`👤 User registered: ${userData.name || 'Anonymous'} (${socket.id})`);
      
      // Send welcome message
      socket.emit('welcome', {
        message: 'Welcome to my portfolio! I\'m your AI assistant. How can I help you today?',
        suggestions: [
          'Tell me about your AI projects',
          'What machine learning frameworks do you use?',
          'How did you get started in AI?',
          'What services do you offer?',
          'Can you show me your certifications?'
        ]
      });
    });

    // Handle AI chat messages
    socket.on('ai_message', async (data) => {
      try {
        const { message, conversation_id, context } = data;
        const userId = socket.id;

        // Update user activity
        if (connectedUsers.has(userId)) {
          connectedUsers.get(userId).lastActive = new Date();
        }

        // Emit typing indicator
        socket.emit('ai_typing', { typing: true });

        // Forward to AI service
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        try {
          const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
            message,
            conversation_id,
            context: context || 'portfolio',
            user_id: userId
          }, {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Stop typing indicator
          socket.emit('ai_typing', { typing: false });

          // Send AI response
          socket.emit('ai_response', {
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
          });

          // Update conversation tracking
          const convId = response.data.conversation_id || conversation_id || `conv_${Date.now()}`;
          if (!activeConversations.has(convId)) {
            activeConversations.set(convId, {
              id: convId,
              userId,
              startedAt: new Date(),
              messageCount: 0
            });
          }
          
          const conversation = activeConversations.get(convId);
          conversation.messageCount += 1;
          conversation.lastActivity = new Date();

        } catch (aiError) {
          console.error('AI Service Error:', aiError.message);
          
          socket.emit('ai_typing', { typing: false });
          
          // Send fallback response
          socket.emit('ai_response', {
            success: false,
            error: 'I\'m having trouble connecting to my AI brain right now. Please try again in a moment, or feel free to contact me directly!',
            fallback: true,
            contactInfo: {
              email: 'huynhducanh.ai@gmail.com',
              linkedin: 'https://linkedin.com/in/huynhducanh'
            }
          });
        }

      } catch (error) {
        console.error('Socket AI message error:', error);
        socket.emit('ai_response', {
          success: false,
          error: 'An error occurred while processing your message. Please try again.'
        });
      }
    });

    // Handle conversation events
    socket.on('start_conversation', (data) => {
      const convId = data.conversation_id || `conv_${Date.now()}_${socket.id}`;
      
      activeConversations.set(convId, {
        id: convId,
        userId: socket.id,
        title: data.title || 'New Conversation',
        context: data.context || 'portfolio',
        startedAt: new Date(),
        messageCount: 0
      });

      socket.emit('conversation_started', {
        conversation_id: convId,
        title: data.title || 'New Conversation'
      });
    });

    socket.on('end_conversation', (data) => {
      const { conversation_id } = data;
      
      if (activeConversations.has(conversation_id)) {
        const conversation = activeConversations.get(conversation_id);
        console.log(`💬 Conversation ended: ${conversation_id} (${conversation.messageCount} messages)`);
        activeConversations.delete(conversation_id);
      }

      socket.emit('conversation_ended', {
        conversation_id,
        timestamp: new Date().toISOString()
      });
    });

    // Handle user activity tracking
    socket.on('user_activity', (data) => {
      if (connectedUsers.has(socket.id)) {
        const user = connectedUsers.get(socket.id);
        user.lastActive = new Date();
        user.currentPage = data.page;
        user.activity = data.activity;
      }
    });

    // Handle file sharing (if needed)
    socket.on('share_file', (data) => {
      // File sharing logic here if needed
      socket.emit('file_received', {
        success: true,
        message: 'File received successfully'
      });
    });

    // Handle user feedback
    socket.on('feedback', (data) => {
      console.log(`📝 Feedback from ${socket.id}:`, data);
      
      socket.emit('feedback_received', {
        success: true,
        message: 'Thank you for your feedback!'
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${socket.id} (${reason})`);
      
      // Clean up user data
      if (connectedUsers.has(socket.id)) {
        const user = connectedUsers.get(socket.id);
        console.log(`👤 User ${user.name || 'Anonymous'} disconnected after ${Math.round((new Date() - user.connectedAt) / 1000)}s`);
        connectedUsers.delete(socket.id);
      }

      // Clean up conversations
      for (const [convId, conversation] of activeConversations.entries()) {
        if (conversation.userId === socket.id) {
          console.log(`💬 Auto-ending conversation: ${convId}`);
          activeConversations.delete(convId);
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = new Date();
    const timeout = 30 * 60 * 1000; // 30 minutes

    // Clean up inactive users
    for (const [socketId, user] of connectedUsers.entries()) {
      if (now - user.lastActive > timeout) {
        console.log(`🧹 Cleaning up inactive user: ${socketId}`);
        connectedUsers.delete(socketId);
      }
    }

    // Clean up inactive conversations
    for (const [convId, conversation] of activeConversations.entries()) {
      if (now - (conversation.lastActivity || conversation.startedAt) > timeout) {
        console.log(`🧹 Cleaning up inactive conversation: ${convId}`);
        activeConversations.delete(convId);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes
};

// Utility functions
const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

const getActiveConversations = () => {
  return Array.from(activeConversations.values());
};

const getConnectionStats = () => {
  return {
    connectedUsers: connectedUsers.size,
    activeConversations: activeConversations.size,
    totalConnections: connectedUsers.size,
    timestamp: new Date().toISOString()
  };
};

const broadcastMessage = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const sendToUser = (socketId, event, data) => {
  if (io) {
    io.to(socketId).emit(event, data);
  }
};

module.exports = {
  setupSocketHandlers,
  getConnectedUsers,
  getActiveConversations,
  getConnectionStats,
  broadcastMessage,
  sendToUser
};
