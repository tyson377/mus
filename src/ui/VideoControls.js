function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export class VideoControlsUI {
  constructor(videoScreen, container) {
    this.videoScreen = videoScreen;
    this.container = container;
    this.isVisible = false;
    this.isDraggingSeek = false;

    this.createElements();
    this.initListeners();

    // Subscribe to videoScreen state updates
    this.videoScreen.onStateChange((state, type) => {
      if (type === 'time') {
        this.updateTimeDisplay(state.currentTime, state.duration);
      } else {
        this.updateStateDisplay(state);
      }
    });
  }

  createElements() {
    this.root = document.createElement('div');
    this.root.id = 'cinema-controls-dock';
    this.root.className = 'cinema-controls-dock hidden';
    this.root.innerHTML = `
      <div class="dock-panel">
        <!-- Top Status Bar -->
        <div class="dock-header">
          <div class="theater-badge">
            <span class="pulse-led"></span>
            <span class="theater-title">DIVYA CINEMA THEATER</span>
          </div>
          <div id="dock-video-name" class="now-playing-title">No Video Loaded</div>
          <div class="dock-tools">
            <label class="select-file-btn" title="Pick an actual video from your computer">
              📁 Select Video File
              <input type="file" id="local-video-file-input" accept="video/*" style="display:none;" />
            </label>
            <select id="video-select-dropdown" class="video-dropdown" title="Choose from videos folder">
              <option value="">(No folder videos)</option>
            </select>
          </div>
        </div>

        <!-- Progress / Timeline Bar -->
        <div class="timeline-row">
          <span id="current-time-text" class="time-label">00:00</span>
          <div class="seek-container" id="seek-container">
            <div class="seek-bar-bg">
              <div id="seek-bar-fill" class="seek-bar-fill"></div>
              <div id="seek-handle" class="seek-handle"></div>
            </div>
          </div>
          <span id="duration-time-text" class="time-label">00:00</span>
        </div>

        <!-- Button Controls Row -->
        <div class="controls-row">
          <div class="btn-group-left">
            <button id="skip-back-btn" class="ctrl-btn" title="Rewind 10s">⏪ 10s</button>
            <button id="play-pause-btn" class="ctrl-btn play-btn" title="Play/Pause">
              <span id="play-icon">▶</span>
            </button>
            <button id="skip-fwd-btn" class="ctrl-btn" title="Fast Forward 10s">⏩ 10s</button>
          </div>

          <div class="btn-group-right">
            <!-- Volume Control -->
            <button id="mute-btn" class="ctrl-btn mute-btn" title="Mute/Unmute">🔊</button>
            <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.05" value="0.8" title="Volume" />
            
            <!-- Fullscreen Button -->
            <button id="cinema-fullscreen-btn" class="ctrl-btn" title="Fullscreen Theater View">⛶ Fullscreen</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.root);

    this.videoNameEl = this.root.querySelector('#dock-video-name');
    this.playPauseBtn = this.root.querySelector('#play-pause-btn');
    this.playIcon = this.root.querySelector('#play-icon');
    this.skipBackBtn = this.root.querySelector('#skip-back-btn');
    this.skipFwdBtn = this.root.querySelector('#skip-fwd-btn');
    this.muteBtn = this.root.querySelector('#mute-btn');
    this.volumeSlider = this.root.querySelector('#volume-slider');
    this.currentTimeEl = this.root.querySelector('#current-time-text');
    this.durationEl = this.root.querySelector('#duration-time-text');
    this.seekContainer = this.root.querySelector('#seek-container');
    this.seekFill = this.root.querySelector('#seek-bar-fill');
    this.seekHandle = this.root.querySelector('#seek-handle');
    this.fileInput = this.root.querySelector('#local-video-file-input');
    this.dropdown = this.root.querySelector('#video-select-dropdown');
    this.fullscreenBtn = this.root.querySelector('#cinema-fullscreen-btn');
  }

  initListeners() {
    this.playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.videoScreen.togglePlay();
    });

    this.skipBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.videoScreen.seekRelative(-10);
    });

    this.skipFwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.videoScreen.seekRelative(10);
    });

    this.muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.videoScreen.toggleMute();
    });

    this.volumeSlider.addEventListener('input', (e) => {
      this.videoScreen.setVolume(parseFloat(e.target.value));
    });

    // File input picker for user's real videos
    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.videoScreen.loadLocalFile(file);
      }
    });

    // Folder video dropdown
    this.dropdown.addEventListener('change', (e) => {
      const url = e.target.value;
      if (url) {
        const item = this.videoScreen.availableVideos.find(v => v.url === url);
        this.videoScreen.loadVideo(url, item ? item.name : 'Divya Video', true);
      }
    });

    // Scrubbing on seek container
    const handleSeek = (e) => {
      const rect = this.seekContainer.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const percent = clickX / rect.width;
      this.videoScreen.seek(percent);
    };

    this.seekContainer.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.isDraggingSeek = true;
      handleSeek(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingSeek) {
        handleSeek(e);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingSeek = false;
    });

    // Fullscreen video toggle
    this.fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.videoScreen.videoElement) {
        if (this.videoScreen.videoElement.requestFullscreen) {
          this.videoScreen.videoElement.requestFullscreen();
        }
      }
    });
  }

  show() {
    if (!this.isVisible) {
      this.root.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hide() {
    if (this.isVisible) {
      this.root.classList.add('hidden');
      this.isVisible = false;
    }
  }

  updateStateDisplay(state) {
    this.videoNameEl.textContent = state.currentVideoName;
    this.playIcon.textContent = state.isPlaying ? '❚❚' : '▶';

    if (state.isMuted) {
      this.muteBtn.textContent = '🔇';
    } else {
      this.muteBtn.textContent = state.volume > 0.5 ? '🔊' : (state.volume > 0 ? '🔉' : '🔈');
    }
    this.volumeSlider.value = state.isMuted ? 0 : state.volume;

    // Update available videos dropdown
    if (state.availableVideos && state.availableVideos.length > 0) {
      this.dropdown.innerHTML = state.availableVideos.map(v => `
        <option value="${v.url}">${v.name}</option>
      `).join('');
    } else {
      this.dropdown.innerHTML = `<option value="">(Drop .mp4 into videos/)</option>`;
    }

    this.updateTimeDisplay(state.currentTime, state.duration);
  }

  updateTimeDisplay(currentTime, duration) {
    if (this.isDraggingSeek) return;

    this.currentTimeEl.textContent = formatTime(currentTime);
    this.durationEl.textContent = formatTime(duration);

    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
    this.seekFill.style.width = `${percent}%`;
    this.seekHandle.style.left = `${percent}%`;
  }
}
