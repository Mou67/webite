window.addEventListener('load', function() {
    console.log('Script loaded');

    const iframe = document.querySelector('.background-container iframe');
    const cards = document.querySelectorAll('.card');
    
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
            typewriter.style.animation = '';
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            startTypewriterAnimation(card);
        });
    });

    // Add click event listeners for card navigation
    document.getElementById('learning-card').addEventListener('click', () => {
        window.location.href = 'learning.html'; // Replace with the actual URL
    });

    // Add click event listener for "About me" card navigation
    document.getElementById('about-me-card').addEventListener('click', () => {
        window.location.href = 'projekt_1/index.html'; // Replace with the actual URL
    });
});
