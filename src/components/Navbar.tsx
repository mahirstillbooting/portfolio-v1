import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'

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

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
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
        {/* Left: Brand name */}
        <div className="flex items-center shrink-0 pl-1 sm:pl-2">
          <a
            href="#hero"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              lineHeight: 1,
            }}
            className="text-lg sm:text-2xl text-white tracking-tight select-none hover:text-[#E2652B] transition-colors no-underline font-normal whitespace-nowrap"
          >
            Mahiruddin Chowdhury
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
          className="hidden md:flex"
        >
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[13px] text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors font-sans font-medium no-underline"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right: Reverted Rectangular Glassmorphic "Let's talk" CTA Button on Desktop + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#contact"
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/16 hover:border-white/30 text-white text-xs sm:text-[13px] font-medium inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap active:scale-95 transition-all duration-200 shadow-sm no-underline cursor-pointer"
          >
            <span className="whitespace-nowrap">Let's talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80" strokeWidth={1.75} />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 sm:p-2 text-[#9CA3AF] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-18 left-3 right-3 bg-[#121214]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 font-sans text-sm md:hidden"
          >
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors font-medium no-underline"
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
