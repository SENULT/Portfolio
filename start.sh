#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Portfolio Application with Docker Compose${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your configuration before running again.${NC}"
    exit 1
fi

# Build and start services
echo -e "${GREEN}🔨 Building and starting services...${NC}"
docker-compose up --build -d

# Wait for services to be healthy
echo -e "${GREEN}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "${GREEN}🔍 Checking service health...${NC}"

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

# Check backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
fi

# Check AI service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI Service is healthy${NC}"
else
    echo -e "${RED}❌ AI Service is not responding${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Portfolio application is running!${NC}"
echo -e "${GREEN}📱 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:5000${NC}"
echo -e "${GREEN}🤖 AI Service: http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}To stop the application, run: docker-compose down${NC}"
echo -e "${YELLOW}To view logs, run: docker-compose logs -f${NC}"
