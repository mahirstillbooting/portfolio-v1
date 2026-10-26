import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check, Send } from 'lucide-react'
import { GithubIcon, InstagramIcon } from './Icons'
import { getAudioEnabled } from '../utils/audioState'
import winSoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

const TOPICS = [
  'Full-Stack Role',
  'System Architecture',
  'QA & Testing',
  'Collaboration',
]

interface PlaneParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [planeTrail, setPlaneTrail] = useState<PlaneParticle[]>([])
  const [selectedTopic, setSelectedTopic] = useState('Full-Stack Role')
  const [name, setName] = useState('')
  const [returnEmail, setReturnEmail] = useState('')
  const [message, setMessage] = useState('')
  const [dispatched, setDispatched] = useState(false)

  const email = 'stellaroasis116@gmail.com'
  const winAudioRef = useRef<HTMLAudioElement | null>(null)

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

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    playChime()
    setCopied(true)
    setIsFlying(true)

    // Generate trail particles along the flight curve
    const particles: PlaneParticle[] = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      size: Math.random() * 3 + 2,
      color: ['#E2652B', '#FF7A38', '#FFFFFF', '#FFB380'][i % 4],
    }))
    setPlaneTrail(particles)

    setTimeout(() => {
      setIsFlying(false)
      setPlaneTrail([])
    }, 2200)

    setTimeout(() => {
      setCopied(false)
    }, 3200)
  }

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    playChime()
    setDispatched(true)

    const subject = encodeURIComponent(`[${selectedTopic}] Transmission from ${name || 'Portfolio Visitor'}`)
    const body = encodeURIComponent(
      `Name: ${name || 'N/A'}\nEmail: ${returnEmail || 'N/A'}\nTopic: ${selectedTopic}\n\nMessage:\n${message || 'Hi Mahir, I saw your portfolio and wanted to connect!'}`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')

    setTimeout(() => {
      setDispatched(false)
    }, 3500)
  }

  return (
    <section
      id="contact"
      className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 scroll-mt-[70px] select-none relative"
    >
      {/* ==============================================================
          GLOBAL SUPERSONIC PAPER PLANE FLYBY ACROSS THE CONTACT SECTION
          ============================================================== */}
      <AnimatePresence>
        {isFlying && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <motion.div
              initial={{
                x: '15%',
                y: '50%',
                scale: 0.6,
                rotate: -20,
                opacity: 0,
              }}
              animate={{
                x: ['15%', '35%', '70%', '90%', '55%', '15%'],
                y: ['50%', '20%', '15%', '65%', '75%', '50%'],
                rotate: [-20, -45, 10, 85, 180, 360],
                scale: [0.6, 1.4, 1.8, 1.3, 0.9, 0.6],
                opacity: [0, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute flex items-center justify-center filter drop-shadow-[0_0_16px_#E2652B]"
            >
              {/* Paper Plane SVG Vector */}
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="#E2652B"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform -rotate-45"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>

              {/* Glowing Jet Engine Particle Trail */}
              {planeTrail.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    x: p.x,
                    y: p.y,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                    borderRadius: '50%',
                  }}
                />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==============================================================
          MAIN ARCHITECTURAL BENTO SHELL
          ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: '28px',
          background: '#111113',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="w-full relative overflow-hidden p-6 sm:p-9 lg:p-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-8 lg:gap-9 items-stretch"
      >
        {/* Warm Orange Ambient Hardware Glow (Top-Left) */}
        <div
          className="absolute -top-[120px] -left-[80px] w-[480px] h-[480px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(226, 101, 43, 0.14) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />

        {/* Subtle Dot-Matrix Texture in Top Right Corner */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[180px] pointer-events-none z-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(226, 101, 43, 0.3) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            maskImage: 'radial-gradient(circle at top right, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at top right, black 20%, transparent 75%)',
          }}
        />

        {/* ============================================================
            LEFT COLUMN: Brand Pitch, Tactile Email Dock & Social Bento
            ============================================================ */}
        <div className="relative z-10 flex flex-col justify-between gap-7">
          
          {/* Top Meta Row (Without filled circle dot or location tag) */}
          <div className="flex items-center">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/12 font-mono text-[11px] tracking-wider uppercase text-[#F4F4F6]">
              <span>Available for Engineering Roles</span>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="flex flex-col gap-3.5 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-sans font-bold leading-[1.12] tracking-tight text-white">
              Let's build something <span className="text-[#E2652B]">extraordinary.</span>
            </h2>
            <p className="text-sm sm:text-[14.5px] leading-relaxed text-[#A1A1AA] max-w-[440px]">
              Open to full-stack engineering roles, software architecture challenges, and technical collaborations. Copy my direct address or dispatch a message through the terminal.
            </p>
          </div>

          {/* Tactile Email Command Dock with Interactive Morph & Copy */}
          <div
            onClick={copyEmail}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                copyEmail()
              }
            }}
            className="group relative bg-[#161618] hover:bg-[#1a1a1d] border border-white/12 hover:border-[#E2652B]/60 rounded-[18px] p-4 sm:p-4.5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 shadow-md hover:shadow-[0_8px_30px_rgba(226,101,43,0.18)] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-[42px] h-[42px] rounded-xl bg-[#E2652B]/12 border border-[#E2652B]/40 flex items-center justify-center text-[#E2652B] group-hover:scale-105 group-hover:bg-[#E2652B] group-hover:text-black transition-all shrink-0">
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400 group-hover:text-black transition-colors" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
                  Direct Dispatch
                </span>
                <span className="font-mono text-xs sm:text-[13.5px] font-medium text-[#F4F4F6] truncate">
                  {email}
                </span>
              </div>
            </div>

            <span className="px-3.5 py-2 rounded-lg bg-white/[0.05] group-hover:bg-[#E2652B] border border-white/12 group-hover:border-[#E2652B] font-mono text-[11px] font-medium text-white group-hover:text-black tracking-wider shrink-0 transition-all">
              {copied ? 'COPIED!' : 'COPY'}
            </span>
          </div>

          {/* Bottom Social Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a
              href="https://github.com/mahirstillbooting"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-[#E2652B]/40 rounded-[18px] p-4 sm:p-4.5 flex flex-col justify-between gap-4 no-underline transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[#E2652B] group-hover:scale-105 transition-transform">
                  <GithubIcon className="w-4.5 h-4.5 text-[#E2652B]" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/[0.07] flex items-center justify-center text-[#71717A] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white group-hover:text-[#E2652B] transition-colors">
                  GitHub
                </span>
                <span className="font-mono text-[11.5px] text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
                  @mahirstillbooting
                </span>
              </div>
            </a>

            <a
              href="https://instagram.com/pixl.potion"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-[#E2652B]/40 rounded-[18px] p-4 sm:p-4.5 flex flex-col justify-between gap-4 no-underline transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[#E2652B] group-hover:scale-105 transition-transform">
                  <InstagramIcon className="w-4.5 h-4.5 text-[#E2652B]" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/[0.07] flex items-center justify-center text-[#71717A] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white group-hover:text-[#E2652B] transition-colors">
                  Instagram
                </span>
                <span className="font-mono text-[11.5px] text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
                  @pixl.potion
                </span>
              </div>
            </a>
          </div>

        </div>

        {/* ============================================================
            RIGHT COLUMN: Interactive Hardware Message Console Form
            ============================================================ */}
        <form
          onSubmit={handleDispatch}
          className="relative z-10 bg-[#0C0C0E] border border-white/12 rounded-[22px] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {/* Console Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-[#E2652B] rounded-[1px]" />
              Message Console
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
            </div>
          </div>

          {/* Topic Selector Pills */}
          <div className="flex flex-col gap-2.5 text-left">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
              <span>Select Inquiry Topic</span>
              <span className="text-[#52525B] text-[10px]">01</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-2 rounded-xl text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
                    selectedTopic === topic
                      ? 'bg-[#E2652B]/15 border border-[#E2652B]/60 text-white shadow-[0_0_12px_rgba(226,101,43,0.25)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Sender Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
                <span>Your Name</span>
                <span className="text-[#52525B] text-[10px]">02</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-3 bg-[#121215] border border-white/[0.08] focus:border-[#E2652B] focus:bg-[#151519] rounded-xl text-white font-sans text-[13.5px] outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
                <span>Return Email</span>
                <span className="text-[#52525B] text-[10px]">03</span>
              </label>
              <input
                type="email"
                value={returnEmail}
                onChange={(e) => setReturnEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3.5 py-3 bg-[#121215] border border-white/[0.08] focus:border-[#E2652B] focus:bg-[#151519] rounded-xl text-white font-sans text-[13.5px] outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* Message Payload */}
          <div className="flex flex-col gap-2 text-left">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] flex items-center justify-between">
              <span>Project Brief or Message</span>
              <span className="text-[#52525B] text-[10px]">04</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share details about the role, timeline, or engineering challenge..."
              className="w-full px-3.5 py-3 bg-[#121215] border border-white/[0.08] focus:border-[#E2652B] focus:bg-[#151519] rounded-xl text-white font-sans text-[13.5px] outline-none transition-all resize-none h-[92px] leading-relaxed placeholder:text-[#52525B]"
            />
          </div>

          {/* Console Action Bar (Without unnecessary avg response text) */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E2652B] hover:bg-[#eb743b] text-white font-sans text-[13.5px] font-semibold cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(226,101,43,0.3)] hover:shadow-[0_10px_28px_rgba(226,101,43,0.45)] active:scale-[0.98] transition-all"
            >
              {dispatched ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Dispatched ✓</span>
                </>
              ) : (
                <>
                  <span>Send Transmission</span>
                  <Send className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>

        </form>

      </motion.div>
    </section>
  )
}
