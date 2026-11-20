import * as THREE from 'three';

function createDustTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 235, 175, 1)');
  grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.6)');
  grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.screenGlowLight = null;
    this.dustParticles = null;

    this.init();
    this.initDustParticles();
  }

  init() {
    // 1. Warm Golden Hemisphere light (Golden sky fill, warm bounce)
    const hemiLight = new THREE.HemisphereLight(0xfff5e6, 0xd4c2a5, 0.85);
    hemiLight.position.set(0, 10, 0);
    this.scene.add(hemiLight);

    // 2. Rotunda Central Chandelier Warm Light
    const rotundaLight = new THREE.PointLight(0xffeedb, 3.6, 16, 1.2);
    rotundaLight.position.set(0, 4.8, 16);
    rotundaLight.castShadow = true;
    rotundaLight.shadow.bias = -0.0002;
    rotundaLight.shadow.mapSize.width = 1024;
    rotundaLight.shadow.mapSize.height = 1024;
    this.scene.add(rotundaLight);

    // 3. SPECIAL LUXURY DEDICATION WALL SPOTLIGHTS (Rotunda South Wall)
    const dedSpotL = new THREE.SpotLight(0xffeedd, 4.2, 12, Math.PI / 4, 0.45, 1.1);
    dedSpotL.position.set(-2.8, 4.8, 20.8);
    dedSpotL.target.position.set(-1.5, 2.7, 23.7);
    this.scene.add(dedSpotL);
    this.scene.add(dedSpotL.target);

    const dedSpotR = new THREE.SpotLight(0xffeedd, 4.2, 12, Math.PI / 4, 0.45, 1.1);
    dedSpotR.position.set(2.8, 4.8, 20.8);
    dedSpotR.target.position.set(1.5, 2.7, 23.7);
    this.scene.add(dedSpotR);
    this.scene.add(dedSpotR.target);

    // 4. Gallery 1 Track Warm Ceiling Lights
    const g1Light = new THREE.PointLight(0xfff2e0, 2.8, 14, 1.2);
    g1Light.position.set(0, 4.8, -4);
    this.scene.add(g1Light);

    // 5. Gallery 2 Track Warm Ceiling Lights
    const g2Light = new THREE.PointLight(0xfff2e0, 2.8, 15, 1.2);
    g2Light.position.set(22, 4.8, 16);
    this.scene.add(g2Light);

    // 6. Cinema Room Ambient & Dynamic Screen Glow
    const cinemaDimLight = new THREE.PointLight(0x2a3650, 0.9, 12, 1.5);
    cinemaDimLight.position.set(-18, 4.5, 16);
    this.scene.add(cinemaDimLight);

    this.screenGlowLight = new THREE.PointLight(0x88bbff, 2.2, 14, 1.2);
    this.screenGlowLight.position.set(-28, 3.0, 16);
    this.scene.add(this.screenGlowLight);

    const stepLight1 = new THREE.PointLight(0xff9933, 0.4, 3);
    stepLight1.position.set(-14, 0.2, 12);
    this.scene.add(stepLight1);

    const stepLight2 = new THREE.PointLight(0xff9933, 0.4, 3);
    stepLight2.position.set(-14, 0.2, 20);
    this.scene.add(stepLight2);

    // 7. SECRET MEMORY ROOM ("The Most Precious Memories") AMBIENT & LIGHTS
    const secretRoomLight = new THREE.PointLight(0xffdfb3, 3.2, 16, 1.3);
    secretRoomLight.position.set(0, 4.2, -22);
    secretRoomLight.castShadow = true;
    this.scene.add(secretRoomLight);

    // Spotlight on Secret Centerpiece Crystal Heart
    const crystalSpot = new THREE.SpotLight(0xffe6b8, 4.5, 10, Math.PI / 5, 0.35, 1.2);
    crystalSpot.position.set(0, 4.8, -22);
    crystalSpot.target.position.set(0, 1.4, -22);
    this.scene.add(crystalSpot);
    this.scene.add(crystalSpot.target);

    // Spotlight on Secret North Monument Wall
    const secretMonSpot = new THREE.SpotLight(0xffecd0, 4.0, 10, Math.PI / 4, 0.45, 1.1);
    secretMonSpot.position.set(0, 4.8, -26.0);
    secretMonSpot.target.position.set(0, 2.7, -28.7);
    this.scene.add(secretMonSpot);
    this.scene.add(secretMonSpot.target);

    // Secret Room Entrance Archway Glow in Gallery 1
    const secretArchGlow = new THREE.PointLight(0xffc966, 1.5, 6, 1.4);
    secretArchGlow.position.set(0, 3.8, -12);
    this.scene.add(secretArchGlow);
  }

  initDustParticles() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Scatter in Rotunda, Galleries, and Secret Room
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      positions[i * 3 + 2] = -26 + Math.random() * 48;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: createDustTexture(),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  setScreenGlow(colorHex, intensity) {
    if (this.screenGlowLight) {
      if (colorHex) this.screenGlowLight.color.set(colorHex);
      if (intensity !== undefined) this.screenGlowLight.intensity = intensity;
    }
  }

  update(time) {
    if (this.dustParticles) {
      const positions = this.dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.8 + i) * 0.003;
        positions[i] += Math.cos(time * 0.5 + i) * 0.002;
        if (positions[i + 1] > 5.2) positions[i + 1] = 0.6;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }
  }
}
