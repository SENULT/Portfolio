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

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImg = document.querySelector('.hero-img img');
    
    if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
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

// ===== THEME TOGGLE (BONUS) =====
function createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff8000;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: white;
        cursor: pointer;
        z-index: 1001;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Initialize theme toggle
createThemeToggle();
