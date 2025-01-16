class AudioVisualizer {
    constructor(audio, canvas) {
        this.audio = audio;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.initialized = false;

        this.initializeAudio = this.initializeAudio.bind(this);
        this.animate = this.animate.bind(this);

        this.optimizeCanvasSize();
        this.fadeOutDuration = 1000;
    }
    
    async initializeAudio() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.audio);
            
            await new Promise(resolve => {
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                resolve();
            });

            this.analyser.fftSize = 64;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            this.initializeProperties();
            this.initialized = true;
            
            requestAnimationFrame(this.animate);
        } catch (error) {
            console.error('Audio initialization error:', error);
            this.initialized = false;
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    animate(timestamp) {
        if (this.isLowEndDevice && !this.audio.playing) return;
        if (timestamp - this.lastRender > this.fpsInterval) {
            const updates = this.calculateUpdates();
            this.applyUpdates(updates);
            
            this.lastRender = timestamp;
        }
        
        if (timestamp - this.lastUpdate < this.updateInterval) {
            this.animationFrame = requestAnimationFrame(this.animate);
            return;
        }
        
        this.lastUpdate = timestamp;
        this.animationFrame = requestAnimationFrame(this.animate);
    }
    
    smoothValue(key, targetValue) {
        this.previousValues[key] = (targetValue * (1 - this.smoothingFactor)) + 
                                 (this.previousValues[key] * this.smoothingFactor);
        return this.previousValues[key];
    }

    applyUpdates(updates) {
        if (!this.isLowEndDevice) {
            requestAnimationFrame(() => {
                if (this.content) {
                    this.content.style.transform = `translate(-50%, -50%) scale(${updates.scale})`;
                    this.content.style.backdropFilter = `blur(${updates.blur}px)`;
                    this.content.style.backgroundColor = `rgba(0, 0, 0, ${updates.opacity})`;
                    this.content.style.borderColor = updates.borderColor;
                    this.content.style.boxShadow = updates.boxShadow;
                    this.content.style.filter = `grayscale(${updates.grayscale}%)`;
                }
            });
        }
    }

    applyContentEffect(intensity) {
        if (this.content) {
            const scale = 1 + (intensity * 0.05);
            const blur = 5 + (intensity * 3);
            const opacity = 0.7 + (intensity * 0.3);
            
            this.content.style.transform = `translate(-50%, -50%) scale(${scale})`;
            this.content.style.backdropFilter = `blur(${blur}px)`;
            this.content.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }
    }

    applyBackgroundEffect(bass, mid) {
        if (this.background) {
            const video = document.getElementById('myVideo');
            if (video) {
                const saturation = 100 + (mid * 50);
                const brightness = 100 + (bass * 30);
                video.style.filter = `saturate(${saturation}%) brightness(${brightness}%)`;
            }
        }
    }

    applyColorEffect(intensity, bass) {
        document.documentElement.style.setProperty('--dynamic-color', 
            `hsl(${200 + (intensity * 160)}, ${70 + (bass * 30)}%, ${50 + (intensity * 20)}%)`);
    }
    
    updateDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (this.content) {
            this.content.style.maxHeight = `${height * 0.8}px`;
        }

        const visualizer = document.querySelector('.audio-visualizer');
        if (visualizer) {
            if (width >= 1920) {
                visualizer.style.bottom = 'calc(50vh - 400px)';
            } else if (width >= 1024) {
                visualizer.style.bottom = 'calc(50vh - 350px)';
            } else {
                visualizer.style.bottom = '100px';
            }
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', this.resizeHandler);
    }
}

function fadeAudioAndPause(audio, duration) {
    const originalVolume = audio.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = originalVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.max(0, originalVolume - (volumeStep * currentStep));
        audio.volume = newVolume;

        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.volume = originalVolume;
        }
    }, stepDuration);
}

function typeText(element, text, speed = 50, callback = null) {
    let index = 0;
    (function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    })();
}

// Titel Animation
function animateTitle() {
    const titles = [
        "✦✦ Mou67 ✦✦",
        "★彡 Mou67 彡★",
        "⟨✧⟩ Mou67 ⟨✧⟩",
        "✧･ﾟ Mou67 ･ﾟ✧",
        "⋆˙⟡ Mou67 ⟡˙⋆",
        "✩°｡⋆ Mou67 ⋆｡°✩",
        "⊹₊ Mou67 ₊⊹",
        "˗ˏˋ Mou67 ˎˊ˗",
        "⭒☆ﾟ Mou67 ﾟ☆⭒",
        "⋆｡°✩ Mou67 ✩°｡⋆"
    ];
    let currentIndex = 0;

    setInterval(() => {
        document.title = titles[currentIndex];
        currentIndex = (currentIndex + 1) % titles.length;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const audio = document.getElementById('bgMusic');
        const content = document.querySelector('.content');
        let dynamicEffects = null;
        let originalVolume = 0.2;
        let isClicked = false;

        if (audio && content) {
            audio.volume = 0.05;

            // Simplified card click handler
            content.addEventListener('click', () => {
                if (!isClicked) {
                    isClicked = true;
                    content.classList.add('clicked');
                    audio.play();

                    const introSection = document.querySelector('.intro-section p');
                    introSection.textContent = '';
                    typeText(introSection, "Welcome to my personal website", 50, () => {
                        const aboutP1 = document.querySelector('.about-section p:nth-of-type(1)');
                        aboutP1.textContent = '';
                        typeText(aboutP1, "I'm just a guy that likes programming, anime, gaming and learning new things.", 50, () => {
                            const aboutP2 = document.querySelector('.about-section p:nth-of-type(2)');
                            aboutP2.textContent = '';
                            typeText(aboutP2, "Nice to meet you, perhaps we can create something together.", 50, () => {
                                const skillItems = document.querySelectorAll('.skills-grid .skill-item');
                                const skillTexts = ["HTML", "CSS", "JavaScript", "Python"];
                                skillItems.forEach((item, i) => {
                                    item.textContent = '';
                                    typeText(item, skillTexts[i], 50);
                                });

                                const socialLinks = document.querySelectorAll('.contact-section .social-link');
                                const linkTexts = ["GitHub", "Discord Bot"];
                                socialLinks.forEach((link, i) => {
                                    link.textContent = linkTexts[i];
                                    link.href = i === 0 ? "https://github.com/Mou67" : "https://aideon.gitbook.io/aideon";
                                });
                            });
                        });
                    });
                }
            });

            const initAudioContext = async () => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                dynamicEffects = new DynamicEffects(audio, analyser);
                return analyser;
            };
            const startBackgroundAudio = async () => {
                try {
                    if (!dynamicEffects) {
                        await initAudioContext();
                    }
                    await audio.play();
                } catch (err) {
                    console.error('Could not autoplay:', err);
                }
            };
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

window.addEventListener('unload', () => {
    if (window.visualizer) {
        window.visualizer.destroy();
    }
    if (window.dynamicEffects) {
        window.dynamicEffects.destroy();
    }
});

// Starte die Animation wenn das Dokument geladen ist
document.addEventListener('DOMContentLoaded', animateTitle);