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
  const [dockState, setDockState] = useState<'idle' | 'copied-state'>('idle')
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
    const steps = 30
    const bezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const u = 1 - t
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
    }

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        const t = i / steps
        const px = 38 + bezier(0, 200, 550, 1000, t)
        const py = 38 + bezier(0, 15, -140, -280, t)
        const x = px - 6 + (Math.random() * 8 - 4)
        const y = py + 6 + (Math.random() * 8 - 4)
        const dx = `${-14 - Math.random() * 20}px`
        const dy = `${10 + Math.random() * 20}px`
        const id = Date.now() + i + Math.random()

        setFlightPixels((prev) => [...prev, { id, x, y, dx, dy }])

        setTimeout(() => {
          setFlightPixels((prev) => prev.filter((p) => p.id !== id))
        }, 650)
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

    // Instant tactile copied state & launch paper plane flight
    setDockState('copied-state')
    setIsPlaneFlying(true)
    spawnFlightPixels()

    // Complete plane flyby smoothly
    setTimeout(() => {
      setIsPlaneFlying(false)
    }, 1450)

    // Smoothly restore idle direct dispatch state
    setTimeout(() => {
      setDockState('idle')
      isAnimatingRef.current = false
    }, 3200)
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
           TACTILE EMAIL COMMAND DOCK & FLYING PAPER PLANE
           ============================================================== */
        .email-dock-stage {
          position: relative;
          height: 76px;
          width: 100%;
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
          transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.25s ease,
                      background-color 0.25s ease,
                      box-shadow 0.25s ease;
          z-index: 2;
        }

        .email-dock:hover {
          border-color: rgba(226, 101, 43, 0.4);
          box-shadow: 0 10px 30px rgba(226, 101, 43, 0.12);
        }

        .email-dock:active {
          transform: scale(0.985);
        }

        .email-dock.copied-state {
          border-color: rgba(226, 101, 43, 0.6);
          background: rgba(226, 101, 43, 0.08);
          box-shadow: 0 0 32px rgba(226, 101, 43, 0.2);
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
          left: 38px;
          top: 50%;
          width: 44px;
          height: 44px;
          margin-left: -22px;
          margin-top: -22px;
          pointer-events: none;
          opacity: 0;
          z-index: 50;
          will-change: transform, opacity;
          filter: drop-shadow(0 0 16px rgba(226, 101, 43, 0.95));
        }

        .paper-plane-actor.flying {
          animation: planeFlybyAcrossSection 1.35s cubic-bezier(0.2, 0.0, 0.2, 1.0) forwards;
        }

        /* High-density 40-frame aerodynamic trajectory (continuous tangent & velocity interpolation) */
        @keyframes planeFlybyAcrossSection {
          0% { opacity: 0.0; transform: translate3d(0.0px, 0.0px, 0) scale(0.55) rotate(49.3deg); }
          2.5% { opacity: 0.62; transform: translate3d(15.3px, 0.8px, 0) scale(0.61) rotate(46.8deg); }
          5% { opacity: 1.0; transform: translate3d(31.1px, 1.0px, 0) scale(0.67) rotate(44.6deg); }
          7.5% { opacity: 1.0; transform: translate3d(47.5px, 0.6px, 0) scale(0.73) rotate(42.6deg); }
          10% { opacity: 1.0; transform: translate3d(64.5px, -0.4px, 0) scale(0.79) rotate(40.7deg); }
          12.5% { opacity: 1.0; transform: translate3d(81.9px, -2.0px, 0) scale(0.85) rotate(39.1deg); }
          15% { opacity: 1.0; transform: translate3d(100.0px, -4.1px, 0) scale(0.91) rotate(37.6deg); }
          17.5% { opacity: 1.0; transform: translate3d(118.5px, -6.8px, 0) scale(0.97) rotate(36.2deg); }
          20% { opacity: 1.0; transform: translate3d(137.6px, -9.9px, 0) scale(1.03) rotate(35.0deg); }
          22.5% { opacity: 1.0; transform: translate3d(157.2px, -13.6px, 0) scale(1.09) rotate(33.9deg); }
          25% { opacity: 1.0; transform: translate3d(177.3px, -17.7px, 0) scale(1.15) rotate(32.9deg); }
          27.5% { opacity: 1.0; transform: translate3d(198.0px, -22.3px, 0) scale(1.14) rotate(32.0deg); }
          30% { opacity: 1.0; transform: translate3d(219.1px, -27.4px, 0) scale(1.12) rotate(31.2deg); }
          32.5% { opacity: 1.0; transform: translate3d(240.8px, -32.9px, 0) scale(1.11) rotate(30.4deg); }
          35% { opacity: 1.0; transform: translate3d(263.0px, -38.8px, 0) scale(1.09) rotate(29.8deg); }
          37.5% { opacity: 1.0; transform: translate3d(285.6px, -45.1px, 0) scale(1.08) rotate(29.2deg); }
          40% { opacity: 1.0; transform: translate3d(308.8px, -51.8px, 0) scale(1.07) rotate(28.7deg); }
          42.5% { opacity: 1.0; transform: translate3d(332.4px, -58.8px, 0) scale(1.05) rotate(28.2deg); }
          45% { opacity: 1.0; transform: translate3d(356.6px, -66.2px, 0) scale(1.04) rotate(27.8deg); }
          47.5% { opacity: 1.0; transform: translate3d(381.2px, -73.9px, 0) scale(1.02) rotate(27.4deg); }
          50% { opacity: 1.0; transform: translate3d(406.2px, -81.9px, 0) scale(1.01) rotate(27.1deg); }
          52.5% { opacity: 1.0; transform: translate3d(431.8px, -90.2px, 0) scale(1.00) rotate(26.9deg); }
          55% { opacity: 1.0; transform: translate3d(457.8px, -98.7px, 0) scale(0.98) rotate(26.7deg); }
          57.5% { opacity: 1.0; transform: translate3d(484.3px, -107.6px, 0) scale(0.97) rotate(26.5deg); }
          60% { opacity: 1.0; transform: translate3d(511.2px, -116.6px, 0) scale(0.96) rotate(26.3deg); }
          62.5% { opacity: 1.0; transform: translate3d(538.6px, -125.9px, 0) scale(0.94) rotate(26.2deg); }
          65% { opacity: 1.0; transform: translate3d(566.4px, -135.4px, 0) scale(0.93) rotate(26.1deg); }
          67.5% { opacity: 1.0; transform: translate3d(594.7px, -145.1px, 0) scale(0.91) rotate(26.1deg); }
          70% { opacity: 1.0; transform: translate3d(623.3px, -154.9px, 0) scale(0.90) rotate(26.1deg); }
          72.5% { opacity: 1.0; transform: translate3d(652.5px, -164.9px, 0) scale(0.86) rotate(26.1deg); }
          75% { opacity: 1.0; transform: translate3d(682.0px, -175.1px, 0) scale(0.82) rotate(26.1deg); }
          77.5% { opacity: 1.0; transform: translate3d(712.0px, -185.3px, 0) scale(0.79) rotate(26.2deg); }
          80% { opacity: 1.0; transform: translate3d(742.4px, -195.7px, 0) scale(0.75) rotate(26.2deg); }
          82.5% { opacity: 0.97; transform: translate3d(773.2px, -206.1px, 0) scale(0.71) rotate(26.3deg); }
          85% { opacity: 0.83; transform: translate3d(804.4px, -216.6px, 0) scale(0.67) rotate(26.5deg); }
          87.5% { opacity: 0.69; transform: translate3d(836.0px, -227.2px, 0) scale(0.64) rotate(26.6deg); }
          90% { opacity: 0.56; transform: translate3d(868.1px, -237.7px, 0) scale(0.60) rotate(26.8deg); }
          92.5% { opacity: 0.42; transform: translate3d(900.5px, -248.3px, 0) scale(0.56) rotate(27.0deg); }
          95% { opacity: 0.28; transform: translate3d(933.3px, -258.9px, 0) scale(0.53) rotate(27.2deg); }
          97.5% { opacity: 0.14; transform: translate3d(966.4px, -269.5px, 0) scale(0.49) rotate(27.5deg); }
          100% { opacity: 0.0; transform: translate3d(1000.0px, -280.0px, 0) scale(0.45) rotate(27.7deg); }
        }

        .flight-pixel {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #E2652B;
          border-radius: 1px;
          pointer-events: none;
          z-index: 45;
          will-change: transform, opacity;
          box-shadow: 0 0 10px #E2652B;
          animation: pixelFadeFall 0.65s ease-out forwards;
        }

        @keyframes pixelFadeFall {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--dx), var(--dy), 0) scale(0.2);
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

          {/* Tactile Email Command Dock with Flying Paper Plane */}
          <div className="email-dock-stage" id="emailDockStage">
            
            {/* Paper Plane SVG Actor */}
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

            {/* Interactive Tactile Email Card */}
            <div
              className={`email-dock ${dockState === 'copied-state' ? 'copied-state' : ''}`}
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
