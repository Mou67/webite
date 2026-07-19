import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initAbout() {
  const statement = document.querySelector('[data-statement]');
  if (statement) {
    document.fonts.ready.then(() => {
      const split = SplitText.create(statement, {
        type: 'lines',
        mask: 'lines',
      });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: statement,
          start: 'top 80%',
          once: true,
        },
      });
    });
  }

  const rows = gsap.utils.toArray('.about__row');
  gsap.from(rows, {
    y: 48,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '[data-about-rows]',
      start: 'top 85%',
      once: true,
    },
  });
}
