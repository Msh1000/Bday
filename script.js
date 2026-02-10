let celebrationActive = false;
let celebrationTimer = null;
let lastShakeTime = 0;
let celebrationStartTime = 0;
const audio = document.getElementById('party-sound');

const MIN_DURATION = 30000;      // 30 seconds minimum
const SHAKE_TIMEOUT = 5000;      // 5 seconds after last shake
const MAX_DURATION = 60000;      // hard max 60 seconds

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
    celebrationStartTime = Date.now();
    lastShakeTime = Date.now();

    const isMobile = window.innerWidth <= 768;
    const confettiCount = isMobile ? 30 : 50;

    // Initial burst
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece();
            if (Math.random() > 0.5) createHeartPiece();
        }, i * 140);   // slightly slower stagger for mobile
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
        }, 1000 + index * 2200); // gentler timing
    });

    // Music fade in
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1800);

    // Visuals
    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active');

    // Speed up balloons
    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

    // Start continuous particles
    startParticles();

    // Check for auto-end (will be managed by shake or timeout)
    checkAutoEnd();
}

function endCelebration(wasMaxDuration = false) {
    if (!celebrationActive) return;
    celebrationActive = false;
    clearTimeout(celebrationTimer);

    // Button back
    document.querySelector('.celebration-btn').textContent = "🎊 Celebrate!";

    // Music fade out
    fadeVolume(audio, 1, 0, 1800, () => {
        audio.pause();
    });

    // Remove effects (message stays visible)
    document.body.classList.remove('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.remove('active');
    document.getElementById('hearts').classList.remove('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));

    // Fireworks only on natural/auto end (not manual stop)
    if (!wasMaxDuration) {
        launchFireworks();
    }
}

function checkAutoEnd() {
    if (!celebrationActive) return;

    const now = Date.now();
    const elapsed = now - celebrationStartTime;

    // Hard max
    if (elapsed >= MAX_DURATION) {
        endCelebration(true);
        return;
    }

    // Minimum duration not reached yet → wait full min
    if (elapsed < MIN_DURATION) {
        celebrationTimer = setTimeout(checkAutoEnd, 1000);
        return;
    }

    // After min duration: end if no shake for SHAKE_TIMEOUT
    if (now - lastShakeTime > SHAKE_TIMEOUT) {
        endCelebration();
    } else {
        celebrationTimer = setTimeout(checkAutoEnd, 800);
    }
}

function launchFireworks() {
    const container = document.getElementById('confetti') || document.body;
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 12 : 20;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createFirework(container);
        }, i * 220 + Math.random() * 300);
    }
}

function createFirework(container) {
    const fw = document.createElement('div');
    fw.className = 'firework';
    fw.style.left = Math.random() * 100 + '%';
    fw.style.top = Math.random() * 60 + '%'; // mostly upper half

    const hue = Math.random() * 360;
    fw.style.setProperty('--hue', hue);

    container.appendChild(fw);

    // Remove after animation
    setTimeout(() => fw.remove(), 2200);
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

function createConfettiPiece() {
    if (!celebrationActive) return;
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.backgroundColor = getRandomColor();
    document.getElementById('confetti').appendChild(el);
    setTimeout(() => el.remove(), 4500);
}

function createHeartPiece() {
    if (!celebrationActive) return;
    const el = document.createElement('div');
    el.className = 'heart-piece';
    el.textContent = '❤️';
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    document.getElementById('hearts').appendChild(el);
    setTimeout(() => el.remove(), 5500);
}

function startParticles() {
    if (!celebrationActive) return;

    const isMobile = window.innerWidth <= 768;
    const intervalMs = isMobile ? 320 : 220;

    const interval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(interval);
            return;
        }
        createConfettiPiece();
        if (Math.random() > (isMobile ? 0.7 : 0.45)) {
            createHeartPiece();
        }
    }, intervalMs);
}

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#6c5ce7','#55a3ff','#26de81'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ── Blow candles also starts/updates celebration ──
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

    // Trigger or extend celebration
    if (!celebrationActive) {
        startCelebration();
    } else {
        lastShakeTime = Date.now(); // extend
    }
}

// ── Shake detection – extend celebration + extra particles ──
let lastShake = 0;
window.addEventListener('devicemotion', e => {
    if (!e.accelerationIncludingGravity) return;
    const { x, y, z } = e.accelerationIncludingGravity;
    const speed = Math.sqrt(x*x + y*y + z*z);
    
    const now = Date.now();
    if (speed > 14 && now - lastShake > 900) {   // debounce a bit more
        lastShake = now;
        lastShakeTime = now; // update global last shake time

        blowCandles(); // visual feedback + start if not active
        
        // Extra burst only if celebration is active
        if (celebrationActive) {
            for (let i = 0; i < 35; i++) {
                setTimeout(() => {
                    createConfettiPiece();
                    if (Math.random() > 0.4) createHeartPiece();
                }, i * 70);
            }
        }
    }
});
