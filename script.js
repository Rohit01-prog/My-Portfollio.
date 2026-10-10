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


// --- DEVELOPER SWAG FLOATING PARALLAX ANIMATION ---
// Added as per user request to scatter animated white/orange/yellow swags across all pages
document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#ffffff', '#f59e0b', '#fbbf24', '#f97316']; 
    const swags = [
        { icon: 'ph-t-shirt', label: 'AWS' },
        { icon: 'ph-coat', label: '' },
        { icon: 'ph-drop', label: '' },
        { icon: 'ph-flask', label: '' },
        { icon: 'ph-coffee', label: '' },
        { icon: 'ph-sticker', label: '' },
        { icon: 'ph-t-shirt', label: 'DEV' },
        { icon: 'ph-backpack', label: '' },
        { icon: 'ph-sunglasses', label: '' }
    ];

    const container = document.createElement('div');
    container.id = 'swag-floating-layer';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1'; 
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const floatingElements = [];
    const numSwags = 18;
    
    for (let i = 0; i < numSwags; i++) {
        const swagTemplate = swags[Math.floor(Math.random() * swags.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.color = color;
        const size = Math.random() * 50 + 30;
        el.style.fontSize = size + 'px'; 
        el.style.filter = "drop-shadow(0 0 10px " + color + ") opacity(0.3)";
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.transition = 'transform 0.1s ease-out';
        
        let htmlStr = '<i class="ph-fill ' + swagTemplate.icon + '"></i>';
        if (swagTemplate.label) {
            htmlStr += '<span style="font-size:0.25em; margin-top:5px; font-weight:900; font-family:sans-serif; letter-spacing:1px;">' + swagTemplate.label + '</span>';
        }
        el.innerHTML = htmlStr;
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        el.style.left = startX + 'vw';
        el.style.top = startY + 'vh';

        const speedX = (Math.random() - 0.5) * 1.5; 
        const speedY = (Math.random() - 0.5) * 1.5;
        const rotationSpeed = (Math.random() - 0.5) * 0.5;

        container.appendChild(el);
        floatingElements.push({ el: el, speedX: speedX, speedY: speedY, rotationSpeed: rotationSpeed });
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        for (let i = 0; i < floatingElements.length; i++) {
            const item = floatingElements[i];
            const moveX = scrollY * item.speedX;
            const moveY = scrollY * item.speedY;
            const rotate = scrollY * item.rotationSpeed;
            
            item.el.style.transform = "translate(" + moveX + "px, " + moveY + "px) rotate(" + rotate + "deg)";
        }
    });
});
