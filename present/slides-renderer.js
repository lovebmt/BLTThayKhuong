// Slide Rendering Engine
let slidesData = null;
let currentSlide = 1;
let totalSlides = 0;

// Elapsed Time Tracking
let startTime = null;
let elapsedTimeInterval = null;

// Load slides data from embedded JS
function loadSlidesData() {
    try {
        // Data loaded from slides-data.js (SLIDES_DATA global variable)
        if (typeof SLIDES_DATA !== 'undefined') {
            slidesData = SLIDES_DATA.slides;
            totalSlides = SLIDES_DATA.presentation.totalSlides;
            return SLIDES_DATA;
        } else {
            throw new Error('SLIDES_DATA not found. Make sure slides-data.js is loaded before slides-renderer.js');
        }
    } catch (error) {
        console.error('Error loading slides data:', error);
        return null;
    }
}

// Render navigation menu
function renderNavigation(slides) {
    const nav = document.querySelector('.sidebar-nav');
    nav.innerHTML = '';
    
    slides.forEach((slide, index) => {
        const slideNumber = String(index + 1).padStart(2, '0');
        const navItem = document.createElement('a');
        navItem.href = `#slide${slide.id}`;
        navItem.className = `sidebar-item ${index === 0 ? 'active' : ''}`;
        navItem.onclick = () => goToSlide(slide.id);
        
        navItem.innerHTML = `
            <span class="slide-number">${slideNumber}</span>
            <span class="slide-title">${getShortTitle(slide)}</span>
        `;
        
        nav.appendChild(navItem);
    });
}

// Get short title for navigation
function getShortTitle(slide) {
    // Use the actual slide title, truncate if too long
    const maxLength = 30;
    return slide.title.length > maxLength 
        ? slide.title.substring(0, maxLength) + '...' 
        : slide.title;
}

// Render badges
function renderBadges(badges) {
    if (!badges || badges.length === 0) return '';
    
    return `
        <div class="badges-row">
            ${badges.map(badge => `
                <span class="badge badge-${badge.color}">${badge.text}</span>
            `).join('')}
        </div>
    `;
}

// Render info card
function renderCard(card) {
    const dialogHtml = card.dialogImage ? `
        <img class="card-dialog" src="${card.dialogImage}" alt="${card.title}">
    ` : '';
    
    return `
        <div class="info-card">
            <div class="icon-badge icon-${card.iconColor}">${card.icon}</div>
            <div class="card-text">
                <p><strong>${card.title}</strong></p>
                ${card.content ? `<p>${card.content}</p>` : ''}
            </div>
            ${dialogHtml}
        </div>
    `;
}

// Render single-column layout
function renderSingleColumnLayout(content) {
    return `
        <div class="single-column-layout">
            ${content.map(item => renderCard(item)).join('')}
        </div>
    `;
}

// Render two-column layout
function renderTwoColumnLayout(columns) {
    return `
        <div class="two-column-layout">
            ${columns.map((column, idx) => `
                <div class="${idx === 0 ? 'left-column' : 'right-column'}">
                    <div class="card-section">
                        ${column.title ? `<h3 class="card-title">${column.title}</h3>` : ''}
                        ${column.cards.map(card => renderCard(card)).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render stats layout
function renderStatsLayout(statsCards) {
    return `
        <div class="stats-grid">
            ${statsCards.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value" ${stat.valueStyle ? `style="${stat.valueStyle}"` : ''}>${stat.value}</div>
                    <div class="stat-label">${stat.sublabel}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render table layout
function renderTableLayout(table, additionalCards) {
    let html = `
        <div class="data-table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        ${table.headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${table.rows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    if (additionalCards && additionalCards.length > 0) {
        html += `
            <div class="two-column-layout" style="margin-top: var(--spacing-lg);">
                ${additionalCards.map(card => `
                    <div class="info-card">
                        <div class="icon-badge icon-${card.iconColor}">${card.icon}</div>
                        <div class="card-text">
                            <p><strong>${card.title}</strong></p>
                            <p>${card.content}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    return html;
}

// Render image slide
function renderImageSlide(slide) {
    return `
        <div class="full-width-chart" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="chart-container" style="max-height: 600px;">
                <img src="${slide.image}" alt="${slide.title}" style="${slide.imageStyle || 'max-height: 500px; width: auto; object-fit: contain;'}">
            </div>
        </div>
    `;
}

// Render multi-chart slide
function renderMultiChartSlide(slide) {
    return `
        <div class="chart-grid">
            ${slide.charts.map(chart => `
                <div class="chart-container">
                    <img src="${chart.image}" alt="${chart.title}">
                    <h3 class="chart-title">${chart.title}</h3>
                    <p class="chart-description">${chart.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Render slide content based on type
function renderSlideContent(slide) {
    let content = `
        <h1 class="main-title">${slide.title}</h1>
        ${slide.subtitle ? `<h2 class="sub-title">${slide.subtitle}</h2>` : ''}
        ${slide.subtitleDetail ? `<p class="sub-title-detail">${slide.subtitleDetail}</p>` : ''}
        ${renderBadges(slide.badges)}
    `;
    
    // Render layout based on slide type
    switch (slide.type) {
        case 'title':
        case 'content':
            if (slide.layout === 'single-column' && slide.content) {
                content += renderSingleColumnLayout(slide.content);
            } else if (slide.layout === 'two-column' && slide.columns) {
                content += renderTwoColumnLayout(slide.columns);
            } else if (slide.layout === 'stats' && slide.statsCards) {
                content += renderStatsLayout(slide.statsCards);
            } else if (slide.layout === 'table' && slide.table) {
                content += renderTableLayout(slide.table, slide.additionalCards);
            }
            break;
        case 'image':
            content += renderImageSlide(slide);
            break;
        case 'multi-chart':
            content += renderMultiChartSlide(slide);
            break;
        case 'thank-you':
            if (slide.questions && slide.questions.length > 0) {
                content += `<ol style="text-align: left; max-width: 900px; margin: 2rem auto; line-height: 1.8; opacity: 0.6; font-size: 0.85em;">
                    ${slide.questions.map(q => `<li>${q}</li>`).join('')}
                </ol>`;
            }
            break;
    }
    
    return content;
}

// Render all slides
function renderSlides(slides) {
    const container = document.getElementById('slidesContainer');
    container.innerHTML = '';
    
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.id = `slide${slide.id}`;
        
        slideDiv.innerHTML = `
            <div class="slide-content">
                ${renderSlideContent(slide)}
            </div>
        `;
        
        container.appendChild(slideDiv);
    });
}

// Update slide display
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
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
        // Show/hide mobile menu button when sidebar is collapsed
        if (sidebar.classList.contains('collapsed')) {
            mobileMenuToggle.style.display = 'flex';
        } else {
            mobileMenuToggle.style.display = 'none';
        }
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
        case 'Escape':
            toggleSidebar();
            break;
    }
});

// Check URL hash on load
function checkInitialSlide() {
    const hash = window.location.hash;
    if (hash) {
        const slideNum = parseInt(hash.replace('#slide', ''));
        if (slideNum >= 1 && slideNum <= totalSlides) {
            currentSlide = slideNum;
            updateSlide();
        }
    }
}

// Elapsed Time Functions
function startElapsedTimeTracking() {
    startTime = Date.now();
    updateElapsedTime(); // Initial update
    
    // Update every 10 seconds
    elapsedTimeInterval = setInterval(updateElapsedTime, 10000);
}

function updateElapsedTime() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // seconds
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = `${minutes}m:${seconds.toString().padStart(2, '0')}s`;
    }
}

// Initialize presentation
function initPresentation() {
    const data = loadSlidesData();
    if (data) {
        renderNavigation(data.slides);
        renderSlides(data.slides);
        checkInitialSlide();
        updateSlide();
        startElapsedTimeTracking();
        
        console.log(`✅ Presentation loaded: ${totalSlides} slides`);
    } else {
        console.error('❌ Failed to load presentation data');
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresentation);
} else {
    initPresentation();
}
