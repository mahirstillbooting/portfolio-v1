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
    <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-6 pointer-events-none gap-2">
      {/* Main Navbar Floating Bar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1120px',
          padding: '0 12px 0 28px',
          height: '68px',
          background: scrolled ? 'rgba(16, 16, 18, 0.95)' : 'rgba(20, 20, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxSizing: 'border-box',
        }}
        className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)] !h-[56px] md:!h-[68px] px-4 md:pl-[28px] md:pr-[12px]"
      >
        {/* Left Brand: Mahiruddin Chowdhury on desktop / MahirChy on mobile */}
        <div
          style={{ paddingLeft: '4px' }}
          className="flex items-center shrink-0"
        >
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
          style={{
            gap: '32px',
            margin: '0 auto',
          }}
          className="hidden md:flex items-center"
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

        {/* Right CTA: Let's talk ↗ Button */}
        <div className="flex items-center shrink-0 ml-auto md:ml-auto">
          <a
            href="#contact"
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              marginRight: '8px',
              padding: '12px 22px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#F3F4F6',
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            className="group hover:!bg-white hover:!text-black hover:!border-white active:scale-95 no-underline cursor-pointer shadow-sm !py-2 !px-3.5 md:!py-[12px] md:!px-[22px] text-xs md:text-sm"
          >
            <span>Let's talk</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
        </div>
      </motion.nav>

      {/* Mobile Floating Action Chips Tray */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex md:hidden items-center justify-center gap-2 w-full max-w-[380px] pointer-events-auto px-1"
      >
        {navLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              background: scrolled ? 'rgba(18, 18, 22, 0.92)' : 'rgba(22, 22, 26, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
            className="flex-1 py-1.5 px-2.5 rounded-full text-[11px] font-mono font-medium text-[#D4D4D8] hover:text-[#E2652B] hover:border-[#E2652B]/60 active:scale-95 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.45)] no-underline flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span className="w-1 h-1 rounded-full bg-[#E2652B]" />
            <span>{item.label}</span>
          </a>
        ))}
      </motion.div>
    </header>
  )
}
