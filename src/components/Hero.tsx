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
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '720px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '72px',
        overflow: 'hidden',
      }}
      className="w-full select-none"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-b from-[#E2652B]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      {/* Centered Dot-Matrix Portrait Canvas (position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '520px',
          height: '520px',
          zIndex: 1,
        }}
        className="pointer-events-auto flex items-center justify-center"
      >
        <PortraitCanvas imageSrc={mahirImg} />
      </div>

      {/* Hero Text Overlay (z-index: 10; position: relative; margin-top: -140px; text-align: center;) */}
      <div
        style={{
          zIndex: 10,
          position: 'relative',
          marginTop: '-140px',
          textAlign: 'center',
        }}
        className="w-full max-w-4xl px-4 flex flex-col items-center pointer-events-none"
      >
        {/* Subtle dark backdrop gradient directly behind title for 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent blur-2xl -z-10 pointer-events-none scale-125" />

        {/* EDITORIAL HEADLINE IN INSTRUMENT SERIF */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
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

        {/* Single clean subtitle (18px, #A1A1AA, margin-top: 12px, margin-bottom: 28px) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '18px',
            color: '#A1A1AA',
            marginTop: '12px',
            marginBottom: '28px',
          }}
          className="font-sans font-normal leading-relaxed text-center"
        >
          Building full-stack web systems &amp; IoT hardware.
        </motion.p>

        {/* Spacious Modern Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-5 pointer-events-auto"
        >
          {/* Primary Pill Button */}
          <a
            href="#projects"
            style={{
              height: '48px',
              padding: '0 28px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#FFFFFF',
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="hover:bg-[#E2652B] hover:border-[#E2652B] hover:text-black hover:-translate-y-0.5 no-underline active:scale-95"
          >
            <span>Explore my work</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.75} />
          </a>

          {/* Secondary Minimal Button */}
          <a
            href="mailto:stellaroasis116@gmail.com"
            style={{
              height: '48px',
              padding: '0 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#D4D4D8',
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            className="hover:text-white hover:border-b-[#E2652B]"
          >
            <span>Start a conversation</span>
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
