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
        className={`pointer-events-auto flex items-center justify-between w-full max-w-[980px] h-[58px] sm:h-[62px] pl-7 sm:pl-10 md:pl-12 pr-4 sm:pr-6 md:pr-7 rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#101012]/85 border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'
            : 'bg-[#121214]/75 border-white/8 shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
        } backdrop-blur-[20px]`}
      >
        {/* Left: Name in Instrument Serif with ample breathing room from the border */}
        <div className="flex items-center gap-2.5 shrink-0 pl-1 sm:pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] shadow-[0_0_8px_#E2652B]" />
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

        {/* Right: Full "Let's talk" CTA Button with generous padding + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#contact"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
            }}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium font-sans text-white hover:bg-[#E2652B] hover:border-[#E2652B] hover:text-black transition-all duration-200 active:scale-95 no-underline flex items-center gap-2 shadow-sm"
          >
            <span>Let's talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
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
