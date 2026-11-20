import * as THREE from 'three';

function createPlacardTexture(title, date) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Brushed brass gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, '#c59b37');
  grad.addColorStop(0.5, '#e8c973');
  grad.addColorStop(1, '#b38728');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  // Border inlay
  ctx.strokeStyle = 'rgba(70, 45, 10, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 112);

  // Text
  ctx.fillStyle = '#1e1408';
  ctx.textAlign = 'center';
  ctx.font = 'bold 30px "Cinzel", "Georgia", "Times New Roman", serif';
  ctx.fillText(title, 256, 56);

  ctx.font = 'italic 20px "Cinzel", "Georgia", "Times New Roman", serif';
  ctx.fillStyle = '#3a2510';
  ctx.fillText(date, 256, 94);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

export class ArtFrame {
  constructor(photoData, materials, textureLoader) {
    this.data = photoData;
    this.materials = materials;
    this.textureLoader = textureLoader;
    this.mesh = new THREE.Group();
    this.spotLight = null;

    this.build();
  }

  build() {
    const { id, src, title, date, aspectRatio, frameStyle, position, rotation } = this.data;

    // Standard art height in meters, calculate width from aspect ratio
    // If portrait (aspect < 1), standard height is 2.2m. If landscape, standard width is 2.4m
    let photoW, photoH;
    if (aspectRatio < 1) {
      photoH = 1.9;
      photoW = photoH * aspectRatio;
    } else {
      photoW = 2.4;
      photoH = photoW / aspectRatio;
    }

    // Border and mat sizes
    const matBorder = 0.12;
    const frameBorder = 0.10;
    const frameDepth = 0.08;

    const totalW = photoW + (matBorder + frameBorder) * 2;
    const totalH = photoH + (matBorder + frameBorder) * 2;

    // Pick frame material
    let frameMat = this.materials.goldFrame;
    if (frameStyle === 'walnut') frameMat = this.materials.walnutFrame;
    if (frameStyle === 'champagne') frameMat = this.materials.champagneFrame;

    // 1. Outer Frame (Box frame with beveled front)
    const frameGeo = new THREE.BoxGeometry(totalW, totalH, frameDepth);
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    this.mesh.add(frameMesh);

    // 2. White Mat Board (Passe-partout)
    const matGeo = new THREE.PlaneGeometry(photoW + matBorder * 2, photoH + matBorder * 2);
    const matMesh = new THREE.Mesh(matGeo, this.materials.frameMatte);
    matMesh.position.z = frameDepth / 2 + 0.002;
    this.mesh.add(matMesh);

    // 3. Photo Canvas
    const photoGeo = new THREE.PlaneGeometry(photoW, photoH);
    const photoMat = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.02
    });

    // Load actual photo
    this.textureLoader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 16;
        photoMat.map = texture;
        photoMat.needsUpdate = true;

        if (texture.image && texture.image.width && texture.image.height) {
          const naturalAspect = texture.image.width / texture.image.height;
          const currentAspect = photoW / photoH;
          if (Math.abs(naturalAspect - currentAspect) > 0.03) {
            photoMesh.scale.x = naturalAspect / currentAspect;
          }
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load photo texture:', src, err);
      }
    );

    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.position.z = frameDepth / 2 + 0.005;
    // Tag for raycasting
    photoMesh.userData = {
      isArtwork: true,
      data: this.data
    };
    this.mesh.add(photoMesh);
    this.interactionTarget = photoMesh;

    // 4. Glass cover plane
    const glassGeo = new THREE.PlaneGeometry(photoW + matBorder * 2, photoH + matBorder * 2);
    const glassMesh = new THREE.Mesh(glassGeo, this.materials.frameGlass);
    glassMesh.position.z = frameDepth / 2 + 0.008;
    this.mesh.add(glassMesh);

    // 5. Brass Placard below the frame
    const placardW = Math.min(0.65, totalW * 0.7);
    const placardH = 0.16;
    const placardGeo = new THREE.BoxGeometry(placardW, placardH, 0.02);
    const placardTex = createPlacardTexture(title, date);
    const placardMat = new THREE.MeshStandardMaterial({
      map: placardTex,
      roughness: 0.3,
      metalness: 0.8
    });
    const placardMesh = new THREE.Mesh(placardGeo, placardMat);
    placardMesh.position.set(0, -totalH / 2 - 0.14, 0.01);
    this.mesh.add(placardMesh);

    // 6. Overhead Gallery Wall Lamp Fixture
    const lampArmGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
    const lampArm = new THREE.Mesh(lampArmGeo, frameMat);
    lampArm.rotation.x = Math.PI / 2;
    lampArm.position.set(0, totalH / 2 + 0.22, 0.2);
    this.mesh.add(lampArm);

    const lampShadeGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.35, 12);
    const lampShade = new THREE.Mesh(lampShadeGeo, frameMat);
    lampShade.rotation.z = Math.PI / 2;
    lampShade.position.set(0, totalH / 2 + 0.22, 0.4);
    this.mesh.add(lampShade);

    // 7. Dedicated Warm Art Spotlight
    const spot = new THREE.SpotLight(0xfff3e0, 3.2, 5.0, Math.PI / 4, 0.45, 1.2);
    spot.position.set(0, totalH / 2 + 0.35, 0.65);
    spot.target = photoMesh;
    spot.castShadow = false;
    this.mesh.add(spot);
    this.mesh.add(spot.target);
    this.spotLight = spot;

    // Apply world transform
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  }
}
