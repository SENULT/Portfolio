from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Annotated
import asyncio
import uuid
from datetime import datetime
import logging

from ..services.ai_service import AIService
from ..core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    context: str = Field("portfolio", description="Context for the conversation")
    user_id: Optional[str] = Field(None, description="User identifier")

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    context: str
    timestamp: datetime
    tokens_used: Optional[int] = None
    response_time: Optional[float] = None
    suggestions: Optional[List[str]] = None

class ChatHistory(BaseModel):
    role: str
    content: str
    timestamp: datetime

# Global AI service instance
ai_service = AIService()

@router.post("/chat", response_model=Dict[str, Any])
async def chat_with_ai(
    message_data: ChatMessage,
    background_tasks: BackgroundTasks
):
    """
    Chat with AI Assistant
    """
    try:
        start_time = datetime.now()
        
        # Generate conversation ID if not provided
        conversation_id = message_data.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
        
        logger.info(f"Processing chat message for conversation: {conversation_id}")
        
        # Get AI response
        response_data = await ai_service.get_ai_response(
            message=message_data.message,
            conversation_id=conversation_id,
            context=message_data.context,
            user_id=message_data.user_id
        )
        
        # Calculate response time
        response_time = (datetime.now() - start_time).total_seconds()
        
        # Get conversation suggestions
        suggestions = await ai_service.get_suggestions(
            context=message_data.context,
            conversation_id=conversation_id
        )
        
        # Prepare response
        chat_response = {
            "response": response_data["response"],
            "conversation_id": conversation_id,
            "context": message_data.context,
            "timestamp": datetime.now().isoformat(),
            "tokens_used": response_data.get("tokens_used"),
            "response_time": response_time,
            "suggestions": suggestions[:5] if suggestions else None
        }
        
        # Background task to save conversation
        background_tasks.add_task(
            ai_service.save_conversation_message,
            conversation_id,
            message_data.message,
            response_data["response"],
            message_data.context
        )
        
        logger.info(f"Chat response generated in {response_time:.2f}s")
        
        return chat_response
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        
        # Return fallback response
        return {
            "response": "I'm sorry, I'm having trouble processing your request right now. Please try again or contact me directly at huynhducanh.ai@gmail.com",
            "conversation_id": message_data.conversation_id or f"conv_{uuid.uuid4().hex[:8]}",
            "context": message_data.context,
            "timestamp": datetime.now().isoformat(),
            "error": True,
            "fallback": True
        }

@router.get("/chat/suggestions")
async def get_chat_suggestions(
    context: str = "portfolio",
    topic: Optional[str] = None
):
    """
    Get conversation suggestions
    """
    try:
        suggestions = await ai_service.get_suggestions(context=context, topic=topic)
        
        return {
            "success": True,
            "suggestions": suggestions,
            "context": context,
            "topic": topic
        }
        
    except Exception as e:
        logger.error(f"Suggestions error: {str(e)}")
        
        # Fallback suggestions
        fallback_suggestions = [
            "Tell me about your AI projects",
            "What machine learning frameworks do you use?",
            "How did you get started in AI?",
            "What services do you offer?",
            "Can you show me your certifications?"
        ]
        
        return {
            "success": True,
            "suggestions": fallback_suggestions,
            "fallback": True
        }

@router.post("/chat/feedback")
async def submit_feedback(
    conversation_id: str,
    rating: Annotated[int, Query(ge=1, le=5)],
    feedback: Optional[str] = None
):
    """
    Submit feedback for a conversation
    """
    try:
        await ai_service.save_feedback(conversation_id, rating, feedback)
        
        logger.info(f"Feedback submitted for conversation: {conversation_id}")
        
        return {
            "success": True,
            "message": "Thank you for your feedback!"
        }
        
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

@router.get("/chat/health")
async def chat_health_check():
    """
    Health check for chat service
    """
    try:
        health_status = await ai_service.health_check()
        
        return {
            "status": "healthy",
            "ai_service": health_status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Chat health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
