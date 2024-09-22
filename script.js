window.addEventListener('load', function() {
    const iframe = document.querySelector('.background-container iframe');
    const cards = document.querySelectorAll('.card');
    const typewriters = document.querySelectorAll('.typewriter');
    
    function removeWatermark() {
        if (iframe.contentDocument) {
            const style = document.createElement('style');
            style.textContent = `
                .spline-watermark, 
                [data-name="watermark"],
                #watermark-container {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
            `;
            iframe.contentDocument.head.appendChild(style);

            const watermarks = iframe.contentDocument.querySelectorAll('.spline-watermark, [data-name="watermark"], #watermark-container');
            watermarks.forEach(el => el.remove());
        }
    }

    iframe.addEventListener('load', removeWatermark);

    // Versuche mehrmals, das Wasserzeichen zu entfernen
    const interval = setInterval(removeWatermark, 1000);
    setTimeout(() => clearInterval(interval), 10000); // Stoppe nach 10 Sekunden

    function rotateCard(event) {
        cards.forEach(card => {
            if (card.matches(':hover')) return;

            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const maxRotation = 10;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const deltaX = mouseX - cardCenterX;
            const deltaY = mouseY - cardCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const maxDistance = Math.max(cardRect.width, cardRect.height) / 2;

            const rotationFactor = Math.min(distance / maxDistance, 1);

            const rotateY = (deltaX / cardRect.width) * maxRotation * rotationFactor;
            const rotateX = -(deltaY / cardRect.height) * maxRotation * rotationFactor;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }

    document.addEventListener('mousemove', rotateCard);

    function startTypewriterAnimation(card) {
        const cardTypewriters = card.querySelectorAll('.typewriter');
        cardTypewriters.forEach((typewriter, index) => {
            typewriter.style.animation = 'none';
            void typewriter.offsetWidth;
            typewriter.style.animation = null;
        });
    }

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.02)';
            startTypewriterAnimation(card);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            const cardTypewriters = card.querySelectorAll('.typewriter');
            cardTypewriters.forEach(typewriter => {
                typewriter.style.width = '0';
            });
        });
    });

    const music = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const volumeControl = document.getElementById('volume');
    const progressBar = document.getElementById('progress');
    const musicStatus = document.querySelector('.music-status');

    // Setze die anfängliche Lautstärke auf einen niedrigen Wert (z.B. 0.2)
    music.volume = 0.2;
    volumeControl.value = 0.2;

    // Starte die Musik automatisch
    music.play().then(() => {
        playPauseBtn.textContent = '⏸️';
        musicStatus.textContent = 'Music is playing';
    }).catch((error) => {
        console.error('Autoplay was prevented:', error);
        // Falls Autoplay verhindert wurde, zeigen wir den Play-Button
        playPauseBtn.textContent = '▶️';
        musicStatus.textContent = 'Click to play music';
    });

    playPauseBtn.addEventListener('click', function() {
        if (music.paused) {
            music.play();
            playPauseBtn.textContent = '⏸️';
            musicStatus.textContent = 'Music is playing';
        } else {
            music.pause();
            playPauseBtn.textContent = '▶️';
            musicStatus.textContent = 'Music is paused';
        }
    });

    stopBtn.addEventListener('click', function() {
        music.pause();
        music.currentTime = 0;
        playPauseBtn.textContent = '▶️';
        musicStatus.textContent = 'Music is stopped';
    });

    volumeControl.addEventListener('input', function() {
        music.volume = this.value;
    });

    music.addEventListener('timeupdate', function() {
        const progress = (music.currentTime / music.duration) * 100;
        progressBar.style.width = progress + '%';
    });

    music.addEventListener('error', function() {
        console.error('Error loading audio file');
        musicStatus.textContent = 'Error loading audio';
    });

    // Rest des bestehenden Codes
});
