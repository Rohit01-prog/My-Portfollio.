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
    // Generate an array of all possible swag parts from the 3 images
    const allSwags = [
        { bg: 'aws_swag_real.png', size: '200%', pos: '10% 80%', label: 'Community Bag' },
        { bg: 'aws_swag_real.png', size: '250%', pos: '40% 10%', label: 'Builder Tumbler' },
        { bg: 'aws_swag_real.png', size: '250%', pos: '70% 15%', label: 'Builder Cap' },
        { bg: 'aws_swag_real.png', size: '300%', pos: '30% 95%', label: 'Builder Stickers' },
        { bg: 'aws_swag_real.png', size: '350%', pos: '95% 90%', label: 'Cables & Tech' },
        { bg: 'aws_swag_2.png', size: '250%', pos: '30% 15%', label: 'Specialist Mug' },
        { bg: 'aws_swag_2.png', size: '200%', pos: '35% 85%', label: 'Specialist Notebook' },
        { bg: 'aws_swag_2.png', size: '150%', pos: '80% 60%', label: 'Specialist Jacket' },
        { bg: 'aws_swag_2.png', size: '300%', pos: '45% 95%', label: 'OneTeam Stickers' },
        { bg: 'aws_swag_3.png', size: '150%', pos: '50% 30%', label: 'Zip Hoodie' },
        { bg: 'aws_swag_3.png', size: '150%', pos: '40% 60%', label: 'Zip Hoodie Pocket' }
    ];

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '0'; // Above background, but behind relative text
    document.body.appendChild(container);

    const activeSwags = [];
    const numItems = 2 + Math.floor(Math.random() * 2); // 2 or 3 items max

    for(let i = 0; i < numItems; i++) {
        const cfg = allSwags[Math.floor(Math.random() * allSwags.length)];
        
        const wrapper = document.createElement('div');
        wrapper.className = 'real-swag-container';
        
        // Random starting X position
        const startX = Math.random() * 90;
        wrapper.style.left = startX + 'vw';
        
        // Use CSS Animation for Header to Footer continuous movement
        const animDuration = 25 + Math.random() * 15; // 10s to 25s
        const animDelay = -(Math.random() * 10); // Start at random point in animation
        wrapper.style.animation = "floatHeaderToFooter " + animDuration + "s ease-in-out infinite";
        wrapper.style.animationDelay = animDelay + "s";
        
        // Add random X drift
        const speedX = (Math.random() - 0.5) * 1.5; 
        
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

        activeSwags.push({ wrapper: wrapper, card: card, speedX: speedX });
    }
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const tiltX = (centerY - mouseY) / 20;
        const tiltY = (mouseX - centerX) / 20;

        for (let i = 0; i < activeSwags.length; i++) {
            activeSwags[i].card.style.transform = "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
        }
    });
});
