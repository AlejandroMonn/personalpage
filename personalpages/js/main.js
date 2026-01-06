/**
 * Main JavaScript - Alejandro Montoya Portfolio
 * No external dependencies - Vanilla JS
 */

'use strict';

// ============================================
// FADE-IN ANIMATIONS (INTERSECTION OBSERVER)
// ============================================
const initFadeInAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
};

// ============================================
// TYPING ANIMATION
// ============================================
const initTypingAnimation = () => {
    const name = "Alejandro Montoya";
    const typingElement = document.getElementById("typing-name");
    
    if (!typingElement) return;
    
    let i = 0;
    
    const typeWriter = () => {
        if (i < name.length) {
            typingElement.textContent += name.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 500);
};

// ============================================
// LANGUAGE SELECTOR
// ============================================
const toggleLangDropdown = () => {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
};

const changeLang = (lang) => {
    const labels = {
        es: 'ES',
        en: 'EN',
        pt: 'PT',
        zh: '中文'
    };
    
    const currentLangElement = document.getElementById('current-lang');
    const dropdown = document.getElementById('lang-dropdown');
    
    if (currentLangElement) {
        currentLangElement.textContent = labels[lang] || 'ES';
    }
    
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    // Aquí puedes agregar lógica para cambiar el contenido del sitio
    // Por ahora solo cambia el label
    console.log(`Idioma cambiado a: ${lang}`);
};

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (e) => {
    const langSelector = document.querySelector('.lang-selector');
    const dropdown = document.getElementById('lang-dropdown');
    
    if (langSelector && dropdown && !langSelector.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

const getVisibleSlides = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 3; // Desktop: 3 cards
    if (width >= 768) return 2;  // Tablet: 2 cards
    return 1;                     // Mobile: 1 card
};

const updateCarousel = () => {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    
    const visibleSlides = getVisibleSlides();
    const slideWidth = 100 / visibleSlides;
    carousel.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    updateButtons();
};

const updateButtons = () => {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (!prevBtn || !nextBtn) return;
    
    const visibleSlides = getVisibleSlides();
    const maxSlide = totalSlides - visibleSlides;
    
    prevBtn.classList.toggle('disabled', currentSlide === 0);
    nextBtn.classList.toggle('disabled', currentSlide >= maxSlide);
};

const moveCarousel = (direction) => {
    const visibleSlides = getVisibleSlides();
    const maxSlide = totalSlides - visibleSlides;
    currentSlide = Math.max(0, Math.min(currentSlide + direction, maxSlide));
    updateCarousel();
};

// Reiniciar carousel en resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const visibleSlides = getVisibleSlides();
        const maxSlide = totalSlides - visibleSlides;
        currentSlide = Math.min(currentSlide, maxSlide);
        updateCarousel();
    }, 150);
});

// ============================================
// INITIALIZATION
// ============================================
const init = () => {
    initFadeInAnimations();
    initTypingAnimation();
    updateCarousel();
};

// Execute when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make functions global for onclick handlers in HTML
window.toggleLangDropdown = toggleLangDropdown;
window.changeLang = changeLang;
window.moveCarousel = moveCarousel;