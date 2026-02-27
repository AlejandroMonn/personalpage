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
// DYNAMIC BACKGROUND CANVAS (GLASSMORPHISM ORBS)
// ============================================
const initDynamicBackground = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Orb configuration
    const orbs = [
        { x: 0.15, y: 0.2,  r: 280, color: '#22C55E', vx: 0.00018, vy: 0.00012, phase: 0 },
        { x: 0.75, y: 0.15, r: 220, color: '#536B69', vx: -0.00014, vy: 0.00016, phase: 1.2 },
        { x: 0.5,  y: 0.6,  r: 320, color: '#22C55E', vx: 0.00010, vy: -0.00018, phase: 2.4 },
        { x: 0.85, y: 0.75, r: 200, color: '#536B69', vx: -0.00016, vy: -0.00010, phase: 3.6 },
        { x: 0.25, y: 0.85, r: 180, color: '#22C55E', vx: 0.00012, vy: 0.00014, phase: 4.8 },
    ];

    // Convert relative positions to absolute
    orbs.forEach(orb => {
        orb.ax = orb.x * window.innerWidth;
        orb.ay = orb.y * window.innerHeight;
    });

    let time = 0;

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const drawFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        orbs.forEach((orb, i) => {
            // Smooth floating motion using sine waves
            const floatX = orb.ax + Math.sin(time * orb.vx * 1000 + orb.phase) * (canvas.width * 0.08);
            const floatY = orb.ay + Math.cos(time * orb.vy * 1000 + orb.phase) * (canvas.height * 0.06);

            const rgb = hexToRgb(orb.color);
            const gradient = ctx.createRadialGradient(floatX, floatY, 0, floatX, floatY, orb.r);
            gradient.addColorStop(0,   `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`);
            gradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
            gradient.addColorStop(1,   `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

            ctx.beginPath();
            ctx.arc(floatX, floatY, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });

        time += 16; // ~60fps increment
        requestAnimationFrame(drawFrame);
    };

    drawFrame();
};

// ============================================
// INITIALIZATION
// ============================================
const init = () => {
    initFadeInAnimations();
    initTypingAnimation();
    updateCarousel();
    initDynamicBackground();
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