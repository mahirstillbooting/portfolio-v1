import { ArrowUpRight, Check } from 'lucide-react'
import { GithubIcon, InstagramIcon } from './Icons'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAudioEnabled } from '../utils/audioState'
import winSoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

interface PixelParticle {
  id: number
  dx: number
  dy: number
  color: string
  size: number
  delay: number
  rotate: number
  isRound: boolean
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [particles, setParticles] = useState<PixelParticle[]>([])
  const email = 'stellaroasis116@gmail.com'
  const winAudioRef = useRef<HTMLAudioElement | null>(null)

  const playCopySound = useCallback(() => {
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
    playCopySound()

    // Spawn falling orange & pixel particles
    const colors = ['#E2652B', '#FF7A38', '#FF9E66', '#FFFFFF', '#D71921', '#FFB380']
    const newParticles: PixelParticle[] = Array.from({ length: 18 }, (_, i) => {
      const angle = Math.random() * Math.PI * 1.4 - Math.PI * 0.2
      const speed = Math.random() * 50 + 20
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * speed + (Math.random() * 20 - 10),
        dy: -Math.sin(angle) * speed + (Math.random() * 45 + 35), // flies up then descends with gravity
        color: colors[i % colors.length],
        size: Math.floor(Math.random() * 3 + 3),
        delay: Math.random() * 0.06,
        rotate: Math.random() * 180 - 90,
        isRound: Math.random() > 0.6,
      }
    })
    setParticles(newParticles)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
      setParticles([])
    }, 2400)
  }

  const socials = [
    {
      name: 'GitHub',
      handle: 'mahirstillbooting',
      url: 'https://github.com/mahirstillbooting',
      icon: GithubIcon,
    },
    {
      name: 'Instagram',
      handle: '@pixl.potion',
      url: 'https://instagram.com/pixl.potion',
      icon: InstagramIcon,
    },
  ]

  return (
    <section
      id="contact"
      className="w-full max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 scroll-mt-[80px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: '24px',
          background: 'rgba(20, 20, 22, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="text-center relative overflow-hidden w-full shadow-2xl p-7 sm:p-11 md:p-14 lg:p-16 my-auto flex flex-col items-center"
      >
        {/* Warm Ambient Orange Glow (Preserved) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[360px] sm:w-[520px] h-[190px] bg-[#E2652B]/12 blur-[80px] pointer-events-none rounded-full" />

        {/* Main Heading with Balanced Padding & Spacing */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight max-w-xl mx-auto leading-tight sm:leading-snug mb-3.5 sm:mb-4 pt-1 sm:pt-2">
          Let's build something extraordinary.
        </h2>

        {/* Description Text */}
        <p className="text-sm sm:text-base text-[#A1A1AA] font-sans max-w-lg mx-auto leading-relaxed mb-8 sm:mb-11 px-2">
          Open to full-stack engineering roles, software challenges, and technical discussions.
        </p>

        {/* Centered Copy Email Pill Button with Animated Mail Icon & Flying Particle Effect */}
        <div className="relative flex justify-center mb-10 sm:mb-14 w-full">
          <button
            type="button"
            onClick={copyEmail}
            className="relative group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/[0.04] hover:bg-[#E2652B] hover:text-black border border-white/10 hover:border-[#E2652B] text-neutral-200 transition-all duration-300 font-mono text-xs sm:text-sm cursor-pointer shadow-lg hover:shadow-[0_0_24px_rgba(226,101,43,0.35)] active:scale-95 select-none"
            title="Click to copy email address"
          >
            {/* Particle Burst Container */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ x: -60, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: -60 + p.dx,
                    y: p.dy,
                    opacity: 0,
                    scale: [1, 1.2, 0],
                    rotate: p.rotate,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: p.delay }}
                  style={{
                    position: 'absolute',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 6px ${p.color}`,
                    borderRadius: p.isRound ? '50%' : '1px',
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied-state"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5 font-semibold text-white group-hover:text-black tracking-wide"
                >
                  <Check className="w-4 h-4 text-emerald-400 group-hover:text-black transition-colors" />
                  <span>Copied Email</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default-state"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2.5"
                >
                  {/* Custom Animated Envelope Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E2652B] group-hover:text-black transition-colors"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </motion.div>
                  <span className="tracking-wide">Copy {email}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flying Away Mail Icon on Copy */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  key="flying-envelope"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                  animate={{
                    x: [0, 25, 70],
                    y: [0, -30, -75],
                    scale: [1, 1.15, 0.3],
                    rotate: [0, -15, -40],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="absolute left-6 sm:left-8 pointer-events-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E2652B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Social Transmission Cards (GitHub & Instagram) with Generous Inner & Outer Padding */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-8 sm:pt-10 border-t border-white/[0.08]">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#E2652B]/40 transition-all duration-300 no-underline shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#E2652B] group-hover:scale-105 group-hover:border-[#E2652B]/40 group-hover:bg-[#E2652B]/10 transition-all flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#E2652B]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold font-sans text-sm sm:text-base text-white group-hover:text-[#E2652B] transition-colors">
                      {s.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#71717A] group-hover:text-[#A1A1AA] transition-colors font-mono">
                      {s.handle}
                    </div>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg text-[#71717A] group-hover:text-white group-hover:bg-white/[0.05] transition-all">
                  <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            )
          })}
        </div>

      </motion.div>
    </section>
  )
}
