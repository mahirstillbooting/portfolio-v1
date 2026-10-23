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
          maxWidth: '1120px',
          background: scrolled ? 'rgba(16, 16, 18, 0.92)' : 'rgba(20, 20, 22, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxSizing: 'border-box',
        }}
        className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)] px-4 sm:px-7"
      >
        {/* Left: Brand name (Desktop: full serif name / Mobile: MahirChy) */}
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

        {/* Center: Desktop Navigation Links (Increased generous spacing, hidden on mobile) */}
        <div
          className="hidden md:flex items-center gap-8 lg:gap-10"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors font-sans font-medium no-underline tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right: Redesigned Spacious "Let's talk" Button */}
        <div className="flex items-center shrink-0">
          <a
            href="#contact"
            style={{
              fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            className="group px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white text-white hover:text-black hover:border-white text-xs sm:text-sm font-medium tracking-wide inline-flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all duration-300 shadow-sm no-underline cursor-pointer"
          >
            <span className="whitespace-nowrap">Let's talk</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
        </div>
      </motion.nav>
    </header>
  )
}
