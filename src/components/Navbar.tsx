import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navLinks = [
    { num: '01', title: 'PROJECTS', label: 'Projects', href: '#projects' },
    { num: '02', title: 'ABOUT & MINDSET', label: 'About', href: '#about' },
    { num: '03', title: 'CAPABILITIES', label: 'Skills', href: '#skills' },
    { num: '04', title: 'CONTACT', label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1080px',
            background: scrolled ? 'rgba(16, 16, 18, 0.92)' : 'rgba(20, 20, 22, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxSizing: 'border-box',
          }}
          className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)] px-3.5 sm:px-7"
        >
          {/* Left: Brand name on desktop / Dot-matrix monogram on mobile */}
          <div className="flex items-center shrink-0 pl-1 sm:pl-2">
            <a
              href="#hero"
              className="flex items-center no-underline select-none group"
            >
              {/* Desktop Full Name */}
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  lineHeight: 1,
                }}
                className="hidden md:inline text-2xl text-white tracking-tight hover:text-[#E2652B] transition-colors font-normal whitespace-nowrap"
              >
                Mahiruddin Chowdhury
              </span>

              {/* Mobile Monogram Logo: MC // */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
                  lineHeight: 1,
                }}
                className="inline md:hidden text-sm font-bold tracking-widest text-white group-hover:text-neutral-200 transition-colors"
              >
                MC <span className="text-[#E2652B]">//</span>
              </span>
            </a>
          </div>

          {/* Center: Desktop Navigation Links (hidden on mobile) */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
            className="hidden md:flex"
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors font-sans font-medium no-underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right: Rectangular Glassmorphic "Let's talk" on Desktop / Minimal Pill Trigger on Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop "Let's talk" CTA button */}
            <a
              href="#contact"
              style={{
                fontFamily: "'Geist Sans', sans-serif",
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              className="hidden md:inline-flex px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/16 hover:border-white/30 text-white text-[13px] font-medium items-center gap-2 whitespace-nowrap active:scale-95 transition-all duration-200 shadow-sm no-underline cursor-pointer"
            >
              <span className="whitespace-nowrap">Let's talk</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" strokeWidth={1.75} />
            </a>

            {/* Mobile Menu Button Pill: [ MENU ] */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/14 text-[11px] font-mono tracking-widest text-neutral-200 uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2"
              aria-label="Open Navigation Menu"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] animate-pulse" />
              <span>[ MENU ]</span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Full-Screen Dark Overlay for Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-[#09090b]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 pointer-events-auto"
          >
            {/* Top Bar inside Fullscreen Overlay */}
            <div className="flex items-center justify-between border-b border-white/8 pb-5">
              <span
                style={{ fontFamily: "'JetBrains Mono', 'Geist Mono', monospace" }}
                className="text-base font-bold tracking-widest text-white select-none"
              >
                MC <span className="text-[#E2652B]">//</span>
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/14 text-[11px] font-mono tracking-widest text-neutral-300 uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2"
                aria-label="Close Navigation Menu"
              >
                <X className="w-3.5 h-3.5 text-[#E2652B]" />
                <span>[ CLOSE ]</span>
              </button>
            </div>

            {/* High-Impact Typography Links */}
            <div className="flex flex-col gap-6 my-auto py-6">
              {navLinks.map((item, idx) => (
                <motion.a
                  key={item.num}
                  href={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * (idx + 1), duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-baseline gap-3 text-left no-underline cursor-pointer border-b border-white/6 pb-4 active:scale-[0.98] transition-all"
                >
                  <span className="font-mono text-xs text-[#E2652B] tracking-widest font-semibold shrink-0">
                    {item.num} //
                  </span>
                  <span
                    style={{ fontFamily: "'JetBrains Mono', 'Geist Sans', monospace, sans-serif" }}
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-[#E2652B] group-hover:translate-x-1.5 transition-all"
                  >
                    {item.title}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Bottom Section: Location Info + Quick Action */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-white/10"
            >
              <div className="flex flex-col text-[11px] font-mono text-neutral-400 space-y-0.5">
                <span className="text-neutral-500 uppercase tracking-widest text-[10px]">SYSTEM LOCATION</span>
                <span className="text-neutral-300 tracking-wider">DHAKA, BANGLADESH (UTC+6)</span>
              </div>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white text-xs font-mono font-medium tracking-wider uppercase inline-flex items-center justify-center gap-2 no-underline active:scale-95 transition-all"
              >
                <span>LET'S TALK</span>
                <ArrowUpRight className="w-4 h-4 text-[#E2652B]" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
