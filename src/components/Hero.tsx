import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import PortraitCanvas from './PortraitCanvas'
import mahirImg from '../assets/mahir.png'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 pb-20 px-6 sm:px-8 max-w-[1200px] mx-auto overflow-visible select-none"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-gradient-to-b from-[#E2652B]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      {/* MAIN HERO STAGE (SARTHAK SHARMA EDITORIAL COMPOSITION) */}
      <div className="relative w-full flex flex-col items-center justify-center my-auto">
        
        {/* 1. Borderless Dot-Matrix Portrait Canvas (Masked seamlessly into #080808 with zero box boundaries) */}
        <div className="relative w-full max-w-[700px] h-[520px] sm:h-[600px] md:h-[660px] flex items-center justify-center z-0">
          <PortraitCanvas imageSrc={mahirImg} />
        </div>

        {/* 2. Overlapping Editorial Headline in Instrument Serif (Positioned across lower chest with legibility gradient) */}
        <div className="relative z-10 -mt-28 sm:-mt-36 md:-mt-40 lg:-mt-44 w-full flex flex-col items-center text-center px-4 pointer-events-none">
          
          {/* Subtle dark backdrop gradient directly behind title for 100% legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent blur-2xl -z-10 pointer-events-none scale-110" />

          {/* EDITORIAL HEADLINE IN INSTRUMENT SERIF */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(3.8rem, 7.5vw, 6.8rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
            }}
            className="italic text-white select-none drop-shadow-[0_16px_48px_rgba(0,0,0,0.95)]"
          >
            Mahiruddin Chowdhury
          </motion.h1>

          {/* Subheadline in Geist Sans */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg md:text-xl font-sans text-[#E5E7EB] font-normal max-w-xl mx-auto leading-relaxed"
          >
            Building full-shift web systems &amp; IoT hardware
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 text-xs sm:text-sm font-mono text-[#9CA3AF] max-w-lg leading-relaxed"
          >
            4th-year CSE student at East West University, Dhaka.
            Focusing on full-stack web platforms and embedded ESP32 systems.
          </motion.p>

          {/* DUAL ACTION BUTTONS (pointer-events-auto enabled for clickability) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#E2652B] hover:bg-[#E2652B]/90 text-black font-mono font-semibold text-xs tracking-wider transition-all duration-200 active:scale-95 no-underline shadow-[0_0_24px_rgba(226,101,43,0.35)]"
            >
              <span>Explore my work</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="mailto:stellaroasis116@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 hover:border-white/20 font-mono text-xs tracking-wider transition-all duration-200 active:scale-95 no-underline backdrop-blur-md"
            >
              <span>Start a conversation</span>
              <ArrowUpRight className="w-4 h-4 text-[#E2652B]" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
