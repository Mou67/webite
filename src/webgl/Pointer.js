import * as THREE from 'three';

/**
 * Tracks the mouse as normalized device coords and projects it onto the
 * z = 0 plane of the scene so the shader can react in world space.
 */
export class Pointer {
  constructor() {
    this.ndc = new THREE.Vector2(0, 0);
    this.smoothNdc = new THREE.Vector2(0, 0);
    this.world = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.active = false;

    window.addEventListener(
      'pointermove',
      (event) => {
        this.ndc.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.active = true;
      },
      { passive: true }
    );
  }

  update(camera, dt) {
    const t = 1 - Math.pow(0.001, dt);
    this.smoothNdc.lerp(this.ndc, t);
    this.raycaster.setFromCamera(this.smoothNdc, camera);
    this.raycaster.ray.intersectPlane(this.plane, this.world);
  }
}
