# Huynh Duc Anh - AI Engineer Portfolio

Một website portfolio hiện đại với AI Assistant tích hợp, được xây dựng bằng HTML/CSS/JavaScript, Node.js và FastAPI.

## 🚀 Tính năng

- **Portfolio Website**: Giới thiệu kỹ năng, dự án và kinh nghiệm
- **AI Assistant**: Trò chuyện thông minh được tích hợp sẵn
- **Responsive Design**: Tương thích mọi thiết bị
- **Real-time Chat**: Trò chuyện trực tiếp với AI
- **Tech Stack & Certifications**: Hiển thị công nghệ và chứng chỉ
- **Contact Form**: Gửi email trực tiếp

## 🛠️ Công nghệ sử dụng

### Frontend
- **HTML/CSS/JavaScript** - Modern vanilla frontend
- **Socket.io Client** - Real-time communication
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **Nginx** - Production web server

### Backend
- **Node.js** - Backend server
- **Express.js** - Web framework
- **Socket.io** - WebSocket support
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### AI Service
- **FastAPI** - AI API service
- **Python** - AI processing
- **OpenAI API** - Language model
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## 📦 Cài đặt và Chạy

### Option 1: Docker (Khuyến nghị - Chạy 1 lệnh)

#### Yêu cầu:
- Docker Desktop đã cài đặt và đang chạy
- Git (để clone repository)

#### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/your-portfolio-repo.git
cd Portfolio
```

#### Bước 2: Cấu hình Environment Variables
```bash
# Copy file .env template
copy .env.example .env

# Chỉnh sửa .env với thông tin của bạn:
# - OpenAI API Key (optional)
# - Email credentials (cho contact form)
```

#### Bước 3: Chạy tất cả services
**Windows:**
```cmd
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Hoặc manual:**
```bash
docker-compose up --build
```

### Option 2: Development Mode (Manual)

#### Frontend (Port 3000)
```bash
# Serve static files
npx http-server . -p 3000
# Hoặc dùng Live Server extension trong VS Code
```

#### Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

#### AI Service (Port 8000)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 🌐 Truy cập Website

Sau khi chạy thành công:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## ⚙️ Cấu hình Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Email Configuration (cho contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=your_email@gmail.com

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
```

### AI Service (.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/ai_service
```

## 🚀 Deploy lên GitHub

### Bước 1: Tạo Repository trên GitHub
1. Đăng nhập GitHub
2. Click "New repository"
3. Đặt tên repository (vd: `my-portfolio`)
4. Chọn Public hoặc Private
5. Click "Create repository"

### Bước 2: Push code lên GitHub
```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit với message
git commit -m "Initial commit: Portfolio with AI Assistant"

# Add remote repository
git remote add origin https://github.com/your-username/your-portfolio-repo.git

# Push lên GitHub
git push -u origin main
```

### Bước 3: Deploy lên Vercel (Hosting miễn phí)
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click "Import Project"
4. Chọn repository vừa push
5. Cấu hình build settings:
   ```
   Framework Preset: Other
   Build Command: npm run build (nếu có)
   Output Directory: . (root directory)
   ```
6. Thêm Environment Variables trong Vercel dashboard
7. Deploy!

## 📁 Cấu trúc Project

```
Portfolio/
├── 📁 frontend/                 # Frontend files
│   ├── index.html              # Main HTML file
│   ├── style.css               # CSS styles
│   ├── script.js               # JavaScript logic
│   └── assets/                 # Images, fonts, etc.
├── 📁 backend/                 # Node.js backend
│   ├── src/
│   │   ├── app.js             # Express server
│   │   ├── routes/            # API routes
│   │   └── middleware/        # Middleware functions
│   ├── package.json
│   └── Dockerfile
├── 📁 ai-service/             # FastAPI AI service
│   ├── app/
│   │   ├── main.py           # FastAPI main
│   │   ├── api/              # API endpoints
│   │   └── services/         # AI services
│   ├── requirements.txt
│   └── Dockerfile
├── 📁 certs/                  # Certificate images
├── docker-compose.yml         # Docker configuration
├── .env.example              # Environment template
├── start.bat                 # Windows start script
├── start.sh                  # Linux/Mac start script
└── README.md                 # This file
```

## 🔧 Customization

### Thay đổi thông tin cá nhân
1. **index.html**: Cập nhật tên, title, mô tả
2. **style.css**: Thay đổi màu sắc, font chữ
3. **assets/**: Thêm ảnh đại diện, certificate

### Thêm tech stack mới
1. Mở **index.html**
2. Tìm section `#tech-stack`
3. Thêm tech item mới:
```html
<div class="tech-item">
    <i class="fab fa-your-icon"></i>
    <span>Your Technology</span>
</div>
```

### Cấu hình AI Assistant
1. Cập nhật **ai-service/app/services/knowledge_base.py**
2. Thêm thông tin portfolio của bạn
3. Cấu hình OpenAI API key

## 🐛 Troubleshooting

### Docker không chạy được
```bash
# Kiểm tra Docker đang chạy
docker --version
docker info

# Xóa containers cũ và rebuild
docker-compose down
docker-compose up --build
```

### Port bị chiếm
```bash
# Tìm process đang dùng port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <process_id> /F
```

### AI Assistant không hoạt động
1. Kiểm tra OpenAI API key trong `.env`
2. Check logs: `docker-compose logs ai-service`
3. Kiểm tra network connection

## 📞 Liên hệ

- **Email**: 
- **GitHub**: [github.com/your-username](https://github.com/your-username)
- **LinkedIn**: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết chi tiết.

---

💡 **Tip**: Nếu bạn muốn customize thêm, hãy fork repository và tạo pull request!