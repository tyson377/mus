/**
 * Divya Birthday Tribute & Memory Gallery - Core Interactive Controller
 * Powers the Hero Reel, Spotlight Carousel, Filterable Masonry Grid,
 * Fullscreen Lightbox with Auto-Slideshow, and Confetti Engine.
 */

import {
  SPOTLIGHT_PHOTOS,
  HERO_VIDEOS,
  ALL_PHOTOS,
  ALL_VIDEOS,
  ALL_MEDIA,
  BIRTHDAY_INFO
} from './src/config/galleryData.js';

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
    // Cannon from left, right, and center
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
// 2. Ambient Sparkling Dust Particles
// ==========================================================================
class AmbientParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = Math.floor(this.width / 24);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.01;
      p.alpha = Math.max(0.1, Math.min(0.85, p.alpha));

      if (p.y < -10) p.y = this.height + 10;
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.fillStyle = `rgba(245, 208, 97, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================================================
// 3. Gentle Ambient Synthesizer (Optional Web Audio Melodies)
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

    // Celebratory pentatonic scale frequencies (C, D, E, G, A in octaves 4 & 5)
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
// 4. Main Gallery Application Controller
// ==========================================================================
class GalleryApp {
  constructor() {
    this.allMedia = ALL_MEDIA;
    this.activeFilter = 'all';
    this.currentLightboxIndex = 0;
    this.isSlideshowActive = false;
    this.slideshowInterval = null;
    this.slideshowDuration = 4500; // ms
    this.slideshowProgress = 0;
    this.slideshowProgressTimer = null;

    this.confetti = new ConfettiEngine('confetti-canvas');
    this.ambientParticles = new AmbientParticles('bg-canvas');
    this.audioPlayer = new AmbientAudioPlayer();

    this.init();
  }

  init() {
    this.setupTopNav();
    this.setupHeroReel();
    this.setupSpotlightCarousel();
    this.setupMasonryGallery();
    this.setupLightbox();
    this.setupBirthdayWish();
    this.setupKeyboardShortcuts();
  }

  // --- Top Navigation & Audio ---
  setupTopNav() {
    const nav = document.querySelector('.top-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    const musicBtn = document.getElementById('btn-toggle-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const active = this.audioPlayer.toggle();
        musicBtn.innerHTML = active
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>`;
        musicBtn.setAttribute('title', active ? 'Mute Music' : 'Play Celebration Melody');
      });
    }

    const launchSlideshowBtn = document.getElementById('nav-launch-slideshow');
    if (launchSlideshowBtn) {
      launchSlideshowBtn.addEventListener('click', () => {
        this.openLightbox(0, true);
      });
    }
  }

  // --- Hero Video Reel (Alternates between 2 videos smoothly) ---
  setupHeroReel() {
    const video1 = document.getElementById('hero-reel-1');
    const video2 = document.getElementById('hero-reel-2');
    const heroSlideshowBtn = document.getElementById('hero-launch-slideshow');

    if (heroSlideshowBtn) {
      heroSlideshowBtn.addEventListener('click', () => {
        this.openLightbox(0, true);
      });
    }

    if (!video1 || !video2) return;

    // Load URLs from HERO_VIDEOS
    if (HERO_VIDEOS[0]) video1.src = HERO_VIDEOS[0].url;
    if (HERO_VIDEOS[1]) video2.src = HERO_VIDEOS[1].url;

    video1.play().catch(() => {});

    let activeVideo = video1;
    let standbyVideo = video2;

    const crossfadeToStandby = () => {
      standbyVideo.currentTime = 0;
      standbyVideo.play().then(() => {
        standbyVideo.classList.remove('standby');
        standbyVideo.classList.add('active');

        activeVideo.classList.remove('active');
        activeVideo.classList.add('standby');

        const temp = activeVideo;
        activeVideo = standbyVideo;
        standbyVideo = temp;
      }).catch(() => {});
    };

    video1.addEventListener('ended', crossfadeToStandby);
    video2.addEventListener('ended', crossfadeToStandby);

    // Safety fallback: swap every 12 seconds if videos don't emit ended
    setInterval(() => {
      if (activeVideo.duration && activeVideo.currentTime >= (activeVideo.duration - 1)) {
        crossfadeToStandby();
      }
    }, 4000);
  }

  // --- Featured Spotlight Carousel (5 Top High-Res Photos) ---
  setupSpotlightCarousel() {
    const track = document.getElementById('spotlight-track');
    const prevBtn = document.getElementById('spotlight-prev');
    const nextBtn = document.getElementById('spotlight-next');
    const dotsContainer = document.getElementById('spotlight-dots');

    if (!track) return;

    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    SPOTLIGHT_PHOTOS.forEach((photo, idx) => {
      // Find global index in ALL_MEDIA
      const globalIndex = this.allMedia.findIndex(m => m.filename === photo.filename);

      const card = document.createElement('div');
      card.className = 'spotlight-card';
      card.innerHTML = `
        <div class="spotlight-media-wrap">
          <span class="spotlight-badge">★ SPOTLIGHT #${idx + 1}</span>
          <img class="spotlight-img" src="${photo.url}" alt="${photo.title}" loading="lazy" />
          <div class="spotlight-overlay">
            <h3 class="spotlight-title">${photo.title}</h3>
            <p class="spotlight-caption">${photo.caption}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.openLightbox(globalIndex >= 0 ? globalIndex : 0);
      });

      track.appendChild(card);

      const dot = document.createElement('div');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.scrollToSpotlightIndex(idx));
      dotsContainer.appendChild(dot);
    });

    let currentSlide = 0;
    const maxSlides = SPOTLIGHT_PHOTOS.length;

    this.scrollToSpotlightIndex = (index) => {
      currentSlide = Math.max(0, Math.min(index, maxSlides - 1));
      const card = track.children[currentSlide];
      if (card) {
        const offset = card.offsetLeft - track.offsetLeft;
        track.style.transform = `translateX(-${offset}px)`;
      }

      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = currentSlide === 0 ? maxSlides - 1 : currentSlide - 1;
        this.scrollToSpotlightIndex(prev);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (currentSlide + 1) % maxSlides;
        this.scrollToSpotlightIndex(next);
      });
    }
  }

  // --- Filterable Masonry Gallery ---
  setupMasonryGallery() {
    const galleryContainer = document.getElementById('masonry-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!galleryContainer) return;

    this.renderMasonryItems(this.allMedia);

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        this.activeFilter = filter;

        let filtered = this.allMedia;
        if (filter === 'photo') filtered = ALL_PHOTOS;
        if (filter === 'video') filtered = ALL_VIDEOS;

        this.renderMasonryItems(filtered);
      });
    });
  }

  renderMasonryItems(items) {
    const galleryContainer = document.getElementById('masonry-container');
    galleryContainer.innerHTML = '';

    items.forEach((item) => {
      const globalIndex = this.allMedia.findIndex(m => m.filename === item.filename);
      const card = document.createElement('div');
      card.className = `masonry-item item-type-${item.type}`;
      card.dataset.index = globalIndex;

      if (item.type === 'photo') {
        card.innerHTML = `
          <div class="masonry-media-wrap">
            <span class="item-badge-type">PHOTO</span>
            <img class="masonry-img" src="${item.url}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="masonry-info">
            <h4 class="item-title">${item.title}</h4>
            <p class="item-caption">${item.caption}</p>
            <div class="item-date">✦ ${item.date}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="masonry-media-wrap">
            <span class="item-badge-type" style="border-color: #f5d061; color: #f5d061;">🎬 VIDEO</span>
            <video class="masonry-video" src="${item.url}" preload="metadata" muted playsinline loop></video>
            <div class="video-play-overlay">
              <div class="play-icon-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="masonry-info">
            <h4 class="item-title">${item.title}</h4>
            <p class="item-caption">${item.caption}</p>
            <div class="item-date">🎬 Video Moment • ${item.date}</div>
          </div>
        `;

        // Smooth video preview on mouse hover
        const videoEl = card.querySelector('video');
        card.addEventListener('mouseenter', () => {
          if (videoEl && videoEl.paused) {
            videoEl.play().catch(() => {});
          }
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

      galleryContainer.appendChild(card);
    });
  }

  // --- Fullscreen Lightbox & Auto-Slideshow ---
  setupLightbox() {
    this.modal = document.getElementById('lightbox-modal');
    this.stage = document.getElementById('lightbox-media-container');
    this.counter = document.getElementById('lightbox-counter');
    this.titleEl = document.getElementById('lightbox-title');
    this.captionEl = document.getElementById('lightbox-caption');
    this.filmstrip = document.getElementById('lightbox-filmstrip');
    this.progressBar = document.getElementById('slideshow-progress-bar');
    this.slideshowToggleBtn = document.getElementById('btn-lightbox-slideshow');

    const closeBtn = document.getElementById('btn-lightbox-close');
    const prevBtn = document.getElementById('stage-prev-btn');
    const nextBtn = document.getElementById('stage-next-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateLightbox(1));

    if (this.slideshowToggleBtn) {
      this.slideshowToggleBtn.addEventListener('click', () => {
        this.toggleSlideshow();
      });
    }

    // Populate bottom filmstrip thumbnails once
    if (this.filmstrip) {
      this.filmstrip.innerHTML = '';
      this.allMedia.forEach((item, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'filmstrip-thumb';
        thumb.dataset.index = idx;
        if (item.type === 'photo') {
          thumb.innerHTML = `<img src="${item.url}" alt="${item.title}" loading="lazy"/>`;
        } else {
          thumb.innerHTML = `<video src="${item.url}" preload="metadata" muted></video>`;
        }
        thumb.addEventListener('click', () => this.openLightbox(idx));
        this.filmstrip.appendChild(thumb);
      });
    }
  }

  openLightbox(index, startSlideshow = false) {
    this.currentLightboxIndex = index;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.renderLightboxItem();

    if (startSlideshow) {
      this.startSlideshow();
    } else {
      this.stopSlideshow();
    }
  }

  closeLightbox() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.stopSlideshow();

    // Pause any playing lightbox video
    const video = this.stage.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
  }

  renderLightboxItem() {
    const item = this.allMedia[this.currentLightboxIndex];
    if (!item) return;

    this.counter.textContent = `${this.currentLightboxIndex + 1} / ${this.allMedia.length}`;
    this.titleEl.textContent = item.title;
    this.captionEl.textContent = item.caption;

    // Highlight filmstrip thumbnail
    if (this.filmstrip) {
      Array.from(this.filmstrip.children).forEach((thumb, i) => {
        thumb.classList.toggle('active', i === this.currentLightboxIndex);
      });
      const activeThumb = this.filmstrip.children[this.currentLightboxIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // Clean previous media
    this.stage.innerHTML = '';

    if (item.type === 'photo') {
      const img = document.createElement('img');
      img.className = 'lightbox-photo';
      img.src = item.url;
      img.alt = item.title;
      this.stage.appendChild(img);

      if (this.isSlideshowActive) {
        this.startItemTimer(this.slideshowDuration);
      }
    } else {
      const video = document.createElement('video');
      video.className = 'lightbox-video';
      video.src = item.url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;

      video.addEventListener('ended', () => {
        if (this.isSlideshowActive) {
          this.navigateLightbox(1);
        }
      });

      this.stage.appendChild(video);

      if (this.isSlideshowActive) {
        // Wait for video duration or advance when done
        this.progressBar.style.width = '100%';
      }
    }
  }

  navigateLightbox(direction) {
    this.currentLightboxIndex = (this.currentLightboxIndex + direction + this.allMedia.length) % this.allMedia.length;
    this.renderLightboxItem();
  }

  toggleSlideshow() {
    if (this.isSlideshowActive) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  startSlideshow() {
    this.isSlideshowActive = true;
    if (this.slideshowToggleBtn) {
      this.slideshowToggleBtn.classList.add('slideshow-active');
      this.slideshowToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        Pause Slideshow
      `;
    }
    this.renderLightboxItem();
  }

  stopSlideshow() {
    this.isSlideshowActive = false;
    if (this.slideshowInterval) clearInterval(this.slideshowInterval);
    if (this.slideshowProgressTimer) clearInterval(this.slideshowProgressTimer);
    if (this.progressBar) this.progressBar.style.width = '0%';

    if (this.slideshowToggleBtn) {
      this.slideshowToggleBtn.classList.remove('slideshow-active');
      this.slideshowToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Play Slideshow
      `;
    }
  }

  startItemTimer(duration) {
    if (this.slideshowProgressTimer) clearInterval(this.slideshowProgressTimer);
    if (this.slideshowInterval) clearTimeout(this.slideshowInterval);

    const startTime = Date.now();
    this.slideshowProgressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (this.progressBar) this.progressBar.style.width = `${pct}%`;

      if (pct >= 100) {
        clearInterval(this.slideshowProgressTimer);
      }
    }, 50);

    this.slideshowInterval = setTimeout(() => {
      if (this.isSlideshowActive) {
        this.navigateLightbox(1);
      }
    }, duration);
  }

  // --- Confetti & Birthday Wish ---
  setupBirthdayWish() {
    const confettiBtn = document.getElementById('btn-celebrate-confetti');
    if (confettiBtn) {
      confettiBtn.addEventListener('click', () => {
        this.confetti.grandCelebration();
      });
    }

    // Trigger welcoming confetti burst on page load
    setTimeout(() => {
      this.confetti.burst(0.5, 0.4, 60);
    }, 1200);
  }

  // --- Keyboard Shortcuts (Arrow Keys, ESC, Space) ---
  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;

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
          this.toggleSlideshow();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          this.modal.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new GalleryApp();
});
