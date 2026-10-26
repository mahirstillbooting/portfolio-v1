import { useState, useCallback, useRef } from 'react'
import { getAudioEnabled } from '../utils/audioState'
import winSoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

const TOPICS = [
  'Full-Stack Role',
  'System Architecture',
  'QA & Testing',
  'Collaboration',
]

interface FlightPixel {
  id: number
  x: number
  y: number
  dx: string
  dy: string
}

export default function Contact() {
  const [dockState, setDockState] = useState<'idle' | 'folding' | 'copied-state'>('idle')
  const [isPlaneFlying, setIsPlaneFlying] = useState(false)
  const [flightPixels, setFlightPixels] = useState<FlightPixel[]>([])
  const [selectedTopic, setSelectedTopic] = useState('Full-Stack Role')
  const [name, setName] = useState('')
  const [returnEmail, setReturnEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isDispatched, setIsDispatched] = useState(false)

  const isAnimatingRef = useRef(false)
  const winAudioRef = useRef<HTMLAudioElement | null>(null)
  const email = 'stellaroasis116@gmail.com'

  const playChime = useCallback(() => {
    if (!getAudioEnabled()) return
    try {
      if (!winAudioRef.current) {
        winAudioRef.current = new Audio(winSoundUrl)
      }
      const audio = winAudioRef.current.cloneNode(true) as HTMLAudioElement
      audio.volume = 0.25
      audio.play().catch(() => {})
    } catch {
      // Audio fallback
    }
  }, [])

  const spawnFlightPixels = useCallback(() => {
    const steps = 18
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        const progress = i / steps
        const x = 120 + progress * 580 + (Math.random() * 20 - 10)
        const y = 38 - progress * 220 + (Math.random() * 20 - 10)
        const dx = `${-24 - Math.random() * 30}px`
        const dy = `${26 + Math.random() * 35}px`
        const id = Date.now() + i + Math.random()

        setFlightPixels((prev) => [...prev, { id, x, y, dx, dy }])

        setTimeout(() => {
          setFlightPixels((prev) => prev.filter((p) => p.id !== id))
        }, 750)
      }, i * 42)
    }
  }, [])

  const handleCopyEmail = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    playChime()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {})
    }

    // Phase 1: Card creases and folds in 3D like origami paper into a paper plane
    setDockState('folding')

    // Phase 2: At apex of fold (360ms), paper plane launches into supersonic flight
    setTimeout(() => {
      setIsPlaneFlying(true)
      spawnFlightPixels()
    }, 360)

    // Phase 3: Plane completes flight across section and unfolds softly back into card with Copied state
    setTimeout(() => {
      setIsPlaneFlying(false)
      setDockState('copied-state')
    }, 1450)

    // Phase 4: Smoothly restore idle direct dispatch state
    setTimeout(() => {
      setDockState('idle')
      isAnimatingRef.current = false
    }, 3800)
  }

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    playChime()
    setIsDispatched(true)

    const subject = encodeURIComponent(`[${selectedTopic}] Transmission from ${name || 'Portfolio Visitor'}`)
    const body = encodeURIComponent(
      `Name: ${name || 'N/A'}\nEmail: ${returnEmail || 'N/A'}\nTopic: ${selectedTopic}\n\nMessage:\n${
        message || 'Hi Mahir, I saw your portfolio and wanted to connect!'
      }`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')

    setTimeout(() => {
      setIsDispatched(false)
    }, 3500)
  }

  return (
    <section className="contact-bento-section select-none" id="contact">
      <style>{`
        .contact-bento-section {
          width: 100%;
          max-width: 1120px;
          min-height: 100vh;
          padding: 108px 24px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          scroll-margin-top: 70px;
        }

        .bento-shell {
          width: 100%;
          background: #111113;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.85);
          display: grid;
          grid-template-columns: 1.05fr 1.15fr;
          gap: 36px;
          align-items: stretch;
        }

        .bento-shell::before {
          content: "";
          position: absolute;
          top: -120px;
          left: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(226, 101, 43, 0.14) 0%, rgba(0, 0, 0, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .bento-shell::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 180px;
          background-image: radial-gradient(rgba(226, 101, 43, 0.2) 1px, transparent 1px);
          background-size: 12px 12px;
          mask-image: radial-gradient(circle at top right, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(circle at top right, black 20%, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }

        .left-column {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }

        .top-meta-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #F4F4F6;
        }

        .headline-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        .contact-title {
          font-size: clamp(32px, 3.6vw, 44px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-title span {
          background: none;
          -webkit-text-fill-color: #E2652B;
        }

        .contact-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: #A1A1AA;
          max-width: 440px;
        }

        /* ==============================================================
           ORIGAMI 3D FOLDING STAGE & PAPER PLANE MORPH
           ============================================================== */
        .email-dock-stage {
          position: relative;
          height: 76px;
          width: 100%;
          perspective: 1200px;
          perspective-origin: center center;
        }

        .email-dock {
          position: relative;
          width: 100%;
          height: 100%;
          background: #161618;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          user-select: none;
          transform-style: preserve-3d;
          transform-origin: center center;
          transition: border-color 0.3s ease,
                      background-color 0.3s ease,
                      box-shadow 0.3s ease;
          z-index: 2;
        }

        .email-dock:hover {
          border-color: rgba(226, 101, 43, 0.4);
          box-shadow: 0 10px 30px rgba(226, 101, 43, 0.12);
        }

        /* Central crease light effect during origami fold */
        .email-dock::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(226, 101, 43, 0.8) 100%);
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%);
          transition: opacity 0.2s ease;
        }

        /* Phase 1: Card folds in 3D like real origami paper into a paper plane */
        .email-dock.folding {
          animation: cardOrigamiFold 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          pointer-events: none;
        }

        .email-dock.folding::after {
          opacity: 1;
        }

        @keyframes cardOrigamiFold {
          0% {
            transform: perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            opacity: 1;
            filter: brightness(1);
          }
          30% {
            /* Crease along center and top corners tuck in */
            transform: perspective(1200px) rotateX(16deg) rotateY(-22deg) scale(0.85);
            clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%);
            background: #1c1c20;
            border-color: #E2652B;
            filter: brightness(0.95);
            opacity: 0.95;
          }
          65% {
            /* Wings fold inward along center crease */
            transform: perspective(1200px) rotateX(25deg) rotateY(-45deg) rotateZ(-10deg) scale(0.55);
            clip-path: polygon(50% 0%, 95% 75%, 50% 100%, 5% 75%);
            background: #E2652B;
            border-color: #FFFFFF;
            filter: brightness(1.1);
            opacity: 0.9;
          }
          100% {
            /* Morphs completely into paper plane triangular nose */
            transform: perspective(1200px) rotateX(32deg) rotateY(-62deg) rotateZ(-26deg) scale(0.25) translate(40px, -15px);
            clip-path: polygon(50% 0%, 100% 100%, 50% 75%, 0% 100%);
            background: #E2652B;
            opacity: 0;
          }
        }

        /* Phase 2: Card unfolds softly back into place with Copied confirmation */
        .email-dock.copied-state {
          border-color: #E2652B;
          background: rgba(226, 101, 43, 0.08);
          box-shadow: 0 0 32px rgba(226, 101, 43, 0.2);
          animation: cardOrigamiUnfold 0.62s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardOrigamiUnfold {
          0% {
            opacity: 0;
            transform: perspective(1200px) rotateX(25deg) rotateY(45deg) rotateZ(12deg) scale(0.35);
            clip-path: polygon(50% 0%, 100% 100%, 50% 75%, 0% 100%);
            filter: drop-shadow(0 0 24px #E2652B);
          }
          40% {
            opacity: 0.9;
            transform: perspective(1200px) rotateX(10deg) rotateY(15deg) scale(0.88);
            clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%);
            border-color: #E2652B;
          }
          75% {
            transform: perspective(1200px) rotateX(-3deg) rotateY(-2deg) scale(1.02);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            border-color: #E2652B;
          }
          100% {
            opacity: 1;
            transform: perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1);
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
            border-color: #E2652B;
          }
        }

        .email-dock-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .email-icon-frame {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(226, 101, 43, 0.12);
          border: 1px solid rgba(226, 101, 43, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E2652B;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .email-dock.copied-state .email-icon-frame {
          background: #E2652B;
          color: #FFFFFF;
        }

        .email-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          text-align: left;
        }

        .email-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #52525B;
          transition: color 0.3s ease;
        }

        .email-dock.copied-state .email-label {
          color: #E2652B;
        }

        .email-address {
          font-family: 'Geist Mono', monospace;
          font-size: 13.5px;
          font-weight: 500;
          color: #F4F4F6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-kbd {
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #F4F4F6;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .email-dock.copied-state .copy-kbd {
          background: #E2652B;
          border-color: #E2652B;
          color: #FFFFFF;
        }

        /* Flying Paper Plane Craft & Jet Particle Trail */
        .paper-plane-actor {
          position: absolute;
          left: 42%;
          top: 50%;
          width: 56px;
          height: 56px;
          margin-left: -28px;
          margin-top: -28px;
          pointer-events: none;
          opacity: 0;
          z-index: 50;
          filter: drop-shadow(0 0 20px rgba(226, 101, 43, 0.95));
        }

        .paper-plane-actor.flying {
          animation: planeFlybyAcrossSection 1.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Smooth aerodynamic flight path gliding across the section */
        @keyframes planeFlybyAcrossSection {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.45) rotate(-28deg);
          }
          14% {
            opacity: 1;
            /* Catches air current with gentle lift */
            transform: translate(-34px, 16px) scale(1.15) rotate(-18deg);
          }
          38% {
            opacity: 1;
            /* Soars up and across headline */
            transform: translate(170px, -105px) scale(1.22) rotate(14deg);
          }
          62% {
            opacity: 1;
            /* Sweeps over the Right Hardware Console */
            transform: translate(460px, -65px) scale(1.08) rotate(26deg);
          }
          82% {
            opacity: 0.92;
            /* Banks high across top right */
            transform: translate(690px, -185px) scale(0.78) rotate(38deg);
          }
          100% {
            opacity: 0;
            transform: translate(860px, -260px) scale(0.42) rotate(52deg);
          }
        }

        .flight-pixel {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #E2652B;
          border-radius: 1px;
          pointer-events: none;
          z-index: 45;
          box-shadow: 0 0 10px #E2652B;
          animation: pixelFadeFall 0.75s ease-out forwards;
        }

        @keyframes pixelFadeFall {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.2);
          }
        }

        .social-bento-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .social-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 16px 18px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .social-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }

        .social-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .social-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E2652B;
        }

        .external-arrow {
          font-family: 'Geist Mono', monospace;
          font-size: 13px;
          color: #52525B;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .social-card:hover .external-arrow {
          color: #FFFFFF;
        }

        .social-card-bottom {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .social-title {
          font-size: 14px;
          font-weight: 600;
          color: #F4F4F6;
        }

        .social-sub {
          font-family: 'Geist Mono', monospace;
          font-size: 11.5px;
          color: #52525B;
        }

        .right-console {
          position: relative;
          z-index: 1;
          background: #0C0C0E;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .console-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .console-title {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #A1A1AA;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .console-title::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #E2652B;
          border-radius: 1px;
        }

        .console-dots {
          display: flex;
          gap: 6px;
        }

        .console-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.14);
        }

        .topic-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }

        .field-label {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #A1A1AA;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .field-label span {
          color: #52525B;
          font-size: 10px;
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .topic-chip {
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 12.5px;
          font-weight: 500;
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topic-chip.selected {
          background: rgba(226, 101, 43, 0.12);
          border-color: rgba(226, 101, 43, 0.4);
          color: #FFFFFF;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          text-align: left;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .console-input,
        .console-textarea {
          width: 100%;
          padding: 13px 16px;
          background: #121215;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          color: #FFFFFF;
          font-family: 'Geist', sans-serif;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .console-input::placeholder,
        .console-textarea::placeholder {
          color: #52525B;
        }

        .console-input:focus,
        .console-textarea:focus {
          border-color: #E2652B;
          background: #151519;
        }

        .console-textarea {
          resize: none;
          height: 92px;
          line-height: 1.5;
        }

        .console-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .btn-dispatch {
          padding: 13px 24px;
          border-radius: 12px;
          background: #E2652B;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-family: 'Geist', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(226, 101, 43, 0.28);
          transition: all 0.2s ease;
        }

        .btn-dispatch:hover {
          background: #ea7037;
          box-shadow: 0 10px 28px rgba(226, 101, 43, 0.42);
        }

        .btn-dispatch:active {
          transform: scale(0.98);
        }

        @media (max-width: 920px) {
          .contact-bento-section {
            padding: 96px 16px 32px;
          }
          .bento-shell {
            grid-template-columns: 1fr;
            padding: 28px 22px;
            gap: 28px;
          }
        }

        @media (max-width: 560px) {
          .input-grid,
          .social-bento-row {
            grid-template-columns: 1fr;
          }
          .console-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-dispatch {
            justify-content: center;
          }
        }
      `}</style>

      {/* Main Bento Shell Container */}
      <div className="bento-shell" id="bentoShell">
        
        {/* LEFT COLUMN: Brand Pitch, Morphing Email Dock & Social Bento */}
        <div className="left-column">
          
          <div className="top-meta-row">
            <div className="status-badge">
              <span>Available for Engineering Roles</span>
            </div>
          </div>

          <div className="headline-group">
            <h1 className="contact-title">
              Let's build something <span>extraordinary.</span>
            </h1>
            <p className="contact-desc">
              Open to full-stack engineering roles, software architecture challenges, and technical collaborations. Copy my direct address or dispatch a message through the terminal.
            </p>
          </div>

          {/* Tactile Email Command Dock with Origami 3D Paper Plane Morph Stage */}
          <div className="email-dock-stage" id="emailDockStage">
            
            {/* Paper Plane SVG Actor (Launches seamlessly at apex of fold) */}
            <div className={`paper-plane-actor ${isPlaneFlying ? 'flying' : ''}`} id="paperPlaneActor">
              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#E2652B" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Spawned Flight Trail Pixels */}
            {flightPixels.map((p) => (
              <span
                key={p.id}
                className="flight-pixel"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  '--dx': p.dx,
                  '--dy': p.dy,
                } as React.CSSProperties}
              />
            ))}

            {/* Interactive Origami Folding Card */}
            <div
              className={`email-dock ${dockState === 'folding' ? 'folding' : ''} ${dockState === 'copied-state' ? 'copied-state' : ''}`}
              id="emailDock"
              role="button"
              tabIndex={0}
              onClick={handleCopyEmail}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCopyEmail()
                }
              }}
            >
              <div className="email-dock-left">
                <div className="email-icon-frame" id="emailIconFrame">
                  {dockState === 'copied-state' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg id="emailSvgIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  )}
                </div>
                <div className="email-meta">
                  <span className="email-label" id="emailLabel">
                    {dockState === 'copied-state' ? 'Dispatch Ready' : 'Direct Dispatch'}
                  </span>
                  <span className="email-address" id="emailAddress">
                    {dockState === 'copied-state' ? 'Copied Email to Clipboard!' : email}
                  </span>
                </div>
              </div>
              <span className="copy-kbd" id="copyKbd">
                {dockState === 'copied-state' ? 'COPIED ✓' : 'COPY'}
              </span>
            </div>

          </div>

          {/* Social Bento Cards */}
          <div className="social-bento-row">
            
            <a href="https://github.com/mahirstillbooting" target="_blank" rel="noopener noreferrer" className="social-card">
              <div className="social-card-top">
                <div className="social-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                </div>
                <span className="external-arrow">↗</span>
              </div>
              <div className="social-card-bottom">
                <span className="social-title">GitHub</span>
                <span className="social-sub">@mahirstillbooting</span>
              </div>
            </a>

            <a href="https://instagram.com/pixl.potion" target="_blank" rel="noopener noreferrer" className="social-card">
              <div className="social-card-top">
                <div className="social-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <span className="external-arrow">↗</span>
              </div>
              <div className="social-card-bottom">
                <span className="social-title">Instagram</span>
                <span className="social-sub">@pixl.potion</span>
              </div>
            </a>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Message Console */}
        <form className="right-console" onSubmit={handleDispatch}>
          
          <div className="console-header">
            <span className="console-title">Message Console</span>
            <div className="console-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          {/* Topic Selector Pills */}
          <div className="topic-group">
            <label className="field-label">
              Select Inquiry Topic <span>01</span>
            </label>
            <div className="chip-row" id="topicChips">
              {TOPICS.map((topic) => (
                <span
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`topic-chip ${selectedTopic === topic ? 'selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedTopic(topic)
                    }
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Sender Info */}
          <div className="input-grid">
            <div className="field-block">
              <label className="field-label">
                Your Name <span>02</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="console-input"
                placeholder="e.g. Alex Rivera"
              />
            </div>
            <div className="field-block">
              <label className="field-label">
                Return Email <span>03</span>
              </label>
              <input
                type="email"
                value={returnEmail}
                onChange={(e) => setReturnEmail(e.target.value)}
                className="console-input"
                placeholder="alex@company.com"
              />
            </div>
          </div>

          {/* Message Payload */}
          <div className="field-block">
            <label className="field-label">
              Project Brief or Message <span>04</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="console-textarea"
              placeholder="Share details about the role, timeline, or engineering challenge..."
            />
          </div>

          {/* Console Action Bar */}
          <div className="console-footer">
            <button type="submit" className="btn-dispatch">
              {isDispatched ? (
                <>
                  <span>Dispatched ✓</span>
                </>
              ) : (
                <>
                  <span>Send Transmission</span> <span>→</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </section>
  )
}
