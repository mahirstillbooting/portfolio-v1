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
    <header className="fixed top-5 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '64px',
          padding: '0 24px 0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1080px',
          background: scrolled ? 'rgba(16, 16, 18, 0.88)' : 'rgba(20, 20, 22, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxSizing: 'border-box',
        }}
        className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
      >
        {/* Left: Brand name container with strict 8px left breathing room */}
        <div
          style={{ paddingLeft: '8px', flexShrink: 0 }}
          className="flex items-center"
        >
          <a
            href="#hero"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(20px, 2.3vw, 24px)',
              lineHeight: 1,
            }}
            className="text-white tracking-tight select-none hover:text-[#E2652B] transition-colors no-underline font-normal whitespace-nowrap"
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

        {/* Right: Full "Let's talk" CTA Button with strict non-wrapping styles + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#contact"
            style={{
              whiteSpace: 'nowrap',
              flexShrink: 0,
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#FFFFFF',
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-[#E2652B] hover:border-[#E2652B] hover:text-black active:scale-95 no-underline shadow-sm"
          >
            <span className="whitespace-nowrap">Let's talk</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-white rounded-lg transition-colors cursor-pointer"
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
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#121214]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 font-sans text-sm md:hidden"
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
