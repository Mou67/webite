document.addEventListener('DOMContentLoaded', () => {
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    document.getElementById('counter').textContent = count;
});