let celebrationActive = false;
        let celebrationTimer = null;
        let volumeFadeInterval = null;
        let lineRevealTimers = [];

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

            audio.volume = 0;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            fadeVolume(audio, 0, 1, 1600);

            setTimeout(() => document.body.classList.add("animating"), 5500);
            setTimeout(() => document.querySelector('.birthday-card').classList.add('pulse'), 5500);

            document.querySelector('.celebration-btn').textContent = "Stop Celebration";
            document.body.classList.add('dark-theme', 'party-pulse');
            document.getElementById('confetti').classList.add('active');
            document.getElementById('hearts').classList.add('active');
            document.querySelectorAll('.balloon').forEach(b => b.classList.add('sped-up'));

            const wish = document.getElementById('wishMessage');
            if (wish) {
                lineRevealTimers.forEach(t => clearTimeout(t));
                lineRevealTimers = [];

                const lines = wish.querySelectorAll('span');
                lines.forEach(line => line.classList.remove('visible'));

                const lineSpacing = 3500;
                const firstLineDelay = 5500;

                lineRevealTimers.push(setTimeout(() => {
                    wish.style.display = 'block';
                    wish.classList.remove('hidden');

                    lines.forEach((line, index) => {
                        const timer = setTimeout(() => {
                            line.classList.add('visible');
                        }, index * lineSpacing);
                        lineRevealTimers.push(timer);
                    });

                    const lastLineTimer = setTimeout(() => {
                        wish.classList.add('breathe');
                    }, (lines.length - 1) * lineSpacing + 3500);
                    lineRevealTimers.push(lastLineTimer);

                }, firstLineDelay));

                setTimeout(() => startParticles(), firstLineDelay - 2650);
            }

            celebrationTimer = setTimeout(endCelebration, 35000);
        }

        function endCelebration() {
            if (!celebrationActive) return;
            celebrationActive = false;

            const wish = document.getElementById('wishMessage');
            if (wish) {
                const lines = wish.querySelectorAll('span');
                lines.forEach(line => line.classList.add('visible'));
                wish.classList.add('breathe');
            }

            lineRevealTimers.forEach(t => clearTimeout(t));
            lineRevealTimers = [];
            clearTimeout(celebrationTimer);

            document.querySelector('.celebration-btn').textContent = "Celebrate With Me!";
            fadeVolume(audio, 1, 0, 1800, () => audio.pause());

            document.querySelector('.birthday-card').classList.remove('pulse');
            document.body.classList.remove('dark-theme', 'party-pulse');
            document.getElementById('confetti').classList.remove('active');
            document.getElementById('hearts').classList.remove('active');
            document.querySelectorAll('.balloon').forEach(b => b.classList.remove('sped-up'));
        }

        function fadeVolume(element, start, end, durationMs, callback = () => {}) {
            if (volumeFadeInterval) clearInterval(volumeFadeInterval);
            const steps = 22;
            const stepTime = durationMs / steps;
            const stepSize = (end - start) / steps;
            let vol = start;

            volumeFadeInterval = setInterval(() => {
                vol += stepSize;
                element.volume = Math.max(0, Math.min(1, vol));
                if ((stepSize > 0 && vol >= end) || (stepSize < 0 && vol <= end)) {
                    clearInterval(volumeFadeInterval);
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
            const randLength = Math.random();
            const randWidth = Math.random();
            const isCircle = Math.random() > 0.5;
            el.style.setProperty('--length-factor', randLength);
            el.style.setProperty('--width-factor', randWidth);
            el.style.setProperty('--border-radius', isCircle ? '50%' : '2px');
            el.style.setProperty('--rand-duration', Math.random());
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.getElementById('confetti').appendChild(el);
            setTimeout(() => el.remove(), 9500);
        }

        function createHeartPiece() {
            const el = document.createElement('div');
            el.className = 'heart-piece' + (celebrationActive ? ' sped-up' : '');
            el.textContent = (Math.random() > 0.55) ? '🌹' : '💕';
            const size = Math.random() * 0.9 + 0.6;
            el.style.transform = `scale(${size})`;
            el.style.left = Math.random() * 100 + '%';
            el.style.setProperty('--drift', (Math.random() * 72 - 36) + 'px');
            document.getElementById('hearts').appendChild(el);
            setTimeout(() => el.remove(), 9500);
        }

        function startParticles() {
            if (!celebrationActive) return;

            const isMobile = window.innerWidth <= 768;
            const confettiCount = isMobile ? 45 : 80;
            const heartCount = isMobile ? 12 : 22;

            for (let i = 0; i < confettiCount; i++) {
                setTimeout(() => { if (celebrationActive) createConfettiPiece(); }, i * 68);
            }
            for (let i = 0; i < heartCount; i++) {
                setTimeout(() => { if (celebrationActive) createHeartPiece(); }, i * 98);
            }

            const confettiInterval = setInterval(() => {
                if (!celebrationActive) { clearInterval(confettiInterval); return; }
                createConfettiPiece();
            }, isMobile ? 100 : 80);

            const heartInterval = setInterval(() => {
                if (!celebrationActive) { clearInterval(heartInterval); return; }
                createHeartPiece();
            }, isMobile ? 780 : 620);
        }

        function getRandomColor() {
            const colors = ['#ff4d94', '#ff8fab', '#ffb3d1', '#e6c3ff', '#ff6ec4', '#ff99cc', '#f8a5c2', '#c78cff', '#ff80ab', '#db7093', '#ffd700', '#00ff00'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function handleVisibilityChange() {
            if (document.hidden && celebrationActive) {
                audio.pause();
                location.reload();
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);

        document.addEventListener('keydown', e => {
            if (e.key === "Escape" && celebrationActive) endCelebration();
        });

        // New: Add touch event for cake to start celebration on mobile
        document.querySelector('.cake').addEventListener('touchstart', () => {
            if (!celebrationActive) {
                startCelebration();
            }
        });