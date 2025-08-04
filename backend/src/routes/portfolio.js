const express = require('express');
const router = express.Router();

// Portfolio data
const portfolioData = {
  personal: {
    name: "Huynh Duc Anh",
    title: "AI Engineer",
    email: "huynhducanh.ai@gmail.com",
    phone: "+84 123 456 789",
    location: "Ho Chi Minh City, Vietnam",
    bio: "An AI engineer with expertise in Python, Machine Learning, Deep Learning and Computer Vision. Passionate about creating intelligent solutions that solve real-world problems.",
    avatar: "/images/profile.jpg"
  },
  
  skills: [
    { name: "Python", level: 95, category: "programming" },
    { name: "Machine Learning", level: 90, category: "ai" },
    { name: "Computer Vision", level: 85, category: "ai" },
    { name: "Data Science", level: 80, category: "data" },
    { name: "Deep Learning", level: 85, category: "ai" },
    { name: "TensorFlow", level: 80, category: "framework" },
    { name: "PyTorch", level: 75, category: "framework" },
    { name: "FastAPI", level: 85, category: "backend" },
    { name: "Node.js", level: 70, category: "backend" },
    { name: "React.js", level: 75, category: "frontend" }
  ],
  
  experience: [
    {
      id: 1,
      position: "Senior AI Engineer",
      company: "TechCorp Vietnam",
      period: "2023 - Present",
      description: "Leading AI projects focusing on computer vision and natural language processing solutions.",
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenCV", "FastAPI"]
    },
    {
      id: 2,
      position: "Machine Learning Engineer",
      company: "DataTech Solutions",
      period: "2021 - 2023",
      description: "Developed and deployed ML models for various business applications.",
      technologies: ["Python", "Scikit-learn", "Pandas", "Docker", "AWS"]
    },
    {
      id: 3,
      position: "Junior Data Scientist",
      company: "StartupAI",
      period: "2020 - 2021",
      description: "Analyzed data and built predictive models for business intelligence.",
      technologies: ["Python", "SQL", "Tableau", "Jupyter", "Git"]
    }
  ],
  
  education: [
    {
      id: 1,
      degree: "Bachelor of Computer Science",
      school: "University of Technology",
      period: "2016 - 2020",
      gpa: "3.8/4.0",
      description: "Specialized in Artificial Intelligence and Machine Learning"
    }
  ],
  
  certifications: [
    {
      id: 1,
      name: "AI Foundation Certificate",
      issuer: "TechCorp Academy",
      date: "2023",
      image: "/certs/AI_foundation.png"
    },
    {
      id: 2,
      name: "Data Science Professional",
      issuer: "DataScience Institute",
      date: "2022",
      image: "/certs/datascience.png"
    },
    {
      id: 3,
      name: "Machine Learning Specialist",
      issuer: "ML Academy",
      date: "2022",
      image: "/certs/math_ML.png"
    },
    {
      id: 4,
      name: "Software Development Lifecycle",
      issuer: "DevOps Institute",
      date: "2021",
      image: "/certs/sdlc.png"
    }
  ],
  
  projects: [
    {
      id: 1,
      title: "AI-Powered Image Recognition System",
      description: "Computer vision system for automated quality control in manufacturing",
      technologies: ["Python", "OpenCV", "TensorFlow", "FastAPI", "Docker"],
      category: "ai",
      image: "/projects/image-recognition.jpg",
      github: "https://github.com/SENULT/image-recognition",
      live: "https://demo.example.com",
      featured: true
    },
    {
      id: 2,
      title: "Natural Language Processing Chatbot",
      description: "Intelligent chatbot for customer service automation",
      technologies: ["Python", "NLTK", "Transformers", "Flask", "Redis"],
      category: "ai",
      image: "/projects/nlp-chatbot.jpg",
      github: "https://github.com/SENULT/nlp-chatbot",
      live: "https://chatbot.example.com",
      featured: true
    },
    {
      id: 3,
      title: "Predictive Analytics Dashboard",
      description: "Real-time analytics dashboard for business intelligence",
      technologies: ["Python", "Pandas", "Plotly", "Streamlit", "PostgreSQL"],
      category: "data",
      image: "/projects/analytics-dashboard.jpg",
      github: "https://github.com/SENULT/analytics-dashboard",
      live: "https://analytics.example.com",
      featured: false
    },
    {
      id: 4,
      title: "Portfolio Website with AI Assistant",
      description: "Modern portfolio website with integrated AI assistant",
      technologies: ["React.js", "Node.js", "FastAPI", "Socket.io", "OpenAI"],
      category: "web",
      image: "/projects/portfolio-website.jpg",
      github: "https://github.com/SENULT/Portfolio",
      live: "https://huynhducanh.vercel.app",
      featured: true
    }
  ],
  
  services: [
    {
      id: 1,
      title: "AI Consultation",
      description: "Expert consultation on AI strategy and implementation for businesses",
      icon: "fas fa-brain",
      features: ["AI Strategy Planning", "Technology Assessment", "Implementation Roadmap"]
    },
    {
      id: 2,
      title: "Machine Learning Development",
      description: "Custom ML model development and deployment solutions",
      icon: "fas fa-robot",
      features: ["Model Development", "Training & Optimization", "Deployment & Monitoring"]
    },
    {
      id: 3,
      title: "Computer Vision Solutions",
      description: "Advanced computer vision applications for various industries",
      icon: "fas fa-eye",
      features: ["Image Recognition", "Object Detection", "Video Analysis"]
    },
    {
      id: 4,
      title: "Data Science Services",
      description: "Comprehensive data analysis and insights generation",
      icon: "fas fa-chart-line",
      features: ["Data Analysis", "Predictive Modeling", "Visualization"]
    }
  ],
  
  social: {
    github: "https://github.com/SENULT",
    linkedin: "https://linkedin.com/in/huynhducanh",
    twitter: "https://twitter.com/huynhducanh",
    facebook: "https://facebook.com/huynhducanh",
    email: "mailto:huynhducanh.ai@gmail.com"
  },
  
  stats: {
    experience: "5+",
    projects: "20+",
    clients: "80+",
    certifications: "10+"
  }
};

// Get all portfolio data
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio data'
    });
  }
});

// Get personal information
router.get('/personal', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.personal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch personal data'
    });
  }
});

// Get skills
router.get('/skills', (req, res) => {
  try {
    const { category } = req.query;
    let skills = portfolioData.skills;
    
    if (category) {
      skills = skills.filter(skill => skill.category === category);
    }
    
    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch skills data'
    });
  }
});

// Get experience
router.get('/experience', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience data'
    });
  }
});

// Get projects
router.get('/projects', (req, res) => {
  try {
    const { category, featured } = req.query;
    let projects = portfolioData.projects;
    
    if (category) {
      projects = projects.filter(project => project.category === category);
    }
    
    if (featured === 'true') {
      projects = projects.filter(project => project.featured);
    }
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects data'
    });
  }
});

// Get single project
router.get('/projects/:id', (req, res) => {
  try {
    const project = portfolioData.projects.find(p => p.id === parseInt(req.params.id));
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project data'
    });
  }
});

// Get services
router.get('/services', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services data'
    });
  }
});

// Get certifications
router.get('/certifications', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.certifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch certifications data'
    });
  }
});

// Get social links
router.get('/social', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.social
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch social data'
    });
  }
});

// Get stats
router.get('/stats', (req, res) => {
  try {
    res.json({
      success: true,
      data: portfolioData.stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats data'
    });
  }
});

module.exports = router;
