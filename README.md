# Mahiruddin Chowdhury — Portfolio v1

> **An editorial, Nothing OS-inspired portfolio merging tactile dot-matrix aesthetics, 3D interactive Three.js rover mechanics, and high-performance web engineering.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mahirstillbooting.github.io%2Fportfolio--v1-E2652B?style=for-the-badge&logo=github)](https://mahirstillbooting.github.io/portfolio-v1)
[![Built With React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✦ Overview

Designed with an obsession for physical telemetry, tactile feedback, and brutalist minimalism. Inspired by the industrial design language of **Nothing OS**, modern editorial typography (**Instrument Serif** & **Geist**), and real-time 3D canvas mechanics.

Engineered by **Mahiruddin Chowdhury** — 4th-year Computer Science & Engineering undergraduate at East West University, Dhaka.

---

## ⚡ Key Highlights & Features

### 1. "Dhaka Neon Drift" — Borderless 3D Three.js Cyber Rover Game
- **Interactive Isometric Grid:** Controllable 3D glowing wireframe rover inspired by the *ChalokApp* IoT capstone.
- **Controls:** Smooth keyboard steering via `WASD` / `Arrow Keys` or **Click/Tap anywhere** on the 3D grid to auto-pilot/drift to that position using GSAP physics, leaving an amber (`#E2652B`) particle trail.
- **5 Holographic Project Beacons:** Drive into or click any of the 5 glowing beacons (`01: ChalokApp`, `02: ARS System`, `03: Ivory Pastry`, `04: Smart Waste Dhaka`, `05: Book Shop DB`) to trigger a 3D particle burst, a synthesized Web Audio mechanical synth chime, camera zoom, and open the floating Glassmorphism Project Drawer.
- **Quick-Select Fallback Tabs:** Recruiter-friendly pill tabs below the stage to instantly auto-pilot the rover to any project.

### 2. Editorial Hero Section (Sarthak Sharma Style)
- **Zero Box Borders:** The interactive portrait matrix blends seamlessly into the `#080808` canvas using radial CSS masking (`radial-gradient(circle, black 45%, transparent 72%)`).
- **Overlapping Typography:** Giant display title in *Instrument Serif* italic (`font-size: clamp(3.8rem, 7.5vw, 6.8rem)`) overlapping the lower chest portion with a subtle dark backdrop gradient for 100% legibility.
- **S-Curve Tornado Swirl & Scroll Dispersion:** Interactive vortex swirl on click, and GSAP scroll dispersion fading particles into the dark background.

### 3. Strict Spacing & Bento Card Architecture
- **Whitespace:** Strict `140px 32px` vertical padding between sections with a `max-width: 1200px` centered layout.
- **Bento Standards:** `28px` minimum grid gaps, `36px` card padding, and `20px` border radius with subtle corner markers.
- **Text Discipline:** Strict 25-word summary limits per project card with collaborator GitHub links for *ChalokApp* (`@Smswad` & `@Emon-2004`).

### 4. Honest Journey & Technical Matrix
- **Biography:** Two scannable paragraphs (`max-width: 65ch`, `line-height: 1.8`) capturing real academic progress at East West University.
- **Hobbies & Passions:** 4-column balanced grid featuring Mechanical Keyboards, Perfume Notes, Retro PC Gaming, and AI Engineering.
- **10D Telemetry Bar Chart:** Interactive Nothing OS-inspired unrounded blocky bar chart tracking language and tool proficiencies.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), CSS Radial Masking, Nothing OS Palette |
| **3D & Canvas** | [Three.js](https://threejs.org/), HTML5 Canvas 2D Physics Engine |
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

*Designed & developed with precision. Nothing OS aesthetic inspired.*
