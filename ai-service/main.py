from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Import routers
from app.api.chat import router as chat_router
from app.api.conversations import router as conversations_router
from app.api.knowledge import router as knowledge_router
from app.core.config import settings
from app.core.logger import setup_logging
from app.services.ai_service import AIService

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.TITLE,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app"]
)

# Initialize AI service
ai_service = AIService()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Starting AI Assistant API...")
    
    try:
        # Initialize AI service
        await ai_service.initialize()
        logger.info("✅ AI Service initialized successfully")
        
        # Initialize vector database
        await ai_service.initialize_knowledge_base()
        logger.info("✅ Knowledge base initialized")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down AI Assistant API...")
    
    try:
        await ai_service.cleanup()
        logger.info("✅ Cleanup completed")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check AI service health
        ai_health = await ai_service.health_check()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.VERSION,
            "environment": settings.FASTAPI_ENV,
            "ai_service": ai_health,
            "uptime": "running"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Portfolio AI Assistant API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "chat": "/api/chat",
            "conversations": "/api/conversations",
            "knowledge": "/api/knowledge"
        },
        "author": "Huynh Duc Anh",
        "description": "AI Assistant for portfolio website with natural language processing capabilities"
    }

# Include API routers
app.include_router(
    chat_router,
    prefix=f"{settings.API_PREFIX}",
    tags=["Chat"]
)

app.include_router(
    conversations_router,
    prefix=f"{settings.API_PREFIX}",
    tags=["Conversations"]
)

app.include_router(
    knowledge_router,
    prefix=f"{settings.API_PREFIX}",
    tags=["Knowledge Base"]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Custom HTTP exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

if __name__ == "__main__":
    # Configuration for development
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        access_log=True,
        log_level=settings.LOG_LEVEL.lower()
    )
