import * as THREE from 'three';
import gsap from 'gsap';
import { Particles } from './Particles.js';
import { Pointer } from './Pointer.js';
import { prefersReducedMotion } from '../js/scroll.js';

export class Experience {
  constructor(container) {
    this.container = container;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    this.quality = {
      count: coarse ? 12000 : cores >= 8 ? 45000 : 25000,
      dprCap: coarse ? 1.5 : 2,
    };

    this.pixelRatio = Math.min(window.devicePixelRatio, this.quality.dprCap);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    this.camera.position.z = 7;
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.add(this.camera);
    this.scene.add(this.cameraGroup);

    this.pointer = new Pointer();
    this.particles = new Particles(this.quality.count, this.pixelRatio);
    this.scene.add(this.particles.mesh);
    this.layout();

    if (coarse) this.particles.uniforms.uPointerStrength.value = 0;

    this.progress = 0;
    this.hidden = document.hidden;

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', () => {
      this.hidden = document.hidden;
    });

    if (prefersReducedMotion) {
      // Static constellation: render one frame, refresh only on resize
      document.documentElement.classList.add('static-webgl');
      this.particles.update(2.5, null);
      this.renderer.render(this.scene, this.camera);
      this.static = true;
    } else {
      gsap.ticker.add(this.tick);
    }
  }

  /** Driven by the hero ScrollTrigger scrub (0 = top, 1 = fully scrolled away). */
  setProgress(progress) {
    this.progress = progress;
    const u = this.particles.uniforms;
    u.uMorph.value = smoothstep(0, 0.5, progress);
    u.uScatter.value = smoothstep(0.35, 0.95, progress);
    this.container.style.visibility = progress > 0.95 ? 'hidden' : '';
  }

  tick(time, deltaTime) {
    if (this.hidden || this.progress > 0.95) return;

    const dt = Math.min(deltaTime / 1000, 0.05);
    this.pointer.update(this.camera, dt);

    // Mouse parallax on the camera rig
    const t = 1 - Math.pow(0.002, dt);
    this.cameraGroup.rotation.y +=
      (this.pointer.smoothNdc.x * 0.12 - this.cameraGroup.rotation.y) * t;
    this.cameraGroup.rotation.x +=
      (-this.pointer.smoothNdc.y * 0.08 - this.cameraGroup.rotation.x) * t;

    this.particles.update(time, this.pointer.active ? this.pointer.world : null);
    this.renderer.render(this.scene, this.camera);
  }

  /** Frame the cloud for the current viewport: right of the copy on wide
   *  screens, centered and smaller below it on narrow ones. */
  layout() {
    const mesh = this.particles.mesh;
    if (window.innerWidth < 768) {
      mesh.position.set(0, -0.75, 0);
      mesh.scale.setScalar(0.78);
      this.particles.uniforms.uGlobalAlpha.value = 0.55;
    } else {
      mesh.position.set(1.5, -0.15, 0);
      mesh.scale.setScalar(1);
      this.particles.uniforms.uGlobalAlpha.value = 1;
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.layout();
    this.pixelRatio = Math.min(window.devicePixelRatio, this.quality.dprCap);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.particles.uniforms.uPixelRatio.value = this.pixelRatio;
    if (this.static) this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    gsap.ticker.remove(this.tick);
    window.removeEventListener('resize', this.resize);
    this.particles.dispose();
    this.renderer.dispose();
  }
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
