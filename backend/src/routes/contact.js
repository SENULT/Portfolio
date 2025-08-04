const express = require('express');
const nodemailer = require('nodemailer');
const { validateRequest } = require('../middleware/validation');
const Joi = require('joi');
const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Contact form validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(5).max(200).required(),
  message: Joi.string().min(10).max(2000).required(),
  phone: Joi.string().optional(),
  company: Joi.string().optional(),
  project_type: Joi.string().valid('ai', 'ml', 'cv', 'data', 'web', 'consultation', 'other').optional()
});

// Submit contact form
router.post('/', validateRequest(contactSchema), async (req, res) => {
  try {
    const { name, email, subject, message, phone, company, project_type } = req.body;

    // Create email content
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER || 'huynhducanh.ai@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff8000, #ff6000); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333; border-bottom: 2px solid #ff8000; padding-bottom: 10px;">Contact Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px; color: #333;">${email}</td>
              </tr>
              ${phone ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 10px; color: #333;">${phone}</td>
                </tr>
              ` : ''}
              ${company ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555;">Company:</td>
                  <td style="padding: 10px; color: #333;">${company}</td>
                </tr>
              ` : ''}
              ${project_type ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555;">Project Type:</td>
                  <td style="padding: 10px; color: #333;">${project_type.toUpperCase()}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 10px; color: #333;">${subject}</td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 20px;">Message:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #ff8000;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br>
                <strong>IP Address:</strong> ${req.ip || 'Not available'}
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Huynh Duc Anh - AI Engineer Portfolio</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.7;">Auto-generated email from portfolio contact form</p>
          </div>
        </div>
      `
    };

    // Auto-reply to sender
    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me - Huynh Duc Anh',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff8000, #ff6000); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Your Message!</h1>
          </div>
          
          <div style="padding: 20px;">
            <p style="color: #333; font-size: 16px;">Dear ${name},</p>
            
            <p style="color: #333; line-height: 1.6;">
              Thank you for reaching out to me through my portfolio website. I have received your message and will get back to you within 24-48 hours.
            </p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Project Type:</strong> ${project_type ? project_type.toUpperCase() : 'Not specified'}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              In the meantime, feel free to explore my portfolio and check out my latest projects. You can also connect with me on my social media platforms.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://linkedin.com/in/huynhducanh" style="display: inline-block; padding: 12px 24px; background: #ff8000; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">LinkedIn</a>
              <a href="https://github.com/SENULT" style="display: inline-block; padding: 12px 24px; background: #333; color: white; text-decoration: none; border-radius: 5px; margin: 0 10px;">GitHub</a>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              Best regards,<br>
              <strong>Huynh Duc Anh</strong><br>
              AI Engineer<br>
              Email: huynhducanh.ai@gmail.com
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">© 2025 Huynh Duc Anh. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send emails
    const transporter = createTransporter();
    
    // Send notification to me
    await transporter.sendMail(emailContent);
    
    // Send auto-reply to sender
    await transporter.sendMail(autoReply);

    // Log contact submission (in production, save to database)
    console.log(`Contact form submission from ${name} (${email}): ${subject}`);

    res.json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        submitted_at: new Date().toISOString(),
        reference_id: `CONTACT_${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later or contact me directly.',
      fallback: {
        email: 'huynhducanh.ai@gmail.com',
        linkedin: 'https://linkedin.com/in/huynhducanh'
      }
    });
  }
});

// Get contact information
router.get('/info', (req, res) => {
  try {
    const contactInfo = {
      email: 'huynhducanh.ai@gmail.com',
      phone: '+84 123 456 789',
      location: 'Ho Chi Minh City, Vietnam',
      timezone: 'GMT+7 (ICT)',
      availability: 'Monday - Friday, 9:00 AM - 6:00 PM',
      response_time: '24-48 hours',
      preferred_contact: ['email', 'linkedin'],
      social: {
        linkedin: 'https://linkedin.com/in/huynhducanh',
        github: 'https://github.com/SENULT',
        twitter: 'https://twitter.com/huynhducanh'
      },
      project_types: [
        { value: 'ai', label: 'Artificial Intelligence' },
        { value: 'ml', label: 'Machine Learning' },
        { value: 'cv', label: 'Computer Vision' },
        { value: 'data', label: 'Data Science' },
        { value: 'web', label: 'Web Development' },
        { value: 'consultation', label: 'Technical Consultation' },
        { value: 'other', label: 'Other' }
      ]
    };

    res.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact information'
    });
  }
});

// Test email configuration
router.post('/test-email', async (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Email test not allowed in production'
    });
  }

  try {
    const transporter = createTransporter();
    
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'Email configuration is working correctly'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Email configuration error',
      details: error.message
    });
  }
});

module.exports = router;
