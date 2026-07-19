/**
 * WebGL entry: feature-detects, then lazy-loads three.js so the DOM can
 * paint first. `?nowebgl` in the URL forces the CSS fallback for testing.
 */
export let experience = null;

export async function initWebGL() {
  const container = document.querySelector('[data-webgl]');
  if (!container) return null;

  const forceOff = new URLSearchParams(window.location.search).has('nowebgl');
  if (forceOff || !supportsWebGL()) {
    document.documentElement.classList.add('no-webgl');
    return null;
  }

  try {
    const { Experience } = await import('./Experience.js');
    experience = new Experience(container);
  } catch (error) {
    console.error('WebGL init failed, falling back to CSS:', error);
    document.documentElement.classList.add('no-webgl');
  }
  return experience;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
