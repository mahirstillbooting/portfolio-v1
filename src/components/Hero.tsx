import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import PortraitCanvas from './PortraitCanvas'
import mahirImg from '../assets/mahir.png'

function LiveClock() {
  const clockRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const update = () => {
      if (clockRef.current) {
        const now = new Date()
        clockRef.current.textContent = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      }
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])
  return <span ref={clockRef} className="font-mono text-white/90" />
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-24 pb-12 overflow-hidden select-none"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#E2652B]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      {/* TOP SUBTLE HUD META */}
      <div className="w-full max-w-[1240px] px-6 sm:px-8 flex items-center justify-between text-[11px] font-mono text-[#6B7280] tracking-widest uppercase pb-6 border-b border-white/6 mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[#9CA3AF]">MAHIRUDDIN CHOWDHURY</span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#6B7280]">CSE 4TH YEAR // EWU</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-white/40">LOC: DHAKA, BD</span>
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="text-[#E2652B]">GMT+6</span>
            <LiveClock />
          </div>
        </div>
      </div>

      {/* MAIN HERO STAGE (FULL-WIDTH SCATTERED PARTICLES + EDITORIAL COMPOSITION) */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-auto py-2">
        
        {/* Full-width interactive portrait + ambient scattered particle canvas */}
        <div className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] flex items-center justify-center z-0">
          <PortraitCanvas imageSrc={mahirImg} />
        </div>

        {/* Overlapping Editorial Headline in Instrument Serif (Positioned across lower chest with legibility gradient) */}
        <div className="relative z-10 -mt-24 sm:-mt-28 md:-mt-32 w-full max-w-4xl flex flex-col items-center text-center px-4 pointer-events-none">
          
          {/* Subtle dark backdrop gradient directly behind title for 100% legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent blur-xl -z-10 pointer-events-none scale-110" />

          {/* EDITORIAL HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-white tracking-[-0.03em] leading-[0.92] select-none text-[clamp(3.5rem,7vw,6.5rem)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
          >
            Mahiruddin Chowdhury
          </motion.h1>

          {/* Subheadline & description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg md:text-xl font-sans text-[#E5E7EB] font-normal max-w-xl mx-auto leading-relaxed"
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

      {/* BOTTOM FOOTER TELEMETRY DETAILS */}
      <div className="w-full max-w-[1240px] px-6 sm:px-8 flex items-center justify-between text-[11px] font-mono text-[#6B7280] tracking-widest pt-6 border-t border-white/6 mt-6 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#E2652B]">01 / PRESENCE</span>
          <span className="text-white/20">•</span>
          <span>EAST WEST UNIVERSITY // DHAKA</span>
        </div>
        <div className="hidden sm:block">
          SYS.STATUS: <span className="text-white">ONLINE</span>
        </div>
      </div>
    </section>
  )
}
