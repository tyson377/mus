import * as THREE from 'three';

function createDedicationWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Luxury Italian Dark Marble & Polished Obsidian Gradient
  const grad = ctx.createLinearGradient(0, 0, 2048, 1024);
  grad.addColorStop(0, '#0c0d12');
  grad.addColorStop(0.3, '#191b26');
  grad.addColorStop(0.7, '#141620');
  grad.addColorStop(1, '#0a0b10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Subtle marble veining
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    let cx = Math.random() * 2048;
    let cy = Math.random() * 1024;
    ctx.moveTo(cx, cy);
    for (let j = 0; j < 14; j++) {
      cx += (Math.random() - 0.45) * 180;
      cy += (Math.random() - 0.45) * 140;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Triple Gold Leaf Filigree Borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 1992, 968);

  ctx.strokeStyle = 'rgba(243, 229, 171, 0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(44, 44, 1960, 936);

  ctx.strokeStyle = '#aa820a';
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 56, 1936, 912);

  // Decorative Corner Rosettes
  const corners = [
    [56, 56], [1992, 56], [56, 968], [1992, 968]
  ];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Badge
  ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
  ctx.textAlign = 'center';
  ctx.font = '600 28px "Cinzel", "Georgia", serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('✦  SPECIAL PERMANENT DEDICATION  ✦', 1024, 170);

  // Museum Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px "Cinzel", "Georgia", "Times New Roman", serif';
  ctx.fillText('DIVYA MEMORY MUSEUM', 1024, 280);

  // Gold Divider Line
  const divGrad = ctx.createLinearGradient(424, 0, 1624, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.9)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(424, 340, 1200, 4);

  // MAIN DEDICATION QUOTE
  ctx.fillStyle = '#f3e5ab';
  ctx.font = 'italic 700 68px "Cinzel", "Georgia", "Times New Roman", serif';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
  ctx.shadowBlur = 24;
  ctx.fillText('“Every memory has a story.', 1024, 470);
  ctx.fillText('Every story has you.”', 1024, 570);
  ctx.shadowBlur = 0;

  // Subtitle & Curation Note
  ctx.fillStyle = '#d4af37';
  ctx.font = '500 32px "Cinzel", "Georgia", serif';
  ctx.fillText('A Sanctuary of Unfiltered Joy, Gentle Grace & Timeless Moments', 1024, 700);

  ctx.fillStyle = 'rgba(240, 235, 220, 0.7)';
  ctx.font = '24px "Inter", sans-serif';
  ctx.fillText('Preserved with eternal love and heartfelt gratitude • Est. 2026', 1024, 770);

  // Bottom Flourish
  ctx.font = '32px serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('⚜  ✦  ⚜', 1024, 860);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  return tex;
}

function createSecretMonumentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Midnight Obsidian & Warm Amber Gradient
  const grad = ctx.createLinearGradient(0, 0, 1536, 768);
  grad.addColorStop(0, '#0d0a14');
  grad.addColorStop(0.5, '#181224');
  grad.addColorStop(1, '#09070e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1536, 768);

  // Gold ornate border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 1496, 728);
  ctx.strokeStyle = 'rgba(243, 229, 171, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, 1468, 700);

  // Header Badge
  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Cinzel", "Georgia", serif';
  ctx.fillText('✦  THE SECRET SANCTUARY  ✦', 768, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px "Cinzel", "Georgia", serif';
  ctx.fillText('THE MOST PRECIOUS MEMORIES', 768, 205);

  // Divider
  const divGrad = ctx.createLinearGradient(300, 0, 1236, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.9)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(300, 245, 936, 3);

  // Emotional Special Message
  ctx.fillStyle = '#f3e5ab';
  ctx.font = 'italic 700 52px "Cinzel", "Georgia", serif';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
  ctx.shadowBlur = 20;
  ctx.fillText('“Some memories never fade.', 768, 360);
  ctx.fillText('They live forever in our hearts.”', 768, 445);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.fillStyle = '#e8cd9b';
  ctx.font = 'italic 26px "Cinzel", serif';
  ctx.fillText('Dedicated to the chapters that time can never diminish.', 768, 545);

  ctx.fillStyle = 'rgba(220, 210, 230, 0.7)';
  ctx.font = '20px "Inter", sans-serif';
  ctx.fillText('An eternal keepsake held close, through every sunrise and starlit night.', 768, 605);

  ctx.font = '30px serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('✦  ✦  ✦', 768, 675);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 16;
  return tex;
}

function createRoomSignTexture(roomName) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e1810';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#c59b37';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 112);

  ctx.fillStyle = '#f8eec7';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Cinzel", "Georgia", "Times New Roman", serif';
  ctx.fillText(roomName, 256, 75);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export class Architecture {
  constructor(materials) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.colliders = [];

    this.build();
  }

  addCollider(box) {
    this.colliders.push(box);
  }

  build() {
    this.buildFloors();
    this.buildCeilings();
    this.buildWalls();
    this.buildMoldingsAndTrims();
    this.buildDecorations();
  }

  buildFloors() {
    // 1. Rotunda Floor (Center: 0, 0, 16. Width: 18, Depth: 16)
    const rotundaFloorGeo = new THREE.PlaneGeometry(18, 16);
    const rotundaFloor = new THREE.Mesh(rotundaFloorGeo, this.materials.marbleFloor);
    rotundaFloor.rotation.x = -Math.PI / 2;
    rotundaFloor.position.set(0, 0, 16);
    rotundaFloor.receiveShadow = true;
    this.group.add(rotundaFloor);

    // 2. Gallery 1 Floor (Center: 0, 0, -4. Width: 16, Depth: 16)
    const g1FloorGeo = new THREE.PlaneGeometry(16, 16);
    const g1Floor = new THREE.Mesh(g1FloorGeo, this.materials.parquetFloor);
    g1Floor.rotation.x = -Math.PI / 2;
    g1Floor.position.set(0, 0, -4);
    g1Floor.receiveShadow = true;
    this.group.add(g1Floor);

    // 3. Gallery 2 Floor (Center: 22, 0, 16. Width: 18, Depth: 16)
    const g2FloorGeo = new THREE.PlaneGeometry(18, 16);
    const g2Floor = new THREE.Mesh(g2FloorGeo, this.materials.parquetFloor);
    g2Floor.rotation.x = -Math.PI / 2;
    g2Floor.position.set(22, 0, 16);
    g2Floor.receiveShadow = true;
    this.group.add(g2Floor);

    // 4. Cinema Floor (Center: -22, 0, 16. Width: 18, Depth: 16)
    const cinemaFloorGeo = new THREE.PlaneGeometry(18, 16);
    const cinemaFloor = new THREE.Mesh(cinemaFloorGeo, this.materials.cinemaCarpet);
    cinemaFloor.rotation.x = -Math.PI / 2;
    cinemaFloor.position.set(-22, 0, 16);
    cinemaFloor.receiveShadow = true;
    this.group.add(cinemaFloor);

    // 5. Secret Memory Room Floor (Center: 0, 0, -22. Width: 14, Depth: 14)
    const secretFloorGeo = new THREE.PlaneGeometry(14, 14);
    const secretFloor = new THREE.Mesh(secretFloorGeo, this.materials.secretFloor);
    secretFloor.rotation.x = -Math.PI / 2;
    secretFloor.position.set(0, 0.001, -22);
    secretFloor.receiveShadow = true;
    this.group.add(secretFloor);

    // Secret Room Connector Corridor Floor (Z: -12 to -15)
    const secretCorrFloorGeo = new THREE.PlaneGeometry(3.6, 3.2);
    const secretCorrFloor = new THREE.Mesh(secretCorrFloorGeo, this.materials.secretFloor);
    secretCorrFloor.rotation.x = -Math.PI / 2;
    secretCorrFloor.position.set(0, 0.001, -13.5);
    secretCorrFloor.receiveShadow = true;
    this.group.add(secretCorrFloor);

    // Hallway threshold connectors
    const threshNorthGeo = new THREE.PlaneGeometry(4.8, 8);
    const threshNorth = new THREE.Mesh(threshNorthGeo, this.materials.marbleFloor);
    threshNorth.rotation.x = -Math.PI / 2;
    threshNorth.position.set(0, 0.001, 6);
    threshNorth.receiveShadow = true;
    this.group.add(threshNorth);

    const threshEastGeo = new THREE.PlaneGeometry(8, 4.8);
    const threshEast = new THREE.Mesh(threshEastGeo, this.materials.marbleFloor);
    threshEast.rotation.x = -Math.PI / 2;
    threshEast.position.set(11, 0.001, 16);
    threshEast.receiveShadow = true;
    this.group.add(threshEast);

    const threshWestGeo = new THREE.PlaneGeometry(8, 4.8);
    const threshWest = new THREE.Mesh(threshWestGeo, this.materials.marbleFloor);
    threshWest.rotation.x = -Math.PI / 2;
    threshWest.position.set(-11, 0.001, 16);
    threshWest.receiveShadow = true;
    this.group.add(threshWest);
  }

  buildCeilings() {
    const H = 5.6;

    // Rotunda Ceiling
    const rotundaCeilGeo = new THREE.PlaneGeometry(18, 16);
    const rotundaCeil = new THREE.Mesh(rotundaCeilGeo, this.materials.ceiling);
    rotundaCeil.rotation.x = Math.PI / 2;
    rotundaCeil.position.set(0, H, 16);
    this.group.add(rotundaCeil);

    // Gallery 1 Ceiling
    const g1CeilGeo = new THREE.PlaneGeometry(16, 24);
    const g1Ceil = new THREE.Mesh(g1CeilGeo, this.materials.ceiling);
    g1Ceil.rotation.x = Math.PI / 2;
    g1Ceil.position.set(0, H, 0);
    this.group.add(g1Ceil);

    // Gallery 2 Ceiling
    const g2CeilGeo = new THREE.PlaneGeometry(24, 16);
    const g2Ceil = new THREE.Mesh(g2CeilGeo, this.materials.ceiling);
    g2Ceil.rotation.x = Math.PI / 2;
    g2Ceil.position.set(20, H, 16);
    this.group.add(g2Ceil);

    // Cinema Ceiling (Dark acoustic)
    const cinemaCeilGeo = new THREE.PlaneGeometry(24, 16);
    const cinemaCeil = new THREE.Mesh(cinemaCeilGeo, this.materials.cinemaCeiling);
    cinemaCeil.rotation.x = Math.PI / 2;
    cinemaCeil.position.set(-20, H, 16);
    this.group.add(cinemaCeil);

    // Secret Room Ceiling (Starry Celestial)
    const secretCeilGeo = new THREE.PlaneGeometry(14, 14);
    const secretCeil = new THREE.Mesh(secretCeilGeo, this.materials.secretCeiling);
    secretCeil.rotation.x = Math.PI / 2;
    secretCeil.position.set(0, H, -22);
    this.group.add(secretCeil);

    const secretCorrCeilGeo = new THREE.PlaneGeometry(3.6, 3.2);
    const secretCorrCeil = new THREE.Mesh(secretCorrCeilGeo, this.materials.secretCeiling);
    secretCorrCeil.rotation.x = Math.PI / 2;
    secretCorrCeil.position.set(0, H, -13.5);
    this.group.add(secretCorrCeil);
  }

  createWallSegment(w, h, d, x, y, z, mat = this.materials.galleryWall, hasCollider = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);

    if (hasCollider) {
      const halfW = w / 2;
      const halfH = h / 2;
      const halfD = d / 2;
      this.addCollider(new THREE.Box3(
        new THREE.Vector3(x - halfW, y - halfH, z - halfD),
        new THREE.Vector3(x + halfW, y + halfH, z + halfD)
      ));
    }
    return mesh;
  }

  buildWalls() {
    const H = 5.6;
    const Y = H / 2;
    const T = 0.5; // wall thickness

    // ==========================================
    // 1. ROTUNDA WALLS (Center: 0, 16. Bounds: X [-9, 9], Z [8, 24])
    // ==========================================
    // South Wall (Back of rotunda, has the Special Dedication Wall)
    this.createWallSegment(18.5, H, T, 0, Y, 24, this.materials.rotundaWall, true);

    // North Wall: Doorway to Gallery 1 (Opening from X: -2.4 to 2.4 at Z: 8)
    this.createWallSegment(6.6, H, T, -5.7, Y, 8, this.materials.rotundaWall, true);
    this.createWallSegment(6.6, H, T, 5.7, Y, 8, this.materials.rotundaWall, true);
    this.createWallSegment(4.8, 1.6, T, 0, H - 0.8, 8, this.materials.rotundaWall, false);

    // West Wall: Doorway to Cinema (Opening from Z: 13.6 to 18.4 at X: -9)
    this.createWallSegment(T, H, 5.6, -9, Y, 10.8, this.materials.rotundaWall, true);
    this.createWallSegment(T, H, 5.6, -9, Y, 21.2, this.materials.rotundaWall, true);
    this.createWallSegment(T, 1.6, 4.8, -9, H - 0.8, 16, this.materials.rotundaWall, false);

    // East Wall: Doorway to Gallery 2 (Opening from Z: 13.6 to 18.4 at X: 9)
    this.createWallSegment(T, H, 5.6, 9, Y, 10.8, this.materials.rotundaWall, true);
    this.createWallSegment(T, H, 5.6, 9, Y, 21.2, this.materials.rotundaWall, true);
    this.createWallSegment(T, 1.6, 4.8, 9, H - 0.8, 16, this.materials.rotundaWall, false);

    // Hallway Connector Side Walls
    this.createWallSegment(T, H, 4.0, -2.4 - T / 2, Y, 6, this.materials.galleryWall, true);
    this.createWallSegment(T, H, 4.0, 2.4 + T / 2, Y, 6, this.materials.galleryWall, true);

    this.createWallSegment(4.0, H, T, -11, Y, 13.6 - T / 2, this.materials.cinemaWall, true);
    this.createWallSegment(4.0, H, T, -11, Y, 18.4 + T / 2, this.materials.cinemaWall, true);

    this.createWallSegment(4.0, H, T, 11, Y, 13.6 - T / 2, this.materials.galleryWall, true);
    this.createWallSegment(4.0, H, T, 11, Y, 18.4 + T / 2, this.materials.galleryWall, true);

    // ==========================================
    // 2. GALLERY 1 (Center: 0, -4. Bounds: X [-8, 8], Z [-12, 4])
    // ==========================================
    // North Wall: Has the Secret Portal Opening (X: -1.7 to 1.7 at Z: -12)
    this.createWallSegment(6.5, H, T, -4.95, Y, -12, this.materials.galleryWall, true);
    this.createWallSegment(6.5, H, T, 4.95, Y, -12, this.materials.galleryWall, true);
    this.createWallSegment(3.6, 1.6, T, 0, H - 0.8, -12, this.materials.galleryWall, false);

    // West Wall
    this.createWallSegment(T, H, 16.5, -8, Y, -4, this.materials.galleryWall, true);
    // East Wall
    this.createWallSegment(T, H, 16.5, 8, Y, -4, this.materials.galleryWall, true);
    // South Wall connecting back to Rotunda
    this.createWallSegment(5.6, H, T, -5.2, Y, 4, this.materials.galleryWall, true);
    this.createWallSegment(5.6, H, T, 5.2, Y, 4, this.materials.galleryWall, true);
    this.createWallSegment(4.8, 1.6, T, 0, H - 0.8, 4, this.materials.galleryWall, false);

    // Corridor connecting Gallery 1 to Secret Room (Z: -12 to -15)
    this.createWallSegment(T, H, 3.2, -1.7 - T / 2, Y, -13.5, this.materials.galleryWall, true);
    this.createWallSegment(T, H, 3.2, 1.7 + T / 2, Y, -13.5, this.materials.galleryWall, true);

    // ==========================================
    // 3. SECRET MEMORY ROOM (Center: 0, -22. Bounds: X [-7, 7], Z [-29, -15])
    // ==========================================
    // South Wall of Secret Room (Opening from X: -1.7 to 1.7 at Z: -15)
    this.createWallSegment(5.3, H, T, -4.35, Y, -15, this.materials.secretWall, true);
    this.createWallSegment(5.3, H, T, 4.35, Y, -15, this.materials.secretWall, true);
    this.createWallSegment(3.6, 1.6, T, 0, H - 0.8, -15, this.materials.secretWall, false);

    // North Wall of Secret Room (Features the Emotional Dedication Monument)
    this.createWallSegment(14.5, H, T, 0, Y, -29, this.materials.secretWall, true);
    // West Wall of Secret Room
    this.createWallSegment(T, H, 14.5, -7, Y, -22, this.materials.secretWall, true);
    // East Wall of Secret Room
    this.createWallSegment(T, H, 14.5, 7, Y, -22, this.materials.secretWall, true);

    // ==========================================
    // 4. GALLERY 2 (Center: 22, 16. Bounds: X [13, 31], Z [8, 24])
    // ==========================================
    this.createWallSegment(18.5, H, T, 22, Y, 8, this.materials.galleryWall, true);
    this.createWallSegment(18.5, H, T, 22, Y, 24, this.materials.galleryWall, true);
    this.createWallSegment(T, H, 16.5, 31, Y, 16, this.materials.galleryWall, true);
    this.createWallSegment(T, H, 5.6, 13, Y, 10.8, this.materials.galleryWall, true);
    this.createWallSegment(T, H, 5.6, 13, Y, 21.2, this.materials.galleryWall, true);
    this.createWallSegment(T, 1.6, 4.8, 13, H - 0.8, 16, this.materials.galleryWall, false);

    // ==========================================
    // 5. THE CINEMA THEATER (Center: -22, 16. Bounds: X [-31, -13], Z [8, 24])
    // ==========================================
    this.createWallSegment(18.5, H, T, -22, Y, 8, this.materials.cinemaWall, true);
    this.createWallSegment(18.5, H, T, -22, Y, 24, this.materials.cinemaWall, true);
    this.createWallSegment(T, H, 16.5, -31, Y, 16, this.materials.cinemaWall, true);
    this.createWallSegment(T, H, 5.6, -13, Y, 10.8, this.materials.cinemaWall, true);
    this.createWallSegment(T, H, 5.6, -13, Y, 21.2, this.materials.cinemaWall, true);
    this.createWallSegment(T, 1.6, 4.8, -13, H - 0.8, 16, this.materials.cinemaWall, false);
  }

  buildMoldingsAndTrims() {
    const trimHeight = 0.22;
    const trimDepth = 0.08;

    const rotundaBaseGeo = new THREE.BoxGeometry(17.8, trimHeight, trimDepth);
    const rotundaBase = new THREE.Mesh(rotundaBaseGeo, this.materials.whiteTrim);
    rotundaBase.position.set(0, trimHeight / 2, 23.7);
    this.group.add(rotundaBase);

    const rotundaCrownGeo = new THREE.BoxGeometry(17.8, 0.25, 0.25);
    const rotundaCrown = new THREE.Mesh(rotundaCrownGeo, this.materials.whiteTrim);
    rotundaCrown.position.set(0, 5.45, 23.7);
    this.group.add(rotundaCrown);

    // Archway portal trims
    this.createArchwayTrim(0, 6, 4.4, 4.0, false); // Gallery 1 portal
    this.createArchwayTrim(11, 16, 4.4, 4.0, true); // Gallery 2 portal
    this.createArchwayTrim(-11, 16, 4.4, 4.0, true); // Cinema portal
    this.createArchwayTrim(0, -12, 3.4, 3.9, false); // Secret Room portal in Gallery 1
  }

  createArchwayTrim(x, z, width, height, isAlongX = false) {
    const postGeo = new THREE.BoxGeometry(0.3, height, 0.3);
    const lintelGeo = isAlongX
      ? new THREE.BoxGeometry(0.3, 0.35, width + 0.3)
      : new THREE.BoxGeometry(width + 0.3, 0.35, 0.3);

    const post1 = new THREE.Mesh(postGeo, this.materials.goldFrame);
    const post2 = new THREE.Mesh(postGeo, this.materials.goldFrame);
    const lintel = new THREE.Mesh(lintelGeo, this.materials.goldFrame);

    if (isAlongX) {
      post1.position.set(x, height / 2, z - width / 2);
      post2.position.set(x, height / 2, z + width / 2);
      lintel.position.set(x, height + 0.15, z);
    } else {
      post1.position.set(x - width / 2, height / 2, z);
      post2.position.set(x + width / 2, height / 2, z);
      lintel.position.set(x, height + 0.15, z);
    }

    this.group.add(post1);
    this.group.add(post2);
    this.group.add(lintel);
  }

  buildDecorations() {
    // ========================================================
    // 1. SPECIAL LUXURY GOLDEN DEDICATION WALL (Rotunda South Wall)
    // ========================================================
    const dedicationGeo = new THREE.PlaneGeometry(8.6, 4.0);
    const dedicationTex = createDedicationWallTexture();
    const dedicationMat = new THREE.MeshStandardMaterial({
      map: dedicationTex,
      roughness: 0.28,
      metalness: 0.65
    });
    const dedicationMesh = new THREE.Mesh(dedicationGeo, dedicationMat);
    dedicationMesh.position.set(0, 2.7, 23.7);
    this.group.add(dedicationMesh);

    // Sculpted Outer Beveled Gold Frame for Dedication Wall
    const frameGeo = new THREE.BoxGeometry(8.9, 4.3, 0.15);
    const frameMesh = new THREE.Mesh(frameGeo, this.materials.goldFrame);
    frameMesh.position.set(0, 2.7, 23.64);
    frameMesh.castShadow = true;
    this.group.add(frameMesh);

    // Golden decorative sconces flanking the dedication wall
    const sconceGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.6, 16);
    const sconceL = new THREE.Mesh(sconceGeo, this.materials.goldFrame);
    sconceL.position.set(-4.7, 2.7, 23.6);
    this.group.add(sconceL);

    const sconceR = new THREE.Mesh(sconceGeo, this.materials.goldFrame);
    sconceR.position.set(4.7, 2.7, 23.6);
    this.group.add(sconceR);

    // ========================================================
    // 2. CENTRAL ROTUNDA MONOGRAM & PEDESTAL
    // ========================================================
    const pedestalBaseGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.7, 32);
    const pedestalBase = new THREE.Mesh(pedestalBaseGeo, this.materials.marbleFloor);
    pedestalBase.position.set(0, 0.35, 18);
    pedestalBase.castShadow = true;
    pedestalBase.receiveShadow = true;
    this.group.add(pedestalBase);
    this.addCollider(new THREE.Box3(
      new THREE.Vector3(-1.2, 0, 16.8),
      new THREE.Vector3(1.2, 1.8, 19.2)
    ));

    const pedestalGoldGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.12, 32);
    const pedestalGold = new THREE.Mesh(pedestalGoldGeo, this.materials.goldFrame);
    pedestalGold.position.set(0, 0.75, 18);
    this.group.add(pedestalGold);

    const heartGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 64);
    const heartMesh = new THREE.Mesh(heartGeo, this.materials.goldFrame);
    heartMesh.position.set(0, 1.5, 18);
    heartMesh.rotation.y = Math.PI / 4;
    heartMesh.castShadow = true;
    this.group.add(heartMesh);

    // ========================================================
    // 3. ROOM SIGNS ABOVE PORTALS
    // ========================================================
    const g1SignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.6),
      new THREE.MeshStandardMaterial({ map: createRoomSignTexture('GALLERY 1: GOLDEN MOMENTS') })
    );
    g1SignMesh.position.set(0, 4.3, 7.7);
    this.group.add(g1SignMesh);

    const g2SignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.6),
      new THREE.MeshStandardMaterial({ map: createRoomSignTexture('GALLERY 2: ADVENTURES') })
    );
    g2SignMesh.rotation.y = -Math.PI / 2;
    g2SignMesh.position.set(8.7, 4.3, 16);
    this.group.add(g2SignMesh);

    const cinemaSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.6),
      new THREE.MeshStandardMaterial({ map: createRoomSignTexture('THE CINEMA THEATER') })
    );
    cinemaSignMesh.rotation.y = Math.PI / 2;
    cinemaSignMesh.position.set(-8.7, 4.3, 16);
    this.group.add(cinemaSignMesh);

    // Disguised portal sign above the Secret Room entrance in Gallery 1
    const secretPortalSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.55),
      new THREE.MeshStandardMaterial({ map: createRoomSignTexture('✦ THE MOST PRECIOUS MEMORIES ✦') })
    );
    secretPortalSignMesh.position.set(0, 4.25, -11.7);
    this.group.add(secretPortalSignMesh);

    // ========================================================
    // 4. SECRET MEMORY ROOM INTERIOR DECORATIONS
    // ========================================================
    // North Feature Monument Wall with Special Message
    const secMonGeo = new THREE.PlaneGeometry(7.6, 3.4);
    const secMonTex = createSecretMonumentTexture();
    const secMonMat = new THREE.MeshStandardMaterial({
      map: secMonTex,
      roughness: 0.3,
      metalness: 0.6
    });
    const secMonMesh = new THREE.Mesh(secMonGeo, secMonMat);
    secMonMesh.position.set(0, 2.7, -28.7);
    this.group.add(secMonMesh);

    const secFrameGeo = new THREE.BoxGeometry(7.9, 3.7, 0.12);
    const secFrame = new THREE.Mesh(secFrameGeo, this.materials.goldFrame);
    secFrame.position.set(0, 2.7, -28.75);
    this.group.add(secFrame);

    // Secret Room Centerpiece Pedestal & Glowing Crystal Heart
    const secPedGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 32);
    const secPed = new THREE.Mesh(secPedGeo, this.materials.marbleFloor);
    secPed.position.set(0, 0.35, -22);
    secPed.castShadow = true;
    secPed.receiveShadow = true;
    this.group.add(secPed);
    this.addCollider(new THREE.Box3(
      new THREE.Vector3(-1.3, 0, -23.3),
      new THREE.Vector3(1.3, 2.0, -20.7)
    ));

    const secGoldRingGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.12, 32);
    const secGoldRing = new THREE.Mesh(secGoldRingGeo, this.materials.goldFrame);
    secGoldRing.position.set(0, 0.75, -22);
    this.group.add(secGoldRing);

    // Glowing Rotating Crystal Heart Sculpture
    const crystalGeo = new THREE.TorusGeometry(0.65, 0.18, 16, 64);
    this.crystalHeartMesh = new THREE.Mesh(crystalGeo, this.materials.crystalHeart);
    this.crystalHeartMesh.position.set(0, 1.6, -22);
    this.crystalHeartMesh.rotation.y = Math.PI / 4;
    this.crystalHeartMesh.castShadow = true;
    this.group.add(this.crystalHeartMesh);

    // Secret Room Viewing Benches
    this.createGalleryBench(-4.6, -22, Math.PI / 2);
    this.createGalleryBench(4.6, -22, -Math.PI / 2);

    // Gallery viewing benches (positioned gracefully on sides, keeping all pathways clear)
    this.createGalleryBench(-4.2, -5, Math.PI / 2); // Gallery 1 West bench
    this.createGalleryBench(4.2, -5, -Math.PI / 2); // Gallery 1 East bench
    this.createGalleryBench(22, 12.5, 0); // Gallery 2 viewing bench

    // Cinema Lounge Chairs
    this.createCinemaSeating(-22, 16);
  }

  createGalleryBench(x, z, rotY = 0) {
    const benchGroup = new THREE.Group();

    const cushionGeo = new THREE.BoxGeometry(2.6, 0.28, 0.95);
    const cushion = new THREE.Mesh(cushionGeo, this.materials.leatherBench);
    cushion.position.y = 0.52;
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    benchGroup.add(cushion);

    const legGeo = new THREE.BoxGeometry(0.08, 0.45, 0.85);
    const leg1 = new THREE.Mesh(legGeo, this.materials.benchLegs);
    leg1.position.set(-1.05, 0.22, 0);
    leg1.castShadow = true;
    const leg2 = new THREE.Mesh(legGeo, this.materials.benchLegs);
    leg2.position.set(1.05, 0.22, 0);
    leg2.castShadow = true;
    benchGroup.add(leg1);
    benchGroup.add(leg2);

    benchGroup.position.set(x, 0, z);
    benchGroup.rotation.y = rotY;
    this.group.add(benchGroup);

    this.addCollider(new THREE.Box3(
      new THREE.Vector3(x - 1.4, 0, z - 0.6),
      new THREE.Vector3(x + 1.4, 1.2, z + 0.6)
    ));
  }

  createCinemaSeating(x, z) {
    const rows = [z - 3.2, z + 3.2];
    rows.forEach((rowZ) => {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 5.5),
        this.materials.leatherBench
      );
      bench.position.set(x + 3.5, 0.4, rowZ);
      bench.castShadow = true;
      this.group.add(bench);

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.65, 5.5),
        this.materials.leatherBench
      );
      back.position.set(x + 4.0, 0.8, rowZ);
      back.castShadow = true;
      this.group.add(back);

      this.addCollider(new THREE.Box3(
        new THREE.Vector3(x + 2.8, 0, rowZ - 2.8),
        new THREE.Vector3(x + 4.2, 1.4, rowZ + 2.8)
      ));
    });
  }
}
