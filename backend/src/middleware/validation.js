const Joi = require('joi');

// Validation middleware factory
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // ID parameter validation
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().default('createdAt')
  }),

  // Search validation
  search: Joi.object({
    q: Joi.string().min(1).max(100).required(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  // Contact form validation
  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(5).max(200).required(),
    message: Joi.string().min(10).max(2000).required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    company: Joi.string().max(100).optional(),
    project_type: Joi.string().valid('ai', 'ml', 'cv', 'data', 'web', 'consultation', 'other').optional()
  }),

  // AI chat validation
  aiChat: Joi.object({
    message: Joi.string().min(1).max(1000).required(),
    conversation_id: Joi.string().optional(),
    context: Joi.string().valid('portfolio', 'general', 'technical').default('portfolio')
  }),

  // File upload validation
  fileUpload: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid(
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ).required(),
    size: Joi.number().max(5 * 1024 * 1024) // 5MB max
  })
};

// Sanitization helpers
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, ''); // Remove < and > characters
  }
  return input;
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

// Sanitization middleware
const sanitizeRequest = (property = 'body') => {
  return (req, res, next) => {
    if (req[property]) {
      req[property] = sanitizeObject(req[property]);
    }
    next();
  };
};

// Rate limiting validation
const validateRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, []);
    }

    const clientRequests = requests.get(clientId);
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    validRequests.push(now);
    requests.set(clientId, validRequests);
    
    next();
  };
};

// Custom validation functions
const validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (req.file) {
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type',
          allowedTypes
        });
      }
    }
    next();
  };
};

const validateFileSize = (maxSize) => {
  return (req, res, next) => {
    if (req.file && req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File size too large',
        maxSize: `${maxSize / (1024 * 1024)}MB`
      });
    }
    next();
  };
};

module.exports = {
  validateRequest,
  schemas,
  sanitizeInput,
  sanitizeObject,
  sanitizeRequest,
  validateRateLimit,
  validateFileType,
  validateFileSize
};
