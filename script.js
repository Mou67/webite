import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

const videos = [
    '../videos/video 1.mp4',
    '../videos/video 2.mp4',
    '../videos/video 3.mp4',
];

function randomizeVideo() {
    const video = document.getElementById('myVideo');
    if (video) {
        const videoSource = video.querySelector('source');
        if (videoSource) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            videoSource.src = videos[randomIndex];
            video.load();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize video
        randomizeVideo();
        
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCa0kNM8HyAAzGkzpMwmIEjtWy5i5NuOPU",
            authDomain: "mywebsite-fbd3d.firebaseapp.com",
            projectId: "mywebsite-fbd3d",
            storageBucket: "mywebsite-fbd3d.firebasestorage.app",
            messagingSenderId: "187953838680",
            appId: "1:187953838680:web:0c3fd5004ea4602ef6282d",
            measurementId: "G-ZCFWCXD77B"
        };
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const database = getDatabase(app);
        
        // Set up visitor counter
        const visitorCountRef = ref(database, 'visitorCount');
        
        // Check for new session
        const sessionKey = 'visitedBefore';
        if (!sessionStorage.getItem(sessionKey)) {
            runTransaction(visitorCountRef, (currentCount) => {
                return (currentCount || 0) + 1;
            });
            sessionStorage.setItem(sessionKey, 'true');
        }
        
        // Update counter display
        onValue(visitorCountRef, (snapshot) => {
            const counterElement = document.getElementById('counter');
            if (counterElement) {
                counterElement.textContent = snapshot.val() || 0;
            }
        });
        
        // Set up eye tracking
        const eyeBall = document.querySelector('.eye-ball');
        if (eyeBall) {
            document.addEventListener('mousemove', (event) => {
                const eyeRect = eyeBall.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                
                const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
                const distance = Math.min(5, Math.sqrt(Math.pow(event.clientX - eyeCenterX, 2) + Math.pow(event.clientY - eyeCenterY, 2)) / 10);
                
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                eyeBall.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});