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
        dy: -Math.sin(angle) * speed + (Math.random() * 45 + 35),
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
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 scroll-mt-[80px]"
    >
      <div className="w-full max-w-[920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: '32px',
            background: 'rgba(20, 20, 22, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          className="relative overflow-hidden w-full shadow-2xl px-6 sm:px-14 md:px-20 lg:px-24 py-12 sm:py-18 md:py-20 flex flex-col items-center text-center"
        >
          {/* Warm Ambient Orange Glow (Preserved) */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-[380px] sm:w-[600px] h-[220px] bg-[#E2652B]/12 blur-[90px] pointer-events-none rounded-full" />

          {/* Centered Heading & Description with Generous Spacing */}
          <div className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight sm:leading-snug mb-4 sm:mb-5 max-w-xl mx-auto">
              Let's build something extraordinary.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#A1A1AA] font-sans max-w-lg mx-auto leading-relaxed px-4">
              Open to full-stack engineering roles, software challenges, and technical discussions.
            </p>
          </div>

          {/* Prominent Email Pill with Substantial Spacing Above, Below, and on Both Sides */}
          <div className="relative w-full flex justify-center mb-14 sm:mb-20 px-4">
            <button
              type="button"
              onClick={copyEmail}
              className="relative group inline-flex items-center justify-center gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-white/[0.04] hover:bg-[#E2652B] hover:text-black border border-white/10 hover:border-[#E2652B] text-neutral-200 transition-all duration-300 font-mono text-xs sm:text-sm cursor-pointer shadow-xl hover:shadow-[0_0_32px_rgba(226,101,43,0.4)] active:scale-95 select-none"
              title="Click to copy email address"
            >
              {/* Particle Burst Container */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ x: -70, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: -70 + p.dx,
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
                    className="flex items-center gap-3 font-semibold text-white group-hover:text-black tracking-wide"
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
                    className="flex items-center gap-3.5"
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
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2652B] group-hover:text-black transition-colors"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </motion.div>
                    <span className="tracking-wide font-medium">Copy {email}</span>
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
                    className="absolute left-6 sm:left-10 pointer-events-none"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E2652B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Social Cards (GitHub & Instagram) - Centered with Wide Side Margins and Generous Inner Padding */}
          <div className="w-full pt-10 sm:pt-14 border-t border-white/[0.08] flex justify-center">
            <div className="w-full max-w-[660px] grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 px-2 sm:px-4">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-[#E2652B]/40 transition-all duration-300 no-underline shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#E2652B] group-hover:scale-105 group-hover:border-[#E2652B]/40 group-hover:bg-[#E2652B]/10 transition-all flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E2652B]" />
                      </div>
                      <div className="text-left flex flex-col justify-center">
                        <span className="font-semibold font-sans text-sm sm:text-base text-white group-hover:text-[#E2652B] transition-colors leading-snug">
                          {s.name}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#71717A] group-hover:text-[#A1A1AA] transition-colors font-mono leading-normal mt-1">
                          {s.handle}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl text-[#71717A] group-hover:text-white group-hover:bg-white/[0.05] transition-all shrink-0 ml-3">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
