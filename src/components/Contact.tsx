import { useState, useCallback, useRef } from 'react'
import UseAnimations from 'react-useanimations'
import mail from 'react-useanimations/lib/mail'
import github from 'react-useanimations/lib/github'
import instagram from 'react-useanimations/lib/instagram'
import { getAudioEnabled } from '../utils/audioState'
import winSoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

const TOPICS = [
  'Full-Stack Role',
  'System Architecture',
  'QA & Testing',
  'Collaboration',
]

export default function Contact() {
  const [dockState, setDockState] = useState<'idle' | 'copied-state'>('idle')
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

  const handleCopyEmail = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    playChime()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {})
    }

    // Set copied state & trigger react-useanimations mail icon
    setDockState('copied-state')

    // Smoothly restore idle direct dispatch state
    setTimeout(() => {
      setDockState('idle')
      isAnimatingRef.current = false
    }, 2800)
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

          {/* Tactile Email Command Dock with Animated Mail Icon */}
          <div className="email-dock-stage" id="emailDockStage">
            
            <UseAnimations
              animation={mail}
              size={32}
              strokeColor={dockState === 'copied-state' ? '#FFFFFF' : '#E2652B'}
              render={(eventProps, animationProps) => (
                <div
                  className={`email-dock ${dockState === 'copied-state' ? 'copied-state' : ''}`}
                  id="emailDock"
                  role="button"
                  tabIndex={0}
                  {...eventProps}
                  onClick={(e) => {
                    eventProps.onClick(e)
                    handleCopyEmail()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCopyEmail()
                    }
                  }}
                >
                  <div className="email-dock-left">
                    <div className="email-icon-frame" id="emailIconFrame">
                      <span {...animationProps} />
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
              )}
            />

          </div>

          {/* Social Bento Cards with Card-Level Hover Triggers */}
          <div className="social-bento-row">
            
            <UseAnimations
              animation={github}
              size={32}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href="https://github.com/mahirstillbooting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  {...eventProps}
                >
                  <div className="social-card-top">
                    <div className="social-badge">
                      <span {...animationProps} />
                    </div>
                    <span className="external-arrow">↗</span>
                  </div>
                  <div className="social-card-bottom">
                    <span className="social-title">GitHub</span>
                    <span className="social-sub">@mahirstillbooting</span>
                  </div>
                </a>
              )}
            />

            <UseAnimations
              animation={instagram}
              size={32}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href="https://instagram.com/pixl.potion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  {...eventProps}
                >
                  <div className="social-card-top">
                    <div className="social-badge">
                      <span {...animationProps} />
                    </div>
                    <span className="external-arrow">↗</span>
                  </div>
                  <div className="social-card-bottom">
                    <span className="social-title">Instagram</span>
                    <span className="social-sub">@pixl.potion</span>
                  </div>
                </a>
              )}
            />

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
