const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    outlineX += distX * 0.15; 
    outlineY += distY * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll Reveal Animation
window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;

        if (revealtop < windowheight - revealpoint) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

// Trigger once on load
reveal();

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Custom Tooltip Logic
document.addEventListener('DOMContentLoaded', () => {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'custom-tooltip';
    document.body.appendChild(tooltip);

    let hideTimeout;

    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout); // Cancel any pending hide
            const text = el.getAttribute('data-tooltip');
            if (text) {
                tooltip.innerHTML = text;
                tooltip.classList.add('active');

                // Calculate Position
                const rect = el.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                // Horizontal centering
                let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
                
                // Clamp to screen edges
                const padding = 10;
                if (left < padding) left = padding;
                if (left + tooltipRect.width > document.documentElement.clientWidth - padding) {
                    left = document.documentElement.clientWidth - tooltipRect.width - padding;
                }

                // Vertical positioning (default top)
                let top = rect.top + window.scrollY - tooltipRect.height - 12; // 12px gap for arrow
                let isBottom = false;

                // Flip if not enough space on top
                if (rect.top - tooltipRect.height - 20 < 0) {
                    top = rect.bottom + window.scrollY + 12;
                    isBottom = true;
                    tooltip.classList.add('bottom');
                } else {
                    tooltip.classList.remove('bottom');
                }

                // Apply positions
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;

                // Calculate arrow position relative to tooltip
                const elementCenter = rect.left + window.scrollX + (rect.width / 2);
                const arrowRelativePos = elementCenter - left;
                
                tooltip.style.setProperty('--arrow-left', `${arrowRelativePos}px`);
            }
        });

        el.addEventListener('mouseleave', () => {
            if (!tooltip.classList.contains('pinned')) {
                hideTimeout = setTimeout(() => {
                    tooltip.classList.remove('active');
                }, 200); // 200ms delay
            }
        });

        el.addEventListener('click', () => {
            tooltip.classList.toggle('pinned');
            if (!tooltip.classList.contains('active')) {
                // If not active, trigger mouseenter
                el.dispatchEvent(new Event('mouseenter'));
            }
        });
    });

    // Prevent hide when mouse enters tooltip
    tooltip.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });

    tooltip.addEventListener('mouseleave', () => {
        if (!tooltip.classList.contains('pinned')) {
            hideTimeout = setTimeout(() => {
                tooltip.classList.remove('active');
            }, 200);
        }
    });

    // Hide tooltip when clicking outside
    document.addEventListener('click', (e) => {
        if (!tooltip.contains(e.target) && !Array.from(tooltipElements).some(el => el.contains(e.target))) {
            tooltip.classList.remove('pinned');
            tooltip.classList.remove('active');
            clearTimeout(hideTimeout);
        }
    });
});