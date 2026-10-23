import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, X, Sparkles, Award, MapPin, Compass } from 'lucide-react'
import { getAudioEnabled } from '../utils/audioState'
import discoverySoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

export interface Hobby {
  id: string
  title: string
  desc: string
}

export const HOBBIES: Hobby[] = [
  {
    id: 'keyboards',
    title: 'Mechanical Keyboards',
    desc: 'Custom switches, satisfying sound signatures, and tactile feedback.',
  },
  {
    id: 'perfume',
    title: 'Perfume Notes',
    desc: 'Niche accords, olfactory pyramids, and fragrance chemistry.',
  },
  {
    id: 'gaming',
    title: 'Retro PC Gaming',
    desc: 'Metal Slug, GTA San Andreas, retro PC gaming, and Rockstar worlds.',
  },
  {
    id: 'ai',
    title: 'AI Engineering',
    desc: 'Creative AI workflows using tools such as Antigravity, Claude, and Figma.',
  },
]

// 21-cell contribution matrix layout (7 columns x 3 rows) matching the reference design
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
  // Exactly 4 winning cells mapped to hobbies
  const [winningCellMap, setWinningCellMap] = useState<Record<number, Hobby>>({})
  const [discoveredCells, setDiscoveredCells] = useState<number[]>([])
  const [flippedCells, setFlippedCells] = useState<number[]>([])
  const [checkedInactiveCells, setCheckedInactiveCells] = useState<number[]>([])
  const [activeModalHobby, setActiveModalHobby] = useState<Hobby | null>(null)
  const [animatingCellId, setAnimatingCellId] = useState<number | null>(null)
  const [feedbackNotice, setFeedbackNotice] = useState<string>('')

  const cellRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const lastInteractedCellRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize a fresh treasure hunt round
  const startFreshHunt = useCallback(() => {
    // Collect all valid colored indices (non-black cells)
    const validCandidateIndices: number[] = []
    GRID_CELL_STYLES.forEach((cell, idx) => {
      if (!cell.isBlack) {
        validCandidateIndices.push(idx)
      }
    })

    // Shuffle and pick exactly 4 distinct indices
    const shuffled = [...validCandidateIndices].sort(() => Math.random() - 0.5)
    const chosenWinners = shuffled.slice(0, 4)

    const map: Record<number, Hobby> = {}
    chosenWinners.forEach((cellIdx, i) => {
      map[cellIdx] = HOBBIES[i]
    })

    setWinningCellMap(map)
    setDiscoveredCells([])
    setFlippedCells([])
    setCheckedInactiveCells([])
    setActiveModalHobby(null)
    setAnimatingCellId(null)
    setFeedbackNotice('')
  }, [])

  useEffect(() => {
    startFreshHunt()
  }, [startFreshHunt])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (activeModalHobby) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModalHobby])

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalHobby) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalHobby])

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
    if (animatingCellId !== null || activeModalHobby !== null) return

    lastInteractedCellRef.current = cellIndex
    const cellConfig = GRID_CELL_STYLES[cellIndex]

    // 1. Black cells: strictly inactive days with no activity
    if (cellConfig.isBlack) {
      setCheckedInactiveCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFeedbackNotice('No activity recorded on this day.')
      return
    }

    // 2. Already discovered cell
    if (discoveredCells.includes(cellIndex)) {
      const alreadyFound = winningCellMap[cellIndex]
      if (alreadyFound) {
        setActiveModalHobby(alreadyFound)
      }
      return
    }

    // 3. Checked active cell without a passion
    const winningHobby = winningCellMap[cellIndex]
    if (!winningHobby) {
      setCheckedInactiveCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFeedbackNotice('Nothing hidden here. Keep exploring.')
      return
    }

    // 4. Winning cell discovered
    setAnimatingCellId(cellIndex)
    setFeedbackNotice('')
    playDiscoverySound()

    // Trigger the 3D flip animation
    setFlippedCells((prev) => [...prev, cellIndex])

    setTimeout(() => {
      setDiscoveredCells((prev) => [...prev, cellIndex])
      setActiveModalHobby(winningHobby)
      setAnimatingCellId(null)
    }, 650)
  }

  const closeModal = () => {
    setActiveModalHobby(null)
    if (lastInteractedCellRef.current !== null) {
      const btn = cellRefs.current[lastInteractedCellRef.current]
      if (btn) btn.focus()
    }
  }

  const discoveredCount = discoveredCells.length
  const allFound = discoveredCount === 4

  return (
    <section
      id="about"
      style={{
        paddingTop: 'clamp(90px, 14vw, 160px)',
        paddingBottom: 'clamp(90px, 14vw, 160px)',
      }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center px-4 sm:px-6 scroll-mt-24 select-none"
    >
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14 space-y-2">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
          <Compass className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>03 · ABOUT &amp; MINDSET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          The Honest Journey
        </h2>
      </div>

      {/* Unified Bento Grid Layout: 12-Column CSS Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): Main Identity and Biography Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="flex flex-col">
            {/* Top Bar Header with Clear Divider */}
            <div className="flex items-center justify-between text-xs font-mono text-[#71717A] tracking-widest pb-4 mb-6 border-b border-white/8">
              <span>SYSTEM PROFILE · IDENTITY</span>
              <span className="text-[#E2652B] font-semibold">EAST WEST UNIVERSITY</span>
            </div>

            {/* Main Bio Text */}
            <div
              style={{
                fontFamily: "'Geist Sans', sans-serif",
              }}
              className="space-y-4 text-sm sm:text-base leading-relaxed text-[#D4D4D8]"
            >
              <p>
                I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I learn at my own pace and work persistently until problems are solved.
              </p>
              <p>
                My passion began with <span className="text-white font-medium">Metal Slug</span> arcades and <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, evolving into software development, web tinkering, and AI engineering.
              </p>
            </div>
          </div>

          {/* Badges Dedicated Footer Flex Row */}
          <div className="mt-8 pt-5 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">freeCodeCamp · Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#A1A1AA]">
              Native &amp; Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Right Column (5 cols): Vertically Stacked Location and Academic Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Top Card: Location / Dhaka City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#71717A] pb-3 mb-4 border-b border-white/8">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                  LOCATION
                </span>
                <span className="text-[#E2652B] font-semibold">23.81° N, 90.41° E</span>
              </div>

              <h3 className="text-xl font-sans font-semibold text-white mb-2">
                Dhaka City
              </h3>
              <p className="text-sm font-sans text-[#A1A1AA] leading-relaxed">
                Living and engineering in the heart of Dhaka. Fast-paced, resilient, and always active.
              </p>
            </div>

            {/* Clean ASCII Dot Map Snippet */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-white/8 font-mono text-xs select-none">
              <div className="text-[#8E9298] leading-tight overflow-x-auto whitespace-pre">
                {`  ⣠⠤⠤⠤⠤⠤⣠⠤⠤⡀     ⣀⠤⠤⠤⡀
⢀⠎       ⢸   ⠉⠲⠤⠤⠤⠎   ⢱
⡰⠁  `}
                <span className="text-[#F1FA8C] font-bold">Dhaka</span>
                <span className="text-[#4D7CFE]">∷∷</span>
                {` ⠣⠤⠤⠤⠤⠤⠤⠤⠤⠤⠴⠁
⠣⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤`}
              </div>
            </div>
          </motion.div>

          {/* Bottom Card: Academic Degree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex flex-col justify-center p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="text-xs font-mono tracking-widest text-[#71717A] pb-2 mb-3 border-b border-white/8">
              ACADEMIC DEGREE
            </div>
            <div className="text-lg font-sans text-white font-bold mb-1 tracking-tight">
              BSc in Computer Science &amp; Engineering
            </div>
            <div className="text-xs font-mono text-[#E2652B] mb-2 font-semibold">
              East West University · 4th Year
            </div>
            <p className="text-sm font-sans text-[#A1A1AA] leading-relaxed">
              Software engineering, database architectures, and QA verification.
            </p>
          </motion.div>

        </div>

        {/* Bottom Full-Width Card: Hidden Passions Treasure Hunt (Replacing the 4 individual hobby cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-12 rounded-2xl sm:rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl p-4 sm:p-8 lg:p-9 overflow-hidden backdrop-blur-xl mt-2"
        >
          {/* Card Header Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-white/8">
            <div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest text-[#E2652B] uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE DISCOVERY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                Hidden Passions
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-sans">
                Four little things that keep me curious. Find them in the grid.
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.04] border border-[#E2652B]/30 text-[11px] sm:text-xs font-mono font-medium text-[#E2652B] flex items-center gap-2">
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
                className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-white transition-colors cursor-pointer active:scale-95 px-2.5 py-1 sm:py-1.5 rounded-lg hover:bg-white/5 border border-white/8"
                aria-label="Start fresh hunt"
                title="Restart treasure hunt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start fresh</span>
              </button>
            </div>
          </div>

          {/* 21-Cell Contribution Grid (7 columns x 3 rows) */}
          <div
            role="grid"
            aria-label="Passion discovery contribution grid"
            className="grid grid-cols-7 gap-1.5 sm:gap-3.5 max-w-[720px] mx-auto my-2 sm:my-3 p-2 sm:p-5 rounded-xl sm:rounded-2xl bg-[#09090b] border border-white/5"
          >
            {GRID_CELL_STYLES.map((cellStyle, idx) => {
              const isFlipped = flippedCells.includes(idx)
              const isDiscovered = discoveredCells.includes(idx)
              const isCheckedInactive = checkedInactiveCells.includes(idx)

              return (
                <div
                  key={idx}
                  style={{ perspective: '1000px' }}
                  className="w-full aspect-square max-w-[84px] mx-auto relative"
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

          {/* Dynamic Restrained Feedback or Completion Banner */}
          <div className="min-h-[26px] mt-4 flex items-center justify-center text-xs font-mono">
            <AnimatePresence mode="wait">
              {allFound ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-emerald-400 font-medium"
                >
                  All four passions discovered. Thanks for exploring.
                </motion.div>
              ) : feedbackNotice ? (
                <motion.div
                  key={feedbackNotice}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[#71717A]"
                >
                  {feedbackNotice}
                </motion.div>
              ) : (
                <motion.div
                  key="default-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#71717A]"
                >
                  Discover a highlighted cell to reveal a passion.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clean Discovered Badges Row (revealed once discovered) */}
          {discoveredCells.length > 0 && (
            <div className="w-full mt-4 pt-4 border-t border-white/6 flex flex-wrap items-center justify-center gap-2">
              {discoveredCells.map((idx) => {
                const hobby = winningCellMap[idx]
                if (!hobby) return null
                return (
                  <button
                    key={hobby.id}
                    type="button"
                    onClick={() => setActiveModalHobby(hobby)}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-[#E2652B]/40 hover:border-[#E2652B] text-xs font-sans text-neutral-200 hover:text-white transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B]" />
                    <span>{hobby.title}</span>
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>

      </div>

      {/* Glassmorphism Discovery Modal */}
      <AnimatePresence>
        {activeModalHobby && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hobby-modal-title"
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(18, 18, 20, 0.96)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(226, 101, 43, 0.15)',
              }}
              className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative text-left select-text"
            >
              {/* Modal Top Header with Close Icon */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/8">
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#E2652B] font-medium uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] animate-pulse" />
                  <span>Discovered Passion</span>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Discovered Hobby Title */}
              <h3
                id="hobby-modal-title"
                style={{ fontFamily: "'Geist Sans', sans-serif" }}
                className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              >
                {activeModalHobby.title}
              </h3>

              {/* Discovered Hobby Description */}
              <p className="mt-3 text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-normal">
                {activeModalHobby.desc}
              </p>

              {/* Close Button Action */}
              <div className="mt-6 pt-4 border-t border-white/8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-black font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-98 cursor-pointer"
                >
                  Continue exploring
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
