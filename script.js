let celebrationActive = false;
let celebrationTimer = null;
const audio = document.getElementById('party-sound');
let volumeFadeInterval = null;

const audio = document.getElementById('party-sound');

document.addEventListener('click', () => {
    audio.volume = 0;
    audio.play().catch(err => console.log(err));

    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, 1000);
}, { once: true }); // only needs one click



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

    
for (let i = 0; i < (window.innerWidth <= 768 ? 30 : 50); i++) {
    setTimeout(() => {
        createConfettiPiece();
        if (Math.random() > 0.5) createHeartPiece();
    }, i * 120);   
}

    
    const btn = document.querySelector('.celebration-btn');
    btn.textContent = "Stop Celebration";

    const wish = document.getElementById('wishMessage');
    const lines = wish.querySelectorAll('span');

    wish.style.display = 'block';   
    wish.classList.remove('hidden');

    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 3000); // 3 seconds per line
    });


    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1500);

    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active');

    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

    startParticles();

    celebrationTimer = setTimeout(endCelebration, 30000);
}

function endCelebration() {
    if (!celebrationActive) return;
    celebrationActive = false;

    clearTimeout(celebrationTimer);

    document.querySelector('.celebration-btn').textContent = "🎊 Celebrate!";

    fadeVolume(audio, 1, 0, 1500, () => {
        audio.pause();
    });

    document.body.classList.remove('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.remove('active');
    document.getElementById('hearts').classList.remove('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));
}

function fadeVolume(element, start, end, durationMs, callback = () => {}) {

    // Kill any previous fade
    if (volumeFadeInterval) {
        clearInterval(volumeFadeInterval);
        volumeFadeInterval = null;
    }

    const steps = 20;
    const stepTime = durationMs / steps;
    const stepSize = (end - start) / steps;
    let vol = start;

    volumeFadeInterval = setInterval(() => {
        vol += stepSize;
        element.volume = Math.max(0, Math.min(1, vol));

        if ((stepSize > 0 && vol >= end) || (stepSize < 0 && vol <= end)) {
            clearInterval(volumeFadeInterval);
            volumeFadeInterval = null;
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
    el.textContent = (celebrationActive && Math.random() > 0.6) ? '🌹' : '❤️';
    const size = Math.random() * 1 + 0.5;
    el.style.transform = `scale(${size})`;
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    document.getElementById('hearts').appendChild(el);
    setTimeout(() => el.remove(), 7000);
}

function startParticles() {
    const isMobile = window.innerWidth <= 768;
    const intervalMs = isMobile ? 280 : 180;          

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

let lastShake = 0;
window.addEventListener('devicemotion', e => {
    if (!e.accelerationIncludingGravity) return;
    const { x, y, z } = e.accelerationIncludingGravity;
    const speed = Math.sqrt(x*x + y*y + z*z);
    
    const now = Date.now();
    if (speed > 18 && now - lastShake > 1200) {
        lastShake = now;
const hint = document.getElementById("shakeHint");

if (hint) {
    hint.style.display = "none";
}

// Clear existing interval so we don't stack multiple
if (shakeHintInterval) {
    clearInterval(shakeHintInterval);
}

// Start repeating reappearance every 10 seconds
shakeHintInterval = setInterval(() => {
    const hint = document.getElementById("shakeHint");
    if (hint && window.innerWidth <= 768) {
        hint.style.display = "block";
    }
}, 10000);
    

        blowCandles(); // also triggers celebration
        
        // Extra burst of particles
        for (let i = 0; i < 45; i++) {
            setTimeout(() => {
                createConfettiPiece();
                createHeartPiece();
            }, i * 60);
        }
    }

});

// Show shake hint on mobile only
window.addEventListener("load", () => {
    if (window.innerWidth <= 768) {
        const hint = document.getElementById("shakeHint");
        if (hint) hint.style.display = "block";
    }
});


