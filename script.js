// Mobile-Optimized Fireworks Animation
class Fireworks {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.fireworks = [];
        this.hue = 120;
        this.tick = 0;
        this.isMobile = window.innerWidth <= 768;
        
        // Always initialize fireworks, but with different settings for mobile
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create initial fireworks based on device
        const initialCount = this.isMobile ? 1 : 2;
        for(let i = 0; i < initialCount; i++) {
            this.createFirework();
        }
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * (this.isMobile ? 0.3 : 0.4));
        const speed = Math.random() * (this.isMobile ? 1.5 : 2) + (this.isMobile ? 1 : 1.5);
        const size = Math.random() * (this.isMobile ? 1 : 1.5) + (this.isMobile ? 0.5 : 0.8);
        const hue = Math.random() * 60 + 0;
        
        this.fireworks.push({
            x, y, targetY, speed, size, hue,
            brightness: 70,
            alpha: 1,
            trail: []
        });
    }
    
    createParticles(x, y, hue) {
        const particleCount = this.isMobile ? 30 : 70;
        for(let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (this.isMobile ? 3 : 4) + 0.8;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const size = Math.random() * (this.isMobile ? 1 : 1.5) + 0.3;
            const life = this.isMobile ? 60 : 80;
            
            this.particles.push({
                x, y, velocity, size, hue,
                brightness: 70,
                alpha: 1,
                life, maxLife: life
            });
        }
    }
    
    animate() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = this.isMobile ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'lighter';
        
        for(let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.y -= firework.speed;
            
            firework.trail.push({x: firework.x, y: firework.y});
            if(firework.trail.length > (this.isMobile ? 5 : 8)) firework.trail.shift();
            
            // Draw trail
            for(let j = 0; j < firework.trail.length; j++) {
                const point = firework.trail[j];
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, firework.size * (j / firework.trail.length), 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${firework.hue}, 100%, ${firework.brightness}%, ${j / firework.trail.length * 0.7})`;
                this.ctx.fill();
            }
            
            // Draw firework
            this.ctx.beginPath();
            this.ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${firework.hue}, 100%, ${firework.brightness}%, ${firework.alpha})`;
            this.ctx.fill();
            
            // Explode if reached target
            if(firework.y <= firework.targetY) {
                this.createParticles(firework.x, firework.y, firework.hue);
                this.fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for(let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.velocity.y += (this.isMobile ? 0.02 : 0.03);
            p.life--;
            p.alpha = p.life / p.maxLife;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha * 0.7})`;
            this.ctx.fill();
            
            if(p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Create new fireworks occasionally
        this.tick++;
        if(this.tick % (this.isMobile ? 120 : 80) === 0 && this.fireworks.length < (this.isMobile ? 3 : 5)) {
            this.createFirework();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Mobile-Optimized Snowflakes Animation
class Snowflakes {
    constructor(container) {
        this.container = container;
        this.flakes = [];
        this.isMobile = window.innerWidth <= 768;
        this.createFlakes();
    }
    
    createFlakes() {
        const count = this.isMobile ? 25 : 50;
        
        for(let i = 0; i < count; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            
            const size = this.isMobile ? (Math.random() * 2 + 1) : (Math.random() * 3 + 1.5);
            const startX = Math.random() * 100;
            const duration = this.isMobile ? (Math.random() * 6 + 6) : (Math.random() * 8 + 8);
            const delay = Math.random() * 5;
            
            flake.style.width = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left = `${startX}vw`;
            flake.style.top = `-20px`;
            flake.style.position = 'absolute';
            flake.style.opacity = '0.7';
            flake.style.borderRadius = '50%';
            flake.style.backgroundColor = 'white';
            flake.style.zIndex = '1';
            flake.style.pointerEvents = 'none';
            flake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
            
            this.container.appendChild(flake);
            this.flakes.push(flake);
        }
        
        // Ensure fall animation exists
        this.ensureFallAnimation();
    }
    
    ensureFallAnimation() {
        if (!document.querySelector('#snowfall-styles')) {
            const style = document.createElement('style');
            style.id = 'snowfall-styles';
            style.textContent = `
                @keyframes fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 0.7; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Enhanced Audio Manager
class AudioManager {
    constructor() {
        this.audio = document.getElementById('christmasAudio');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.volumeUp = document.getElementById('volumeUp');
        this.hasInteracted = false;
        this.audioLoaded = false;
        
        this.setupEventListeners();
        this.setupAutoplay();
    }
    
    setupAutoplay() {
        // Start muted to allow autoplay
        this.audio.muted = true;
        this.audio.volume = 0.5;
        
        // Try to play immediately (muted)
        setTimeout(() => {
            this.audio.play().then(() => {
                console.log("✅ Audio playing (muted)");
                // Unmute after user interaction
                this.setupUnmuteOnInteraction();
            }).catch(error => {
                console.log("⚠️ Muted autoplay failed:", error);
                this.setupInteractionListener();
            });
        }, 500);
    }
    
    setupUnmuteOnInteraction() {
        const unmute = () => {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                this.audio.muted = false;
                console.log("🔊 Audio unmuted");
                this.showToast("🎵 Music playing");
                
                // Remove listeners
                document.removeEventListener('click', unmute);
                document.removeEventListener('touchstart', unmute);
            }
        };
        
        document.addEventListener('click', unmute);
        document.addEventListener('touchstart', unmute);
    }
    
    setupInteractionListener() {
        const startAudio = () => {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                this.audio.muted = false;
                this.audio.play().then(() => {
                    console.log("✅ Audio started via interaction");
                    this.showToast("🎵 Music playing");
                }).catch(error => {
                    console.log("❌ Play failed:", error);
                    this.showToast("❌ Could not play audio");
                });
                
                // Remove listeners
                document.removeEventListener('click', startAudio);
                document.removeEventListener('touchstart', startAudio);
            }
        };
        
        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.audio.paused) {
                this.audio.play().then(() => {
                    this.audio.muted = false;
                    this.updateIcons();
                }).catch(error => {
                    console.log("Play error:", error);
                });
            } else {
                this.audio.pause();
                this.updateIcons();
            }
            this.hasInteracted = true;
        });
        
        // Pause button
        this.pauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.audio.pause();
            this.updateIcons();
            this.hasInteracted = true;
        });
        
        // Volume up button
        this.volumeUp.addEventListener('click', (e) => {
            e.preventDefault();
            this.audio.volume = Math.min(1, this.audio.volume + 0.1);
            this.showVolumeToast();
            this.hasInteracted = true;
            
            // Ensure audio is unmuted when volume is adjusted
            if (this.audio.muted) {
                this.audio.muted = false;
            }
            
            // Auto-play if paused
            if (this.audio.paused) {
                this.audio.play().catch(console.error);
            }
        });
        
        // Volume down on right-click
        this.volumeUp.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.audio.volume = Math.max(0.1, this.audio.volume - 0.1);
            this.showVolumeToast();
            this.hasInteracted = true;
            return false;
        });
        
        // Update icons on play/pause
        this.audio.addEventListener('play', () => this.updateIcons());
        this.audio.addEventListener('pause', () => this.updateIcons());
    }
    
    updateIcons() {
        const playIcon = this.playBtn.querySelector('i');
        if (this.audio.paused) {
            playIcon.setAttribute('data-feather', 'play');
        } else {
            playIcon.setAttribute('data-feather', 'pause');
        }
        feather.replace();
    }
    
    showVolumeToast() {
        this.showToast(`Volume: ${Math.round(this.audio.volume * 100)}%`);
    }
    
    showToast(message) {
        // Remove existing toasts
        document.querySelectorAll('.audio-toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = 'audio-toast fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-50';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 1500);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log("🎄 Initializing Christmas website...");
    
    // Initialize Fireworks (now works on mobile too)
    const canvas = document.getElementById('fireworksCanvas');
    new Fireworks(canvas);
    
    // Initialize Snowflakes
    const snowContainer = document.getElementById('snowflakes');
    new Snowflakes(snowContainer);
    
    // Initialize Audio Manager
    const audioManager = new AudioManager();
    
    // Add hover effect to QR code
    const qrCode = document.getElementById('qrPlaceholder');
    qrCode.addEventListener('mouseenter', () => {
        qrCode.style.filter = 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.6))';
        qrCode.style.transform = 'scale(1.05)';
    });
    qrCode.addEventListener('mouseleave', () => {
        qrCode.style.filter = 'none';
        qrCode.style.transform = 'scale(1)';
    });
    
    // Add click effect for festive icons
    document.querySelectorAll('.grid-cols-2 > div, .grid-cols-4 > div').forEach(iconContainer => {
        iconContainer.addEventListener('click', () => {
            iconContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                iconContainer.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Force a reflow to update animations
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 10);
        }, 250);
    });
    
    // Preload feather icons
    setTimeout(() => feather.replace(), 100);
});

// Add audio styles
const addAudioStyles = () => {
    if (!document.querySelector('#audio-styles')) {
        const style = document.createElement('style');
        style.id = 'audio-styles';
        style.textContent = `
            .audio-toast {
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp {
                from { transform: translate(-50%, 20px); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
};

addAudioStyles();