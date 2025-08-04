from fastapi import APIRouter, HTTPException, Depends, Path
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Annotated
from datetime import datetime
import logging

from ..services.ai_service import AIService

logger = logging.getLogger(__name__)
router = APIRouter()

class ConversationCreate(BaseModel):
    title: Optional[str] = Field("New Conversation", description="Conversation title")
    context: str = Field("portfolio", description="Conversation context")
    user_id: Optional[str] = Field(None, description="User identifier")

class ConversationResponse(BaseModel):
    id: str
    title: str
    context: str
    created_at: datetime
    message_count: int
    last_activity: Optional[datetime] = None

class ConversationMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime

# Global AI service instance
ai_service = AIService()

@router.post("/conversations", response_model=Dict[str, Any])
async def create_conversation(conversation_data: ConversationCreate):
    """
    Create a new conversation
    """
    try:
        conversation = await ai_service.create_conversation(
            title=conversation_data.title,
            context=conversation_data.context,
            user_id=conversation_data.user_id
        )
        
        logger.info(f"Created conversation: {conversation['id']}")
        
        return {
            "success": True,
            "data": conversation
        }
        
    except Exception as e:
        logger.error(f"Create conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create conversation")

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """
    Get conversation by ID
    """
    try:
        conversation = await ai_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {
            "success": True,
            "data": conversation
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversation")

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = 50,
    offset: int = 0
):
    """
    Get conversation messages
    """
    try:
        messages = await ai_service.get_conversation_messages(
            conversation_id=conversation_id,
            limit=limit,
            offset=offset
        )
        
        return {
            "success": True,
            "data": messages,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": len(messages)
            }
        }
        
    except Exception as e:
        logger.error(f"Get conversation messages error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversation messages")

@router.get("/conversations")
async def list_conversations(
    user_id: Optional[str] = None,
    context: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    """
    List conversations with optional filtering
    """
    try:
        conversations = await ai_service.list_conversations(
            user_id=user_id,
            context=context,
            limit=limit,
            offset=offset
        )
        
        return {
            "success": True,
            "data": conversations,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": len(conversations)
            }
        }
        
    except Exception as e:
        logger.error(f"List conversations error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversations")

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """
    Delete a conversation
    """
    try:
        success = await ai_service.delete_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        logger.info(f"Deleted conversation: {conversation_id}")
        
        return {
            "success": True,
            "message": "Conversation deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete conversation")

class UpdateTitleRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)

@router.put("/conversations/{conversation_id}/title")
async def update_conversation_title(
    conversation_id: Annotated[str, Path(description="Conversation ID")],
    request: UpdateTitleRequest
):
    """
    Update conversation title
    """
    try:
        success = await ai_service.update_conversation_title(conversation_id, request.title)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        logger.info(f"Updated conversation title: {conversation_id}")
        
        return {
            "success": True,
            "message": "Conversation title updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update conversation title error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update conversation title")

@router.post("/conversations/{conversation_id}/archive")
async def archive_conversation(conversation_id: str):
    """
    Archive a conversation
    """
    try:
        success = await ai_service.archive_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        logger.info(f"Archived conversation: {conversation_id}")
        
        return {
            "success": True,
            "message": "Conversation archived successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Archive conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to archive conversation")

@router.get("/conversations/{conversation_id}/export")
async def export_conversation(conversation_id: str, format: str = "json"):
    """
    Export conversation data
    """
    try:
        if format not in ["json", "txt", "md"]:
            raise HTTPException(status_code=400, detail="Invalid export format")
        
        export_data = await ai_service.export_conversation(conversation_id, format)
        
        if not export_data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {
            "success": True,
            "data": export_data,
            "format": format
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Export conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export conversation")
