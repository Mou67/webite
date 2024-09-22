window.addEventListener('load', function() {
    const iframe = document.querySelector('.background-container iframe');
    const card = document.querySelector('.card');
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

    const interval = setInterval(removeWatermark, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    function rotateCard(event) {
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
    }
    document.addEventListener('mousemove', rotateCard);

    function startTypewriterAnimation() {
        typewriters.forEach((typewriter, index) => {
            typewriter.style.animation = 'none';
            void typewriter.offsetWidth;
            typewriter.style.animation = null;
        });
    }

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.05)';
        startTypewriterAnimation();
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        typewriters.forEach(typewriter => {
            typewriter.style.width = '0';
        });
    });
});
