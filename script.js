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

// ===== TESTIMONIALS SLIDER =====
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show selected testimonial and activate corresponding dot
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
}

// Add click event to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-slide testimonials every 5 seconds
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

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
