import * as THREE from 'three';

export class FPSControls {
  constructor(camera, domElement, architecture) {
    this.camera = camera;
    this.domElement = domElement;
    this.architecture = architecture;

    this.isLocked = false;
    this.enabled = true;

    // Movement state
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;

    // Speeds & physics
    this.walkSpeed = 4.4;
    this.sprintSpeed = 7.5;
    this.damping = 10.0;
    this.playerRadius = 0.35; // Comfortable radius for smooth doorway passage
    this.eyeHeight = 1.7;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Mouse look Euler angles
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.mouseSensitivity = 0.0022;

    // Head bobbing
    this.bobTimer = 0;
    this.bobFrequency = 10;
    this.bobAmplitude = 0.035;

    // Spawn location in Grand Rotunda center crossroads facing North
    this.camera.position.set(0, this.eyeHeight, 13.0);
    this.euler.y = 0; // facing North towards Gallery 1
    this.camera.quaternion.setFromEuler(this.euler);

    this.initListeners();
  }

  resetMovement() {
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;
    this.velocity.set(0, 0, 0);
  }

  initListeners() {
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onPointerLockChange = this.handlePointerLockChange.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);

    // Click listener: only lock the mouse when clicking directly inside the 3D walkthrough canvas
    window.addEventListener('click', (e) => {
      if (!this.enabled) return;
      const inside3D = e.target.closest('#canvas-container, #3d-walkthrough');
      const isInteractive = e.target.closest('button, input, select, a, .lightbox-card, .dock-panel, .start-card, .museum-nav, .monument-card, .museum-grid, .museum-footer, .museum-celebration-wrap');
      if (inside3D && !isInteractive && !this.isLocked) {
        this.lock();
      }
    });

    // Reset keys if user alt-tabs or window loses focus
    window.addEventListener('blur', () => this.resetMovement());
  }

  handlePointerLockChange() {
    this.isLocked = (document.pointerLockElement === this.domElement);
    if (!this.isLocked) {
      this.resetMovement();
    }
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  handleKeyDown(e) {
    if (!this.enabled || !this.isLocked) return;

    const key = (e.key || '').toLowerCase();
    const code = e.code;

    if (code === 'KeyW' || key === 'w' || code === 'ArrowUp') {
      this.moveForward = true;
    } else if (code === 'KeyS' || key === 's' || code === 'ArrowDown') {
      this.moveBackward = true;
    } else if (code === 'KeyA' || key === 'a' || code === 'ArrowLeft') {
      this.moveLeft = true;
    } else if (code === 'KeyD' || key === 'd' || code === 'ArrowRight') {
      this.moveRight = true;
    } else if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
      this.isSprinting = true;
    }
  }

  handleKeyUp(e) {
    if (!this.enabled || !this.isLocked) return;
    const key = (e.key || '').toLowerCase();
    const code = e.code;

    if (code === 'KeyW' || key === 'w' || code === 'ArrowUp') {
      this.moveForward = false;
    } else if (code === 'KeyS' || key === 's' || code === 'ArrowDown') {
      this.moveBackward = false;
    } else if (code === 'KeyA' || key === 'a' || code === 'ArrowLeft') {
      this.moveLeft = false;
    } else if (code === 'KeyD' || key === 'd' || code === 'ArrowRight') {
      this.moveRight = false;
    } else if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift') {
      this.isSprinting = false;
    }
  }

  handleMouseMove(e) {
    if (!this.isLocked || !this.enabled) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this.euler.y -= movementX * this.mouseSensitivity;
    this.euler.x -= movementY * this.mouseSensitivity;

    // Clamp vertical pitch between -85 and +85 degrees
    const maxPitch = Math.PI / 2 - 0.05;
    this.euler.x = Math.max(-maxPitch, Math.min(maxPitch, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  checkCollision(newX, newZ) {
    const r = this.playerRadius;
    const colliders = this.architecture.colliders;
    const playerFeet = 0.1;
    const playerHead = 1.85;

    for (let i = 0; i < colliders.length; i++) {
      const b = colliders[i];

      // Only collide if the obstacle vertically intersects the player body
      if (b.max.y <= playerFeet || b.min.y >= playerHead) {
        continue;
      }

      // Check 2D horizontal overlap with circle / box bounds
      if (
        newX + r > b.min.x &&
        newX - r < b.max.x &&
        newZ + r > b.min.z &&
        newZ - r < b.max.z
      ) {
        return true;
      }
    }
    return false;
  }

  getCurrentRoom() {
    const p = this.camera.position;
    if (p.z < -13.5) return 'The Most Precious Memories';
    if (p.x < -10) return 'The Cinema Theater';
    if (p.x > 10) return 'Gallery 2: Joy & Adventures';
    if (p.z < 5) return 'Gallery 1: Golden Moments';
    return 'The Grand Rotunda';
  }

  update(delta) {
    if (!this.enabled) return;

    // Movement damping
    this.velocity.x -= this.velocity.x * this.damping * delta;
    this.velocity.z -= this.velocity.z * this.damping * delta;

    // Movement input vector
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    const speed = this.isSprinting ? this.sprintSpeed : this.walkSpeed;

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * speed * 8.0 * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x += this.direction.x * speed * 8.0 * delta;
    }

    // World-space movement relative to camera yaw
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);

    const deltaMove = new THREE.Vector3()
      .addScaledVector(forward, -this.velocity.z * delta)
      .addScaledVector(right, this.velocity.x * delta);

    // Test X and Z movements independently for smooth wall sliding
    const currentPos = this.camera.position;

    const testX = currentPos.x + deltaMove.x;
    if (!this.checkCollision(testX, currentPos.z)) {
      currentPos.x = testX;
    }

    const testZ = currentPos.z + deltaMove.z;
    if (!this.checkCollision(currentPos.x, testZ)) {
      currentPos.z = testZ;
    }

    // Head bobbing effect (active while walking)
    const moving = (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight);
    if (moving && this.isLocked) {
      this.bobTimer += delta * this.bobFrequency * (this.isSprinting ? 1.5 : 1.0);
      this.camera.position.y = this.eyeHeight + Math.sin(this.bobTimer) * this.bobAmplitude;
    } else {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.eyeHeight, delta * 8);
    }
  }
}
