let celebrationActive = false;
let sparkleTimer = null;
let ambientTimer = null;
const music = document.getElementById('party-sound');
const confettiContainer = document.getElementById('confetti');

function toggleCelebration() {
    const btn = document.querySelector('.celebration-btn');
    const isMobile = window.innerWidth < 768;

    if (celebrationActive) {
        // STOP
        celebrationActive = false;
        btn.classList.remove('active');
        btn.textContent = '🎊 Celebrate!';

        document.body.classList.remove('celebrating');
       // document.querySelector('.secret-message').classList.remove('show');
        document.querySelector('.birthday-card').classList.remove('music-pulse');
        document.querySelector('.cake').classList.remove('cake-celebrate');
        confettiContainer.classList.remove('active');

        // Fade out music
        let vol = music.volume;
        const fadeOut = setInterval(() => {
            if (vol > 0.03) {
                vol -= 0.04;
                music.volume = Math.max(vol, 0);
            } else {
                music.pause();
                music.currentTime = 0;
                clearInterval(fadeOut);
            }
        }, 120);

        clearInterval(sparkleTimer);
        clearInterval(ambientTimer);
        sparkleTimer = null;
        ambientTimer = null;

    } else {
        // START
                // START celebration
        celebrationActive = true;
        btn.classList.add('active');
        btn.textContent = '🎊 Stop Celebration';

        document.body.classList.add('celebrating');
        document.querySelector('.secret-message').classList.add('show');
        document.querySelector('.birthday-card').classList.add('music-pulse');
        document.querySelector('.cake').classList.add('cake-celebrate');

        // Music fade-in (unchanged)
        music.volume = 0;
        music.currentTime = 0;
        music.play().catch(() => {});

        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.65) {
                vol += 0.035;
                music.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 180);

        confettiContainer.classList.add('active');

                // ───────────────────────────────────────────────
        //   PARTICLES THAT KEEP GOING THE WHOLE TIME
        // ───────────────────────────────────────────────
        const isMobile = window.innerWidth < 768;

        const maxConfettiOnScreen = isMobile ? 30 : 60;       // increased cap → more visible
        const maxSparklesOnScreen  = isMobile ? 8 : 15;

        const initialConfettiCount = isMobile ? 30 : 60;
        const initialHeartCount    = isMobile ? 18 : 35;

        // Initial burst
        for (let i = 0; i < initialConfettiCount; i++) {
            setTimeout(() => createConfetti('normal'), i * (isMobile ? 100 : 70));
        }
        for (let i = 0; i < initialHeartCount; i++) {
            setTimeout(() => createConfetti('heart'), i * (isMobile ? 160 : 110));
        }

        // Continuous creation – keeps particles coming until celebration ends
        ambientTimer = setInterval(() => {
            if (!celebrationActive) return;

            const currentCount = getCurrentParticleCount();
            if (currentCount < maxConfettiOnScreen) {
                // More likely to create hearts/confetti mix
                createConfetti(Math.random() > 0.4 ? 'heart' : 'normal');
            }
        }, isMobile ? 1200 : 700);   // frequent enough to feel continuous

        // Sparkles – keep them subtle but present
        sparkleTimer = setInterval(() => {
            if (!celebrationActive) return;
            if (document.querySelectorAll('.sparkle').length < maxSparklesOnScreen) {
                createSparkle();
            }
        }, isMobile ? 2000 : 1200);

        // Sparkles – a bit faster too
        sparkleTimer = setInterval(() => {
            if (!celebrationActive) return;
            if (document.querySelectorAll('.sparkle').length < maxSparklesOnScreen) {
                createSparkle();
            }
        }, isMobile ? 2200 : 1400);

        // Auto-stop after 60 seconds (only if still active)
        setTimeout(() => {
            if (celebrationActive) toggleCelebration();
        }, 60000);
    }
}

// Helper: count current confetti + hearts
function getCurrentParticleCount() {
    return confettiContainer.children.length;
}

function createConfetti(type = 'normal') {
    if (!celebrationActive || !confettiContainer) return;

    const isMobile = window.innerWidth < 768;
    const maxOnScreen = isMobile ? 30 : 60;

    if (confettiContainer.children.length >= maxOnScreen) return;

    const piece = document.createElement('div');
    piece.className = type === 'heart' ? 'confetti-heart' : 'confetti-piece';

    piece.style.left = Math.random() * 100 + 'vw';

    // Fall duration: fast enough to feel lively, but long enough to fill the screen
    const fallDuration = (Math.random() * 2 + 2.5) + 's';  // 2.5–4.5 seconds
    piece.style.animationDuration = fallDuration;

    if (type === 'normal') {
        piece.style.backgroundColor = getRandomColor();
    }
    piece.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;

    confettiContainer.appendChild(piece);

    // Longer lifetime so they don't disappear too soon
    setTimeout(() => {
        if (piece.parentNode) piece.remove();
    }, 7000);  // 7 seconds – covers most of the fall + buffer
}

function createSparkle() {
    if (!celebrationActive) return;

    const sparkleCount = document.querySelectorAll('.sparkle').length;
    const maxSparkles = window.innerWidth < 768 ? 5 : 10;
    if (sparkleCount >= maxSparkles) return;

    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 50 + 10 + 'vh'; // mostly upper area
    document.body.appendChild(s);

    setTimeout(() => {
        if (s.parentNode) s.remove();
    }, 9000);
}

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#ff9f1c','#ff006e'];
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
    }, 2500);

    toggleCelebration();
}

// Events
document.querySelector('.celebration-btn').addEventListener('click', toggleCelebration);

// Shake (kept but throttled)
let lastShake = 0;
window.addEventListener('devicemotion', (e) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    if (mag > 15 && Date.now() - lastShake > 1500) {
        lastShake = Date.now();
        blowCandles();
    }
});