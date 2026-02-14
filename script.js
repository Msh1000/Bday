let celebrationActive = false;
let celebrationTimer = null;
const audio = document.getElementById('party-sound');
let volumeFadeInterval = null;
let shakeUnlocked = false;
let shakeHintInterval = null;
let lastShake = 0;

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

    shakeUnlocked = true;

    const hint = document.getElementById("shakeHint");
    if (hint) hint.style.display = "block";

    // ── Confetti & hearts creation (combined - original style) ──
    const isMobile = window.innerWidth <= 768;

    // 🎉 More confetti
    const confettiCount = isMobile ? 70 : 140;

    // ❤️ Fewer hearts
    const heartCount = isMobile ? 15 : 25;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece();
        }, i * 85);
    }

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createHeartPiece();
        }, i * 120);
    }


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

        setTimeout(() => {
            wish.style.display = 'block';
            wish.classList.remove('hidden');

            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.add('visible');
                }, index * 4200 + 400);
            });

            const lastLineDelay = (lines.length - 1) * 4300 + 410;
            setTimeout(() => {
                wish.classList.add('breathe');
                wish.classList.add('glow-active');
            }, lastLineDelay + 1200);
        }, 80);
    }

    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    fadeVolume(audio, 0, 1, 1500);

    document.body.classList.add('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.add('active');
    document.getElementById('hearts').classList.add('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

    startParticles();

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

// Fade audio helper (unchanged)
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

// ── Confetti creation (fixed width, short length variation) ──
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
    setTimeout(() => el.remove(), 7000);
}

// ── Heart creation (unchanged) ──
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

    const confettiIntervalMs = isMobile ? 70 : 45;
    const heartIntervalMs = isMobile ? 900 : 700;

    const confettiInterval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(confettiInterval);
            return;
        }
        createConfettiPiece();
    }, confettiIntervalMs);

    const heartInterval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(heartInterval);
            return;
        }
        createHeartPiece();
    }, heartIntervalMs);
}


function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#6c5ce7','#55a3ff','#26de81'];
    return colors[Math.floor(Math.random() * colors.length)];
}



// Page visibility (unchanged)
function handleVisibilityChange() {
    if (document.hidden) {
        if (celebrationActive) {
            audio.pause();
            document.body.classList.remove('party-pulse');
        }
    } else {
        if (celebrationActive) {
            audio.play().catch(() => {});
            document.body.classList.add('party-pulse');
        }
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);

// Shake detection (unchanged except burst count)
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
        for (let i = 0; i < 100; i++) {
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