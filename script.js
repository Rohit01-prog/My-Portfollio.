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
    container.style.zIndex = '0'; 
    document.body.appendChild(container);

    const activeSwags = [];
    const numItems = 2 + Math.floor(Math.random() * 2);

    for(let i = 0; i < numItems; i++) {
        const cfg = allSwags[Math.floor(Math.random() * allSwags.length)];
        const wrapper = document.createElement('div');
        wrapper.className = 'real-swag-container';
        
        const startX = Math.random() * 90;
        wrapper.style.left = startX + 'vw';
        
        const animDuration = 25 + Math.random() * 15;
        const animDelay = -(Math.random() * 10);
        wrapper.style.animation = "floatHeaderToFooter " + animDuration + "s ease-in-out infinite";
        wrapper.style.animationDelay = animDelay + "s";
        
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

        activeSwags.push({ wrapper: wrapper, card: card });
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



// --- SMALL GLOWING TECH ICONS PARTICLE SYSTEM ---
document.addEventListener('DOMContentLoaded', () => {
    const iconClasses = [
        'ph-github-logo', 'ph-amazon-logo', 'ph-code', 'ph-terminal', 
        'ph-cpu', 'ph-database', 'ph-cloud', 'ph-braces'
    ];
    const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6'];
    
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100vw';
    particleContainer.style.height = '100vh';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-2';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 15; i++) {
        const icon = document.createElement('i');
        const iconClass = iconClasses[Math.floor(Math.random() * iconClasses.length)];
        icon.className = 'ph-fill ' + iconClass;
        
        const size = 15 + Math.random() * 25;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        icon.style.position = 'absolute';
        icon.style.fontSize = size + 'px';
        icon.style.color = color;
        icon.style.filter = 'drop-shadow(0 0 10px ' + color + ')';
        icon.style.opacity = (0.2 + Math.random() * 0.4).toString();
        
        icon.style.left = (Math.random() * 100) + 'vw';
        
        const duration = 15 + Math.random() * 20;
        const delay = -(Math.random() * 20);
        
        icon.style.animation = 'floatUpParticles ' + duration + 's linear infinite';
        icon.style.animationDelay = delay + 's';
        
        particleContainer.appendChild(icon);
    }
});

// --- GEN-Z CYBER HUD MARGINS (LEFT & RIGHT) ---
document.addEventListener('DOMContentLoaded', () => {
    // Left HUD: Dynamic Coordinates & Line
    const leftHud = document.createElement('div');
    leftHud.className = 'cyber-hud left-hud';
    leftHud.innerHTML = `
        <div class="hud-line"></div>
        <div class="hud-text" id="hud-coords">SYS.LOC // 00.00</div>
        <div class="hud-dot"></div>
    `;
    
    // Right HUD: Vertical Scrolling Tech Text
    const rightHud = document.createElement('div');
    rightHud.className = 'cyber-hud right-hud';
    rightHud.innerHTML = `
        <div class="hud-text" style="writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: 3px;">
            <span class="hud-marquee">>>> AI ENGINEER // AWS CLOUD // FULL STACK // CREATIVE DEVELOPER <<<</span>
        </div>
        <div class="hud-line"></div>
    `;
    
    document.body.appendChild(leftHud);
    document.body.appendChild(rightHud);
    
    // Update coordinates on mouse move to look "GenZ Tech / Interactive"
    window.addEventListener('mousemove', (e) => {
        const coords = document.getElementById('hud-coords');
        if (coords) {
            const x = (e.clientX / window.innerWidth * 100).toFixed(2);
            const y = (e.clientY / window.innerHeight * 100).toFixed(2);
            coords.innerText = `SYS.LOC // ${x}:${y}`;
        }
    });
    
    // --- GEN-Z HOLOGRAPHIC CORNERS ---
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(pos => {
        const corner = document.createElement('div');
        corner.className = `cyber-corner ${pos}`;
        document.body.appendChild(corner);
    });
});