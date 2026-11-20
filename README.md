# Divya Memory Museum 🏛️✨

An architectural 3D virtual memory museum designed with Three.js, featuring realistic lighting, walking controls, framed photo exhibits, and an interactive 3D cinema theater.

---

## 🌟 Key Highlights

- **First-Person Exploration**: Walk freely through multiple museum wings using **WASD** and **Mouse Look** with wall collision physics.
- **13 Framed Artworks**: All 13 original photos from `dipics` displayed in custom beveled 3D frames (gold, walnut, and champagne) with dedicated overhead gallery spotlights and brass plaques.
- **Aspect-Ratio Fitting**: No stretching or distortion—portrait and landscape images are mapped to their true mathematical proportions.
- **Inspection Lightbox**: Look at any photo and press **[E]** or click to open an ultra high-res museum modal with titles, curated captions, and Next/Previous navigation.
- **The Cinema Theater**: An intimate screening room with a giant screen that plays real uploaded videos.
  - Video controls: Play/Pause, Timeline scrubber (seek/rewind), Volume slider, Mute, and Fullscreen.
  - Works with any video files in the `videos/` folder or via the on-screen "Select Video File" button.
- **Atmospheric Visuals**: High-end PBR materials (polished Italian marble floor, gallery plaster walls, acoustic cinema textures, soft shadows, warm spotlights).
- **Ambient Soundtrack**: Built-in harmonic piano ambience toggle.

---

## 🎮 Controls

| Key / Action | Function |
|--------------|----------|
| **W / A / S / D** or **Arrow Keys** | Walk Forward / Left / Backward / Right |
| **Shift** | Sprint |
| **Mouse** | Look around (Pointer Lock) |
| **Left Click Canvas** | Lock mouse cursor to look around |
| **E** or **Left Click Photo** | Inspect framed artwork / Open Lightbox |
| **ESC** | Unlock cursor / Close inspection view |
| **Space** | Toggle Cinema video play/pause |

---

## 🎬 How to Add Videos

1. Place your `.mp4`, `.mov`, or `.webm` files into the `videos/` folder:
   `F:\mus\divya-memory-museum\videos\`
2. When the server runs, it automatically detects any video placed in this folder and lists them in the Cinema dropdown.
3. You can also click **"📁 Select Video File"** directly in the cinema controls dock while exploring the museum to choose any video file from your computer on the fly!

---

## 🚀 How to Run

### Method 1: Double-Click
Double-click `start.bat` in this folder. It will launch the server and open `http://localhost:8080` in your browser.

### Method 2: Command Line
Open a terminal in `F:\mus\divya-memory-museum` and run:
```bash
node serve.js
```
Then visit:
```
http://localhost:8080
```
