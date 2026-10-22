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
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between w-full max-w-[940px] h-[50px] sm:h-[56px] px-3.5 sm:px-7 rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#101012]/85 border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'
            : 'bg-[#121214]/75 border-white/8 shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
        } backdrop-blur-[20px]`}
      >
        {/* Left: Name in Instrument Serif, responsive single line */}
        <a
          href="#hero"
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
          }}
          className="text-[17px] xs:text-[19px] sm:text-[23px] text-white tracking-tight select-none hover:text-[#E2652B] transition-colors no-underline font-normal pl-1 sm:pl-2 whitespace-nowrap truncate max-w-[175px] xs:max-w-[210px] sm:max-w-none"
        >
          Mahiruddin Chowdhury
        </a>

        {/* Center: Desktop Navigation Links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '36px' }}
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

        {/* Right: CTA Button + Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Let's talk CTA */}
          <a
            href="mailto:stellaroasis116@gmail.com"
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
            className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-12 text-xs sm:text-sm font-medium font-sans text-white hover:bg-[#E2652B] hover:border-[#E2652B] hover:text-black transition-all duration-200 active:scale-95 no-underline flex items-center gap-1.5"
          >
            <span className="hidden xs:inline">Let's talk</span>
            <span className="xs:hidden">Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            className="pointer-events-auto absolute top-16 left-3 right-3 bg-[#121214]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 font-sans text-sm md:hidden"
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
