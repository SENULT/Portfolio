import openai
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid
import json
from ..core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = None
        self.conversations = {}  # In-memory storage for demo
        self.knowledge_base = {}
        
    async def initialize(self):
        """Initialize AI service"""
        try:
            if settings.OPENAI_API_KEY:
                openai.api_key = settings.OPENAI_API_KEY
                self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                logger.info("OpenAI client initialized")
            else:
                logger.warning("OpenAI API key not provided - using fallback responses")
                
        except Exception as e:
            logger.error(f"AI service initialization error: {str(e)}")
            raise
    
    async def initialize_knowledge_base(self):
        """Initialize portfolio knowledge base"""
        try:
            self.knowledge_base = {
                "personal": {
                    "name": "Huynh Duc Anh",
                    "title": "AI Engineer", 
                    "bio": "An AI engineer with expertise in Python, Machine Learning, Deep Learning and Computer Vision. Passionate about creating intelligent solutions that solve real-world problems.",
                    "location": "Ho Chi Minh City, Vietnam",
                    "email": "huynhducanh.ai@gmail.com",
                    "experience_years": 5,
                    "specialties": ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Data Science"]
                },
                "skills": {
                    "programming": ["Python", "JavaScript", "SQL"],
                    "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV"],
                    "frameworks": ["FastAPI", "React.js", "Node.js", "Flask"],
                    "tools": ["Docker", "Git", "AWS", "Google Cloud"]
                },
                "projects": [
                    {
                        "name": "AI-Powered Image Recognition System",
                        "description": "Computer vision system for automated quality control in manufacturing using deep learning",
                        "technologies": ["Python", "OpenCV", "TensorFlow", "FastAPI", "Docker"],
                        "category": "Computer Vision"
                    },
                    {
                        "name": "Natural Language Processing Chatbot", 
                        "description": "Intelligent chatbot for customer service automation with sentiment analysis",
                        "technologies": ["Python", "NLTK", "Transformers", "Flask", "Redis"],
                        "category": "NLP"
                    },
                    {
                        "name": "Portfolio Website with AI Assistant",
                        "description": "Modern portfolio website with integrated AI assistant for real-time interaction",
                        "technologies": ["React.js", "Node.js", "FastAPI", "Socket.io", "OpenAI"],
                        "category": "Web Development"
                    }
                ],
                "services": [
                    "AI Strategy Consultation",
                    "Machine Learning Model Development", 
                    "Computer Vision Solutions",
                    "Data Science & Analytics",
                    "AI System Integration"
                ]
            }
            logger.info("Knowledge base initialized")
            
        except Exception as e:
            logger.error(f"Knowledge base initialization error: {str(e)}")
            raise

    async def get_ai_response(self, message: str, conversation_id: str, context: str = "portfolio", user_id: str = None) -> Dict[str, Any]:
        """Get AI response for user message"""
        try:
            # Create system prompt based on context
            system_prompt = self._create_system_prompt(context)
            
            # Get conversation history
            conversation_history = self._get_conversation_history(conversation_id)
            
            # If OpenAI is available, use it
            if self.client and settings.OPENAI_API_KEY:
                return await self._get_openai_response(message, system_prompt, conversation_history)
            else:
                # Use fallback response system
                return await self._get_fallback_response(message, context)
                
        except Exception as e:
            logger.error(f"AI response error: {str(e)}")
            return {
                "response": "I'm sorry, I'm experiencing some technical difficulties. Please try again or contact me directly at huynhducanh.ai@gmail.com",
                "tokens_used": 0,
                "error": True
            }

    async def _get_openai_response(self, message: str, system_prompt: str, conversation_history: List) -> Dict[str, Any]:
        """Get response from OpenAI"""
        try:
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(conversation_history[-10:])  # Last 10 messages for context
            messages.append({"role": "user", "content": message})
            
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=settings.OPENAI_TEMPERATURE
            )
            
            return {
                "response": response.choices[0].message.content,
                "tokens_used": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _get_fallback_response(self, message: str, context: str) -> Dict[str, Any]:
        """Generate fallback response without OpenAI"""
        message_lower = message.lower()
        
        # Simple keyword-based responses
        if any(word in message_lower for word in ["skill", "technology", "programming"]):
            response = "I specialize in Python, Machine Learning, Computer Vision, and AI development. My core technologies include TensorFlow, PyTorch, FastAPI, and React.js. I have 5+ years of experience in AI engineering."
            
        elif any(word in message_lower for word in ["project", "work", "portfolio"]):
            response = "I've worked on various AI projects including an Image Recognition System for manufacturing, NLP Chatbots for customer service, and this portfolio website with AI assistant integration. Each project showcases different aspects of AI and machine learning."
            
        elif any(word in message_lower for word in ["experience", "background", "career"]):
            response = "I'm currently a Senior AI Engineer at TechCorp Vietnam with 5+ years of experience in AI and machine learning. I previously worked as a Machine Learning Engineer at DataTech Solutions. I hold a Computer Science degree with specialization in AI."
            
        elif any(word in message_lower for word in ["service", "hire", "consultation"]):
            response = "I offer AI consultation, machine learning model development, computer vision solutions, and data science services. I can help with AI strategy, model development, deployment, and system integration. Feel free to contact me to discuss your specific needs!"
            
        elif any(word in message_lower for word in ["education", "certification", "study"]):
            response = "I have a Bachelor's degree in Computer Science from University of Technology, specializing in AI and Machine Learning. I also hold certifications in AI Foundation, Data Science, and Machine Learning from various institutes."
            
        elif any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            response = "Hello! I'm Huynh Duc Anh's AI assistant. I'm here to help you learn about my skills, projects, and experience in AI engineering. What would you like to know?"
            
        elif any(word in message_lower for word in ["thank", "thanks"]):
            response = "You're welcome! I'm happy to help. If you have any other questions about my AI expertise or projects, feel free to ask!"
            
        else:
            response = "I'm an AI assistant for Huynh Duc Anh's portfolio. I can help you learn about his AI engineering skills, machine learning projects, experience, and services. What specific information would you like to know?"
        
        return {
            "response": response,
            "tokens_used": 0,
            "fallback": True
        }

    def _create_system_prompt(self, context: str) -> str:
        """Create system prompt based on context"""
        base_prompt = """You are an AI assistant for Huynh Duc Anh's portfolio website. You represent Huynh Duc Anh, an experienced AI Engineer specializing in Machine Learning, Computer Vision, and Data Science.

Key Information about Huynh Duc Anh:
- Name: Huynh Duc Anh
- Title: AI Engineer  
- Location: Ho Chi Minh City, Vietnam
- Email: huynhducanh.ai@gmail.com
- Experience: 5+ years in AI/ML

Skills & Technologies:
- Programming: Python (Expert), JavaScript, SQL
- AI/ML: TensorFlow, PyTorch, Scikit-learn, OpenCV, NLTK
- Frameworks: FastAPI, React.js, Node.js, Flask
- Tools: Docker, Git, AWS, Google Cloud

Experience:
- Current: Senior AI Engineer at TechCorp Vietnam (2023-Present)
- Previous: Machine Learning Engineer at DataTech Solutions (2021-2023)  
- Education: Bachelor of Computer Science, specializing in AI/ML

Notable Projects:
1. AI-Powered Image Recognition System for manufacturing
2. NLP Chatbot with sentiment analysis
3. Portfolio website with AI assistant integration

Services Offered:
- AI Strategy Consultation
- ML Model Development & Deployment
- Computer Vision Solutions  
- Data Science & Analytics

Instructions:
- Be helpful, professional, and knowledgeable
- Provide specific, accurate information about skills and experience
- Encourage users to contact for collaboration opportunities
- Keep responses concise but informative
- If asked about topics outside your expertise, politely redirect to relevant portfolio areas"""

        if context == "technical":
            base_prompt += "\n\nFocus on technical aspects, implementation details, and methodologies."
        elif context == "business":
            base_prompt += "\n\nFocus on business value, ROI, and practical applications of AI solutions."
            
        return base_prompt

    def _get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Get conversation history"""
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        return self.conversations[conversation_id]

    async def save_conversation_message(self, conversation_id: str, user_message: str, ai_response: str, context: str):
        """Save conversation message"""
        try:
            if conversation_id not in self.conversations:
                self.conversations[conversation_id] = []
            
            self.conversations[conversation_id].extend([
                {"role": "user", "content": user_message, "timestamp": datetime.now().isoformat()},
                {"role": "assistant", "content": ai_response, "timestamp": datetime.now().isoformat()}
            ])
            
            # Keep only last 20 messages
            if len(self.conversations[conversation_id]) > 20:
                self.conversations[conversation_id] = self.conversations[conversation_id][-20:]
                
        except Exception as e:
            logger.error(f"Save conversation error: {str(e)}")

    async def get_suggestions(self, context: str = "portfolio", topic: str = None, conversation_id: str = None) -> List[str]:
        """Get conversation suggestions"""
        try:
            suggestions = [
                "Tell me about your AI projects",
                "What machine learning frameworks do you use?", 
                "How did you get started in AI?",
                "What services do you offer?",
                "Can you show me your certifications?",
                "What's your experience with computer vision?",
                "How can you help with my AI project?",
                "What programming languages do you specialize in?"
            ]
            
            if topic:
                if "project" in topic.lower():
                    suggestions = [
                        "Tell me about your image recognition project",
                        "How did you build the NLP chatbot?", 
                        "What technologies did you use in your projects?",
                        "Can you explain your computer vision work?"
                    ]
                elif "skill" in topic.lower():
                    suggestions = [
                        "What's your Python expertise level?",
                        "How experienced are you with TensorFlow?",
                        "Do you work with PyTorch?",
                        "What about React.js and web development?"
                    ]
            
            return suggestions[:5]
            
        except Exception as e:
            logger.error(f"Get suggestions error: {str(e)}")
            return []

    async def health_check(self) -> Dict[str, Any]:
        """Check AI service health"""
        try:
            health_status = {
                "openai_available": bool(self.client and settings.OPENAI_API_KEY),
                "knowledge_base_loaded": bool(self.knowledge_base),
                "conversations_active": len(self.conversations),
                "status": "healthy"
            }
            
            if self.client and settings.OPENAI_API_KEY:
                # Test OpenAI connection
                try:
                    test_response = self.client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[{"role": "user", "content": "test"}],
                        max_tokens=1
                    )
                    health_status["openai_test"] = "passed"
                except:
                    health_status["openai_test"] = "failed"
                    health_status["openai_available"] = False
            
            return health_status
            
        except Exception as e:
            logger.error(f"Health check error: {str(e)}")
            return {"status": "unhealthy", "error": str(e)}

    async def cleanup(self):
        """Cleanup resources"""
        try:
            logger.info("AI service cleanup completed")
        except Exception as e:
            logger.error(f"Cleanup error: {str(e)}")

    # Additional methods for conversation management
    async def create_conversation(self, title: str, context: str, user_id: str = None) -> Dict[str, Any]:
        """Create new conversation"""
        conversation_id = f"conv_{uuid.uuid4().hex[:8]}"
        conversation = {
            "id": conversation_id,
            "title": title,
            "context": context,
            "user_id": user_id,
            "created_at": datetime.now().isoformat(),
            "message_count": 0,
            "last_activity": None
        }
        return conversation

    async def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """Get conversation details"""
        if conversation_id in self.conversations:
            return {
                "id": conversation_id,
                "messages": self.conversations[conversation_id],
                "message_count": len(self.conversations[conversation_id])
            }
        return None

    async def get_conversation_messages(self, conversation_id: str, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Get conversation messages"""
        if conversation_id in self.conversations:
            messages = self.conversations[conversation_id]
            return messages[offset:offset + limit]
        return []

    async def list_conversations(self, user_id: str = None, context: str = None, limit: int = 20, offset: int = 0) -> List[Dict]:
        """List conversations"""
        # Simple implementation for demo
        conversations = []
        for conv_id, messages in self.conversations.items():
            conversations.append({
                "id": conv_id,
                "message_count": len(messages),
                "last_activity": messages[-1]["timestamp"] if messages else None
            })
        return conversations[offset:offset + limit]

    async def delete_conversation(self, conversation_id: str) -> bool:
        """Delete conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False

    async def save_feedback(self, conversation_id: str, rating: int, feedback: str = None):
        """Save user feedback"""
        logger.info(f"Feedback for {conversation_id}: {rating}/5 - {feedback}")

    async def update_conversation_title(self, conversation_id: str, title: str) -> bool:
        """Update conversation title"""
        # Implementation would update database
        return True

    async def archive_conversation(self, conversation_id: str) -> bool:
        """Archive conversation"""  
        # Implementation would mark as archived
        return True

    async def export_conversation(self, conversation_id: str, format: str) -> Optional[Dict]:
        """Export conversation"""
        if conversation_id in self.conversations:
            return {
                "conversation_id": conversation_id,
                "messages": self.conversations[conversation_id],
                "format": format
            }
        return None
