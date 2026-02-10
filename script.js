let celebrationActive = false;

function startCelebration() {
    if (celebrationActive) return;
    celebrationActive = true;
    
    document.getElementById('party-sound').play();

    // Switch to dark theme
    document.body.classList.add('dark-theme');
  
    const confetti = document.getElementById('confetti');
    confetti.classList.add('active');
  
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createConfetti(), i * 100);
    }
  
    for (let i = 0; i < 10; i++) {
      setTimeout(() => createMusicNote(), i * 500);
    }
  
    setTimeout(() => {
      confetti.classList.remove('active');
      celebrationActive = false;
  
      // Revert to light theme
      document.body.classList.remove('dark-theme');
    }, 10000);
  }
  

       

        function createConfetti() {
            const confetti = document.getElementById('confetti');
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = getRandomColor();
            piece.style.animationDelay = Math.random() * 2 + 's';
            confetti.appendChild(piece);
            
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, 3000);
        }

        function createMusicNote() {
            const note = document.createElement('div');
            note.className = 'music-note';
            note.innerHTML = ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)];
            note.style.left = Math.random() * 100 + '%';
            note.style.top = Math.random() * 100 + '%';
            document.body.appendChild(note);
            
            setTimeout(() => {
                if (note.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 4000);
        }

        function getRandomColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7', '#55a3ff', '#26de81', '#fc5c65', '#fed330'];
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

        // Add touch interactions for mobile
        document.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('cake')) {
                e.preventDefault();
            }
        });

        // Animate elements on load
        window.addEventListener('load', function() {
            const card = document.querySelector('.birthday-card');
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.style.transition = 'opacity 1s ease, transform 1s ease';
                card.style.opacity = '1';
            }, 300);
        });

        let lastShakeTime = 0;
        let shakeThreshold = 15; // tweak this for sensitivity

    window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const currTime = Date.now();

    // Calculate total acceleration magnitude
    const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

    if (totalAcc > shakeThreshold && (currTime - lastShakeTime > 1000)) {
        lastShakeTime = currTime;
        blowCandles();
    }
});

  