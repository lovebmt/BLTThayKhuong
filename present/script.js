// Slide Navigation
let currentSlide = 1;
const totalSlides = 20;

function updateSlide() {
    // Hide all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Update counter
    document.getElementById('slideCounter').textContent = `${currentSlide} / ${totalSlides}`;
    
    // Update progress bar
    const progressPercentage = (currentSlide / totalSlides) * 100;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    // Update sidebar active item
    document.querySelectorAll('.sidebar-item').forEach((item, index) => {
        if (index + 1 === currentSlide) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update URL hash
    window.location.hash = `slide${currentSlide}`;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlide();
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlide();
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        updateSlide();
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
    }
});

// Touch/Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next slide
            nextSlide();
        } else {
            // Swiped right - previous slide
            previousSlide();
        }
    }
}

// Mouse Wheel Navigation - DISABLED to prevent accidental slide changes
/*
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            previousSlide();
        }
    }, 100);
}, { passive: true });
*/

// Handle URL Hash on Load
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const slideMatch = hash.match(/slide(\d+)/);
        if (slideMatch) {
            const slideNumber = parseInt(slideMatch[1]);
            goToSlide(slideNumber);
        }
    } else {
        updateSlide();
    }
});

// Handle Browser Back/Forward
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const slideMatch = hash.match(/slide(\d+)/);
        if (slideMatch) {
            currentSlide = parseInt(slideMatch[1]);
            updateSlide();
        }
    }
});

// Prevent Context Menu on Slides (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.slide')) {
        // e.preventDefault(); // Uncomment to disable right-click
    }
});

// Fullscreen Toggle (F key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Presentation Mode Indicator
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        console.log('Entered fullscreen mode');
        // Could add a class to body for fullscreen-specific styles
        document.body.classList.add('fullscreen-mode');
    } else {
        console.log('Exited fullscreen mode');
        document.body.classList.remove('fullscreen-mode');
    }
});

// Auto-advance feature (optional - commented out)
/*
let autoAdvanceInterval;
const autoAdvanceDelay = 10000; // 10 seconds

function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            stopAutoAdvance();
        }
    }, autoAdvanceDelay);
}

function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
}

// Press 'A' to toggle auto-advance
document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        if (autoAdvanceInterval) {
            stopAutoAdvance();
            console.log('Auto-advance stopped');
        } else {
            startAutoAdvance();
            console.log('Auto-advance started');
        }
    }
});
*/

// Print all slides
function printPresentation() {
    window.print();
}

// Slide Overview Mode (press 'O')
document.addEventListener('keydown', (e) => {
    if (e.key === 'o' || e.key === 'O') {
        // Toggle overview mode
        document.body.classList.toggle('overview-mode');
    }
});

// Help Dialog (press '?' or 'H')
document.addEventListener('keydown', (e) => {
    if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        showHelp();
    }
});

function showHelp() {
    const helpText = `
Keyboard Shortcuts:
- Arrow Keys / Space / Page Down: Next slide
- Arrow Up / Page Up: Previous slide
- Home: First slide
- End: Last slide
- F: Toggle fullscreen
- O: Overview mode (if implemented)
- ?: Show this help

Mouse/Touch:
- Click navigation buttons
- Swipe left/right on touch devices
- Scroll wheel to navigate (with delay)
    `;
    alert(helpText.trim());
}

// Slide Timer (optional)
let slideStartTime = Date.now();
let totalTime = 0;

function trackSlideTime() {
    const now = Date.now();
    const timeSpent = now - slideStartTime;
    totalTime += timeSpent;
    slideStartTime = now;
    
    // Log or display timing information
    console.log(`Slide ${currentSlide - 1} time: ${(timeSpent / 1000).toFixed(1)}s`);
    console.log(`Total presentation time: ${(totalTime / 1000).toFixed(1)}s`);
}

// Track time when changing slides
const originalNextSlide = nextSlide;
const originalPreviousSlide = previousSlide;

nextSlide = function() {
    trackSlideTime();
    originalNextSlide();
};

previousSlide = function() {
    trackSlideTime();
    originalPreviousSlide();
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Presentation initialized');
    console.log('Total slides:', totalSlides);
    console.log('Press "?" for keyboard shortcuts');
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Disable text selection during presentation (optional)
/*
document.addEventListener('selectstart', (e) => {
    if (e.target.closest('.slide')) {
        e.preventDefault();
    }
});
*/

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Presentation loaded in ${loadTime.toFixed(2)}ms`);
});
