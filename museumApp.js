/**
 * Divya Memory Museum - Unified Interactive Controller
 * Powers the Museum Exhibition Wings (All 58 Exhibits: 42 Photos + 16 Videos),
 * Exhibit Lightbox with Auto-Tour Slideshow, Confetti Engine, and Ambience.
 */

import {
  MEMORY_PHOTOS,
  MEMORY_VIDEOS,
  ALL_MUSEUM_EXHIBITS,
  MUSEUM_ROOMS,
  MUSEUM_INFO
} from './src/config/memoryData.js';

// ==========================================================================
// 1. Confetti Engine (High Performance Canvas Particles)
// ==========================================================================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  burst(originX = 0.5, originY = 0.65, count = 100) {
    const colors = [
      '#f5d061', '#ffd700', '#ff9a9e', '#fecfef',
      '#a1c4fd', '#c2e9fb', '#ff6b6b', '#feca57',
      '#48dbfb', '#ff9ff3', '#ffffff'
    ];

    const startX = originX * this.width;
    const startY = originY * this.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 18;
      const isStar = Math.random() > 0.8;
      const isHeart = Math.random() > 0.85;

      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: (Math.sin(angle) * velocity) - (Math.random() * 10 + 6),
        gravity: 0.38 + Math.random() * 0.15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.007 + Math.random() * 0.008,
        shape: isHeart ? 'heart' : (isStar ? 'star' : 'rect')
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  grandCelebration() {
    this.burst(0.5, 0.65, 120);
    setTimeout(() => this.burst(0.15, 0.75, 90), 200);
    setTimeout(() => this.burst(0.85, 0.75, 90), 400);
    setTimeout(() => this.burst(0.5, 0.5, 140), 700);
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawHeart(x, y, size, color) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(0, topCurveHeight);
    this.ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.3);
    this.ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    this.ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'star') {
        this.drawStar(0, 0, 5, p.size, p.size / 2, p.color);
      } else if (p.shape === 'heart') {
        this.drawHeart(0, 0, p.size, p.color);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// ==========================================================================
// 2. Ambient Audio Player (Soft Piano Harmonies)
// ==========================================================================
class AmbientAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.playNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }

  playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.4);

    const delay = 400 + Math.random() * 800;
    this.timer = setTimeout(() => this.playNextNote(), delay);
  }
}

// ==========================================================================
// 3. Master Museum Exhibition Controller
// ==========================================================================
export class MuseumExhibitionManager {
  constructor() {
    this.allExhibits = ALL_MUSEUM_EXHIBITS;
    this.photoExhibits = MEMORY_PHOTOS;
    this.videoExhibits = MEMORY_VIDEOS;
    this.currentExhibitIndex = 0;
    this.isTourActive = false;
    this.tourInterval = null;
    this.tourDuration = 5000; // ms
    this.tourProgressTimer = null;

    this.confetti = new ConfettiEngine('confetti-canvas');
    this.audioPlayer = new AmbientAudioPlayer();

    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupExhibitionWings();
    this.setupExhibitLightbox();
    this.setupCelebrationSection();
    this.setupKeyboardShortcuts();
  }

  setupNavigation() {
    const nav = document.querySelector('.museum-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }

    const audioBtn = document.getElementById('nav-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const active = this.audioPlayer.toggle();
        audioBtn.classList.toggle('active', active);
        audioBtn.setAttribute('title', active ? 'Mute Music' : 'Play Celebration Melody');
      });
    }

    const startTourBtn = document.getElementById('nav-start-tour');
    if (startTourBtn) {
      startTourBtn.addEventListener('click', () => {
        this.openLightbox(0, true);
      });
    }

    const heroTourBtn = document.getElementById('hero-start-tour');
    if (heroTourBtn) {
      heroTourBtn.addEventListener('click', () => {
        this.openLightbox(0, true);
      });
    }
  }

  setupExhibitionWings() {
    const wingsContainer = document.getElementById('museum-exhibits-grid');
    const filterButtons = document.querySelectorAll('.wing-tab-btn');

    if (!wingsContainer) return;

    this.renderExhibits(this.allExhibits);

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.wing;
        let filtered = this.allExhibits;
        if (filter === 'photos') filtered = this.photoExhibits;
        if (filter === 'videos') filtered = this.videoExhibits;

        this.renderExhibits(filtered);
      });
    });
  }

  renderExhibits(items) {
    const grid = document.getElementById('museum-exhibits-grid');
    grid.innerHTML = '';

    items.forEach(item => {
      const globalIndex = this.allExhibits.findIndex(e => e.id === item.id);
      const card = document.createElement('div');
      card.className = `museum-exhibit-card type-${item.type} frame-${item.frameStyle || 'gold'}`;
      card.dataset.index = globalIndex;

      if (item.type === 'photo') {
        card.innerHTML = `
          <!-- Museum Wall Overhead Spotlight Fixture -->
          <div class="exhibit-lamp-arm"></div>
          <div class="exhibit-spotlight-glow"></div>

          <!-- Gilded / Walnut / Champagne Exhibit Frame -->
          <div class="exhibit-frame-moulding">
            <div class="exhibit-passepartout">
              <div class="exhibit-canvas-wrapper">
                <span class="exhibit-catalog-tag">${item.catalogNumber}</span>
                <img class="exhibit-img" src="${item.url}" alt="${item.title}" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Authentic Brass Museum Placard -->
          <div class="exhibit-placard">
            <div class="placard-border">
              <div class="placard-top">
                <span class="placard-wing">${item.wing}</span>
                <span class="placard-num">${item.catalogNumber}</span>
              </div>
              <h4 class="placard-title">${item.title}</h4>
              <p class="placard-caption">${item.caption}</p>
              <div class="placard-footer">
                <span class="placard-date">✦ ${item.date}</span>
                <span class="placard-action">Click to Inspect &rarr;</span>
              </div>
            </div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <!-- Motion Screening Screen / Kiosk -->
          <div class="exhibit-lamp-arm" style="background: linear-gradient(to right, #48dbfb, #f5d061);"></div>
          <div class="exhibit-spotlight-glow" style="background: radial-gradient(circle, rgba(72, 219, 251, 0.25) 0%, transparent 70%);"></div>

          <div class="exhibit-frame-moulding motion-display">
            <div class="exhibit-passepartout motion-screen-bezel">
              <div class="exhibit-canvas-wrapper motion-screen">
                <span class="exhibit-catalog-tag" style="background: rgba(245, 208, 97, 0.9); color: #000;">${item.catalogNumber}</span>
                <video class="exhibit-video" src="${item.url}" preload="metadata" muted playsinline loop></video>
                <div class="motion-play-overlay">
                  <div class="motion-play-btn">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Brass Placard for Motion Exhibit -->
          <div class="exhibit-placard">
            <div class="placard-border motion-placard">
              <div class="placard-top">
                <span class="placard-wing">Wing II: The Video Screening Room</span>
                <span class="placard-num">${item.catalogNumber}</span>
              </div>
              <h4 class="placard-title">${item.title}</h4>
              <p class="placard-caption">${item.caption}</p>
              <div class="placard-footer">
                <span class="placard-date">🎬 Video Moment • ${item.date}</span>
                <span class="placard-action" style="color: #f5d061;">Click to Watch with Sound &rarr;</span>
              </div>
            </div>
          </div>
        `;

        // Video hover preview
        const videoEl = card.querySelector('video');
        card.addEventListener('mouseenter', () => {
          if (videoEl && videoEl.paused) videoEl.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
          if (videoEl && !videoEl.paused) {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        });
      }

      card.addEventListener('click', () => {
        this.openLightbox(globalIndex);
      });

      grid.appendChild(card);
    });
  }

  // ========================================================================
  // Exhibit Lightbox & Guided Auto-Tour
  // ========================================================================
  setupExhibitLightbox() {
    this.modal = document.getElementById('museum-lightbox-modal');
    this.stage = document.getElementById('lightbox-media-mount');
    this.counter = document.getElementById('lightbox-catalog-counter');
    this.titleEl = document.getElementById('lightbox-exhibit-title');
    this.captionEl = document.getElementById('lightbox-exhibit-caption');
    this.wingEl = document.getElementById('lightbox-exhibit-wing');
    this.filmstrip = document.getElementById('lightbox-filmstrip-strip');
    this.progressBar = document.getElementById('tour-progress-bar');
    this.tourBtn = document.getElementById('btn-tour-toggle');

    const closeBtn = document.getElementById('btn-lightbox-close');
    const prevBtn = document.getElementById('btn-stage-prev');
    const nextBtn = document.getElementById('btn-stage-next');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateLightbox(1));

    if (this.tourBtn) {
      this.tourBtn.addEventListener('click', () => this.toggleTour());
    }

    // Populate filmstrip
    if (this.filmstrip) {
      this.filmstrip.innerHTML = '';
      this.allExhibits.forEach((item, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `filmstrip-item ${item.type}`;
        thumb.dataset.index = idx;
        if (item.type === 'photo') {
          thumb.innerHTML = `<img src="${item.url}" alt="${item.title}" loading="lazy"/>`;
        } else {
          thumb.innerHTML = `
            <video src="${item.url}" preload="metadata" muted></video>
            <span class="film-play-badge">▶</span>
          `;
        }
        thumb.addEventListener('click', () => this.openLightbox(idx));
        this.filmstrip.appendChild(thumb);
      });
    }
  }

  openLightbox(index, startTour = false) {
    this.currentExhibitIndex = index;
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    this.renderLightboxExhibit();

    if (startTour) {
      this.startTour();
    } else {
      this.stopTour();
    }
  }

  closeLightbox() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    this.stopTour();

    const video = this.stage.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
  }

  renderLightboxExhibit() {
    const item = this.allExhibits[this.currentExhibitIndex];
    if (!item || !this.stage) return;

    if (this.counter) {
      this.counter.innerHTML = `
        <span class="catalog-badge">${item.catalogNumber}</span>
        <span class="catalog-total">${this.currentExhibitIndex + 1} of ${this.allExhibits.length} Exhibits</span>
      `;
    }

    if (this.titleEl) this.titleEl.textContent = item.title;
    if (this.captionEl) this.captionEl.textContent = item.caption;
    if (this.wingEl) this.wingEl.textContent = item.wing;

    // Filmstrip active highlight
    if (this.filmstrip) {
      Array.from(this.filmstrip.children).forEach((thumb, i) => {
        thumb.classList.toggle('active', i === this.currentExhibitIndex);
      });
      const activeThumb = this.filmstrip.children[this.currentExhibitIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    this.stage.innerHTML = '';

    if (item.type === 'photo') {
      const img = document.createElement('img');
      img.className = 'lightbox-photo-view';
      img.src = item.url;
      img.alt = item.title;
      this.stage.appendChild(img);

      if (this.isTourActive) {
        this.startTourItemTimer(this.tourDuration);
      }
    } else {
      const video = document.createElement('video');
      video.className = 'lightbox-video-view';
      video.src = item.url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;

      video.addEventListener('ended', () => {
        if (this.isTourActive) {
          this.navigateLightbox(1);
        }
      });

      this.stage.appendChild(video);

      if (this.isTourActive) {
        this.progressBar.style.width = '100%';
      }
    }
  }

  navigateLightbox(dir) {
    this.currentExhibitIndex = (this.currentExhibitIndex + dir + this.allExhibits.length) % this.allExhibits.length;
    this.renderLightboxExhibit();
  }

  toggleTour() {
    if (this.isTourActive) {
      this.stopTour();
    } else {
      this.startTour();
    }
  }

  startTour() {
    this.isTourActive = true;
    if (this.tourBtn) {
      this.tourBtn.classList.add('tour-active');
      this.tourBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        Pause Tour
      `;
    }
    this.renderLightboxExhibit();
  }

  stopTour() {
    this.isTourActive = false;
    if (this.tourInterval) clearInterval(this.tourInterval);
    if (this.tourProgressTimer) clearInterval(this.tourProgressTimer);
    if (this.progressBar) this.progressBar.style.width = '0%';

    if (this.tourBtn) {
      this.tourBtn.classList.remove('tour-active');
      this.tourBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Auto-Tour Slideshow
      `;
    }
  }

  startTourItemTimer(duration) {
    if (this.tourProgressTimer) clearInterval(this.tourProgressTimer);
    if (this.tourInterval) clearTimeout(this.tourInterval);

    const startTime = Date.now();
    this.tourProgressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (this.progressBar) this.progressBar.style.width = `${pct}%`;

      if (pct >= 100) {
        clearInterval(this.tourProgressTimer);
      }
    }, 50);

    this.tourInterval = setTimeout(() => {
      if (this.isTourActive) {
        this.navigateLightbox(1);
      }
    }, duration);
  }

  setupCelebrationSection() {
    const confettiBtn = document.getElementById('btn-celebrate-confetti');
    if (confettiBtn) {
      confettiBtn.addEventListener('click', () => {
        this.confetti.grandCelebration();
      });
    }

    const navConfettiBtn = document.getElementById('nav-celebrate-btn');
    if (navConfettiBtn) {
      navConfettiBtn.addEventListener('click', () => {
        this.confetti.grandCelebration();
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigateLightbox(1);
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        const video = this.stage.querySelector('video');
        if (video) {
          if (video.paused) video.play();
          else video.pause();
        } else {
          this.toggleTour();
        }
      }
    });
  }
}

// Instantiate
window.addEventListener('DOMContentLoaded', () => {
  window.museumManager = new MuseumExhibitionManager();
});
