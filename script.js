let celebrationActive = false;
let celebrationTimer = null;
let volumeFadeInterval = null;
let lineRevealTimers = []; // <-- track wish message timers

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

    const btn = document.querySelector('.celebration-btn');
    btn.textContent = "Stop Celebration";

    // ── Wish message animation ──
    const wish = document.getElementById('wishMessage');
    if (wish) {
        // clear any old timers if starting again
        lineRevealTimers.forEach(t => clearTimeout(t));
        lineRevealTimers = [];

        const lines = wish.querySelectorAll('span');
        lines.forEach(line => line.classList.remove('visible'));

        const lineSpacing = 3500;
        const firstLineDelay = 5500;

        lineRevealTimers.push(setTimeout(() => {
            wish.style.display = 'block';
            wish.classList.remove('hidden');

            const card = document.querySelector('.birthday-card');

            lines.forEach((line, index) => {
                const timer = setTimeout(() => {
                    line.classList.add('visible');

                    if (celebrationActive && card) {
                        card.classList.remove('pulse');
                        setTimeout(() => card.classList.add('pulse'), 20);
                        setTimeout(() => card.classList.remove('pulse'), 2900);
                    }
                }, index * lineSpacing);
                lineRevealTimers.push(timer);
            });

            const lastLineTimer = setTimeout(() => {
                wish.classList.add('breathe', 'glow-active');
            }, (lines.length - 1) * lineSpacing + 1200);
            lineRevealTimers.push(lastLineTimer);

        }, firstLineDelay));

        setTimeout(() => startParticles(), firstLineDelay - 2650);

        
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


    // ── Fast-forward wish lines and clear timers ──
    const wish = document.getElementById('wishMessage');
    if (wish) {
        const lines = wish.querySelectorAll('span');
        lines.forEach(line => line.classList.add('visible'));
        wish.classList.add('breathe', 'glow-active');
    }

    // clear all pending timers to avoid double triggers
    lineRevealTimers.forEach(t => clearTimeout(t));
    lineRevealTimers = [];
    clearTimeout(celebrationTimer);
    document.querySelector('.celebration-btn').textContent = "🎊 Celebrate!";

    fadeVolume(audio, 1, 0, 2000, () => audio.pause());

    document.body.classList.remove('dark-theme', 'party-pulse');
    document.getElementById('confetti').classList.remove('active');
    document.getElementById('hearts').classList.remove('active');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));
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

    const confettiIntervalMs = isMobile ? 105 : 90;
    const heartIntervalMs    = isMobile ? 800 : 700;

    // ── Initial burst 
    const confettiCount = isMobile ? 35: 70;
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

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#6c5ce7','#55a3ff','#26de81'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Page visibility
function handleVisibilityChange() {
    if (document.hidden) {
        if (celebrationActive) {
            audio.pause();
            location.reload();
        }
    } 
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);



