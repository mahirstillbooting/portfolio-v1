import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Copy, Check } from 'lucide-react'
import PortraitCanvas from './PortraitCanvas'
import mahirImg from '../assets/mahir.png'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const email = 'stellaroasis116@gmail.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        minHeight: '100vh',
        padding: '96px 24px 64px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '96px',
        width: '100%',
        overflow: 'hidden',
      }}
      className="select-none scroll-mt-[96px]"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-b from-[#E2652B]/10 via-transparent to-transparent blur-[160px] pointer-events-none z-0" />

      {/* 100% Viewport Height Interactive Portrait & Scatter Dot-Matrix Canvas */}
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        className="overflow-hidden pointer-events-auto"
      >
        <PortraitCanvas imageSrc={mahirImg} />
      </div>

      {/* Hero Text Overlay (Strictly layered on top with z-index: 10) */}
      <div
        id="hero-text-overlay"
        style={{
          zIndex: 10,
          position: 'relative',
          textAlign: 'center',
        }}
        className="w-full max-w-4xl px-4 flex flex-col items-center pointer-events-none"
      >
        {/* Subtle dark backdrop gradient directly behind title for 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent blur-2xl -z-10 pointer-events-none scale-125" />

        {/* HEADLINE IN INSTRUMENT SERIF (Single line fit) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 'clamp(2.2rem, 6.5vw, 5.8rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            whiteSpace: 'normal',
          }}
          className="italic text-white select-none drop-shadow-[0_16px_48px_rgba(0,0,0,0.95)]"
        >
          Mahiruddin Chowdhury
        </motion.h1>

        {/* Clean subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '17px',
            color: '#A1A1AA',
            marginTop: '10px',
            marginBottom: '24px',
          }}
          className="font-sans font-normal leading-relaxed text-center"
        >
          Computer Science &amp; Engineering Student • Building Web &amp; Software Systems.
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

          {/* Secondary Copy Email Button */}
          <button
            type="button"
            onClick={copyEmail}
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#EDEDED',
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="hover:bg-white/[0.08] hover:border-[#E2652B] hover:text-[#E2652B] hover:-translate-y-0.5 active:scale-95"
            title="Click to copy email address"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-400" />
                <span>Copy email</span>
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Smooth Bottom Gradient Fade into Projects */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(11, 11, 12, 0.7) 60%, #0b0b0c 100%)',
        }}
      />
    </section>
  )
}
