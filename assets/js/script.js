// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded, using fallback animations');
        initFallbackAnimations();
        return;
    }
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Wait a moment to ensure all scripts are loaded
    setTimeout(() => {
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
        
        // Discord popup handling
        initDiscordPopup();
        
        // Initialize project previews
        initProjectPreviews();
        
        // Add safety check for skills section visibility
        setTimeout(() => {
            ensureSkillsVisibility();
            ensureProjectsVisibility();
        }, 1000);
    }, 100);
});

// Safety function to ensure skills section is visible
function ensureSkillsVisibility() {
    const skillsContainer = document.querySelector('.skills-container');
    const skillItems = document.querySelectorAll('.skill-item');
    
    if (skillsContainer && skillItems.length > 0) {
        // Check if any skill items are hidden (opacity 0 or display none)
        const hiddenItems = Array.from(skillItems).filter(item => {
            const style = window.getComputedStyle(item);
            return style.opacity === '0' || style.display === 'none';
        });
        
        // If there are hidden items and no scroll trigger is active, make them visible
        if (hiddenItems.length > 0) {
            console.log('Skills visibility issue detected, applying fallback');
            
            // Make all skill elements visible with a simple animation
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    
                    // Animate progress bars
                    const progressBar = item.querySelector('.skill-progress');
                    if (progressBar && progressBar.style.width === '0px') {
                        // Get the intended width from the HTML
                        const intendedWidth = progressBar.getAttribute('data-width') || progressBar.style.width;
                        if (intendedWidth) {
                            progressBar.style.transition = 'width 1.2s ease-out';
                            progressBar.style.width = intendedWidth;
                        }
                    }
                }, index * 100);
            });
            
            // Also ensure skill categories are visible
            document.querySelectorAll('.skill-category').forEach((category, index) => {
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    }
}

// Safety function to ensure projects section is visible
function ensureProjectsVisibility() {
    const projectsContainer = document.querySelector('.projects-container');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectsContainer && projectCards.length > 0) {
        // Check if any project cards are hidden (opacity 0 or display none)
        const hiddenCards = Array.from(projectCards).filter(card => {
            const style = window.getComputedStyle(card);
            return style.opacity === '0' || style.display === 'none';
        });
        
        // If there are hidden cards and no scroll trigger is active, make them visible
        if (hiddenCards.length > 0) {
            console.log('Projects visibility issue detected, applying fallback');
            
            // Make all project cards visible with a simple animation
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    }
}

// Discord Popup functionality
function initDiscordPopup() {
    const discordBtn = document.querySelector('.secondary-btn');
    const discordPopup = document.getElementById('discordPopup');
    const closeBtn = document.querySelector('.discord-close-btn');
    const discordAvatar = document.querySelector('.discord-avatar-container');
    
    // Open Discord popup when secondary button is clicked
    if (discordBtn && discordPopup) {
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            discordPopup.classList.add('active');
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    }
    
    // Close popup when close button is clicked
    if (closeBtn && discordPopup) {
        closeBtn.addEventListener('click', () => {
            discordPopup.classList.remove('active');
        });
    }
    
    // Close popup when clicking outside the content
    if (discordPopup) {
        discordPopup.addEventListener('click', (e) => {
            if (e.target === discordPopup) {
                discordPopup.classList.remove('active');
            }
        });
    }
    
    // Redirect to Discord when avatar is clicked
    if (discordAvatar) {
        discordAvatar.addEventListener('click', () => {
            // Add click animation
            discordAvatar.style.transform = 'scale(0.95)';
            setTimeout(() => {
                discordAvatar.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    discordAvatar.style.transform = '';
                    // Redirect to Discord
                    window.open('https://discord.gg/UKYn38QE', '_blank');
                }, 150);
            }, 100);
        });
    }
    
    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && discordPopup.classList.contains('active')) {
            discordPopup.classList.remove('active');
        }
    });
    
    // Prevent scrolling when popup is open
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    if (discordPopup) {
        observer.observe(discordPopup, { attributes: true });
    }
}

// Initialize project previews and handle missing images
function initProjectPreviews() {
    const projectImages = document.querySelectorAll('.project-image img, .project-preview img');
    
    projectImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            // Create a placeholder if image doesn't exist
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 400;
            canvas.height = 250;
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 400, 250);
            gradient.addColorStop(0, '#ff3b30');
            gradient.addColorStop(1, '#ff6b61');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 250);
            
            // Add text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Projekt ' + (Math.floor(index / 2) + 1), 200, 120);
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Bild wird geladen...', 200, 150);
            
            // Replace the image source with the canvas
            this.src = canvas.toDataURL();
        });
    });
    
    // Add lazy loading intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe all lazy-loaded images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

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
    // Ensure ScrollTrigger is properly registered
    if (!window.ScrollTrigger) {
        console.warn('ScrollTrigger not loaded, using fallback animations');
        initFallbackAnimations();
        return;
    }

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
                start: 'top 80%',
                once: true
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
                start: 'top 70%',
                once: true
            }
        });
    });
    
    // Skills animation - optimized for better loading
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        // Create a single ScrollTrigger for the entire skills section
        ScrollTrigger.create({
            trigger: skillsContainer,
            start: 'top 80%',
            onEnter: () => {
                // Animate skill categories first
                gsap.from('.skill-category', {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out'
                });
                
                // Then animate individual skill items
                gsap.utils.toArray('.skill-item').forEach((item, index) => {
                    gsap.from(item, {
                        opacity: 0,
                        x: -30,
                        duration: 0.6,
                        delay: 0.4 + index * 0.08,
                        ease: 'power2.out'
                    });
                    
                    // Animate the skill progress bars with proper timing
                    const progressBar = item.querySelector('.skill-progress');
                    if (progressBar) {
                        // Store original width
                        const originalWidth = progressBar.style.width;
                        
                        // Set initial width to 0
                        gsap.set(progressBar, { width: 0 });
                        
                        // Animate to original width
                        gsap.to(progressBar, {
                            width: originalWidth,
                            duration: 1.2,
                            delay: 0.8 + index * 0.08,
                            ease: 'power2.out'
                        });
                    }
                });
            },
            once: true // Ensure it only runs once
        });
    }
    
    // Project cards animation - optimized for better loading
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer) {
        // Create a single ScrollTrigger for the entire projects section
        ScrollTrigger.create({
            trigger: projectsContainer,
            start: 'top 80%',
            onEnter: () => {
                // Animate project cards with staggered timing
                gsap.utils.toArray('.project-card').forEach((card, index) => {
                    gsap.from(card, {
                        opacity: 0,
                        y: 50,
                        duration: 0.8,
                        delay: index * 0.15,
                        ease: 'power2.out'
                    });
                });
            },
            once: true // Ensure it only runs once
        });
    }
    
    // Contact section animation
    gsap.utils.toArray('.contact-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 70%',
                once: true
            }
        });
    });
    
    gsap.from('.contact-form', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 70%',
            once: true
        }
    });
}

// Fallback animations if ScrollTrigger fails to load
function initFallbackAnimations() {
    // Simple intersection observer fallback
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Handle skills progress bars
                if (entry.target.classList.contains('skills-container')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transition = 'width 1.2s ease-out';
                            // Width is already set in HTML
                        }, 500 + index * 80);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that need animation
    document.querySelectorAll('.section-header, .about-card, .skills-container, .projects-container, .project-card, .contact-item, .contact-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
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
        const preview = card.querySelector('.project-preview');
        
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
            
            // Position preview based on mouse position
            if (preview && window.innerWidth > 1200) {
                const cardCenterX = rect.width / 2;
                const cardCenterY = rect.height / 2;
                
                // Calculate preview position
                let previewX = x > cardCenterX ? -320 : rect.width + 20;
                let previewY = Math.max(-20, Math.min(y - 100, rect.height - 180));
                
                gsap.set(preview, {
                    right: x > cardCenterX ? -320 : 'auto',
                    left: x > cardCenterX ? 'auto' : rect.width + 20,
                    top: previewY
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
        
        // Enhanced click animation
        card.addEventListener('mousedown', () => {
            gsap.to(card, {
                scale: 0.98,
                duration: 0.1
            });
        });
        
        card.addEventListener('mouseup', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.1
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
