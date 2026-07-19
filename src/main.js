import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import './styles/index.css';

import { initNav } from './js/nav.js';
import { initScroll } from './js/scroll.js';
import { initCursor } from './js/cursor.js';
import { initFooter } from './js/footer.js';
import { initWebGL } from './webgl/index.js';
import { initAnimations } from './js/animations/index.js';

initNav();
initScroll();
initCursor();
initFooter();
initWebGL().finally(initAnimations);
