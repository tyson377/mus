import * as THREE from 'three';

export class VideoScreen {
  constructor(scene, lighting) {
    this.scene = scene;
    this.lighting = lighting;
    this.mesh = null;
    this.videoElement = null;
    this.videoTexture = null;
    this.standbyTexture = null;
    this.standbyCanvas = null;
    this.standbyCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.8;
    this.currentVideoName = 'No Video Loaded';
    this.availableVideos = [];
    this.listeners = [];

    this.initVideoElement();
    this.initStandbyCanvas();
    this.build3DScreen();
    this.checkAvailableVideos();
  }

  initVideoElement() {
    this.videoElement = document.createElement('video');
    this.videoElement.crossOrigin = 'anonymous';
    this.videoElement.playsInline = true;
    this.videoElement.preload = 'metadata';
    this.videoElement.volume = this.volume;

    const onAspectReady = () => {
      this.updateScreenAspect();
      this.notifyState();
    };

    this.videoElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateScreenAspect();
      this.notifyState();
    });

    this.videoElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.videoElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.notifyTime();
    });

    this.videoElement.addEventListener('loadedmetadata', onAspectReady);
    this.videoElement.addEventListener('canplay', onAspectReady);
  }

  initStandbyCanvas() {
    this.standbyCanvas = document.createElement('canvas');
    this.standbyCanvas.width = 1920;
    this.standbyCanvas.height = 1080;
    this.standbyCtx = this.standbyCanvas.getContext('2d');
    this.drawStandbyScreen(0);

    this.standbyTexture = new THREE.CanvasTexture(this.standbyCanvas);
    this.standbyTexture.anisotropy = 16;
  }

  drawStandbyScreen(time = 0) {
    const ctx = this.standbyCtx;
    const w = 1920;
    const h = 1080;

    // Deep luxury dark gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0d18');
    grad.addColorStop(0.5, '#12172b');
    grad.addColorStop(1, '#080a12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle animated audio wave visualizer effect
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < w; x += 10) {
      const y = h / 2 + 180 + Math.sin(x * 0.012 + time * 2) * 25 * Math.sin(x * 0.003);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Cinema Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 72px "Cinzel", "Georgia", "Times New Roman", serif';
    ctx.fillText('DIVYA CINEMA THEATER', w / 2, 340);

    ctx.fillStyle = '#ffffff';
    ctx.font = '32px sans-serif';
    ctx.fillText('Dedicated High-Definition Memory Pavilion', w / 2, 420);

    // Decorative divider line
    const lineGrad = ctx.createLinearGradient(w / 2 - 300, 0, w / 2 + 300, 0);
    lineGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    lineGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.8)');
    lineGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(w / 2 - 300, 460, 600, 3);

    // Status & Prompt
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'italic 30px "Cinzel", "Georgia", serif';
    if (this.availableVideos.length > 0) {
      ctx.fillText(`Available Videos Detected: ${this.availableVideos.length}`, w / 2, 540);
      ctx.font = '24px sans-serif';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
      ctx.fillText('Click "Play" or select a video from the console below to begin', w / 2, 600);
    } else {
      ctx.fillText('Ready to Play Your Real Videos', w / 2, 540);
      ctx.font = '24px sans-serif';
      ctx.fillStyle = 'rgba(200, 215, 240, 0.85)';
      ctx.fillText('Place any .mp4 / .mov into the "videos" folder', w / 2, 600);
      ctx.fillText('or use the "Select Video" button on the player controls below', w / 2, 645);
    }

    if (this.standbyTexture) {
      this.standbyTexture.needsUpdate = true;
    }
  }

  build3DScreen() {
    this.mesh = new THREE.Group();

    const screenW = 8.6;
    const screenH = 4.8;
    this.maxScreenW = screenW;
    this.maxScreenH = screenH;
    const frameBorder = 0.22;
    const frameDepth = 0.25;

    // 1. Cinema Screen Outer Frame
    const frameGeo = new THREE.BoxGeometry(frameDepth, screenH + frameBorder * 2, screenW + frameBorder * 2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      roughness: 0.7,
      metalness: 0.3
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(-30.8, 2.9, 16);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    this.mesh.add(frameMesh);

    // 2. Beveled Gold Border Inlay
    const inlayGeo = new THREE.BoxGeometry(0.04, screenH + 0.12, screenW + 0.12);
    const inlayMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8
    });
    const inlayMesh = new THREE.Mesh(inlayGeo, inlayMat);
    inlayMesh.position.set(-30.66, 2.9, 16);
    this.mesh.add(inlayMesh);

    // 2b. Acoustic Matte-Black Screen Backing (Pillarbox/Letterbox foundation)
    const backGeo = new THREE.PlaneGeometry(screenW, screenH);
    const backMat = new THREE.MeshBasicMaterial({ color: 0x05060a });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.rotation.y = Math.PI / 2;
    backMesh.position.set(-30.65, 2.9, 16);
    this.mesh.add(backMesh);
    this.backMesh = backMesh;

    // 3. Screen Plane (Facing East toward the theater seats)
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    this.screenMaterial = new THREE.MeshBasicMaterial({
      map: this.standbyTexture
    });

    const screenMesh = new THREE.Mesh(screenGeo, this.screenMaterial);
    screenMesh.rotation.y = Math.PI / 2;
    screenMesh.position.set(-30.64, 2.9, 16);
    screenMesh.userData = {
      isCinemaScreen: true
    };
    this.mesh.add(screenMesh);
    this.screenMesh = screenMesh;

    // 4. Cinema Stage Platform underneath screen
    const stageGeo = new THREE.BoxGeometry(2.5, 0.3, 10.5);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      roughness: 0.8
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(-29.6, 0.15, 16);
    stageMesh.receiveShadow = true;
    this.mesh.add(stageMesh);

    this.scene.add(this.mesh);
  }

  updateScreenAspect(targetAspect) {
    if (!this.screenMesh) return;

    let aspect = targetAspect;
    if (!aspect) {
      if (this.videoElement && this.videoElement.videoWidth && this.videoElement.videoHeight) {
        aspect = this.videoElement.videoWidth / this.videoElement.videoHeight;
      } else {
        aspect = 9 / 16; // Natural portrait ratio for phone videos
      }
    }

    const maxW = this.maxScreenW || 8.6;
    const maxH = this.maxScreenH || 4.8;
    const maxAspect = maxW / maxH; // ~1.792

    let actualW, actualH;
    if (aspect <= maxAspect) {
      // Portrait or 4:3 video: fit full height, scale width proportionally
      actualH = maxH;
      actualW = Math.max(1.5, Math.min(maxW, maxH * aspect));
    } else {
      // Widescreen or ultrawide: fit full width, scale height proportionally
      actualW = maxW;
      actualH = Math.max(1.5, Math.min(maxH, maxW / aspect));
    }

    if (this.screenMesh.geometry) {
      this.screenMesh.geometry.dispose();
    }
    this.screenMesh.geometry = new THREE.PlaneGeometry(actualW, actualH);
  }

  async checkAvailableVideos() {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        this.availableVideos = data.videos || [];
        this.drawStandbyScreen(0);
        if (this.availableVideos.length > 0) {
          // Pre-load the first video but keep visualizer on screen until user starts playback
          this.loadVideo(this.availableVideos[0].url, this.availableVideos[0].name, false);
          this.screenMaterial.map = this.standbyTexture;
          this.screenMaterial.needsUpdate = true;
          this.updateScreenAspect(16 / 9);
        }
      }
    } catch (e) {
      console.warn('Could not query videos list:', e);
    }
    this.notifyState();
  }

  loadVideo(url, name, autoPlay = true) {
    this.currentVideoName = name || 'Divya Video';
    this.videoElement.src = url;
    this.videoElement.load();

    if (!this.videoTexture) {
      this.videoTexture = new THREE.VideoTexture(this.videoElement);
      this.videoTexture.colorSpace = THREE.SRGBColorSpace;
      this.videoTexture.minFilter = THREE.LinearFilter;
      this.videoTexture.magFilter = THREE.LinearFilter;
    }

    this.screenMaterial.map = this.videoTexture;
    this.screenMaterial.needsUpdate = true;
    this.updateScreenAspect();

    if (autoPlay) {
      this.play();
    } else {
      this.notifyState();
    }
  }

  loadLocalFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    this.loadVideo(url, file.name, true);
  }

  play() {
    if (!this.videoElement.src) {
      if (this.availableVideos.length > 0) {
        this.loadVideo(this.availableVideos[0].url, this.availableVideos[0].name, true);
        return;
      }
      return;
    }

    this.videoElement.play().then(() => {
      this.isPlaying = true;
      if (this.screenMaterial && this.videoTexture) {
        this.screenMaterial.map = this.videoTexture;
        this.screenMaterial.needsUpdate = true;
        this.updateScreenAspect();
      }
      if (this.lighting) {
        this.lighting.setScreenGlow(0x99ccff, 3.5);
      }
      this.notifyState();
    }).catch(err => {
      console.warn('Playback error (user interaction might be needed):', err);
    });
  }

  pause() {
    this.videoElement.pause();
    this.isPlaying = false;
    if (this.lighting) {
      this.lighting.setScreenGlow(0x557799, 1.2);
    }
    this.notifyState();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(percent) {
    if (this.videoElement.duration) {
      this.videoElement.currentTime = this.videoElement.duration * percent;
      this.notifyTime();
    }
  }

  seekRelative(deltaSeconds) {
    if (this.videoElement.duration) {
      this.videoElement.currentTime = Math.max(0, Math.min(this.videoElement.duration, this.videoElement.currentTime + deltaSeconds));
      this.notifyTime();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.videoElement.volume = this.volume;
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      this.videoElement.muted = false;
    }
    this.notifyState();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.videoElement.muted = this.isMuted;
    this.notifyState();
  }

  onStateChange(callback) {
    this.listeners.push(callback);
  }

  notifyState() {
    const state = {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTime: this.videoElement.currentTime || 0,
      duration: this.videoElement.duration || 0,
      currentVideoName: this.currentVideoName,
      availableVideos: this.availableVideos,
      hasSource: Boolean(this.videoElement.src)
    };
    this.listeners.forEach(cb => cb(state));
  }

  notifyTime() {
    const timeState = {
      currentTime: this.videoElement.currentTime || 0,
      duration: this.videoElement.duration || 0
    };
    this.listeners.forEach(cb => cb(timeState, 'time'));
  }

  update(time) {
    if (!this.isPlaying && this.standbyCanvas) {
      this.drawStandbyScreen(time);
    }
  }
}
