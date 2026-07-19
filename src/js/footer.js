import { scrollToTarget } from './scroll.js';

export function initFooter() {
  const topBtn = document.querySelector('[data-back-to-top]');
  topBtn?.addEventListener('click', () =>
    scrollToTarget(document.getElementById('home'))
  );

  const timeEl = document.querySelector('[data-local-time]');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Vienna',
      hour: '2-digit',
      minute: '2-digit',
    });
    const tick = () => (timeEl.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 30_000);
  }
}
