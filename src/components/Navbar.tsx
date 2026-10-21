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
        className={`pointer-events-auto flex items-center justify-between w-full max-w-[820px] h-[56px] px-7 rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#101012]/80 border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'
            : 'bg-[#121214]/65 border-white/8 shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
        } backdrop-blur-[20px]`}
      >
        {/* Left: Brand Identity */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-xs tracking-wider text-[#F3F4F6] hover:text-[#E2652B] transition-colors font-mono font-medium no-underline"
        >
          <span className="live-dot" />
          <span className="tracking-tight font-semibold text-sm">MAHIRUDDIN</span>
          <span className="text-[10px] text-[#6B7280] hidden sm:inline">// 01</span>
        </a>

        {/* Center: Clean Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-1.5 text-xs text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/[0.04] rounded-full transition-all duration-150 font-sans font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right: CTA Button */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:stellaroasis116@gmail.com"
            className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs text-[#F3F4F6] bg-white/[0.06] hover:bg-[#E2652B] hover:text-black border border-white/10 hover:border-[#E2652B] rounded-full font-mono transition-all duration-200 active:scale-95 no-underline font-medium"
          >
            <span>Let's talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#121214]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 font-sans text-sm md:hidden"
          >
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors font-medium"
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
