// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
});

// Smooth Scrolling for all anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Get all links that have hash (#) in their href
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            const targetId = this.getAttribute('href');
            
            // Skip if the href is just "#" with no specific target
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the navbar height for offset calculation
                const navbar = document.querySelector('nav');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                
                // Calculate the position to scroll to
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Animation for cards on scroll - restarts animation when leaving/re-entering view
function animateCardsOnScroll() {
    // Find all elements with animate-up class
    const cards = document.querySelectorAll('.animate-up');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // First ensure the element is reset by removing visible class
                    entry.target.classList.remove('visible');
                    
                    // Force browser reflow before adding the class back
                    void entry.target.offsetWidth;
                    
                    // Add visible class with a slight delay to trigger animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 50);
                } else {
                    // Remove visible class when element is completely out of view
                    // This ensures the animation will reset
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            threshold: 0.15, // Trigger when at least 15% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Negative bottom margin to trigger earlier
        });
        
        // Observe all cards
        cards.forEach(card => observer.observe(card));
    } else {
        // Fallback for older browsers
        cards.forEach(card => card.classList.add('visible'));
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    animateCardsOnScroll();

    // Re-initialize animations if window is resized
    // (to handle potential position changes that might affect viewport visibility)
    window.addEventListener('resize', function() {
        animateCardsOnScroll();
    });
});

// Count-up animation for Results section
function animateResultsCountUp() {
    const resultsSection = document.getElementById('results');
    const numbers = resultsSection.querySelectorAll('.countup-number');

    function countUp(el, target) {
        let start = 0;
        let decimal = target % 1 !== 0;
        let duration = 1200;
        let startTime = null;
        function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            let value = progress * target;
            el.textContent = decimal ? value.toFixed(2) : Math.floor(value);
            if (progress < 1) {
                requestAnimationFrame(animateCount);
            } else {
                el.textContent = decimal ? target.toFixed(2) : target;
            }
        }
        requestAnimationFrame(animateCount);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start animation when entering view
                    numbers.forEach(num => {
                        const target = parseFloat(num.getAttribute('data-target'));
                        countUp(num, target);
                    });
                } else {
                    // Reset numbers to 0 when leaving view
                    // This ensures the animation will restart when scrolling back
                    numbers.forEach(num => { 
                        num.textContent = '0'; 
                    });
                }
            });
        }, { threshold: 0.3 });
        observer.observe(resultsSection);
    } else {
        // Fallback: just set the numbers
        numbers.forEach(num => {
            const target = parseFloat(num.getAttribute('data-target'));
            num.textContent = target;
        });
    }
}

document.addEventListener('DOMContentLoaded', animateResultsCountUp);