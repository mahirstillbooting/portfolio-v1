import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, X, Sparkles } from 'lucide-react'
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

// 28-cell contribution matrix layout (7 columns x 4 rows)
// Palette: black (inactive days with no activity), charcoal, dark brown, medium orange, bright orange, vibrant orange
interface CellConfig {
  id: number
  colorClass: string
  bgStyle: string
  borderStyle: string
  isBlack: boolean
}

const GRID_CELL_STYLES: Omit<CellConfig, 'id'>[] = [
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.18)', isBlack: false },
  { colorClass: 'medium_orange', bgStyle: '#5a2610', borderStyle: 'rgba(226, 101, 43, 0.32)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'bright_orange', bgStyle: '#963c16', borderStyle: 'rgba(226, 101, 43, 0.45)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },

  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'vibrant_orange', bgStyle: '#e2652b', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.18)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'medium_orange', bgStyle: '#5a2610', borderStyle: 'rgba(226, 101, 43, 0.32)', isBlack: false },

  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.18)', isBlack: false },
  { colorClass: 'bright_orange', bgStyle: '#963c16', borderStyle: 'rgba(226, 101, 43, 0.45)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'vibrant_orange', bgStyle: '#e2652b', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.18)', isBlack: false },

  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'medium_orange', bgStyle: '#5a2610', borderStyle: 'rgba(226, 101, 43, 0.32)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1c1c20', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'bright_orange', bgStyle: '#963c16', borderStyle: 'rgba(226, 101, 43, 0.45)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'dark_brown', bgStyle: '#2e1a12', borderStyle: 'rgba(226, 101, 43, 0.18)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0d0d0f', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
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
    // Prevent interaction if an animation is currently playing or modal is open
    if (animatingCellId !== null || activeModalHobby !== null) return

    lastInteractedCellRef.current = cellIndex
    const cellConfig = GRID_CELL_STYLES[cellIndex]

    // 1. Black cells: strictly inactive, represent days with no activity
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

    // 4. Winning cell discovered!
    setAnimatingCellId(cellIndex)
    setFeedbackNotice('')
    playDiscoverySound()

    // Trigger the 3D flip animation
    setFlippedCells((prev) => [...prev, cellIndex])

    // After realistic 600ms flip animation, reveal hobby modal and update discovered state
    setTimeout(() => {
      setDiscoveredCells((prev) => [...prev, cellIndex])
      setActiveModalHobby(winningHobby)
      setAnimatingCellId(null)
    }, 650)
  }

  const closeModal = () => {
    setActiveModalHobby(null)
    // Return focus to the triggered cell for accessibility
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
        paddingTop: 'clamp(80px, 12vw, 140px)',
        paddingBottom: 'clamp(80px, 12vw, 140px)',
      }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col items-center justify-center px-4 sm:px-6 scroll-mt-24 select-none"
    >
      {/* Section Header: Minimalist and Personal */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
        <h2
          style={{ fontFamily: "'Geist Sans', sans-serif" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          The Honest Journey
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] font-normal leading-relaxed">
          Four little things that keep me curious. Can you find them?
        </p>
      </div>

      {/* Main Single Contribution Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(17, 17, 19, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
        className="w-full max-w-[620px] rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center relative"
      >
        {/* Card Header Status Row */}
        <div className="w-full flex items-center justify-between pb-5 mb-6 border-b border-white/6 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#A1A1AA]">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                allFound
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                  : 'bg-[#E2652B] shadow-[0_0_8px_#E2652B]'
              }`}
            />
            <span className="text-white font-medium">
              {allFound ? 'All four discovered' : `${discoveredCount} of 4 found`}
            </span>
          </div>

          <button
            type="button"
            onClick={startFreshHunt}
            className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-white transition-colors cursor-pointer active:scale-95 px-2 py-1 rounded-md hover:bg-white/5"
            aria-label="Start fresh hunt"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start fresh</span>
          </button>
        </div>

        {/* 28-Cell Contribution Treasure Hunt Grid */}
        <div
          role="grid"
          aria-label="Passion discovery contribution grid"
          className="grid grid-cols-7 gap-2.5 sm:gap-3.5 my-2 p-2 sm:p-4 rounded-2xl bg-[#0b0b0d]/70 border border-white/5"
        >
          {GRID_CELL_STYLES.map((cellStyle, idx) => {
            const isFlipped = flippedCells.includes(idx)
            const isDiscovered = discoveredCells.includes(idx)
            const isCheckedInactive = checkedInactiveCells.includes(idx)

            return (
              <div
                key={idx}
                style={{ perspective: '1000px' }}
                className="w-9 h-9 sm:w-12 sm:h-12 aspect-square relative"
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
                  className={`w-full h-full rounded-lg relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2652B] active:scale-95 transition-transform ${
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
                    className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                      isCheckedInactive && !cellStyle.isBlack ? 'opacity-40' : ''
                    }`}
                  >
                    {isCheckedInactive && !cellStyle.isBlack && (
                      <span className="w-1 h-1 rounded-full bg-neutral-600" />
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
                    className="absolute inset-0 rounded-lg flex items-center justify-center text-white"
                  >
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Dynamic Restrained Feedback or Completion Banner */}
        <div className="min-h-[28px] mt-5 flex items-center justify-center text-xs font-mono">
          <AnimatePresence mode="wait">
            {allFound ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-emerald-400 font-medium"
              >
                All 4 discovered. Thanks for exploring.
              </motion.div>
            ) : feedbackNotice ? (
              <motion.div
                key={feedbackNotice}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
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
                Click active cells to uncover hidden interests.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clean Discovered Badges Row (revealed once discovered) */}
        {discoveredCells.length > 0 && (
          <div className="w-full mt-6 pt-5 border-t border-white/6 flex flex-wrap items-center justify-center gap-2">
            {discoveredCells.map((idx) => {
              const hobby = winningCellMap[idx]
              if (!hobby) return null
              return (
                <button
                  key={hobby.id}
                  type="button"
                  onClick={() => setActiveModalHobby(hobby)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-[#E2652B]/40 hover:border-[#E2652B] text-xs font-sans text-neutral-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B]" />
                  <span>{hobby.title}</span>
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

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
                  <span>Discovered</span>
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
