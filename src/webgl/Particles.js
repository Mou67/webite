import * as THREE from 'three';
import vertexShader from './shaders/particles.vert.glsl?raw';
import fragmentShader from './shaders/particles.frag.glsl?raw';

const SPHERE_RADIUS = 1.9;
const KNOT_SCALE = 0.62;

/**
 * Morphing particle field: shape A (position) is a noised sphere shell,
 * shape B (aPositionB) is a loose torus-knot cloud.
 */
export class Particles {
  constructor(count, pixelRatio) {
    const positions = new Float32Array(count * 3);
    const positionsB = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Uniform points on a sphere shell via normalized gaussians
      let x = gaussian();
      let y = gaussian();
      let z = gaussian();
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      const r = SPHERE_RADIUS * (0.92 + Math.random() * 0.16);
      positions[i * 3] = (x / len) * r;
      positions[i * 3 + 1] = (y / len) * r;
      positions[i * 3 + 2] = (z / len) * r;

      // Torus knot (p=2, q=3) with a loose tube radius
      const t = Math.random() * Math.PI * 2;
      const knotR = Math.cos(3 * t) + 2;
      const spread = 0.3;
      positionsB[i * 3] =
        (knotR * Math.cos(2 * t) + gaussian() * spread) * KNOT_SCALE;
      positionsB[i * 3 + 1] =
        (knotR * Math.sin(2 * t) + gaussian() * spread) * KNOT_SCALE;
      positionsB[i * 3 + 2] = (-Math.sin(3 * t) + gaussian() * spread) * KNOT_SCALE;

      randoms[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPositionB', new THREE.BufferAttribute(positionsB, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uScatter: { value: 0 },
      uPointer: { value: new THREE.Vector3(999, 999, 0) },
      uPointerStrength: { value: 1 },
      uSize: { value: 9 },
      uPixelRatio: { value: pixelRatio },
      uGlobalAlpha: { value: 1 },
      uColorA: { value: new THREE.Color('#f2f2ef') },
      uColorB: { value: new THREE.Color('#cbff4d') },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Points(geometry, material);
    this.mesh.frustumCulled = false;
  }

  update(time, pointerWorld) {
    this.uniforms.uTime.value = time;
    if (pointerWorld) this.uniforms.uPointer.value.copy(pointerWorld);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

function gaussian() {
  // Box–Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
