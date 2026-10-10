const canvas = document.getElementById("animation-canvas");
const context = canvas.getContext("2d");

const frameCount = 240; // Total number of images in the folder
const images = [];
let currentFrameIndex = 0;
let canvasInitialized = false;

// Helper to pad the frame index with leading zeros (e.g. 1 -> 0001)
const getFramePath = (index) => {
    return `video_frames_24fps_JPG/frame_${index.toString().padStart(4, '0')}.jpg`;
};

// Preload all images to memory for smooth playback
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    images.push(img);
}

// Function to draw a specific frame to the canvas
function renderFrame(index) {
    const img = images[index];
    
    // Ensure image is loaded and valid before drawing
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Set canvas dimensions to match the image dimensions only once
    if (!canvasInitialized) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvasInitialized = true;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
}

// Handle initial load of the first image
if (images[0] && images[0].complete) {
    renderFrame(0);
} else if (images[0]) {
    images[0].onload = () => renderFrame(0);
}

// Ensure subsequent images also redraw if we scroll fast before they finish loading
images.forEach((img, index) => {
    img.onload = () => {
        // If this image just loaded and it's the one we're currently supposed to show, render it
        if (index === currentFrameIndex) {
            renderFrame(index);
        }
    };
});

// Scroll event listener with requestAnimationFrame for performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = document.documentElement.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            
            if (maxScrollTop > 0) {
                const scrollFraction = scrollTop / maxScrollTop;
                const maxFrameIndex = frameCount - 1;
                const rawFrameIndex = Math.floor(scrollFraction * maxFrameIndex);
                
                currentFrameIndex = Math.min(maxFrameIndex, Math.max(0, rawFrameIndex));
                renderFrame(currentFrameIndex);
            }
            
            ticking = false;
        });
        ticking = true;
    }
});




// Mouse scroll parallax for Real Swag containers
document.addEventListener('DOMContentLoaded', () => {
    const swags = document.querySelectorAll('.real-swag-container');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        for (let i = 0; i < swags.length; i++) {
            const swag = swags[i];
            const speedX = (i % 2 === 0) ? 0.2 : -0.2;
            const speedY = 0.3;
            const moveX = scrollY * speedX;
            const moveY = scrollY * speedY;
            swag.style.transform = "translate(" + moveX + "px, " + moveY + "px)";
        }
    });
});

// --- ADVANCED REAL SWAG PARALLAX SYSTEM ---
document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname.toLowerCase();
    let pageConfig = [];

    // Configuration for each page's swag items
    // bg: image file, size: background-size, pos: background-position, label: text, startX/Y: initial position (vw/vh), speedX/Y: parallax factor
    if (pagePath.includes('index') || pagePath === '/' || pagePath.endsWith('/')) {
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '180%', pos: '10% 80%', label: 'Community Bag', startX: 5, startY: 15, speedY: 0.1, delay: '0s' },
            { bg: 'aws_swag_3.png', size: '150%', pos: '50% 30%', label: 'Zip Hoodie', startX: 80, startY: 70, speedY: 0.2, delay: '1s' }
        ];
    } else if (pagePath.includes('about')) {
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '250%', pos: '40% 10%', label: 'Builder Tumbler', startX: 80, startY: 15, speedY: 0.15, delay: '0.5s' },
            { bg: 'aws_swag_2.png', size: '250%', pos: '30% 15%', label: 'Specialist Mug', startX: 5, startY: 60, speedY: -0.1, delay: '0s' }
        ];
    } else if (pagePath.includes('project')) {
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '220%', pos: '70% 15%', label: 'Builder Cap', startX: 10, startY: 75, speedY: -0.15, delay: '0s' },
            { bg: 'aws_swag_2.png', size: '200%', pos: '35% 85%', label: 'Specialist Notebook', startX: 75, startY: 20, speedY: 0.2, delay: '0.8s' }
        ];
    } else if (pagePath.includes('achievement')) {
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '250%', pos: '30% 95%', label: 'Builder Stickers', startX: 80, startY: 70, speedY: 0.1, delay: '0.3s' },
            { bg: 'aws_swag_2.png', size: '150%', pos: '80% 60%', label: 'Specialist Jacket', startX: 10, startY: 25, speedY: -0.2, delay: '1.2s' }
        ];
    } else if (pagePath.includes('contact')) {
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '300%', pos: '95% 90%', label: 'Cables & Tech', startX: 15, startY: 80, speedY: -0.1, delay: '0s' },
            { bg: 'aws_swag_2.png', size: '300%', pos: '45% 95%', label: 'OneTeam Stickers', startX: 75, startY: 60, speedY: 0.15, delay: '0.7s' },
            { bg: 'aws_swag_real.png', size: '250%', pos: '80% 50%', label: 'Notebook', startX: 50, startY: 15, speedY: 0.2, delay: '0.5s' } // Extra for contact
        ];
    } else {
        // Fallback
        pageConfig = [
            { bg: 'aws_swag_real.png', size: '180%', pos: '10% 80%', label: 'Community Bag', startX: 10, startY: 20, speedY: 0.1, delay: '0s' }
        ];
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '50'; // High enough to see, but not block clicks
    document.body.appendChild(container);

    const activeSwags = [];

    pageConfig.forEach((cfg, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'real-swag-container';
        // Override CSS classes for dynamic placement
        wrapper.style.bottom = 'auto';
        wrapper.style.right = 'auto';
        wrapper.style.left = cfg.startX + 'vw';
        wrapper.style.top = cfg.startY + 'vh';
        wrapper.style.animationDelay = cfg.delay;
        
        // 3D Tilt Effect on mousemove will be applied to inner card
        const card = document.createElement('div');
        card.style.width = '100%';
        card.style.height = '100%';
        card.style.position = 'relative';
        card.style.transition = 'transform 0.1s ease-out';
        
        const img = document.createElement('div');
        img.className = 'real-swag-img';
        img.style.backgroundImage = 'url("' + cfg.bg + '")';
        img.style.backgroundSize = cfg.size;
        img.style.backgroundPosition = cfg.pos;
        
        const label = document.createElement('div');
        label.className = 'real-swag-label';
        label.innerText = cfg.label;

        card.appendChild(img);
        card.appendChild(label);
        wrapper.appendChild(card);
        container.appendChild(wrapper);

        activeSwags.push({ wrapper: wrapper, card: card, speedY: cfg.speedY, startY: cfg.startY });
    });

    // Parallax on Scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        for (let i = 0; i < activeSwags.length; i++) {
            const item = activeSwags[i];
            const moveY = scrollY * item.speedY;
            // Move the wrapper
            item.wrapper.style.transform = "translateY(" + moveY + "px)";
        }
    });

    // Interactive 3D Tilt on Mouse Move
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate tilt
        const tiltX = (centerY - mouseY) / 40;
        const tiltY = (mouseX - centerX) / 40;

        for (let i = 0; i < activeSwags.length; i++) {
            const item = activeSwags[i];
            item.card.style.transform = "perspective(1000px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
        }
    });
});
