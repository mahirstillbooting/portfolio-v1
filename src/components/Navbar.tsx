import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
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
        className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)] px-4 sm:px-7"
      >
        {/* Left: Brand name (Desktop: full name / Mobile: MahirChy) */}
        <div className="flex items-center shrink-0 pl-1 sm:pl-2">
          <a
            href="#hero"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              lineHeight: 1,
            }}
            className="text-xl sm:text-2xl text-white tracking-tight select-none hover:text-[#E2652B] transition-colors no-underline font-normal whitespace-nowrap"
          >
            <span className="hidden md:inline">Mahiruddin Chowdhury</span>
            <span className="inline md:hidden">MahirChy</span>
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

        {/* Right: Glassmorphic "Let's talk" CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#contact"
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/16 hover:border-white/30 text-white text-xs sm:text-[13px] font-medium inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap active:scale-95 transition-all duration-200 shadow-sm no-underline cursor-pointer"
          >
            <span className="whitespace-nowrap">Let's talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80" strokeWidth={1.75} />
          </a>
        </div>
      </motion.nav>
    </header>
  )
}
