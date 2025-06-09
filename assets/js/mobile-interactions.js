// Touch device interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize touch device detection
    initTouchDetection();
    
    // Add about card touch interactions
    initAboutCardTouch();
});

// More reliable touch detection function
function detectTouchCapability() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    
    // Check for touch events support
    if (('ontouchstart' in window) || 
        (window.DocumentTouch && document instanceof window.DocumentTouch)) {
        return true;
    }
    
    // Check for touch-capable media query
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return window.matchMedia(query).matches;
}

// Detect touch devices and add appropriate classes
function initTouchDetection() {
    // Check if device is touch-enabled using more reliable detection
    if (detectTouchCapability() || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        
        // Add tap indicators to about cards
        addCardIndicators();
        
        // Disable custom cursor on touch devices
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (cursor && cursorFollower) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }
        
        // Reset cursor styles for elements
        document.querySelectorAll('a, button, input, textarea, select, .btn, .project-card, .about-card, .social-link')
            .forEach(el => {
                el.style.cursor = 'auto';
            });
        
        // Add event listener to help with device orientation changes
        window.addEventListener('orientationchange', function() {
            // Small delay to allow rendering
            setTimeout(function() {
                // Force redraw of the about cards
                document.querySelectorAll('.about-card').forEach(card => {
                    card.style.display = 'none';
                    setTimeout(() => {
                        card.style.display = '';
                    }, 10);
                });
            }, 300);
        });
    }
}

// Add tap indicators to about cards
function addCardIndicators() {
    const cards = document.querySelectorAll('.about-card');
    
    cards.forEach(card => {
        // Create tap indicator
        const indicator = document.createElement('div');
        indicator.classList.add('card-indicator');
        indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        card.appendChild(indicator);
    });
}

// Initialize touch interactions for about cards
function initAboutCardTouch() {
    const cards = document.querySelectorAll('.about-card');
    
    cards.forEach(card => {
        // Touch start handler
        card.addEventListener('touchstart', function(e) {
            // Add active class to indicate touch
            this.classList.add('touch-active');
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }, { passive: true });
        
        // Touch end handler - flip the card
        card.addEventListener('touchend', function(e) {
            // Toggle flipped state
            this.classList.toggle('flipped');
            
            // Toggle rotation based on current state
            if (this.classList.contains('flipped')) {
                this.style.transform = 'rotateY(180deg)';
                
                // Change indicator icon when flipped
                const indicator = this.querySelector('.card-indicator i');
                if (indicator) {
                    indicator.className = 'fas fa-undo';
                }
            } else {
                this.style.transform = 'rotateY(0deg)';
                
                // Reset indicator icon
                const indicator = this.querySelector('.card-indicator i');
                if (indicator) {
                    indicator.className = 'fas fa-sync-alt';
                }
            }
            
            // Remove active class
            this.classList.remove('touch-active');
        });
        
        // Cancel event handler to avoid accidental flips
        card.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        });
        
        // Prevent default behavior on long press
        card.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    });
    
    // Add swipe detection for mobile navigation
    initSwipeNavigation();
}

// Add swipe navigation for mobile devices
function initSwipeNavigation() {
    const body = document.body;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Minimum swipe distance to trigger navigation
    const minSwipeDistance = 100;
    
    // Track touch start position
    body.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    // Track touch end and navigate if swipe is detected
    body.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        // Calculate distances
        const distanceX = touchEndX - touchStartX;
        const distanceY = touchEndY - touchStartY;
        
        // Only trigger navigation if horizontal swipe is more significant than vertical
        if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
            handleSwipe(distanceX);
        }
    }, { passive: true });
    
    // Navigate based on swipe direction
    function handleSwipe(distance) {
        // Get all section elements
        const sections = Array.from(document.querySelectorAll('section[id]'));
        
        // Find current section in view
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            // Section is considered in view if its top edge is within viewport
            return rect.top <= 50 && rect.bottom >= 50;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetSection;
            
            // Right swipe - go to previous section
            if (distance > 0 && currentIndex > 0) {
                targetSection = sections[currentIndex - 1];
            }
            // Left swipe - go to next section
            else if (distance < 0 && currentIndex < sections.length - 1) {
                targetSection = sections[currentIndex + 1];
            }
            
            // Scroll to target section if defined
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
                
                // Add swipe feedback
                const direction = distance > 0 ? 'right' : 'left';
                showSwipeFeedback(direction);
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Visual feedback for swipe navigation
    function showSwipeFeedback(direction) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `swipe-feedback swipe-${direction}`;
        feedback.innerHTML = `<i class="fas fa-chevron-${direction === 'right' ? 'left' : 'right'}"></i>`;
        
        // Style the feedback
        const styles = {
            position: 'fixed',
            top: '50%',
            [direction === 'right' ? 'left' : 'right']: '20px',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 59, 48, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        };
        
        // Apply styles
        Object.assign(feedback.style, styles);
        
        // Add to body
        document.body.appendChild(feedback);
        
        // Show and hide animation
        setTimeout(() => {
            feedback.style.opacity = '0.9';
            
            setTimeout(() => {
                feedback.style.opacity = '0';
                
                // Remove element after animation
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 300);
            }, 500);
        }, 10);
    }
}
