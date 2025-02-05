let lastLoadedIndex = 0;
let isScrolling = false;
let eggsFound = 0;
let clicks = 0;
let konamiIndex = 0;

const scrollMessages = [
    "Hey, why are you still scrolling? 🤔",
    "There's nothing down here...",
    "Seriously, you're wasting your time!",
    "Maybe you should do something productive? 😅",
    "Like touching some grass? 🌱",
    "Or finding a girlfriend? Oh wait...",
    "Still here? Really? 😮",
    "I'm running out of messages...",
    "You must be really bored 😴",
    "Ok, last warning...",
    "There's literally nothing else",
    "Fine, you win! Here's a cookie 🍪",
    "You're very persistent...",
    "I mean... VERY persistent",
    "Did you know that scrolling burns calories?",
    "Keep scrolling for more disappointment",
    "Loading more nothing...",
    "Error 404: Life not found 😂",
    "Maybe try reading a book instead?",
    "Or learn a new programming language!",
    "Still scrolling? Impressive dedication!",
    "You could have learned React by now...",
    "Fun fact: This goes on forever",
    "Just kidding, there's an end... maybe 🤫",
    "Achievement Unlocked: Master Scroller 🏆",
    "Your thumb must be tired by now",
    "Legend says they're still scrolling...",
    "Plot twist: More scrolling ahead!",
    "Scroll scroll scroll your screen... 🎵",
    "To infinity and beyond! 🚀",
    "You're getting closer to the end...",
    "Trust me, it's worth it! (maybe)",
    "Have you finished your homework? 📚",
    "This is longer than my attention span",
    "Are we there yet? 🚗",
    "Just a few more... probably",
    "You could be sleeping right now 😴",
    "But here you are, still scrolling",
    "Dedication level: 1000 💯",
    "Almost there! (not really)",
    "Fun fact: Cats sleep 16 hours a day 🐱",
    "You could've been a cat...",
    "But instead you're here scrolling",
    "I'm running out of ideas...",
    "How about a dad joke?",
    "Why don't programmers like nature?",
    "It has too many bugs! 🐛",
    "Sorry for that terrible joke",
    "Only 10 messages left!",
    "9...",
    "8...",
    "7...",
    "6...",
    "5...",
    "4...",
    "3...",
    "2...",
    "1...",
    "🎉 Congratulations! 🎉",
    "You've reached the end!",
    "Here's your reward: 🏆",
    "Achievement Unlocked: No Life 😂",
    "Now go touch some grass! 🌱",
    "Seriously, go outside...",
    "This is the real end.",
    "Goodbye! 👋"
];

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Funktionen definieren
function updateEasterEggCounter() {
    const counter = document.querySelector('.easter-egg-counter');
    if (counter) {
        eggsFound++;
        counter.style.display = 'block';
        counter.querySelector('span').textContent = eggsFound;
    }
}

function addNewMessage() {
    const wasteSection = document.querySelector('#wasteSection');
    if (!wasteSection) return;
    
    if (lastLoadedIndex >= scrollMessages.length) {
        // Show end message
        const endMessage = document.createElement('div');
        endMessage.className = 'waste-message end-message';
        endMessage.innerHTML = `
            <p>
                🎊 You've reached the absolute end! 🎊<br>
                Thanks for scrolling all the way down!<br>
                <span class="end-emoji">🌟</span>
            </p>
        `;
        wasteSection.appendChild(endMessage);
        setTimeout(() => endMessage.classList.add('visible'), 50);
        return;
    }
    
    const newMessage = document.createElement('div');
    newMessage.className = 'waste-message';
    
    const randomEffect = ['rotate', 'zoom', 'slide', 'fade'][Math.floor(Math.random() * 4)];
    newMessage.setAttribute('data-effect', randomEffect);
    
    const p = document.createElement('p');
    p.textContent = scrollMessages[lastLoadedIndex];
    newMessage.appendChild(p);
    wasteSection.appendChild(newMessage);
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            newMessage.classList.add('visible');
        }, 50);
    });
    
    lastLoadedIndex++;
}

function showFinalReward() {
    const footer = document.querySelector('.footer');
    if (!footer || footer.hasAttribute('data-rewarded')) return;

    confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 1 },
        colors: ['#5865f2', '#ff73fa', '#ffd700', '#ff4444', '#90EE90'],
        ticks: 300
    });

    footer.setAttribute('data-rewarded', 'true');
    
    const rewardPopup = document.createElement('div');
    rewardPopup.className = 'reward-popup';
    rewardPopup.innerHTML = `
        <div class="reward-content">
            <h3>🏆 Ultimate Scrolling Champion! 🏆</h3>
            <p>You've made it to the very bottom!</p>
            <div class="reward-code">
                <code>SCROLL-MASTER-2024</code>
                <button class="copy-btn">Copy</button>
            </div>
            <small>Use this code on Discord for a special role!</small>
            <div class="reward-timer">This reward expires in <span>30</span> seconds</div>
        </div>
    `;
    document.body.appendChild(rewardPopup);

    // Countdown Timer
    let timeLeft = 30;
    const timerSpan = rewardPopup.querySelector('.reward-timer span');
    const timer = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            rewardPopup.classList.add('fade-out');
            setTimeout(() => {
                rewardPopup.remove();
                footer.removeAttribute('data-rewarded');
            }, 500);
        }
    }, 1000);

    // Copy button
    const copyBtn = rewardPopup.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('SCROLL-MASTER-2024');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

function checkScroll() {
    if (isScrolling) return;
    
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const discordContainer = document.querySelector('.discord-container');
    
    if (discordContainer) {
        if (scrollPosition > windowHeight * 0.3) {
            discordContainer.classList.add('hidden');
        } else {
            discordContainer.classList.remove('hidden');
        }
    }

    if (scrollPosition + windowHeight > documentHeight - 800) {
        isScrolling = true;
        addNewMessage();
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }

    const footer = document.querySelector('.footer');
    if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight && !footer.hasAttribute('data-rewarded')) {
            showFinalReward();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    scrollHint.textContent = 'Psst! There might be something interesting below';
    document.body.appendChild(scrollHint);
    
    setTimeout(() => {
        scrollHint.remove();
    }, 5500);

    const profileAvatar = document.querySelector('.profile-avatar');
    const secretArea = document.querySelector('.secret-click-area');
    const wasteSection = document.querySelector('#wasteSection');
    
    if (profileAvatar) {
        profileAvatar.addEventListener('click', () => {
            clicks++;
            if (clicks === 5) {
                const cat = document.querySelector('.hidden-cat');
                if (cat) cat.classList.add('show');
                updateEasterEggCounter();
            }
        });
    }

    if (secretArea) {
        secretArea.addEventListener('mouseover', () => {
            secretArea.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        });
        secretArea.addEventListener('click', () => {
            alert('You found a secret message! "Sometimes the best things in life are hidden in plain sight."');
            updateEasterEggCounter();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                const konamiMessage = document.querySelector('.konami-message');
                if (konamiMessage) {
                    konamiMessage.classList.add('show');
                    updateEasterEggCounter();
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    if (wasteSection) {
        for (let i = 0; i < 3; i++) {
            addNewMessage();
        }
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            checkScroll();
            scrollTimeout = null;
        }, 100);
    });
});