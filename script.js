let celebrationActive = false;
let celebrationTimer = null;
let volumeFadeInterval = null;
let shakeUnlocked = false;
let shakeHintInterval = null;
let lastShake = 0;

const audio = document.getElementById('party-sound');


function toggleCelebration() {
    if (celebrationActive) {
        endCelebration();
    } else {
        startCelebration();
    }
}

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#6c5ce7','#55a3ff','#26de81'];
    return colors[Math.floor(Math.random() * colors.length)];
}


function startCelebration() {
    if (celebrationActive) return;
    celebrationActive = true;
    

    shakeUnlocked = false;

    // const hint = document.getElementById("shakeHint");
    //if (hint) hint.style.display = "block";

    const btn = document.querySelector('.celebration-btn');
    btn.textContent = "Stop Celebration";

    // ── Wish message animation ──
    const wish = document.getElementById('wishMessage');
    if (wish) {
        wish.style.display = 'none';
        wish.classList.add('hidden');
        wish.classList.remove('breathe', 'glow-active');

        const lines = wish.querySelectorAll('span');
        lines.forEach(line => line.classList.remove('visible'));

        const lineSpacing = 3500;
        const firstLineDelay = 5500;

setTimeout(() => {
    wish.style.display = 'block';
    wish.classList.remove('hidden');

    const card = document.querySelector('.birthday-card');

    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');

            if (celebrationActive && card) {
                card.classList.remove('pulse');

                setTimeout(() => {
                    card.classList.add('pulse');

                    setTimeout(() => {
                        card.classList.remove('pulse');
                    }, 1600);   // match or slightly longer than animation duration
                }, 20);
            }
        }, index * lineSpacing + firstLineDelay);
    });

    const lastLineDelay = (lines.length - 1) * lineSpacing + firstLineDelay;
    setTimeout(() => {
        wish.classList.add('breathe');
        wish.classList.add('glow-active');
    }, lastLineDelay + 1200);
}, 80);

    setTimeout(() => startParticles(), firstLineDelay - 2700);
}

    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1500);

    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));
          
    celebrationTimer = setTimeout(endCelebration, 35000);   // original 35 seconds
}

function endCelebration() {
    if (!celebrationActive) return;
    celebrationActive = false;

    clearTimeout(celebrationTimer);

    document.querySelector('.celebration-btn').textContent = "🎊 Celebrate!";

    fadeVolume(audio, 1, 0, 2000, () => audio.pause());

    document.body.classList.remove('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.remove('active');
    document.getElementById('hearts').classList.remove('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));
    const wish = document.getElementById('wishMessage');
    wish.classList.remove('breathe', 'glow-active');
}

// Fade audio helper 
function fadeVolume(element, start, end, durationMs, callback = () => {}) {
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

// ── Confetti creation 
function createConfettiPiece() {
    const el = document.createElement('div');
    el.className = 'confetti-piece' + (celebrationActive ? ' sped-up' : '');
    el.style.left = Math.random() * 100 + '%';
    el.style.backgroundColor = getRandomColor();

    const randLength = Math.random();
    el.style.setProperty('--rand-length', randLength);

    const randomRotation = Math.random() * 360;
    el.style.transform = `rotate(${randomRotation}deg)`;

    document.getElementById('confetti').appendChild(el);
    setTimeout(() => el.remove(), 9000);
}

// ── Heart creation 
function createHeartPiece() {
    const el = document.createElement('div');
    el.className = 'heart-piece' + (celebrationActive ? ' sped-up' : '');
    el.textContent = (celebrationActive && Math.random() > 0.6) ? '🌹' : '❤️';
    const size = Math.random() * 1 + 0.5;
    el.style.transform = `scale(${size})`;
    el.style.left = Math.random() * 100 + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    document.getElementById('hearts').appendChild(el);
    setTimeout(() => el.remove(), 9000);
}


function startParticles() {
    if (!celebrationActive) return;

    const isMobile = window.innerWidth <= 768;

    const confettiIntervalMs = isMobile ? 115 : 100;
    const heartIntervalMs    = isMobile ? 800 : 700;

    // ── Initial burst 
    const confettiCount = isMobile ? 40 : 70;
    const heartCount    = isMobile ? 10 : 20;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            if (celebrationActive) createConfettiPiece();
        }, i * 85);
    }

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            if (celebrationActive) createHeartPiece();
        }, i * 120);
    }

    // ── Continuous confetti 
    const confettiInterval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(confettiInterval);
            return;
        }
        createConfettiPiece();
    }, confettiIntervalMs);

    // ── Continuous hearts 
    const heartInterval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(heartInterval);
            return;
        }
        createHeartPiece();
    }, heartIntervalMs);
}



// Page visibility
function handleVisibilityChange() {
    if (document.hidden) {
        if (celebrationActive) {
            location.reload();
        }
    } 
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);

// Shake detection 
window.addEventListener('devicemotion', e => {
    if (!shakeUnlocked) return;
    if (!e.accelerationIncludingGravity) return;

    const { x, y, z } = e.accelerationIncludingGravity;
    const speed = Math.sqrt(x*x + y*y + z*z);
    const now = Date.now();

    if (speed > 18 && now - lastShake > 1200) {
        lastShake = now;

        const hint = document.getElementById("shakeHint");
        if (hint) hint.style.display = "none";

        if (shakeHintInterval) clearInterval(shakeHintInterval);
        shakeHintInterval = setInterval(() => {
            const hint = document.getElementById("shakeHint");
            if (hint) hint.style.display = "block";
        }, 4500);

        blowCandles();

        // Shake burst - moderate amount
        for (let i = 0; i < 130; i++) {
            setTimeout(() => {
                createConfettiPiece();
                if (Math.random() > 0.65) createHeartPiece();
            }, i * 40);
        }
    }
});

// Initial setup
window.addEventListener("load", () => {
    const hint = document.getElementById("shakeHint");
    if (hint) hint.style.display = "none";
});