let celebrationActive = false;
let celebrationTimer = null;
const audio = document.getElementById('party-sound');

function toggleCelebration() {
    if (celebrationActive) {
        endCelebration();
    } else {
        startCelebration();
    }
}

function startCelebration() {
    if (celebrationActive) return;
    celebrationActive = true;

    // Initial burst – fewer on mobile
    const isMobile = window.innerWidth <= 768;
    const initialBurstCount = isMobile ? 30 : 50;

    for (let i = 0; i < initialBurstCount; i++) {
        setTimeout(() => {
            createFlowerParticle();
        }, i * 120);
    }

    // Update button
    const btn = document.querySelector('.celebration-btn');
    btn.textContent = "Stop Celebration";

    // Show wish message line by line
    const wish = document.getElementById('wishMessage');
    const lines = wish.querySelectorAll('span');

    wish.style.display = 'block';
    wish.classList.remove('hidden');

    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 2000);
    });

    // Music fade in
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1500);

    // Visuals
    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active'); // still using hearts container, but now it's flowers

    // Speed up balloons
    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

    // Start continuous particles
    startParticles();

    // Auto-stop after 30 seconds
    celebrationTimer = setTimeout(endCelebration, 30000);
}

function endCelebration() {
    if (!celebrationActive) return;
    celebrationActive = false;

    clearTimeout(celebrationTimer);

    // Button back
    document.querySelector('.celebration-btn').textContent = "🎊 Celebrate!";

    // Music fade out
    fadeVolume(audio, 1, 0, 1500, () => {
        audio.pause();
    });

    // Remove effects (message stays visible)
    document.body.classList.remove('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.remove('active');
    document.getElementById('hearts').classList.remove('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));

    // Trigger fireworks when celebration ends
    launchFireworks();
}

function fadeVolume(element, start, end, durationMs, callback = () => {}) {
    const steps = 20;
    const stepTime = durationMs / steps;
    const stepSize = (end - start) / steps;
    let vol = start;

    const interval = setInterval(() => {
        vol += stepSize;
        element.volume = Math.max(0, Math.min(1, vol));
        if ((stepSize > 0 && vol >= end) || (stepSize < 0 && vol <= end)) {
            clearInterval(interval);
            element.volume = end;
            callback();
        }
    }, stepTime);
}

function createFlowerParticle() {
    const isMobile = window.innerWidth <= 768;
    const el = document.createElement('div');
    
    // 50% heart, 50% rose
    const isHeart = Math.random() > 0.5;
    el.className = isHeart ? 'heart-piece' : 'rose-piece';
    el.textContent = isHeart ? '❤️' : '🌹';
    
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    
    // Slightly faster on desktop
    const fallDuration = isMobile ? '4s' : '3.5s';
    el.style.animationDuration = fallDuration + ',' + (Math.random() * 2 + 2) + 's';

    document.getElementById('hearts').appendChild(el);
    setTimeout(() => el.remove(), 6000);
}

function startParticles() {
    const isMobile = window.innerWidth <= 768;
    const intervalMs = isMobile ? 320 : 220; // slower on mobile

    const interval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(interval);
            return;
        }

        createFlowerParticle();

        // Occasionally create extra one
        if (Math.random() > (isMobile ? 0.7 : 0.55)) {
            setTimeout(createFlowerParticle, 80);
        }
    }, intervalMs);
}

function launchFireworks() {
    const container = document.getElementById('confetti'); // reuse confetti container for fireworks
    const isMobile = window.innerWidth <= 768;
    const burstCount = isMobile ? 5 : 8;

    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            createFireworkBurst(container);
        }, i * 400 + Math.random() * 300);
    }
}

function createFireworkBurst(container) {
    const centerX = Math.random() * 80 + 10; // % from left
    const centerY = Math.random() * 40 + 10; // upper half of screen

    const burst = document.createElement('div');
    burst.className = 'firework-burst';
    burst.style.left = centerX + '%';
    burst.style.top = centerY + '%';

    container.appendChild(burst);

    // Create rays/sparks
    const color = getRandomColor();
    const sparkCount = Math.floor(Math.random() * 8) + 12;

    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'firework-spark';
        spark.style.background = color;
        spark.style.transform = `rotate(${i * (360 / sparkCount)}deg) translateY(-30px)`;
        burst.appendChild(spark);
    }

    // Auto-remove after animation
    setTimeout(() => {
        burst.remove();
    }, 1800);
}

function getRandomColor() {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
        '#fd79a8', '#a29bfe', '#6c5ce7', '#55a3ff', '#26de81',
        '#ff9f1c', '#e76f51', '#2a9d8f', '#e9c46a'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ── Blow candles also starts celebration ──
function blowCandles() {
    const candles = document.querySelector('.candles');
    const cake = document.querySelector('.cake');
    
    candles.style.animation = 'none';
    candles.style.opacity = '0.3';
    cake.innerHTML = '🎂✨';
    
    setTimeout(() => {
        candles.style.animation = 'candleFlicker 1.5s ease-in-out infinite alternate';
        candles.style.opacity = '1';
        cake.innerHTML = '🎂';
    }, 3000);

    startCelebration();
}

// ── Shake detection – extra particles ──
let lastShake = 0;
window.addEventListener('devicemotion', e => {
    if (!e.accelerationIncludingGravity) return;
    const { x, y, z } = e.accelerationIncludingGravity;
    const speed = Math.sqrt(x*x + y*y + z*z);
    
    const now = Date.now();
    if (speed > 14 && now - lastShake > 1000) {
        lastShake = now;
        blowCandles();
        
        // Extra burst
        for (let i = 0; i < 45; i++) {
            setTimeout(() => {
                createFlowerParticle();
            }, i * 60);
        }
    }
});
