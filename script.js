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

    // In startCelebration()
for (let i = 0; i < (window.innerWidth <= 768 ? 30 : 50); i++) {
    setTimeout(() => {
        createConfettiPiece();
        if (Math.random() > 0.5) createHeartPiece();
    }, i * 120);   // slower stagger
}

    // Update button
    const btn = document.querySelector('.celebration-btn');
    btn.textContent = "Stop Celebration";

    // Show wish message line by line
    const wish = document.getElementById('wishMessage');
    const lines = wish.querySelectorAll('span');

    wish.style.display = 'block';   // bring it into layout
    wish.classList.remove('hidden');

    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 2000); // 3 seconds per line
    });


    // Music fade in
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1500);

    // Visuals
    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active');

    // Speed up balloons
    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

    // Start particles
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
    const el = document.createElement('div');
    el.className = 'confetti-piece' + (celebrationActive ? ' sped-up' : '');
    el.style.left = Math.random() * 100 + '%';
    el.style.backgroundColor = getRandomColor();
    document.getElementById('confetti').appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function createHeartPiece() {
    const el = document.createElement('div');
    el.className = 'heart-piece' + (celebrationActive ? ' sped-up' : '');
    el.textContent = '❤️';
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    document.getElementById('hearts').appendChild(el);
    setTimeout(() => el.remove(), 5000);
}

function startParticles() {
    // Lower frequency on mobile
    const isMobile = window.innerWidth <= 768;
    const intervalMs = isMobile ? 280 : 180;          // slower on mobile

    const interval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(interval);
            return;
        }

        createConfettiPiece();

        // Hearts less frequent
        if (Math.random() > (isMobile ? 0.65 : 0.4)) {
            createHeartPiece();
        }
    }, intervalMs);
}

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#6c5ce7','#55a3ff','#26de81'];
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
    if (speed > 18 && now - lastShake > 1200) {
        lastShake = now;
        blowCandles(); // also triggers celebration
        
        // Extra burst of particles
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                createConfettiPiece();
                createHeartPiece();
            }, i * 60);
        }
    }

});
