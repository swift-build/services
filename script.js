// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
    observer.observe(item);
});

// Observe skill categories
document.querySelectorAll('.skill-category').forEach((category, index) => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(30px)';
    category.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(category);
});

// Show more/less functionality for skills
document.querySelectorAll('.show-more-btn').forEach(button => {
    // Store references to hidden skills on initialization
    const category = button.closest('.skill-category');
    const allSkills = category.querySelectorAll('.skill-item');
    const hiddenSkillsArray = Array.from(allSkills).filter(skill => skill.classList.contains('hidden-skill'));
    
    // Hide button if no hidden skills
    if (hiddenSkillsArray.length === 0) {
        button.style.display = 'none';
        return;
    }
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.textContent === 'Show more') {
            // Show hidden skills
            hiddenSkillsArray.forEach(skill => {
                skill.classList.remove('hidden-skill');
            });
            this.textContent = 'Show less';
            this.classList.add('active');
        } else {
            // Hide skills again
            hiddenSkillsArray.forEach(skill => {
                skill.classList.add('hidden-skill');
            });
            this.textContent = 'Show more';
            this.classList.remove('active');
        }
    });
});

// Enable touch/click toggles only on touch/coarse pointer devices
const isTouchLike = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (isTouchLike) {

    // Touch/click toggle for About highlight cards
    document.querySelectorAll('.highlight-item').forEach((item) => {
        item.addEventListener('click', (e) => {
            const card = e.currentTarget;
            // Close others in the same grid
            document.querySelectorAll('.highlight-item.open').forEach((openItem) => {
                if (openItem !== card) openItem.classList.remove('open');
            });
            card.classList.toggle('open');
        });
    });

    // Touch/click toggle for Process step cards
    document.querySelectorAll('.step').forEach((step) => {
        step.addEventListener('click', (e) => {
            const current = e.currentTarget;
            // Close other steps
            document.querySelectorAll('.step.open').forEach((openStep) => {
                if (openStep !== current) openStep.classList.remove('open');
            });
            current.classList.toggle('open');
        });
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Add required hidden fields for Google Forms
    formData.append('fvv', '1');
    formData.append('partialResponse', '[null,null,"8425348433487090893"]');
    formData.append('pageHistory', '0');
    formData.append('fbzx', '8425348433487090893');
    formData.append('submissionTimestamp', Date.now().toString());
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Submit to Google Forms
        const response = await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLScVuxjaJdUPk1GXOTf7uiB8f98y31dahdbnA7QlLrJgoSBysQ/formResponse?pli=1', {
            method: 'POST',
            mode: 'no-cors', // Required for Google Forms
            body: formData
        });
        
        // Show success message
        showMessage('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('There was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Function to show messages
function showMessage(text, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        padding: 12px 16px;
        margin-top: 16px;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' ? 
            'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' : 
            'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }
    `;
    
    // Insert after form
    contactForm.parentNode.insertBefore(message, contactForm.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Smooth scroll for anchor links
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

// Add active class to nav links on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Projects Carousel
const carouselTrack = document.querySelector('.carousel-track');
const carouselDots = document.querySelector('.carousel-dots');
const projectCards = document.querySelectorAll('.carousel-track .project-card');
const carouselElement = document.querySelector('.carousel');

let currentIndex = 0;
let autoplayInterval;
const AUTOPLAY_DELAY = 5000; // 5 seconds

// Calculate how many cards to show at once based on screen size
function getCardsPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
}

// Calculate total number of slides
function getTotalSlides() {
    const cardsPerView = getCardsPerView();
    return Math.ceil(projectCards.length / cardsPerView);
}

// Create dots
function createDots() {
    const totalSlides = getTotalSlides();
    carouselDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

// Update carousel position
function updateCarousel() {
    const cardsPerView = getCardsPerView();
    const firstCard = carouselTrack.querySelector('.project-card');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    // Read actual CSS gap
    const computed = window.getComputedStyle(carouselTrack);
    let gap = parseFloat(computed.gap || computed.columnGap || '0');
    if (Number.isNaN(gap)) gap = 0;
    const moveAmount = (cardWidth + gap) * cardsPerView;
    
    carouselTrack.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Go to specific slide
function goToSlide(index) {
    const totalSlides = getTotalSlides();
    currentIndex = index;
    if (currentIndex >= totalSlides) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    updateCarousel();
    resetAutoplay();
}

// Next slide
function nextSlide() {
    const totalSlides = getTotalSlides();
    currentIndex++;
    if (currentIndex >= totalSlides) currentIndex = 0;
    updateCarousel();
}

// Previous slide
function prevSlide() {
    const totalSlides = getTotalSlides();
    currentIndex--;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    updateCarousel();
    resetAutoplay();
}

// Start autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
}

// Stop autoplay
function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Reset autoplay (stop and start again)
function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// No manual buttons (auto + dots only)

// Pause autoplay on hover
carouselTrack.addEventListener('mouseenter', stopAutoplay);
carouselTrack.addEventListener('mouseleave', startAutoplay);

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        createDots();
        currentIndex = 0;
        updateCarousel();
    }, 250);
});

// Initialize carousel
if (projectCards.length > 0) {
    createDots();
    updateCarousel();
    startAutoplay();
}

// React to mouse/trackpad scroll for horizontal navigation (with wraparound)
if (carouselElement) {
    let wheelDeltaAccum = 0;
    const WHEEL_THRESHOLD = 40; // pixels; tune for sensitivity
    let isAnimating = false;

    // Mark animation state using transitionend from the track
    carouselTrack.addEventListener('transitionend', () => {
        isAnimating = false;
    });

    const onWheel = (e) => {
        // Prefer horizontal delta when available (trackpads), else use vertical
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

        // If currently animating, let the page scroll normally
        if (isAnimating) return;

        // Accumulate to avoid advancing too fast on high-resolution wheels
        wheelDeltaAccum += delta;

        if (Math.abs(wheelDeltaAccum) >= WHEEL_THRESHOLD) {
            isAnimating = true;
            if (wheelDeltaAccum > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            wheelDeltaAccum = 0;
            resetAutoplay();
            // Prevent page scroll only when we actually consume the gesture
            e.preventDefault();
        }
        // Otherwise, do not preventDefault so vertical page scroll remains smooth
    };

    // Use non-passive to allow preventDefault when a slide is triggered
    carouselElement.addEventListener('wheel', onWheel, { passive: false });
}

// Touch/swipe handling for mobile carousel
if (carouselElement && carouselTrack) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;
    const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        isHorizontalSwipe = false;
        stopAutoplay();
    }, { passive: true });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - touchStartX);
        const deltaY = Math.abs(currentY - touchStartY);
        
        // Determine if this is a horizontal swipe
        if (deltaX > 10 && deltaX > deltaY) {
            isHorizontalSwipe = true;
            // Prevent vertical scroll when swiping horizontally
            e.preventDefault();
        }
        
        touchEndX = currentX;
    }, { passive: false });

    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const swipeDistance = touchStartX - touchEndX;
        const absSwipeDistance = Math.abs(swipeDistance);

        // Only trigger swipe if it was a horizontal gesture and distance is significant
        if (isHorizontalSwipe && absSwipeDistance > SWIPE_THRESHOLD) {
            if (swipeDistance > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                prevSlide();
            }
            resetAutoplay();
        }

        // Reset touch state
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        isDragging = false;
        isHorizontalSwipe = false;
    }, { passive: true });

    // Handle touch cancel (e.g., if user moves finger off screen)
    carouselTrack.addEventListener('touchcancel', () => {
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        isDragging = false;
        isHorizontalSwipe = false;
        startAutoplay();
    }, { passive: true });
}

// Read more/less for project descriptions
document.querySelectorAll('.project-description').forEach((desc) => {
    // Only add toggle if content overflows (clamped)
    const isOverflowing = desc.scrollHeight > desc.clientHeight + 1;
    if (!isOverflowing) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'read-more-toggle';
    toggle.textContent = '...more';
    toggle.addEventListener('click', () => {
        const expanded = desc.classList.toggle('expanded');
        toggle.textContent = expanded ? 'less' : '...more';
    });

    // Insert after the description paragraph
    desc.insertAdjacentElement('afterend', toggle);
});

// FAQ Accordion Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

console.log('🚀 Website loaded with AI assistance!');

