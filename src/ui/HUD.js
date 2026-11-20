export class HUD {
  constructor(container) {
    this.container = container;
    this.promptVisible = false;
    this.currentRoom = '';

    this.createElements();
  }

  createElements() {
    this.hudRoot = document.createElement('div');
    this.hudRoot.id = 'museum-hud';
    this.hudRoot.innerHTML = `
      <!-- Crosshair -->
      <div id="crosshair" class="crosshair">
        <div class="dot"></div>
      </div>

      <!-- Interaction Prompt -->
      <div id="interact-prompt" class="interact-prompt hidden">
        <div class="key-badge">E</div>
        <div class="prompt-text">
          <span class="action">Inspect Artwork</span>
          <span id="prompt-target" class="target-name">Radiant Smile</span>
        </div>
      </div>

      <!-- Current Room Indicator -->
      <div id="room-indicator" class="room-indicator">
        <span class="icon">🏛️</span>
        <span id="room-name">The Grand Rotunda</span>
      </div>

      <!-- Room Transition Toast Banner -->
      <div id="room-toast" class="room-toast hidden">
        <span id="toast-title" class="toast-title">The Grand Rotunda</span>
      </div>

      <!-- Quick Control Guide -->
      <div id="control-guide" class="control-guide">
        <div class="guide-item"><span class="k">W</span><span class="k">A</span><span class="k">S</span><span class="k">D</span> Walk</div>
        <div class="guide-item"><span class="k">Shift</span> Sprint</div>
        <div class="guide-item"><span class="k">Mouse</span> Look</div>
        <div class="guide-item"><span class="k">E / Click</span> Inspect</div>
      </div>

      <!-- Ambient Music Toggle -->
      <button id="ambient-audio-btn" class="ambient-audio-btn" title="Toggle Museum Ambience">
        <span class="audio-icon">🎵</span>
        <span class="audio-label">Music: Soft Piano</span>
      </button>

      <!-- Welcome Overlay / Click to Start -->
      <div id="click-to-start" class="click-to-start">
        <div class="start-card">
          <div class="museum-badge">MEMORIAL & CELEBRATION</div>
          <h1>Divya Memory Museum</h1>
          <p class="subtitle">An Immersive 3D Walkthrough of Timeless Memories</p>
          <div class="start-features">
            <div class="feat">🖼️ <strong>42 Framed Artworks</strong> across the grand gallery wings</div>
            <div class="feat">🎬 <strong>16 Motion Exhibits</strong> in The Cinema Screening Room</div>
            <div class="feat">🏛️ <strong>Special Dedication Wall</strong> in glowing gold & black marble</div>
            <div class="feat">✨ <strong>Secret Sanctuary</strong>: "The Most Precious Memories"</div>
          </div>
          <button id="enter-museum-btn" class="enter-btn">Click to Enter the Museum</button>
          <div class="hint">Use Mouse to Look • WASD to Walk • Click photos to inspect</div>
        </div>
      </div>
    `;

    this.container.appendChild(this.hudRoot);

    this.crosshair = this.hudRoot.querySelector('#crosshair');
    this.promptEl = this.hudRoot.querySelector('#interact-prompt');
    this.promptTarget = this.hudRoot.querySelector('#prompt-target');
    this.roomNameEl = this.hudRoot.querySelector('#room-name');
    this.roomToast = this.hudRoot.querySelector('#room-toast');
    this.toastTitle = this.hudRoot.querySelector('#toast-title');
    this.clickToStart = this.hudRoot.querySelector('#click-to-start');
    this.enterBtn = this.hudRoot.querySelector('#enter-museum-btn');
    this.audioBtn = this.hudRoot.querySelector('#ambient-audio-btn');
    this.audioLabel = this.hudRoot.querySelector('.audio-label');

    this.initAudioAmbience();
  }

  showPrompt(title, isCinema = false) {
    if (!this.promptVisible) {
      this.promptEl.classList.remove('hidden');
      this.crosshair.classList.add('active');
      this.promptVisible = true;
    }
    if (isCinema) {
      this.promptTarget.innerHTML = `<strong>The Cinema Theater</strong> (Watch Video)`;
      this.promptEl.querySelector('.action').textContent = 'Open Video Controls';
    } else {
      this.promptTarget.textContent = title || 'Artwork';
      this.promptEl.querySelector('.action').textContent = 'Inspect Artwork';
    }
  }

  hidePrompt() {
    if (this.promptVisible) {
      this.promptEl.classList.add('hidden');
      this.crosshair.classList.remove('active');
      this.promptVisible = false;
    }
  }

  setRoom(name) {
    if (this.currentRoom !== name) {
      this.currentRoom = name;
      let icon = '🏛️';
      if (name.includes('Secret') || name.includes('Precious')) icon = '✨';
      else if (name.includes('Gallery')) icon = '🖼️';
      else if (name.includes('Cinema')) icon = '🎬';

      this.roomNameEl.innerHTML = `<span class="icon">${icon}</span> ${name}`;
      this.showRoomToast(name, icon);
    }
  }

  showRoomToast(name, icon) {
    if (!this.roomToast) return;
    this.toastTitle.innerHTML = `${icon} Entered: <strong>${name}</strong>`;
    this.roomToast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.roomToast.classList.add('hidden');
    }, 2800);
  }

  hideStartScreen() {
    this.clickToStart.classList.add('fade-out');
    this.clickToStart.style.pointerEvents = 'none';
    setTimeout(() => {
      this.clickToStart.style.display = 'none';
      if (this.clickToStart.parentNode) {
        this.clickToStart.parentNode.removeChild(this.clickToStart);
      }
    }, 350);
  }

  showStartScreen() {
    this.clickToStart.style.display = 'flex';
    this.clickToStart.classList.remove('fade-out');
  }

  playChime() {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [659.25, 987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    } catch (e) {
      // Audio context might be suspended
    }
  }

  initAudioAmbience() {
    // Rich Procedural Web Audio Synthesizer: Soft grand piano arpeggios + warm string pad
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    let arpeggioTimer = null;
    let currentChordIndex = 0;

    // Poetic, emotional chord progressions (Cmaj9, Am9, Fmaj9, Gsus4)
    const chordProgressions = [
      { bass: 130.81, notes: [261.63, 329.63, 392.00, 493.88, 587.33] }, // Cmaj9
      { bass: 110.00, notes: [220.00, 261.63, 329.63, 392.00, 493.88] }, // Am9
      { bass: 87.31,  notes: [174.61, 261.63, 329.63, 440.00, 523.25] }, // Fmaj9
      { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00, 587.33] }  // G6
    ];

    const playNote = (freq, duration, gainLevel = 0.035, isBass = false) => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = isBass ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + (isBass ? 0.3 : 0.04));
      gain.gain.exponentialRampToValueAtTime(0.00005, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    };

    const triggerNextChord = () => {
      if (!this.isPlaying) return;
      const chord = chordProgressions[currentChordIndex % chordProgressions.length];
      currentChordIndex++;

      // Play soft bass root
      playNote(chord.bass, 5.0, 0.05, true);

      // Play gentle arpeggiated piano melody
      chord.notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isPlaying) {
            playNote(freq, 3.8, 0.038 - idx * 0.004, false);
          }
        }, idx * 600);
      });
    };

    const startMusic = () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.isPlaying = true;
      this.audioLabel.textContent = 'Music: Playing';
      this.audioBtn.classList.add('playing');

      triggerNextChord();
      arpeggioTimer = setInterval(triggerNextChord, 4600);
    };

    const stopMusic = () => {
      this.isPlaying = false;
      this.audioLabel.textContent = 'Music: Muted';
      this.audioBtn.classList.remove('playing');
      if (arpeggioTimer) {
        clearInterval(arpeggioTimer);
        arpeggioTimer = null;
      }
    };

    this.audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });

    // Auto-start music gently when user enters museum
    this.enterBtn.addEventListener('click', () => {
      if (!this.isPlaying) {
        startMusic();
      }
    });
  }
}
