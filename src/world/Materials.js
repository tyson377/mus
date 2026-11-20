import * as THREE from 'three';

// Procedural Canvas Texture Generators
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base marble tone: pristine off-white / light cream
  ctx.fillStyle = '#f8f7f4';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle soft clouding
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 80 + Math.random() * 160;
    const grad = ctx.createRadialGradient(x, y, 10, x, y, r);
    grad.addColorStop(0, 'rgba(225, 222, 215, 0.35)');
    grad.addColorStop(1, 'rgba(248, 247, 244, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Elegant grey/gold marble veining
  ctx.lineWidth = 1.5;
  for (let v = 0; v < 8; v++) {
    ctx.beginPath();
    let cx = Math.random() * 1024;
    let cy = Math.random() * 1024;
    ctx.moveTo(cx, cy);
    const veins = 12 + Math.floor(Math.random() * 10);
    for (let j = 0; j < veins; j++) {
      cx += (Math.random() - 0.45) * 120;
      cy += (Math.random() - 0.45) * 120;
      ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = Math.random() > 0.3 ? 'rgba(180, 175, 168, 0.22)' : 'rgba(212, 175, 55, 0.15)';
    ctx.stroke();
  }

  // Tile grout seams (256x256 tile grid)
  ctx.strokeStyle = 'rgba(140, 135, 128, 0.45)';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 1024; i += 256) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
}

function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Rich warm honey-walnut parquet
  ctx.fillStyle = '#6e4a2d';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankW = 128;
  const plankH = 32;

  for (let y = 0; y < 1024; y += plankH) {
    const shift = (Math.floor(y / plankH) % 2) * (plankW / 2);
    for (let x = -shift; x < 1024; x += plankW) {
      const shade = (Math.random() - 0.5) * 20;
      ctx.fillStyle = `rgb(${110 + shade}, ${74 + shade * 0.7}, ${45 + shade * 0.5})`;
      ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2);

      // Fine wood grain lines
      ctx.strokeStyle = 'rgba(50, 30, 15, 0.18)';
      ctx.lineWidth = 1;
      for (let g = 4; g < plankH - 4; g += 6) {
        ctx.beginPath();
        ctx.moveTo(x + 2, y + g);
        ctx.lineTo(x + plankW - 2, y + g + (Math.random() - 0.5) * 2);
        ctx.stroke();
      }
    }
  }

  // Grout / bevel border
  ctx.strokeStyle = 'rgba(35, 20, 10, 0.6)';
  ctx.lineWidth = 1.5;
  for (let y = 0; y <= 1024; y += plankH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
}

function createCinemaCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep dark indigo/slate acoustic carpet
  ctx.fillStyle = '#141622';
  ctx.fillRect(0, 0, 512, 512);

  // Micro carpet weave noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 1.2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle diamond acoustic weave pattern
  ctx.strokeStyle = 'rgba(70, 80, 120, 0.12)';
  ctx.lineWidth = 2;
  for (let d = -512; d < 1024; d += 64) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(d, 512);
    ctx.lineTo(d + 512, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
}

function createPlasterNormalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Neutral normal map base: RGB(128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const nx = (Math.random() - 0.5) * 16;
    const ny = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, 128 + nx));
    data[i + 1] = Math.min(255, Math.max(0, 128 + ny));
    data[i + 2] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createVelvetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep royal velvet: rich midnight wine / amethyst
  ctx.fillStyle = '#180e1a';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 35;
    data[i] = Math.min(255, Math.max(0, 38 + noise * 1.5));     // red tone
    data[i + 1] = Math.min(255, Math.max(0, 18 + noise * 0.8)); // green tone
    data[i + 2] = Math.min(255, Math.max(0, 32 + noise * 1.2)); // blue tone
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
}

function createStarryCeilingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep cosmic midnight
  ctx.fillStyle = '#06070e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft nebula clouds
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 100 + Math.random() * 200;
    const grad = ctx.createRadialGradient(x, y, 10, x, y, r);
    grad.addColorStop(0, Math.random() > 0.5 ? 'rgba(180, 130, 40, 0.12)' : 'rgba(120, 60, 150, 0.08)');
    grad.addColorStop(1, 'rgba(6, 7, 14, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparkling golden and white celestial stars
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const size = Math.random() < 0.9 ? Math.random() * 1.8 : 2.5 + Math.random() * 2.0;
    const alpha = 0.4 + Math.random() * 0.6;
    ctx.fillStyle = Math.random() > 0.3 ? `rgba(255, 235, 175, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class MuseumMaterials {
  constructor() {
    this.marbleTex = createMarbleTexture();
    this.marbleTex.repeat.set(6, 6);

    this.parquetTex = createParquetTexture();
    this.parquetTex.repeat.set(5, 5);

    this.carpetTex = createCinemaCarpetTexture();
    this.carpetTex.repeat.set(8, 8);

    this.velvetTex = createVelvetTexture();
    this.velvetTex.repeat.set(6, 6);

    this.starryTex = createStarryCeilingTexture();
    this.starryTex.repeat.set(2, 2);

    this.plasterNormal = createPlasterNormalTexture();
    this.plasterNormal.repeat.set(8, 4);

    this.initMaterials();
  }

  initMaterials() {
    // 1. Polished Marble (Rotunda Floor)
    this.marbleFloor = new THREE.MeshStandardMaterial({
      map: this.marbleTex,
      roughness: 0.15,
      metalness: 0.08
    });

    // 2. Parquet Hardwood (Gallery 1 & 2 Floors)
    this.parquetFloor = new THREE.MeshStandardMaterial({
      map: this.parquetTex,
      roughness: 0.35,
      metalness: 0.05
    });

    // 3. Cinema Carpet Floor
    this.cinemaCarpet = new THREE.MeshStandardMaterial({
      map: this.carpetTex,
      roughness: 0.9,
      metalness: 0.02
    });

    // 4. Gallery Plaster Wall
    this.galleryWall = new THREE.MeshStandardMaterial({
      color: 0xf5f3ed,
      roughness: 0.82,
      metalness: 0.02,
      normalMap: this.plasterNormal,
      normalScale: new THREE.Vector2(0.04, 0.04)
    });

    // 5. Rotunda Feature Wall
    this.rotundaWall = new THREE.MeshStandardMaterial({
      color: 0xf0ece2,
      roughness: 0.75,
      metalness: 0.04,
      normalMap: this.plasterNormal,
      normalScale: new THREE.Vector2(0.05, 0.05)
    });

    // 6. Cinema Acoustic Slat Wall
    this.cinemaWall = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.65,
      metalness: 0.15
    });

    // 7. Ceilings
    this.ceiling = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.95,
      metalness: 0.0
    });
    this.cinemaCeiling = new THREE.MeshStandardMaterial({
      color: 0x101118,
      roughness: 0.9,
      metalness: 0.05
    });

    // 8. Trims, Moldings & Baseboards
    this.whiteTrim = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.05
    });
    this.darkWoodTrim = new THREE.MeshStandardMaterial({
      color: 0x2b1c12,
      roughness: 0.5,
      metalness: 0.05
    });

    // 9. Frame Materials
    this.goldFrame = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.88
    });
    this.champagneFrame = new THREE.MeshStandardMaterial({
      color: 0xe6cd9b,
      roughness: 0.32,
      metalness: 0.75
    });
    this.walnutFrame = new THREE.MeshStandardMaterial({
      color: 0x361f12,
      roughness: 0.58,
      metalness: 0.04
    });
    this.frameMatte = new THREE.MeshStandardMaterial({
      color: 0xfbfaf6,
      roughness: 0.95,
      metalness: 0.0
    });
    this.frameGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });

    // 10. Brass Placard
    this.brassPlacard = new THREE.MeshStandardMaterial({
      color: 0xc89d3d,
      roughness: 0.3,
      metalness: 0.85
    });

    // 11. Benches
    this.leatherBench = new THREE.MeshStandardMaterial({
      color: 0x2a1e17,
      roughness: 0.45,
      metalness: 0.08
    });
    this.benchLegs = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8
    });

    // 12. Secret Memory Room Materials
    this.secretFloor = new THREE.MeshStandardMaterial({
      map: this.velvetTex,
      roughness: 0.88,
      metalness: 0.05
    });
    this.secretWall = new THREE.MeshStandardMaterial({
      color: 0x15121b,
      roughness: 0.72,
      metalness: 0.18,
      normalMap: this.plasterNormal,
      normalScale: new THREE.Vector2(0.04, 0.04)
    });
    this.secretCeiling = new THREE.MeshStandardMaterial({
      map: this.starryTex,
      roughness: 0.95,
      metalness: 0.0
    });
    this.crystalHeart = new THREE.MeshPhysicalMaterial({
      color: 0xffd9aa,
      emissive: 0xaa6622,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.75,
      ior: 1.6,
      transparent: true,
      opacity: 0.95
    });
    this.glowingGold = new THREE.MeshStandardMaterial({
      color: 0xf5d061,
      emissive: 0xd4af37,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.9
    });
  }
}
