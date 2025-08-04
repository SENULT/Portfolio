# AI Assistant Service

FastAPI service cung cấp AI Assistant cho portfolio website của Huynh Duc Anh.

## 🚀 Tính năng

- **OpenAI Integration**: Sử dụng GPT models
- **Knowledge Base**: Portfolio-specific knowledge
- **Conversation Management**: Lưu trữ và quản lý cuộc trò chuyện
- **Fallback Responses**: Hoạt động khi không có OpenAI API
- **Real-time API**: RESTful endpoints
- **Health Monitoring**: Service health checks

## 🛠️ Công nghệ

- **FastAPI** - Modern Python web framework
- **OpenAI API** - Language model integration
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **SQLAlchemy** - Database ORM (optional)
- **Python 3.8+** - Runtime

## 📋 Yêu cầu

- Python >= 3.8
- pip package manager

## 🚀 Cài đặt

### 1. Tạo virtual environment (khuyên dùng)
```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 3. Cấu hình environment variables
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
FASTAPI_ENV=development
DEBUG=True
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=150
OPENAI_TEMPERATURE=0.7
DATABASE_URL=sqlite:///./ai_assistant.db
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:5000"]
```

### 4. Chạy service

**Development mode:**
```bash
uvicorn main:app --reload --port 8000
```

**Production mode:**
```bash
uvicorn main:app --port 8000 --workers 4
```

Service sẽ chạy trên: http://localhost:8000

## 📚 API Documentation

Khi service đang chạy, truy cập:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 API Endpoints

### Chat API
- `POST /api/chat` - Chat với AI Assistant
- `GET /api/chat/suggestions` - Lấy gợi ý conversation
- `POST /api/chat/feedback` - Gửi feedback
- `GET /api/chat/health` - Health check chat service

### Conversations API
- `POST /api/conversations` - Tạo conversation mới
- `GET /api/conversations/{id}` - Lấy conversation theo ID
- `GET /api/conversations/{id}/messages` - Lấy messages của conversation
- `GET /api/conversations` - List conversations
- `DELETE /api/conversations/{id}` - Xóa conversation
- `PUT /api/conversations/{id}/title` - Cập nhật title
- `POST /api/conversations/{id}/archive` - Archive conversation
- `GET /api/conversations/{id}/export` - Export conversation

### Knowledge Base API
- `GET /api/knowledge` - Lấy knowledge base
- `GET /api/knowledge/search` - Tìm kiếm knowledge
- `POST /api/knowledge/upload` - Upload knowledge file

### Health & Info
- `GET /health` - Service health status
- `GET /` - API information

## 💬 Chat Examples

### Basic Chat
```bash
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Tell me about your AI projects",
       "context": "portfolio"
     }'
```

### With Conversation ID
```bash
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "message": "What technologies do you use?",
       "conversation_id": "conv_12345",
       "context": "portfolio"
     }'
```

## 🧠 Knowledge Base

AI Assistant có knowledge base về:

- **Personal Info**: Tên, title, bio, liên hệ
- **Skills**: Programming languages, frameworks, tools
- **Experience**: Công việc, vai trò, thành tích
- **Projects**: Dự án AI/ML đã thực hiện
- **Education**: Học vấn, chứng chỉ
- **Services**: Dịch vụ cung cấp

## 🤖 AI Features

### Smart Responses
- Context-aware conversations
- Portfolio-specific knowledge
- Professional tone
- Helpful suggestions

### Fallback System
- Hoạt động khi không có OpenAI API
- Keyword-based responses
- Predefined answers cho câu hỏi thường gặp

### Conversation Management
- Persistent conversation history
- Context preservation
- Message threading
- Export capabilities

## 📁 Cấu trúc thư mục

```
ai-service/
├── app/
│   ├── api/                 # API endpoints
│   │   ├── chat.py         # Chat endpoints
│   │   ├── conversations.py # Conversation management
│   │   └── knowledge.py    # Knowledge base
│   ├── core/               # Core configuration
│   │   ├── config.py       # Settings
│   │   └── logger.py       # Logging setup
│   ├── services/           # Business logic
│   │   └── ai_service.py   # Main AI service
│   └── __init__.py
├── main.py                 # FastAPI application
├── requirements.txt        # Dependencies
├── .env.example           # Environment template
└── README.md
```

## ⚙️ Configuration

### Environment Variables

- `FASTAPI_ENV`: Environment (development/production)
- `DEBUG`: Debug mode (True/False)
- `OPENAI_API_KEY`: OpenAI API key
- `OPENAI_MODEL`: Model name (gpt-3.5-turbo, gpt-4)
- `OPENAI_MAX_TOKENS`: Max response tokens
- `OPENAI_TEMPERATURE`: Response creativity (0.0-2.0)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `DATABASE_URL`: Database connection string

### Model Configuration

```python
# OpenAI Models
- gpt-3.5-turbo: Fast, cost-effective
- gpt-4: More capable, higher cost
- gpt-4-turbo: Latest GPT-4 variant

# Parameters
- max_tokens: 50-500 (recommended)
- temperature: 0.3-0.8 (professional responses)
```

## 🔐 Security

- **API Key Protection**: OpenAI key trong environment
- **CORS Configuration**: Restricted origins
- **Input Validation**: Pydantic models
- **Rate Limiting**: Built-in protection
- **Error Handling**: Secure error responses

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:8000/health
```

### Logs
- Application logs trong `logs/ai_service.log`
- Request/response logging
- Error tracking
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API errors**
   ```
   Error: Invalid API key
   Solution: Kiểm tra OPENAI_API_KEY trong .env
   ```

2. **Dependencies issues**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

3. **Port conflicts**
   ```bash
   # Kiểm tra port đang sử dụng
   netstat -ano | findstr :8000
   
   # Chạy trên port khác
   uvicorn main:app --port 8001
   ```

4. **CORS errors**
   ```
   Error: CORS policy blocked
   Solution: Thêm frontend URL vào ALLOWED_ORIGINS
   ```

### Debug Mode

Chạy với debug để xem chi tiết:
```bash
FASTAPI_ENV=development DEBUG=True uvicorn main:app --reload --log-level debug
```

## 🔄 Deployment

### Production Setup
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Docker (Optional)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📈 Performance

### Optimization Tips
- Sử dụng connection pooling
- Cache frequent responses
- Optimize OpenAI parameters
- Monitor API usage/costs

### Scaling
- Multiple worker processes
- Load balancing
- Database optimization
- CDN for static content

## 📞 Support

Nếu gặp vấn đề:
- Email: huynhducanh.ai@gmail.com  
- GitHub Issues: https://github.com/SENULT/Portfolio/issues
- Documentation: http://localhost:8000/docs

## 📄 License

MIT License - see LICENSE file for details.

## 🔮 Future Features

- [ ] Vector database integration
- [ ] Multi-language support
- [ ] Voice conversation
- [ ] Advanced analytics
- [ ] Custom model fine-tuning
