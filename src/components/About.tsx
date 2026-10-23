import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Sparkles, Award, MapPin, Compass } from 'lucide-react'
import { getAudioEnabled } from '../utils/audioState'
import discoverySoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

export interface Hobby {
  id: string
  title: string
  desc: string
  tag: string
}

export const HOBBIES: Hobby[] = [
  {
    id: 'keyboards',
    title: 'Mechanical Keyboards',
    desc: 'Custom switches, satisfying sound signatures, and tactile feedback.',
    tag: 'Hardware & Tactile',
  },
  {
    id: 'perfume',
    title: 'Perfume Notes',
    desc: 'Niche accords, olfactory pyramids, and fragrance chemistry.',
    tag: 'Fragrance Chemistry',
  },
  {
    id: 'gaming',
    title: 'Retro PC Gaming',
    desc: 'Metal Slug, GTA San Andreas, retro PC gaming, and Rockstar worlds.',
    tag: 'Formative Roots',
  },
  {
    id: 'ai',
    title: 'AI Engineering',
    desc: 'Creative AI workflows using tools such as Antigravity, Claude, and Figma.',
    tag: 'Prompt Workflows',
  },
]

// 21-cell contribution matrix layout (7 columns x 3 rows)
interface CellConfig {
  id: number
  colorClass: string
  bgStyle: string
  borderStyle: string
  isBlack: boolean
}

const GRID_CELL_STYLES: Omit<CellConfig, 'id'>[] = [
  // Row 1 (7 cells)
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'medium_orange', bgStyle: '#5a2610', borderStyle: 'rgba(226, 101, 43, 0.35)', isBlack: false },

  // Row 2 (7 cells)
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'vibrant_orange', bgStyle: '#e2652b', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },

  // Row 3 (7 cells)
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'bright_orange', bgStyle: '#963c16', borderStyle: 'rgba(226, 101, 43, 0.45)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.05)', isBlack: true },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.22)', isBlack: false },
]

export default function About() {
  const [winningCellMap, setWinningCellMap] = useState<Record<number, Hobby>>({})
  const [discoveredCells, setDiscoveredCells] = useState<number[]>([])
  const [discoveredHobbies, setDiscoveredHobbies] = useState<Hobby[]>([])
  const [flippedCells, setFlippedCells] = useState<number[]>([])
  const [checkedInactiveCells, setCheckedInactiveCells] = useState<number[]>([])
  const [animatingCellId, setAnimatingCellId] = useState<number | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState<string>('')

  const cellRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const lastInteractedCellRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startFreshHunt = useCallback(() => {
    const validCandidateIndices: number[] = []
    GRID_CELL_STYLES.forEach((cell, idx) => {
      if (!cell.isBlack) {
        validCandidateIndices.push(idx)
      }
    })

    const shuffled = [...validCandidateIndices].sort(() => Math.random() - 0.5)
    const chosenWinners = shuffled.slice(0, 4)

    const map: Record<number, Hobby> = {}
    chosenWinners.forEach((cellIdx, i) => {
      map[cellIdx] = HOBBIES[i]
    })

    setWinningCellMap(map)
    setDiscoveredCells([])
    setDiscoveredHobbies([])
    setFlippedCells([])
    setCheckedInactiveCells([])
    setAnimatingCellId(null)
    setFeedbackNotice('')
  }, [])

  useEffect(() => {
    startFreshHunt()
  }, [startFreshHunt])

  const playDiscoverySound = () => {
    if (!getAudioEnabled()) return
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(discoverySoundUrl)
      }
      const audio = audioRef.current
      audio.volume = 0.6
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {
      // Audio fallback
    }
  }

  const handleCellClick = (cellIndex: number) => {
    if (animatingCellId !== null) return

    lastInteractedCellRef.current = cellIndex
    const cellConfig = GRID_CELL_STYLES[cellIndex]

    if (cellConfig.isBlack) {
      setCheckedInactiveCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFeedbackNotice('No activity recorded on this day.')
      return
    }

    if (discoveredCells.includes(cellIndex)) {
      return
    }

    const winningHobby = winningCellMap[cellIndex]
    if (!winningHobby) {
      setCheckedInactiveCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFeedbackNotice('Nothing hidden here. Keep exploring.')
      return
    }

    // Winning cell discovered: 3D flip + sound effect + side-stack accumulation
    setAnimatingCellId(cellIndex)
    setFeedbackNotice('')
    playDiscoverySound()

    setFlippedCells((prev) => [...prev, cellIndex])

    setTimeout(() => {
      setDiscoveredCells((prev) => [...prev, cellIndex])
      setDiscoveredHobbies((prev) => {
        if (prev.some((h) => h.id === winningHobby.id)) return prev
        return [...prev, winningHobby]
      })
      setAnimatingCellId(null)
    }, 450)
  }

  const discoveredCount = discoveredCells.length
  const allFound = discoveredCount === 4

  return (
    <section
      id="about"
      style={{
        scrollMarginTop: '110px',
        paddingTop: 'clamp(90px, 14vw, 160px)',
        paddingBottom: '160px',
      }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center px-4 sm:px-6 scroll-mt-[110px] select-none"
    >
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14 space-y-2">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
          <Compass className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>03 · ABOUT &amp; MINDSET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-[#F3F4F6] tracking-tight">
          The Honest Journey
        </h2>
      </div>

      {/* 12-Column Bento Grid Layout (gap: 24px) */}
      <div
        style={{
          display: 'grid',
          gap: '24px',
        }}
        className="grid grid-cols-1 lg:grid-cols-12 items-start"
      >
        
        {/* Left Bio Card (grid-column: span 7; padding: 40px;) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '40px',
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          className="lg:col-span-7 flex flex-col p-6 sm:p-8 lg:p-[40px] hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Header Divider */}
          <div className="flex items-center justify-between text-xs font-mono text-[#71717A] tracking-wider pb-4 mb-6 border-b border-white/[0.08]">
            <span className="text-[#F3F4F6]/90 font-medium">SYSTEM PROFILE · IDENTITY</span>
            <span className="text-[#E2652B] font-semibold">EAST WEST UNIVERSITY</span>
          </div>

          {/* Clean Geist Sans Typography */}
          <div
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#D4D4D8',
            }}
            className="space-y-4 font-normal"
          >
            <p style={{ marginBottom: '16px' }}>
              I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I learn at my own pace and work persistently until problems are solved.
            </p>
            <p>
              My passion began with <span className="text-white font-medium">Metal Slug</span> arcades and <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, evolving into software development, web tinkering, and AI engineering.
            </p>
          </div>

          {/* Badges Footer Row */}
          <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">freeCodeCamp · Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#A1A1AA]">
              Native &amp; Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Right Column: Combined Location & Academic Education Card (grid-column: span 5;) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            padding: '32px',
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          className="lg:col-span-5 flex flex-col p-6 sm:p-[32px] hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Top Section: Dhaka City Telemetry */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-3 mb-4 border-b border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-[#F3F4F6]/90 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                LOCATION
              </span>
              <span className="text-[#E2652B] font-semibold">23.81° N, 90.41° E</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}
              className="font-sans tracking-tight"
            >
              Dhaka City
            </h3>
            <p
              style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: '1.6' }}
              className="font-sans"
            >
              Living and engineering in the heart of Dhaka. Fast-paced, resilient, and always active.
            </p>
          </div>

          {/* Clean Integrated Divider */}
          <div className="border-t border-white/[0.08] my-6" />

          {/* Bottom Section: Integrated Academic Degree & Education Details */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-3 mb-4 border-b border-white/[0.08]">
              <span className="text-[#F3F4F6]/90 font-medium">ACADEMIC DEGREE</span>
              <span className="text-[#E2652B] font-semibold">4TH YEAR</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}
              className="font-sans tracking-tight"
            >
              BSc in Computer Science &amp; Engineering
            </h3>
            <p
              style={{ color: '#E2652B', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, marginBottom: '8px' }}
            >
              East West University · 4th Year
            </p>
            <p
              style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: '1.6' }}
              className="font-sans"
            >
              Software engineering, database architectures, and QA verification.
            </p>
          </div>
        </motion.div>

        {/* Hidden Passions Grid with Smooth Side-Stack Disclosure (grid-column: span 12;) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            padding: '36px',
            marginTop: '8px',
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          className="lg:col-span-12 w-full p-6 sm:p-8 lg:p-[36px] hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Card Header Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 mb-5 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest text-[#E2652B] uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE DISCOVERY</span>
              </div>
              <h3
                style={{ color: '#F3F4F6' }}
                className="text-xl sm:text-2xl font-sans font-bold tracking-tight"
              >
                Hidden Passions
              </h3>
              <p
                style={{ color: '#A1A1AA' }}
                className="text-xs sm:text-sm mt-1 font-sans"
              >
                Four little things that keep me curious. Find them in the grid.
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#E2652B]/30 text-xs font-mono font-medium text-[#E2652B] flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    allFound
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                      : 'bg-[#E2652B] shadow-[0_0_8px_#E2652B]'
                  }`}
                />
                <span>{allFound ? 'All 4 discovered' : `${discoveredCount} of 4 found`}</span>
              </div>

              <button
                type="button"
                onClick={startFreshHunt}
                className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#F3F4F6] transition-colors cursor-pointer active:scale-95 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-white/8"
                aria-label="Start fresh hunt"
                title="Restart treasure hunt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start fresh</span>
              </button>
            </div>
          </div>

          {/* Side-Stack Interactive Area: Grid on Left, Discovered Cards Accumulating on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
            
            {/* Left Side: 21-Cell Contribution Grid */}
            <div className="lg:col-span-7 flex flex-col items-center w-full">
              <div
                role="grid"
                aria-label="Passion discovery contribution grid"
                className="grid grid-cols-7 gap-2 sm:gap-3.5 w-full max-w-[520px] mx-auto p-3 sm:p-5 rounded-2xl bg-[#070709] border border-white/5"
              >
                {GRID_CELL_STYLES.map((cellStyle, idx) => {
                  const isFlipped = flippedCells.includes(idx)
                  const isDiscovered = discoveredCells.includes(idx)
                  const isCheckedInactive = checkedInactiveCells.includes(idx)

                  return (
                    <div
                      key={idx}
                      style={{ perspective: '1000px' }}
                      className="w-full aspect-square max-w-[80px] mx-auto relative"
                    >
                      <button
                        ref={(el) => {
                          cellRefs.current[idx] = el
                        }}
                        type="button"
                        onClick={() => handleCellClick(idx)}
                        aria-label={
                          isDiscovered
                            ? `Discovered cell ${idx + 1}: ${winningCellMap[idx]?.title}`
                            : cellStyle.isBlack
                            ? `Inactive day ${idx + 1}`
                            : `Contribution cell ${idx + 1}`
                        }
                        style={{
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                        className={`w-full h-full rounded-lg sm:rounded-xl relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2652B] active:scale-95 transition-transform ${
                          cellStyle.isBlack ? 'cursor-default opacity-60' : 'hover:scale-105'
                        }`}
                      >
                        {/* FRONT FACE (Default Contribution Grid State) */}
                        <div
                          style={{
                            backgroundColor: cellStyle.bgStyle,
                            border: `1px solid ${cellStyle.borderStyle}`,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                          className={`absolute inset-0 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                            isCheckedInactive && !cellStyle.isBlack ? 'opacity-40' : ''
                          }`}
                        >
                          {isCheckedInactive && !cellStyle.isBlack && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                          )}
                        </div>

                        {/* REVERSE FACE (Realistic 3D Orange Accented Discovery Face) */}
                        <div
                          style={{
                            backgroundColor: '#E2652B',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            boxShadow: '0 0 16px rgba(226, 101, 43, 0.6)',
                          }}
                          className="absolute inset-0 rounded-lg sm:rounded-xl flex items-center justify-center text-white"
                        >
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Feedback Text (Zero Cut-Off / High Contrast) */}
              <div className="min-h-[28px] mt-4 flex items-center justify-center text-xs font-mono text-center">
                <AnimatePresence mode="wait">
                  {allFound ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-emerald-400 font-medium"
                    >
                      All four passions discovered.
                    </motion.div>
                  ) : feedbackNotice ? (
                    <motion.div
                      key={feedbackNotice}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{ color: '#A1A1AA' }}
                    >
                      {feedbackNotice}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ color: '#A1A1AA' }}
                    >
                      Discover a highlighted cell to reveal a passion.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Dedicated Smooth Side-Stack Panel for Discovered Items */}
            <div className="lg:col-span-5 flex flex-col w-full">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-3 mb-3.5 border-b border-white/[0.08]">
                <span className="text-[#F3F4F6]/90 font-medium">DISCOVERED PASSIONS</span>
                <span className="text-[#E2652B] font-semibold">{discoveredHobbies.length} / 4</span>
              </div>

              <div className="flex flex-col gap-3 min-h-[220px]">
                {discoveredHobbies.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs font-mono text-[#71717A] min-h-[200px] select-none">
                    <Sparkles className="w-5 h-5 text-white/20 mb-2" />
                    <span>Uncover active cells in the grid to reveal passions here.</span>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {discoveredHobbies.map((hobby, index) => (
                      <motion.div
                        key={hobby.id}
                        initial={{ opacity: 0, x: 24, y: 8 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="p-4 sm:p-5 rounded-2xl bg-[#141418] border border-white/[0.08] hover:border-[#E2652B]/40 transition-all shadow-md text-left"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-mono font-medium text-[#E2652B] tracking-wider uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] animate-pulse" />
                            {hobby.tag}
                          </span>
                          <span className="text-[10px] font-mono text-[#71717A]">
                            #{index + 1}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-sans font-bold text-[#F3F4F6] tracking-tight">
                          {hobby.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed mt-1 font-sans">
                          {hobby.desc}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
