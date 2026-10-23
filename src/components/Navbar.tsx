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
    <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
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
          background: scrolled ? 'rgba(16, 16, 18, 0.95)' : 'rgba(20, 20, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxSizing: 'border-box',
        }}
        className="pointer-events-auto transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.6)] !h-auto md:!h-[68px] py-2.5 md:py-0 px-4 md:px-[28px] flex-col md:flex-row"
      >
        {/* Left Brand: Mahiruddin Chowdhury sitting comfortably on far left with padding-left: 4px */}
        <div
          style={{ paddingLeft: '4px' }}
          className="flex items-center justify-between w-full md:w-auto md:shrink-0 shrink-0"
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

          {/* Mobile Right CTA button (visible in top row on mobile only) */}
          <div className="flex md:hidden items-center shrink-0 ml-auto">
            <a
              href="#contact"
              style={{
                fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white text-white hover:text-black hover:border-white text-xs font-medium tracking-wide inline-flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all duration-200 shadow-sm no-underline cursor-pointer"
            >
              <span>Let's talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Center: Desktop Navigation Links sitting neatly balanced with gap: 32px */}
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

        {/* Right CTA: Pinned to the far right with margin-left: auto */}
        <div
          style={{ marginLeft: 'auto' }}
          className="hidden md:flex items-center shrink-0"
        >
          <a
            href="#contact"
            style={{
              fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            className="group px-6 lg:px-8 py-3 rounded-xl bg-white/[0.06] hover:bg-white text-white hover:text-black hover:border-white text-xs sm:text-[14px] font-medium tracking-wide inline-flex items-center gap-2.5 whitespace-nowrap active:scale-95 transition-all duration-300 shadow-sm no-underline cursor-pointer"
          >
            <span className="whitespace-nowrap">Let's talk</span>
            <ArrowUpRight
              className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </a>
        </div>

        {/* Mobile Navigation Links Row */}
        <div className="flex md:hidden items-center justify-around w-full pt-2 mt-1 border-t border-white/[0.08] text-xs font-mono font-medium text-[#A1A1AA] px-1">
          {navLinks.map((item, idx) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <a
                href={item.href}
                className="hover:text-white active:text-[#E2652B] transition-colors py-0.5"
              >
                {item.label}
              </a>
              {idx < navLinks.length - 1 && (
                <span className="text-white/20 select-none text-[10px]">·</span>
              )}
            </div>
          ))}
        </div>
      </motion.nav>
    </header>
  )
}
