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
