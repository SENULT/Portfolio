// ===== LOADING SPINNER =====
window.addEventListener('load', function() {
    const spinner = document.getElementById('loadingSpinner');
    setTimeout(() => {
        spinner.style.opacity = '0';
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Close mobile menu when clicking on a link
mobileNav.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    }
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== AI ASSISTANT CHAT =====
class AIAssistant {
    constructor() {
        this.isInitialized = false;
        this.conversationId = null;
        this.socket = null;
        // Auto-detect API URL based on environment
        this.apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000/api'
            : '/api'; // For production deployment
        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
        this.connectSocket();
        this.isInitialized = true;
    }

    createChatInterface() {
        // Use existing HTML elements
        this.chatButton = document.getElementById('aiChatButton');
        this.chatWindow = document.getElementById('aiChatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatClose = document.getElementById('aiChatClose');
        this.chatSend = document.getElementById('chatSend');
        this.chatTyping = document.getElementById('chatTyping');
    }

    setupEventListeners() {
        // Chat button click
        this.chatButton.addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat
        this.chatClose.addEventListener('click', () => {
            this.closeChat();
        });

        // Send message
        this.chatSend.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Suggestion buttons
        this.chatWindow.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                this.chatInput.value = e.target.textContent;
                this.sendMessage();
            }
        });
    }

    connectSocket() {
        try {
            if (typeof io !== 'undefined') {
                // Auto-detect socket URL
                const socketUrl = window.location.hostname === 'localhost' 
                    ? 'http://localhost:5000'
                    : window.location.origin;
                this.socket = io(socketUrl);
                
                this.socket.on('connect', () => {
                    console.log('Connected to AI Assistant');
                    this.socket.emit('register', { name: 'Portfolio Visitor' });
                });

                this.socket.on('ai_response', (data) => {
                    this.handleAIResponse(data);
                });

                this.socket.on('ai_typing', (data) => {
                    this.toggleTyping(data.typing);
                });

                this.socket.on('welcome', (data) => {
                    this.updateSuggestions(data.suggestions);
                });
            }
        } catch (error) {
            console.log('Socket.io not available, using HTTP API');
        }
    }

    toggleChat() {
        const isOpen = this.chatWindow.classList.contains('open');
        if (isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatWindow.classList.add('open');
        this.chatButton.classList.add('hidden');
        this.chatInput.focus();
    }

    closeChat() {
        this.chatWindow.classList.remove('open');
        this.chatButton.classList.remove('hidden');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.toggleTyping(true);

        try {
            // Try socket first, then fallback to HTTP
            if (this.socket && this.socket.connected) {
                this.socket.emit('ai_message', {
                    message,
                    conversation_id: this.conversationId,
                    context: 'portfolio'
                });
            } else {
                // HTTP API fallback
                const response = await fetch(`${this.apiUrl}/ai/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message,
                        conversation_id: this.conversationId,
                        context: 'portfolio'
                    })
                });

                const data = await response.json();
                this.handleAIResponse({ success: true, data });
            }
        } catch (error) {
            console.error('Send message error:', error);
            this.toggleTyping(false);
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again later or contact me directly at huynhducanh.ai@gmail.com', 'ai');
        }
    }

    handleAIResponse(responseData) {
        this.toggleTyping(false);

        if (responseData.success) {
            const data = responseData.data;
            this.addMessage(data.response || data.message, 'ai');
            
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
            }

            if (data.suggestions) {
                this.updateSuggestions(data.suggestions);
            }
        } else {
            this.addMessage(responseData.error || 'Sorry, something went wrong. Please try again.', 'ai');
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    toggleTyping(show) {
        this.chatTyping.style.display = show ? 'flex' : 'none';
        if (show) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    updateSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('chatSuggestions');
        if (suggestions && suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => 
                `<button class="suggestion-btn">${suggestion}</button>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }
}

// Initialize AI Assistant when page loads
window.addEventListener('load', function() {
    setTimeout(() => {
        window.aiAssistant = new AIAssistant();
    }, 2000);
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skills')) {
                const skills = entry.target.querySelectorAll('.skill');
                skills.forEach((skill, index) => {
                    setTimeout(() => {
                        skill.classList.add('animate');
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Observe sections for scroll animations
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '3px solid #ff8000';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Keep blinking cursor for a while, then remove it
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 2000);
        }
    }
    type();
}

// Start typing effect when page loads
window.addEventListener('load', function() {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        setTimeout(() => {
            typeWriter(nameElement, 'Huynh Duc Anh', 150);
        }, 1500);
    }
});

// ===== PORTFOLIO FILTER FUNCTIONALITY =====
const filterButtons = document.querySelectorAll('.portfolio-filters button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.trim();
        
        portfolioItems.forEach((item, index) => {
            setTimeout(() => {
                if (filter === 'All' || item.textContent.includes(filter)) {
                    item.style.display = '';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            }, index * 100);
        });
    });
});

// ===== PORTFOLIO FILTERING =====
const portfolioFilters = document.querySelectorAll('.portfolio-filters button');
const allPortfolioItems = document.querySelectorAll('.portfolio-item');

portfolioFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        // Remove active class from all filters
        portfolioFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        allPortfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ===== ENHANCED CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add loading state to button
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for reaching out! I will get back to you soon.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset floating labels
        const labels = this.querySelectorAll('.floating-label');
        labels.forEach(label => {
            label.style.top = '15px';
            label.style.fontSize = '1rem';
            label.style.color = '#999';
        });
    }, 2000);
});

// ===== FLOATING LABELS =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        const label = this.nextElementSibling;
        if (label && label.classList.contains('floating-label')) {
            label.style.top = '-10px';
            label.style.fontSize = '12px';
            label.style.color = '#ff8000';
        }
    });
    
    input.addEventListener('blur', function() {
        const label = this.nextElementSibling;
        if (label && label.classList.contains('floating-label') && this.value === '') {
            label.style.top = '15px';
            label.style.fontSize = '1rem';
            label.style.color = '#999';
        }
    });
});

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
const pageSections = document.querySelectorAll('section[id]');
const navigationLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    pageSections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navigationLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-nav');
        }
    });
});

// ===== PARALLAX EFFECT FOR HERO IMAGE =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImg = document.querySelector('.hero-img img');
    
    if (heroImg && scrolled < 800) {
        heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    updateThemeIcon();
}

themeToggle.addEventListener('click', function() {
    body.classList.toggle('light-theme');
    
    // Save theme preference
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light-theme');
    } else {
        localStorage.removeItem('theme');
    }
    
    updateThemeIcon();
});

function updateThemeIcon() {
    if (body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// ===== TECH STACK TABS =====
document.addEventListener('DOMContentLoaded', function() {
    const techTabs = document.querySelectorAll('.tech-tab');
    const techCategories = document.querySelectorAll('.tech-category');

    function showTechCategory(targetId) {
        // Hide all categories
        techCategories.forEach(category => {
            category.classList.remove('active');
        });
        
        // Remove active class from all tabs
        techTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected category
        const targetCategory = document.getElementById(targetId);
        if (targetCategory) {
            targetCategory.classList.add('active');
        }
        
        // Activate corresponding tab
        const activeTab = document.querySelector(`[data-target="${targetId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    // Add click event to tabs
    techTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            showTechCategory(targetId);
        });
    });

    // Show first category by default
    if (techCategories.length > 0) {
        showTechCategory('programming-languages');
    }

    // Add hover effects to tech items
    const techItems = document.querySelectorAll('.tech-item, .cert-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== FORM VALIDATION =====
// Update existing form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            
            if (name.trim() === '' || email.trim() === '') {
                alert('Please fill in required fields: Name and Email');
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Success message
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        });
    }
});

// ===== SCROLL PROGRESS INDICATOR =====
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.width = scrollPercentage + '%';
});

// ===== FLOATING ELEMENTS ANIMATION =====
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    hero.appendChild(floatingContainer);
    
    for (let i = 0; i < 6; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.width = element.style.height = Math.random() * 60 + 20 + 'px';
        element.style.animationDelay = Math.random() * 20 + 's';
        element.style.animationDuration = (Math.random() * 10 + 15) + 's';
        floatingContainer.appendChild(element);
    }
}

// Initialize floating elements
document.addEventListener('DOMContentLoaded', createFloatingElements);
