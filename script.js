let celebrationActive = false;
let sparkleTimer = null;
let ambientTimer = null;
const music = document.getElementById('party-sound');
const confettiContainer = document.getElementById('confetti');

function toggleCelebration(e) {
    // Prevent default touch/click behavior issues on mobile
    if (e) e.preventDefault();

    const btn = document.querySelector('.celebration-btn');
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    if (celebrationActive) {
        // STOP celebration
        celebrationActive = false;
        btn.classList.remove('active');
        btn.textContent = '🎊 Celebrate!';

        document.body.classList.remove('celebrating');
        document.querySelector('.secret-message').classList.remove('show');
        document.querySelector('.birthday-card').classList.remove('music-pulse');
        document.querySelector('.cake').classList.remove('cake-celebrate');
        confettiContainer.classList.remove('active');

        // Fade out music
        let vol = music.volume;
        const fadeOut = setInterval(() => {
            if (vol > 0.03) {
                vol -= 0.04;
                music.volume = Math.max(0, vol);
            } else {
                music.pause();
                music.currentTime = 0;
                clearInterval(fadeOut);
            }
        }, 120);

        if (sparkleTimer) clearInterval(sparkleTimer);
        if (ambientTimer) clearInterval(ambientTimer);
        sparkleTimer = null;
        ambientTimer = null;

    } else {
        // START celebration
        celebrationActive = true;
        btn.classList.add('active');
        btn.textContent = '🎊 Stop Celebration';

        document.body.classList.add('celebrating');
        document.querySelector('.secret-message').classList.add('show');
        document.querySelector('.birthday-card').classList.add('music-pulse');
        document.querySelector('.cake').classList.add('cake-celebrate');

        // Music fade-in
        music.volume = 0;
        music.currentTime = 0;
        music.play().catch(() => console.log("Audio blocked - user interaction required"));

        let vol = 0;
        const fadeIn = setInterval(() => {
            if (vol < 0.65) {
                vol += 0.04;
                music.volume = vol;
            } else {
                clearInterval(fadeIn);
            }
        }, 150);

        confettiContainer.classList.add('active');

        // PARTICLES - continuous until celebration ends
        const maxConfettiOnScreen = isMobile ? 35 : 70;
        const maxSparklesOnScreen  = isMobile ? 8 : 18;

        const initialConfettiCount = isMobile ? 35 : 70;
        const initialHeartCount    = isMobile ? 20 : 40;

        // Initial burst
        for (let i = 0; i < initialConfettiCount; i++) {
            setTimeout(() => createConfetti('normal'), i * (isMobile ? 90 : 60));
        }
        for (let i = 0; i < initialHeartCount; i++) {
            setTimeout(() => createConfetti('heart'), i * (isMobile ? 150 : 100));
        }

        // Continuous particles - this keeps them coming the whole time
        ambientTimer = setInterval(() => {
            if (!celebrationActive) return;

            const current = confettiContainer.children.length;
            if (current < maxConfettiOnScreen) {
                // Slightly favor hearts during celebration
                createConfetti(Math.random() > 0.35 ? 'heart' : 'normal');
            }
        }, isMobile ? 1000 : 600);  // frequent enough to feel continuous

        // Sparkles - continuous but light
        sparkleTimer = setInterval(() => {
            if (!celebrationActive) return;
            if (document.querySelectorAll('.sparkle').length < maxSparklesOnScreen) {
                createSparkle();
            }
        }, isMobile ? 1800 : 1100);

        // Auto-end after 60 seconds
        setTimeout(() => {
            if (celebrationActive) toggleCelebration(null);
        }, 60000);
    }
}

function createConfetti(type = 'normal') {
    if (!celebrationActive || !confettiContainer) return;

    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    const maxOnScreen = isMobile ? 35 : 70;

    if (confettiContainer.children.length >= maxOnScreen) return;

    const piece = document.createElement('div');
    piece.className = type === 'heart' ? 'confetti-heart' : 'confetti-piece';

    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDuration = (Math.random() * 2.5 + 2.5) + 's'; // 2.5–5s fall

    if (type === 'normal') {
        piece.style.backgroundColor = getRandomColor();
    }
    piece.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;

    confettiContainer.appendChild(piece);

    setTimeout(() => {
        if (piece.parentNode) piece.remove();
    }, 8000); // long lifetime = smoother coverage
}

function createSparkle() {
    if (!celebrationActive) return;

    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    const maxSparkles = isMobile ? 8 : 18;

    if (document.querySelectorAll('.sparkle').length >= maxSparkles) return;

    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 50 + 5 + 'vh';
    document.body.appendChild(s);

    setTimeout(() => {
        if (s.parentNode) s.remove();
    }, 9000);
}

function getRandomColor() {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#a29bfe','#ff9f1c','#ff006e','#8338ec'];
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

    toggleCelebration(null);
}

// Attach events for both desktop and mobile
const celebrateBtn = document.querySelector('.celebration-btn');

celebrateBtn.addEventListener('click', toggleCelebration);
celebrateBtn.addEventListener('touchstart', toggleCelebration, { passive: false });

// Optional shake detection (unchanged)
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