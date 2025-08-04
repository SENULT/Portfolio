# Portfolio Backend API

Backend API cho website portfolio của Huynh Duc Anh với AI Assistant tích hợp.

## 🚀 Tính năng

- **REST API**: Cung cấp dữ liệu portfolio
- **Socket.io**: Real-time communication cho AI Assistant  
- **AI Integration**: Kết nối với FastAPI AI service
- **Email Service**: Xử lý contact form
- **Rate Limiting**: Bảo vệ khỏi spam
- **CORS**: Hỗ trợ cross-origin requests

## 🛠️ Công nghệ

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket support
- **Axios** - HTTP client
- **Nodemailer** - Email service
- **Joi** - Data validation
- **Helmet** - Security middleware

## 📋 Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình environment variables
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Chạy server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy trên: http://localhost:5000

## 📚 API Endpoints

### Portfolio API
- `GET /api/portfolio` - Lấy tất cả dữ liệu portfolio
- `GET /api/portfolio/personal` - Thông tin cá nhân
- `GET /api/portfolio/skills` - Kỹ năng
- `GET /api/portfolio/experience` - Kinh nghiệm
- `GET /api/portfolio/projects` - Dự án
- `GET /api/portfolio/services` - Dịch vụ
- `GET /api/portfolio/certifications` - Chứng chỉ

### AI Assistant API
- `POST /api/ai/chat` - Chat với AI Assistant
- `GET /api/ai/conversations/:id` - Lấy lịch sử conversation
- `POST /api/ai/conversations` - Tạo conversation mới
- `GET /api/ai/capabilities` - Khả năng của AI
- `GET /api/ai/health` - Health check AI service

### Contact API
- `POST /api/contact` - Gửi contact form
- `GET /api/contact/info` - Thông tin liên hệ
- `POST /api/contact/test-email` - Test email config (dev only)

### Health Check
- `GET /health` - Server health status

## 🔌 Socket.io Events

### Client → Server
- `register` - Đăng ký user
- `ai_message` - Gửi tin nhắn cho AI
- `start_conversation` - Bắt đầu conversation
- `end_conversation` - Kết thúc conversation
- `user_activity` - Tracking hoạt động user
- `feedback` - Gửi feedback

### Server → Client  
- `welcome` - Chào mừng user mới
- `ai_response` - Phản hồi từ AI
- `ai_typing` - AI đang typing
- `conversation_started` - Conversation đã bắt đầu
- `conversation_ended` - Conversation đã kết thúc
- `feedback_received` - Đã nhận feedback

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── routes/          # API routes
│   │   ├── portfolio.js # Portfolio endpoints
│   │   ├── ai.js        # AI Assistant endpoints  
│   │   └── contact.js   # Contact endpoints
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── services/        # Business logic
│   │   └── socketService.js
│   └── server.js        # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🔐 Bảo mật

- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: Chống spam
- **Input Validation**: Joi validation
- **Sanitization**: XSS protection

## 📧 Email Configuration

Để sử dụng contact form, cấu hình email trong `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Lưu ý**: Sử dụng App Password cho Gmail, không phải password thường.

## 🤖 AI Service Integration

Backend kết nối với FastAPI AI service qua:
- HTTP requests cho chat
- WebSocket cho real-time communication
- Health checks để monitoring

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Console logs**: Server events
- **Error handling**: Comprehensive error responses
- **Health checks**: Service status monitoring

## 🔧 Development

### Scripts
- `npm run dev` - Development với nodemon
- `npm start` - Production mode
- `npm test` - Chạy tests (TBD)

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `DEBUG`: Debug mode
- `LOG_LEVEL`: Logging level

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

2. **AI Service connection failed**
   - Kiểm tra AI service đang chạy trên port 8000
   - Kiểm tra `AI_SERVICE_URL` trong .env

3. **Email not sending**
   - Kiểm tra SMTP credentials
   - Sử dụng App Password cho Gmail
   - Kiểm tra firewall/network

4. **CORS errors**
   - Kiểm tra `CORS_ORIGIN` trong .env
   - Đảm bảo frontend chạy đúng port

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- Email: huynhducanh.ai@gmail.com
- GitHub: https://github.com/SENULT

## 📄 License

MIT License - see LICENSE file for details.
