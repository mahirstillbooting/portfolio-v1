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
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between w-full max-w-[940px] h-[56px] px-7 rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#101012]/85 border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'
            : 'bg-[#121214]/75 border-white/8 shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
        } backdrop-blur-[20px]`}
      >
        {/* Left: Name only in Instrument Serif (24px, #ffffff, pl-3, NO blinking dot, NO // 01) */}
        <a
          href="#hero"
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: '24px',
            color: '#ffffff',
            paddingLeft: '12px',
          }}
          className="tracking-tight select-none hover:text-[#E2652B] transition-colors no-underline font-normal"
        >
          Mahiruddin Chowdhury
        </a>

        {/* Center: Clean Navigation Links with exact gap: 36px */}
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

        {/* Right: Spacious Modern CTA Button */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:stellaroasis116@gmail.com"
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF',
            }}
            className="hover:bg-[#E2652B] hover:border-[#E2652B] hover:text-black font-sans transition-all duration-200 active:scale-95 no-underline"
          >
            <span>Let's talk</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-[#9CA3AF] hover:text-white rounded-lg transition-colors cursor-pointer"
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
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#121214]/95 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 font-sans text-sm md:hidden"
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
