export class Lightbox {
  constructor(allPhotos, onOpen, onClose) {
    this.photos = allPhotos;
    this.currentIndex = 0;
    this.isOpen = false;
    this.onOpen = onOpen;
    this.onClose = onClose;

    this.createElements();
    this.initListeners();
  }

  createElements() {
    this.root = document.createElement('div');
    this.root.id = 'museum-lightbox';
    this.root.className = 'museum-lightbox hidden';
    this.root.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-container">
        <!-- Close button -->
        <button id="lightbox-close" class="lightbox-close" title="Close (ESC)">✕</button>

        <!-- Navigation Buttons -->
        <button id="lightbox-prev" class="lightbox-nav-btn prev" title="Previous Photo (←)">‹</button>
        <button id="lightbox-next" class="lightbox-nav-btn next" title="Next Photo (→)">›</button>

        <div class="lightbox-card">
          <div class="lightbox-image-wrapper">
            <img id="lightbox-img" src="" alt="Memory Photo" />
          </div>

          <div class="lightbox-details">
            <div class="lightbox-header">
              <span id="lightbox-wing" class="wing-tag">Gallery 1</span>
              <span id="lightbox-index" class="index-tag">Artwork 1 of 13</span>
            </div>

            <h2 id="lightbox-title" class="artwork-title">Grace in Simplicity</h2>
            <div id="lightbox-date" class="artwork-date">Cherished Moment</div>

            <p id="lightbox-caption" class="artwork-caption">
              A quiet, heartfelt moment that captures your timeless poise and natural grace.
            </p>

            <div class="lightbox-footer">
              <span class="museum-curator-note">✦ Divya Memory Collection ✦</span>
              <button id="lightbox-done-btn" class="done-btn">Back to Walk</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.root);

    this.backdrop = this.root.querySelector('.lightbox-backdrop');
    this.closeBtn = this.root.querySelector('#lightbox-close');
    this.prevBtn = this.root.querySelector('#lightbox-prev');
    this.nextBtn = this.root.querySelector('#lightbox-next');
    this.doneBtn = this.root.querySelector('#lightbox-done-btn');

    this.imgEl = this.root.querySelector('#lightbox-img');
    this.wingEl = this.root.querySelector('#lightbox-wing');
    this.indexEl = this.root.querySelector('#lightbox-index');
    this.titleEl = this.root.querySelector('#lightbox-title');
    this.dateEl = this.root.querySelector('#lightbox-date');
    this.captionEl = this.root.querySelector('#lightbox-caption');
  }

  initListeners() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.doneBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());

    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigate(-1);
    });

    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigate(1);
    });

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      }
    });
  }

  open(photoData) {
    if (!photoData) return;
    if (window.museumManager && typeof window.museumManager.openLightbox === 'function') {
      const gIdx = window.museumManager.allExhibits.findIndex(e => e.id === photoData.id || e.filename === photoData.filename);
      if (gIdx !== -1) {
        if (this.onOpen) this.onOpen();
        window.museumManager.openLightbox(gIdx);
        return;
      }
    }

    const idx = this.photos.findIndex(p => p.id === photoData.id);
    this.currentIndex = idx !== -1 ? idx : 0;
    this.updateContent();

    this.root.classList.remove('hidden');
    this.isOpen = true;

    if (this.onOpen) this.onOpen();
  }

  close() {
    if (!this.isOpen) return;
    this.root.classList.add('hidden');
    this.isOpen = false;

    if (this.onClose) this.onClose();
  }

  navigate(dir) {
    this.currentIndex = (this.currentIndex + dir + this.photos.length) % this.photos.length;
    this.updateContent();
  }

  updateContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    this.imgEl.src = photo.src;
    this.wingEl.textContent = photo.wing || 'Museum Collection';
    this.indexEl.textContent = `Artwork ${this.currentIndex + 1} of ${this.photos.length}`;
    this.titleEl.textContent = photo.title;
    this.dateEl.textContent = photo.date;
    this.captionEl.textContent = photo.caption;
  }
}
