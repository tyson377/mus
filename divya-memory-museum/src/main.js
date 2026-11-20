import * as THREE from 'three';
import { MEMORY_PHOTOS, MUSEUM_ROOMS } from './config/memoryData.js';
import { MuseumMaterials } from './world/Materials.js';
import { Architecture } from './world/Architecture.js';
import { Lighting } from './world/Lighting.js';
import { ArtFrame } from './world/ArtFrame.js';
import { VideoScreen } from './media/VideoScreen.js';
import { FPSControls } from './core/Controls.js';
import { HUD } from './ui/HUD.js';
import { Lightbox } from './ui/Lightbox.js';
import { VideoControlsUI } from './ui/VideoControls.js';

class DivyaMuseumApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();
    this.artFrames = [];
    this.hoveredObject = null;

    this.initEngine();
    this.initWorld();
    this.initUI();
    this.initRaycasting();
    this.animate();
  }

  initEngine() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1017);
    this.scene.fog = new THREE.FogExp2(0x0e1017, 0.015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      68,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // 3. Renderer with high-end PBR settings
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Resize listener
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initWorld() {
    this.textureLoader = new THREE.TextureLoader();

    // 1. Materials
    this.materials = new MuseumMaterials();

    // 2. Architecture & Collisions
    this.architecture = new Architecture(this.materials);
    this.scene.add(this.architecture.group);

    // 3. Lighting System
    this.lighting = new Lighting(this.scene);

    // 4. Video Pavilion (Cinema Wing)
    this.videoScreen = new VideoScreen(this.scene, this.lighting);

    // 5. 13 Art Frames (Galleries 1 & 2)
    this.interactionTargets = [];
    MEMORY_PHOTOS.forEach((photoData) => {
      const frame = new ArtFrame(photoData, this.materials, this.textureLoader);
      this.scene.add(frame.mesh);
      this.artFrames.push(frame);
      if (frame.interactionTarget) {
        this.interactionTargets.push(frame.interactionTarget);
      }
    });

    // Add cinema screen to interaction targets
    if (this.videoScreen.screenMesh) {
      this.interactionTargets.push(this.videoScreen.screenMesh);
    }

    // 6. First Person Walking Controls
    this.controls = new FPSControls(this.camera, this.renderer.domElement, this.architecture);
  }

  initUI() {
    // 1. HUD (Crosshair, Prompts, Room Badge, Controls hint) - Mounted to 3D hero walkthrough
    this.hud = new HUD(document.getElementById('3d-walkthrough') || document.body);

    // 2. High-res Photo Lightbox
    this.lightbox = new Lightbox(
      MEMORY_PHOTOS,
      () => {
        // Pause walking controls and unlock mouse while viewing lightbox
        this.controls.enabled = false;
        this.controls.unlock();
      },
      () => {
        // Resume walking controls
        this.controls.enabled = true;
        this.controls.lock();
      }
    );

    // 3. Cinema Video Controls Dock
    this.videoControls = new VideoControlsUI(this.videoScreen, document.body);

    // Enter Museum Button trigger with multi-event and keyboard fallback
    const handleEnter = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.hud.hideStartScreen();
      this.controls.enabled = true;
      try {
        this.controls.lock();
      } catch (err) {
        console.warn('Pointer lock error:', err);
      }
    };

    if (this.hud.enterBtn) {
      this.hud.enterBtn.addEventListener('click', handleEnter);
      this.hud.enterBtn.addEventListener('pointerdown', handleEnter);
    }

    if (this.hud.clickToStart) {
      this.hud.clickToStart.addEventListener('click', (e) => {
        handleEnter(e);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        const startScreen = document.getElementById('click-to-start');
        if (startScreen && startScreen.style.display !== 'none') {
          handleEnter(e);
        }
      }
    });

    // Keyboard 'E' interaction
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE') {
        this.handleInteraction();
      }
    });

    // Click canvas interaction
    this.renderer.domElement.addEventListener('click', () => {
      if (this.controls.isLocked) {
        this.handleInteraction();
      }
    });
  }

  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 5.2; // Maximum interaction reach in meters
    this.centerScreen = new THREE.Vector2(0, 0); // Center of screen
  }

  handleInteraction() {
    if (!this.hoveredObject) return;

    if (this.hoveredObject.userData && this.hoveredObject.userData.isArtwork) {
      if (this.hud && this.hud.playChime) this.hud.playChime();
      this.lightbox.open(this.hoveredObject.userData.data);
    } else if (this.hoveredObject.userData && this.hoveredObject.userData.isCinemaScreen) {
      this.videoControls.show();
      this.videoScreen.togglePlay();
    }
  }

  updateRaycasting() {
    this.raycaster.setFromCamera(this.centerScreen, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactionTargets, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.hoveredObject = hit;

      if (hit.userData && hit.userData.isArtwork) {
        this.hud.showPrompt(hit.userData.data.title, false);
      } else if (hit.userData && hit.userData.isCinemaScreen) {
        this.hud.showPrompt('Cinema Screen', true);
      }
    } else {
      this.hoveredObject = null;
      this.hud.hidePrompt();
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // Update Controls
    this.controls.update(delta);

    // Update Room Indicator
    const currentRoom = this.controls.getCurrentRoom();
    this.hud.setRoom(currentRoom);

    // Show or hide cinema controls based on location or interaction
    if (currentRoom === 'The Cinema Theater' || (this.hoveredObject && this.hoveredObject.userData.isCinemaScreen)) {
      this.videoControls.show();
    } else {
      this.videoControls.hide();
    }

    // Raycast interaction from camera reticle
    this.updateRaycasting();

    // Update Video standby animations
    this.videoScreen.update(time);

    // Update ambient lighting motes & atmospheric effects
    if (this.lighting && this.lighting.update) {
      this.lighting.update(time);
    }

    // Animate rotating crystal heart in Secret Memory Room
    if (this.architecture && this.architecture.crystalHeartMesh) {
      this.architecture.crystalHeartMesh.rotation.y = time * 0.45;
      this.architecture.crystalHeartMesh.rotation.x = Math.sin(time * 0.3) * 0.15;
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Start museum application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new DivyaMuseumApp();
});
