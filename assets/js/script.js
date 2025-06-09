// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Custom cursor
    initCustomCursor();
    
    // Navigation menu toggle
    initNavigation();
    
    // Scroll animations
    initScrollAnimations();
    
    // Interactive elements
    initInteractiveElements();
    
    // Contact form handling
    initContactForm();
});

// Custom cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    // Cursor state
    let isHovering = false;
    let isClicking = false;
    
    // Initial setup - hide default cursor
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    // Apply cursor:none to all interactive elements
    document.querySelectorAll('a, button, input, textarea, select, .btn, .project-card, .about-card, .social-link').forEach(el => {
        el.style.cursor = 'none';
    });
      // Lerp (Linear interpolation) for smooth movement
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Spring physics parameters
    const springConfig = {
        stiffness: 0.15,  // Spring stiffness
        damping: 0.8,     // Damping effect
        mass: 1           // Mass of the follower
    };
    
    const state = {
        mouse: { x: 0, y: 0 },        // Current mouse position
        cursor: { x: 0, y: 0 },       // Current cursor position
        follower: { x: 0, y: 0 },     // Current follower position
        velocity: { x: 0, y: 0 }      // Velocity for spring physics
    };
    
    // Main animation function for spring physics
    function animateCursor() {
        // Calculate spring force for the follower
        const dx = state.mouse.x - state.follower.x;
        const dy = state.mouse.y - state.follower.y;
        
        // Apply spring physics
        const ax = dx * springConfig.stiffness;
        const ay = dy * springConfig.stiffness;
        
        // Update velocity with spring acceleration and damping
        state.velocity.x += ax / springConfig.mass;
        state.velocity.y += ay / springConfig.mass;
        state.velocity.x *= springConfig.damping;
        state.velocity.y *= springConfig.damping;
        
        // Update positions
        state.cursor.x = lerp(state.cursor.x, state.mouse.x, 0.35);
        state.cursor.y = lerp(state.cursor.y, state.mouse.y, 0.35);
        
        state.follower.x += state.velocity.x;
        state.follower.y += state.velocity.y;
        
        // Apply positions to DOM elements
        gsap.set(cursor, {
            x: state.cursor.x,
            y: state.cursor.y,
            force3D: true
        });
        
        gsap.set(cursorFollower, {
            x: state.follower.x,
            y: state.follower.y,
            force3D: true
        });
        
        requestAnimationFrame(animateCursor);
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
    });
    
    // Handle mouse events
    document.addEventListener('mousedown', () => {
        isClicking = true;
        gsap.to(cursor, {
            scale: 0.8,
            duration: 0.2
        });
        gsap.to(cursorFollower, {
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 59, 48, 0.2)',
            duration: 0.3
        });
    });
    
    document.addEventListener('mouseup', () => {
        isClicking = false;
        gsap.to(cursor, {
            scale: isHovering ? 1.5 : 1,
            duration: 0.2
        });
        gsap.to(cursorFollower, {
            width: isHovering ? '50px' : '40px',
            height: isHovering ? '50px' : '40px',
            backgroundColor: isHovering ? 'rgba(255, 59, 48, 0.1)' : 'transparent',
            duration: 0.3
        });
    });
    
    // Handle visibility
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(cursorFollower, { opacity: 0, duration: 0.2 });
    });
    
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
        gsap.to(cursorFollower, { opacity: 0.6, duration: 0.2 });
    });
    
    // Define interactive elements
    const interactiveElements = [
        { selector: 'a, button, .project-card, .about-card, .social-link', scale: 1.5, color: '#ffffff', followerScale: '50px' },
        { selector: '.btn, .nav-link', scale: 1.7, color: '#ffffff', followerScale: '60px' },
        { selector: 'input, textarea', scale: 1.2, color: '#ffffff', followerBg: 'rgba(255, 59, 48, 0.1)' }
    ];
    
    // Apply hover effects to interactive elements
    interactiveElements.forEach(item => {
        document.querySelectorAll(item.selector).forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovering = true;
                gsap.to(cursor, {
                    scale: item.scale || 1.5,
                    backgroundColor: item.color || '#ffffff',
                    duration: 0.3
                });
                gsap.to(cursorFollower, {
                    width: item.followerScale || '50px',
                    height: item.followerScale || '50px',
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: '1px',
                    backgroundColor: item.followerBg || 'rgba(255, 59, 48, 0.1)',
                    duration: 0.3
                });
                
                // Optional text effect for buttons
                if (el.classList.contains('btn')) {
                    gsap.to(el, {
                        y: -2,
                        duration: 0.2
                    });
                }
            });
            
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                gsap.to(cursor, {
                    scale: isClicking ? 0.8 : 1,
                    backgroundColor: '#ffffff',
                    duration: 0.3
                });
                gsap.to(cursorFollower, {
                    width: '40px',
                    height: '40px',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    borderWidth: '1px',
                    backgroundColor: 'transparent',
                    duration: 0.3
                });
                
                // Revert button text effect
                if (el.classList.contains('btn')) {
                    gsap.to(el, {
                        y: 0,
                        duration: 0.2
                    });
                }
            });
        });
    });    // Ensure cursor works on any newly added elements
    const ensureCursorOnAllElements = () => {
        document.querySelectorAll('a, button, input, textarea, select, .btn, .project-card, .about-card, .social-link').forEach(el => {
            el.style.cursor = 'none';
            
            // Add mouseover event if not already added
            if (!el.hasAttribute('data-cursor-init')) {
                el.setAttribute('data-cursor-init', 'true');
                el.addEventListener('mouseover', () => {
                    document.documentElement.style.cursor = 'none';
                    document.body.style.cursor = 'none';
                });
            }
        });
    };
    
    // Run initially and set up a MutationObserver to handle DOM changes
    ensureCursorOnAllElements();
    
    // Observer for dynamic elements
    const observer = new MutationObserver(ensureCursorOnAllElements);
    observer.observe(document.body, { subtree: true, childList: true });
    
    // Check if it's a touch device
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };
    
    // Start the animation only on non-touch devices
    if (!isTouchDevice() && window.innerWidth > 768) {
        animateCursor();
    } else {
        // Disable custom cursor on mobile/touch devices
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
        
        // Add touch-device class to body
        document.body.classList.add('touch-device');
    }
}

// Navigation menu toggle
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    // Menu toggle for mobile
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (menuToggle?.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    // Hero section animations
    gsap.from('.hero-text h1', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2
    });
    
    gsap.from('.hero-text .subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.4
    });
    
    gsap.from('.hero-text .description', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6
    });
    
    gsap.from('.cta-buttons', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.8
    });
    
    gsap.from('.hero-image', {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.5
    });
    
    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            }
        });
    });
    
    // About cards animation
    gsap.utils.toArray('.about-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: '.about-cards',
                start: 'top 70%'
            }
        });
    });
    
    // Skills animation
    gsap.utils.toArray('.skill-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.skills-container',
                start: 'top 70%'
            }
        });
        
        // Animate the skill progress bars
        gsap.from(item.querySelector('.skill-progress'), {
            width: 0,
            duration: 1.5,
            delay: 0.5 + index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.skills-container',
                start: 'top 70%'
            }
        });
    });
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: '.projects-container',
                start: 'top 70%'
            }
        });
    });
    
    // Contact section animation
    gsap.utils.toArray('.contact-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 70%'
            }
        });
    });
    
    gsap.from('.contact-form', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 70%'
        }
    });
}

// Interactive elements
function initInteractiveElements() {
    // Parallax effect for background grid
    document.addEventListener('mousemove', (e) => {
        const grid = document.querySelector('.grid-background');
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        if (grid) {
            gsap.to(grid, {
                x: moveX,
                y: moveY,
                duration: 1
            });
        }
    });
    
    // Interactive glow effect for hero image
    document.addEventListener('mousemove', (e) => {
        const glowEffect = document.querySelector('.glow-effect');
        const heroImage = document.querySelector('.hero-image');
        
        if (glowEffect && heroImage) {
            const rect = heroImage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const moveX = (e.clientX - centerX) * 0.1;
            const moveY = (e.clientY - centerY) * 0.1;
            
            gsap.to(glowEffect, {
                x: moveX,
                y: moveY,
                duration: 0.5
            });
        }
    });
    
    // Apple-style button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
        });
        
        button.addEventListener('mousedown', () => {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseup', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.1
            });
        });
    });
    
    // Project cards hover effects - Apple style hover
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation angles based on mouse position
            const rotateY = ((x - rect.width / 2) / rect.width) * 10;
            const rotateX = -((y - rect.height / 2) / rect.height) * 10;
            
            // Apply the 3D rotation
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Bitte fülle alle Felder aus.');
                return;
            }
            
            // Simulate form submission (replace with actual form submission)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
            
            // Simulate API call with a timeout
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Show success message
                alert('Deine Nachricht wurde erfolgreich gesendet!');
            }, 2000);
        });
    }
}
