import gsap from 'gsap';
import { initHero } from './hero.js';
import { initAbout } from './about.js';
import { initSkills } from './skills.js';
import { initProjects } from './projects.js';
import { initContact } from './contact.js';

export function initAnimations() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    initHero();
    initAbout();
    initSkills();
    initProjects();
    initContact();
  });
  // Reduced motion: no setup at all — content is fully visible by default.
}
