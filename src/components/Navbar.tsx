import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false)
  const [isBrandTouched, setIsBrandTouched] = useState(false)
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brandTouchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Prevents intermediate scroll-spy updates when a nav link is clicked
  const isManualNavRef = useRef(false)
  const manualNavTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNavClick = (href: string | null) => {
    setActiveSection(href)
    isManualNavRef.current = true

    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
    manualNavTimeoutRef.current = setTimeout(() => {
      isManualNavRef.current = false
    }, 850)
  }

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    setIsTouched(true)
  }

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouched(false)
    }, 800)
  }

  const handleBrandTouchStart = () => {
    if (brandTouchTimeoutRef.current) clearTimeout(brandTouchTimeoutRef.current)
    setIsBrandTouched(true)
  }

  const handleBrandTouchEnd = () => {
    if (brandTouchTimeoutRef.current) clearTimeout(brandTouchTimeoutRef.current)
    brandTouchTimeoutRef.current = setTimeout(() => {
      setIsBrandTouched(false)
    }, 800)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)

      // Skip scroll-spy calculation while smooth-scrolling to a clicked link
      if (isManualNavRef.current) return

      const projectsEl = document.getElementById('projects')
      if (!projectsEl) return

      // If scrolled near bottom of page -> activate contact
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 70
      if (isAtBottom) {
        setActiveSection('#contact')
        return
      }

      // Threshold line for section entry (fixed navbar height is ~68px + offset)
      const threshold = 220
      const projectsRect = projectsEl.getBoundingClientRect()

      // When projects section has not yet reached the threshold, we are in the Hero section
      if (projectsRect.top > threshold) {
        setActiveSection(null)
        return
      }

      // Find the currently active section
      const sectionIds = ['projects', 'about', 'skills', 'contact']
      let current: string | null = null

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= threshold) {
            current = `#${id}`
          }
        }
      }

      setActiveSection(current)
    }

    const handleScrollEnd = () => {
      isManualNavRef.current = false
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scrollend', handleScrollEnd)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
      if (brandTouchTimeoutRef.current) clearTimeout(brandTouchTimeoutRef.current)
      if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current)
    }
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
            onClick={() => handleNavClick(null)}
            onTouchStart={handleBrandTouchStart}
            onTouchEnd={handleBrandTouchEnd}
            onTouchCancel={() => setIsBrandTouched(false)}
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              lineHeight: 1,
            }}
            className={`text-xl sm:text-2xl tracking-tight select-none hover:text-[#E2652B] active:text-[#E2652B] transition-colors duration-200 no-underline font-normal whitespace-nowrap ${
              isBrandTouched ? 'text-[#E2652B]' : 'text-white'
            }`}
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
          {navLinks.map((item) => {
            const isActive = activeSection === item.href
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className="relative py-1 text-sm text-[#A1A1AA] hover:text-white transition-colors font-sans font-medium no-underline tracking-wide flex flex-col items-center group"
              >
                <span>{item.label}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeSectionIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        layout: {
                          type: 'spring',
                          stiffness: 180,
                          damping: 24,
                          mass: 0.9,
                        },
                        opacity: {
                          duration: 0.25,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      <div className="nav-shimmer-dots" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </a>
            )
          })}
        </div>

        {/* Right CTA: Let's talk ↗ Button */}
        <div className="flex items-center shrink-0 ml-auto md:ml-auto">
          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => setIsTouched(false)}
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              marginRight: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              background: isTouched ? 'rgba(226, 101, 43, 0.08)' : 'transparent',
              border: isTouched ? '1px solid #E2652B' : '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: isTouched ? '0 0 20px rgba(226, 101, 43, 0.22)' : 'none',
              color: '#F3F1EE',
              fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box',
              transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.2s ease',
            }}
            className="group hover:!border-[#E2652B] hover:!bg-[rgba(226,101,43,0.08)] hover:shadow-[0_0_20px_rgba(226,101,43,0.22)] active:!border-[#E2652B] active:!bg-[rgba(226,101,43,0.08)] active:shadow-[0_0_20px_rgba(226,101,43,0.22)] active:scale-95 no-underline cursor-pointer !py-[10px] !px-[18px] text-sm"
          >
            <span>Let's talk</span>
            <ArrowUpRight
              className={`w-4 h-4 shrink-0 transition-all duration-300 ease-out group-hover:text-[#E2652B] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-active:text-[#E2652B] group-active:translate-x-[3px] group-active:-translate-y-[3px] ${
                isTouched
                  ? 'text-[#E2652B] translate-x-[3px] -translate-y-[3px]'
                  : 'text-[#A1A1AA]'
              }`}
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
        {navLinks.map((item) => {
          const isActive = activeSection === item.href
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              style={{
                background: scrolled ? 'rgba(18, 18, 22, 0.92)' : 'rgba(22, 22, 26, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
              }}
              className="flex-1 py-1.5 px-2.5 rounded-full text-[11px] font-mono font-medium text-[#D4D4D8] hover:text-[#E2652B] hover:border-[#E2652B]/60 active:scale-95 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.45)] no-underline flex items-center justify-center gap-1.5 whitespace-nowrap relative overflow-hidden"
            >
              <span className={`w-1 h-1 rounded-full transition-colors duration-300 ${isActive ? 'bg-white' : 'bg-[#E2652B]'}`} />
              <span className="relative">
                {item.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveSectionIndicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        layout: {
                          type: 'spring',
                          stiffness: 180,
                          damping: 24,
                          mass: 0.9,
                        },
                        opacity: {
                          duration: 0.25,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      <div className="nav-shimmer-dots" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </a>
          )
        })}
      </motion.div>
    </header>
  )
}
