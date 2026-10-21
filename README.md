# Mahiruddin Chowdhury — Portfolio v1

> **Software portfolio featuring interactive dot-matrix physics, split-viewport 3D Three.js rover mechanics, 12-cell Tornado skill matrix, and high-performance web engineering.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mahirstillbooting.github.io%2Fportfolio--v1-E2652B?style=for-the-badge&logo=github)](https://mahirstillbooting.github.io/portfolio-v1)
[![Built With React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✦ Overview

Engineered by **Mahiruddin Chowdhury** — Computer Science & Engineering undergraduate at East West University, Dhaka, focused on building clean web and software systems.

---

## ⚡ Key Highlights & Architecture

### 1. Interactive Dot-Matrix Hero Section
- **100% Viewport Height Canvas:** The interactive portrait and ambient scattered particle field span the entire viewport (`100vw` x `100vh`), smoothly filling all empty spaces above and below the portrait.
- **Darkened Shade Behind Text:** Background pixels and scatter dots falling directly behind the name, subtitle, and buttons are automatically darkened (`opacity: 0.18`, charcoal `#222222`), while the central portrait face remains crisp and bright.
- **Strict Z-Index Layering:** Text overlay sits strictly on top (`z-index: 10`) with display title in *Instrument Serif* italic (`font-size: clamp(3.2rem, 6.5vw, 5.8rem)`) overlapping the lower chest/neck.
- **S-Curve Tornado Swirl & Scroll Dispersion:** Interactive vortex swirl on click, and GSAP scroll dispersion fading particles smoothly into the dark background.
- **Floating Pill Navbar & Global Audio Toggle:** Minimalist navbar featuring 36px link spacing, brandmark, and a dedicated sound mute/unmute toggle (`Volume2` / `VolumeX`) controlling all synthetic Web Audio sound effects across the site.

### 2. Spatial 3D Project Universe (Zero Cards, Pure 3D Immersion)
- **Full-Bleed 3D Viewport:** Pure OLED black (`#000000`) space with an infinite dot-matrix grid plane in charcoal (`#1F1F1F`) and 5 glowing red LED ring nodes (`#D2531D`).
- **Spatial Floating Typography:** Zero rectangular cards and zero side panels. Approaching or selecting a project node transitions the camera via GSAP (`power4.inOut`) directly in front of the artifact, unfolding massive typography, 1-sentence descriptions, and interactive `[VIEW LIVE]` and `[CODEBASE]` CTAs.
- **Drone Navigation & Controls:** Glides using `WASD` or mouse vector steering on desktop, and touch-drag with soft spring inertia on mobile.
- **Minimal Dot-Bar Dock & Shortcuts:** Floating dot-bar navigator (`01 • 02 • 03 • 04 • 05`) and `1-5` numeric shortcuts for instant orbital transitions.

### 3. Section 04: 12-Cell Interactive Tornado Grid Matrix
- **12 Dedicated Matrix Cells:** Responsive `repeat(auto-fit, minmax(150px, 1fr))` grid replacing legacy charts with a bespoke tactile matrix.
- **28x28 LED Dot-Matrix Canvas:** Each cell renders a `280x280` canvas displaying the technology abbreviation in dot-matrix typography.
- **650ms Cubic Funnel Swirl:** On hover, particles break apart, spiral inward in a tight vortex with cubic easing (`easeInOutCubic`), and reconstitute into the official logo/icon bitmap in Crimson (`#D71921`) and Orange (`#E2652B`).
- **Web Audio Sound Effects:** Real-time synthesized high-frequency oscillator sweep accompanies each particle vortex.
- **12 Technologies:** JavaScript, HTML5, CSS3, SQL, C, C++, Java, Firebase, Git, Figma, AI Prompting, and QA Testing.

### 4. Strict Spacing & Layout Architecture
- **Whitespace:** Strict `140px 32px` vertical padding between sections with a `max-width: 1200px` centered layout.
- **Bento Standards:** `28px` minimum grid gaps, `36px` card padding, and `20px` border radius with subtle corner markers.
- **Text Discipline & Bio:** Strict 25-word summary limits per project card with collaborator GitHub links for *ChalokApp* (`@Smswad` & `@Emon-2004`), describing capstone hardware prototyping.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), CSS Radial Masking |
| **3D & Canvas** | [Three.js](https://threejs.org/), HTML5 Canvas 2D Physics & Particle Engines |
| **Animation** | [GSAP](https://gsap.com/) (GreenSock), [Framer Motion](https://www.framer.com/motion/) |
| **Audio** | Web Audio API (Synthesized triangle/sine oscillators) |
| **Typography** | Geist Sans, Geist Mono, Instrument Serif |

---

## ⌨️ TUI Keyboard Shortcuts

| Key | Target |
|:---:|:-------|
| `W` / `A` / `S` / `D` | Steer **Dhaka Neon Drift** Rover |
| `↑` / `←` / `↓` / `→` | Steer Rover / Grid Navigation |
| `H` | Jump to **Hero** |
| `P` | Jump to **Projects** |
| `A` | Jump to **About** |
| `S` | Jump to **Skills** |
| `C` | Jump to **Contact** |
| `G` | Open **GitHub** Profile |

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

```bash
# Clone the repository
git clone https://github.com/mahirstillbooting/portfolio-v1.git
cd portfolio-v1

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Production Build
```bash
# Typecheck and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment to GitHub Pages

This repository includes a continuous deployment workflow configured at `.github/workflows/deploy.yml`.

1. Push your changes to the `main` branch.
2. In your repository on GitHub, navigate to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow will automatically compile and deploy your site to `https://mahirstillbooting.github.io/portfolio-v1/`.

---

## 📬 Contact & Connect

- **Engineer:** Mahiruddin Chowdhury
- **Email:** [stellaroasis116@gmail.com](mailto:stellaroasis116@gmail.com)
- **Institution:** East West University, Dhaka
- **GitHub:** [@mahirstillbooting](https://github.com/mahirstillbooting)
- **Instagram:** [@pixl.potion](https://instagram.com/pixl.potion)

---

*Designed & developed with precision.*
