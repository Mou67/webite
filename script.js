window.addEventListener('load', function() {
    console.log('Script loaded');

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
    const nextTrackBtn = document.getElementById('next-track');
    const previousBtn = document.getElementById('previous');
    const albumArt = document.getElementById('album-art');
    const progressBar = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    const tracks = [
        { src: "asset/music/Softcore.mp3", name: 'ASTRO', artists: 'Slowboy, IVOXYGEN, zaichkou888', img: 'asset/images/softcore.jpg' },
        // Add more tracks here
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        console.log('Loading track:', index);
        const track = tracks[index];
        music.src = track.src;
        albumArt.src = track.img;
        document.querySelector('.music-info h2').textContent = track.name;
        document.querySelector('.music-info p').textContent = track.artists;
        music.load();
    }

    function updatePlayPauseButton() {
        const playPauseImg = playPauseBtn.querySelector('img');
        console.log('Updating button, music paused:', music.paused);
        if (music.paused) {
            playPauseImg.src = 'asset/images/play.png';
            playPauseImg.alt = 'Play';
        } else {
            playPauseImg.src = 'asset/images/pause.png';
            playPauseImg.alt = 'Pause';
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playPauseBtn.addEventListener('click', function() {
        console.log('Play/Pause button clicked, music paused:', music.paused);
        if (music.paused) {
            music.play().then(() => {
                console.log('Music started playing');
                updatePlayPauseButton();
            }).catch(error => {
                console.error('Error playing music:', error);
            });
        } else {
            music.pause();
            console.log('Music paused');
            updatePlayPauseButton();
        }
    });

    nextTrackBtn.addEventListener('click', function() {
        console.log('Next track button clicked');
        // Implementieren Sie hier die Logik für den nächsten Track
    });

    previousBtn.addEventListener('click', function() {
        console.log('Previous button clicked');
        // Implementieren Sie hier die Logik für den vorherigen Track
    });

    music.addEventListener('timeupdate', function() {
        console.log('Time updated:', music.currentTime);
        const progress = (music.currentTime / music.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(music.currentTime);
    });

    music.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(music.duration);
    });

    music.addEventListener('error', function(e) {
        console.error('Error loading audio:', e);
        console.error('Error code:', e.target.error.code);
        console.error('Error message:', e.target.error.message);
    });

    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        const clickPosition = e.offsetX / this.offsetWidth;
        music.currentTime = clickPosition * music.duration;
    });

    // Initialize the first track
    loadTrack(currentTrackIndex);
    updatePlayPauseButton();

    document.addEventListener('DOMContentLoaded', (event) => {
        const videoElement = document.getElementById('yourVideoElementId'); // Replace with your video element's ID

        function playVideo() {
            videoElement.play().catch(error => {
                console.error('Autoplay was prevented:', error);
            });
        }

        // Add event listeners for user interaction
        document.addEventListener('click', playVideo, { once: true });
        document.addEventListener('keydown', playVideo, { once: true });
    });

});
