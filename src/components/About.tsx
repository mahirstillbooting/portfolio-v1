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
    title: 'Mechanical Keyboard',
    desc: 'Custom switches, satisfying sound signatures, and tactile feedback.',
    tag: 'Mechanical Keyboard',
  },
  {
    id: 'perfume',
    title: 'Perfumes',
    desc: 'Niche accords, olfactory pyramids, and fragrance chemistry.',
    tag: 'Perfumes',
  },
  {
    id: 'gaming',
    title: 'Gaming',
    desc: 'Retro PC gaming, arcade classics, and games from Rockstar.',
    tag: 'Gaming',
  },
  {
    id: 'prompting',
    title: 'Prompting',
    desc: 'Creative AI workflows using tools such as Antigravity, Claude, and Figma.',
    tag: 'Prompting',
  },
]

// Custom SVG Icons for Passions & Flipping Tile States
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-white animate-pulse"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
)

const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-neutral-400"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const PerfumesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-[#E2652B] shrink-0"
  >
    <path d="M 5 22 H 11.072" />
    <path d="M15 5 C 23 4 23.328 12.676 20 14.536" />
    <path d="M15.802 10.308 C 14.776 9.465 14 8.496 14 7" />
    <path d="M2 2h.01" />
    <path d="M2 7h.01" />
    <path d="M5 4.5h.01" />
    <path d="M8.127 22 A 8 8 0 0 1 4 15 3 3 0 0 1 4.879 12.879C 6.879 10.879 10 10 10 7" />
    <circle cx="18" cy="18" r="4" />
    <rect x="9" y="2" width="6" height="5" rx="1" />
  </svg>
)

const GamingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-[#E2652B] shrink-0"
  >
    <line x1="6" x2="10" y1="11" y2="11" />
    <line x1="8" x2="8" y1="9" y2="13" />
    <line x1="15" x2="15.01" y1="12" y2="12" />
    <line x1="18" x2="18.01" y1="10" y2="10" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
)

const KeyboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-[#E2652B] shrink-0"
  >
    <path d="M10 8h.01" />
    <path d="M12 12h.01" />
    <path d="M14 8h.01" />
    <path d="M16 12h.01" />
    <path d="M18 8h.01" />
    <path d="M6 8h.01" />
    <path d="M7 16h10" />
    <path d="M8 12h.01" />
    <rect width="20" height="16" x="2" y="4" rx="2" />
  </svg>
)

const PromptingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="preview-icon text-[#E2652B] shrink-0"
  >
    <path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203" />
  </svg>
)

const PASSION_ICONS: Record<string, React.ReactNode> = {
  perfume: <PerfumesIcon />,
  gaming: <GamingIcon />,
  keyboards: <KeyboardIcon />,
  prompting: <PromptingIcon />,
}

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
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },

  // Row 2 (7 cells)
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },

  // Row 3 (7 cells)
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'black', bgStyle: '#0E0E10', borderStyle: 'rgba(255, 255, 255, 0.04)', isBlack: true },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
]

export default function About() {
  const [winningCellMap, setWinningCellMap] = useState<Record<number, Hobby>>({})
  const [discoveredCells, setDiscoveredCells] = useState<number[]>([])
  const [discoveredHobbies, setDiscoveredHobbies] = useState<Hobby[]>([])
  const [flippedCells, setFlippedCells] = useState<number[]>([])
  const [wrongFlippedCells, setWrongFlippedCells] = useState<number[]>([])
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
    setWrongFlippedCells([])
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
      audio.volume = 0.25
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

    if (discoveredCells.includes(cellIndex) || wrongFlippedCells.includes(cellIndex)) {
      return
    }

    const winningHobby = winningCellMap[cellIndex]
    if (cellConfig.isBlack || !winningHobby) {
      setWrongFlippedCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFlippedCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setCheckedInactiveCells((prev) => (prev.includes(cellIndex) ? prev : [...prev, cellIndex]))
      setFeedbackNotice(cellConfig.isBlack ? 'No activity recorded on this day.' : 'Nothing hidden here. Keep exploring.')
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
        padding: '40px 24px',
        minHeight: 'auto',
        height: 'auto',
        scrollMarginTop: '80px',
        boxSizing: 'border-box',
      }}
      className="w-full max-w-[1200px] mx-auto relative select-none scroll-mt-[80px]"
    >
      {/* Section Heading: Player Details & The Honest Journey */}
      <div className="mb-6 sm:mb-8 space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono uppercase">
          <Compass className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>03 · PLAYER DETAILS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-[#F3F4F6] tracking-tight">
          The Honest Journey
        </h2>
      </div>

      {/* 12-Column Bento Grid Layout */}
      <div
        style={{
          display: 'grid',
          gap: '20px',
        }}
        className="grid grid-cols-1 lg:grid-cols-12 items-start w-full"
      >
        
        {/* Left Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          className="lg:col-span-7 flex flex-col p-5 sm:p-6 lg:p-7 hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Header Divider: DETAILS */}
          <div className="flex items-center justify-between text-xs font-mono text-[#71717A] tracking-wider pb-3 mb-4 border-b border-white/[0.08]">
            <span className="text-[#F3F4F6]/90 font-medium">DETAILS</span>
            <span className="text-[#E2652B] font-semibold">EAST WEST UNIVERSITY</span>
          </div>

          {/* Clean Geist Sans Typography */}
          <div
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '14.5px',
              lineHeight: '1.7',
              color: '#D4D4D8',
            }}
            className="space-y-3 font-normal"
          >
            <p>
              I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I learn at my own pace and work persistently until problems are solved.
            </p>
            <p>
              My passion began with <span className="text-white font-medium">Metal Slug</span> arcades and <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, evolving into software development, web tinkering, and AI engineering.
            </p>
          </div>

          {/* Badges Footer Row */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px]">freeCodeCamp · Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#A1A1AA]">
              Native &amp; Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Right Column: Combined Location & Academic Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
          }}
          className="lg:col-span-5 flex flex-col p-5 sm:p-6 hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Top Section: Dhaka City Telemetry */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-2.5 mb-3 border-b border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-[#F3F4F6]/90 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                LOCATION
              </span>
              <span className="text-[#E2652B] font-semibold">23.81° N, 90.41° E</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}
              className="font-sans tracking-tight"
            >
              Dhaka City
            </h3>
            <p
              style={{ color: '#A1A1AA', fontSize: '13.5px', lineHeight: '1.5' }}
              className="font-sans"
            >
              Living and engineering in the heart of Dhaka. Fast-paced, resilient, and always active.
            </p>
          </div>

          {/* Clean Integrated Divider */}
          <div className="border-t border-white/[0.08] my-3.5" />

          {/* Bottom Section: Integrated Academic Degree & Education Details */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-2.5 mb-3 border-b border-white/[0.08]">
              <span className="text-[#F3F4F6]/90 font-medium">ACADEMIC DEGREE</span>
              <span className="text-[#E2652B] font-semibold">CSE</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '17px', fontWeight: 700, marginBottom: '2px' }}
              className="font-sans tracking-tight"
            >
              BSc in Computer Science &amp; Engineering
            </h3>
            <p
              style={{ color: '#E2652B', fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 600, marginBottom: '4px' }}
            >
              East West University
            </p>
            <p
              style={{ color: '#A1A1AA', fontSize: '13px', lineHeight: '1.5' }}
              className="font-sans"
            >
              Software engineering, database architectures, and QA verification.
            </p>
          </div>
        </motion.div>

        {/* Beside Coding... Interactive Discovery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#0e0e11',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '32px',
          }}
          className="lg:col-span-12 w-full p-6 sm:p-8 hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Card Header: Only Main Title & Subtitle */}
          <div className="pb-4 mb-6 border-b border-white/[0.08]">
            <h3
              style={{ color: '#F3F4F6', fontSize: '24px', fontWeight: 700 }}
              className="text-2xl sm:text-3xl font-sans tracking-tight"
            >
              Beside Coding...
            </h3>
            <p
              style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: '1.6', marginTop: '6px' }}
              className="font-sans"
            >
              Four little things that keep me curious. You may try to find them.
            </p>
          </div>

          {/* Inner Container Wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
            
            {/* Left Side: Flipping Tiles Matrix Inner Container */}
            <div
              style={{
                padding: '24px',
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
              }}
              className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center w-full"
            >
              <div
                role="grid"
                aria-label="Passion discovery contribution grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 52px))',
                  gap: '12px',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '440px',
                }}
                className="mx-auto"
              >
                {GRID_CELL_STYLES.map((cellStyle, idx) => {
                  const isFlipped = flippedCells.includes(idx)
                  const isDiscovered = discoveredCells.includes(idx)
                  const isCheckedInactive = checkedInactiveCells.includes(idx)
                  const isWinning = Boolean(winningCellMap[idx])

                  return (
                    <div
                      key={idx}
                      style={{
                        width: '100%',
                        maxWidth: '52px',
                        aspectRatio: '1 / 1',
                        perspective: '1000px',
                      }}
                      className="relative mx-auto w-full"
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
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: 0,
                        }}
                        className={`w-full h-full rounded-xl relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2652B] active:scale-95 transition-transform ${
                          cellStyle.isBlack ? 'cursor-default opacity-60' : 'hover:scale-105'
                        }`}
                      >
                        {/* FRONT FACE */}
                        <div
                          style={{
                            backgroundColor: cellStyle.bgStyle,
                            border: `1px solid ${cellStyle.borderStyle}`,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                          className={`absolute inset-0 rounded-xl flex items-center justify-center transition-all ${
                            isCheckedInactive && !cellStyle.isBlack ? 'opacity-35' : ''
                          }`}
                        >
                          {isCheckedInactive && !cellStyle.isBlack && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                          )}
                        </div>

                        {/* REVERSE FACE: STAR IF WINNER, X IF INCORRECT */}
                        <div
                          style={{
                            backgroundColor: (isDiscovered || (isWinning && isFlipped)) ? '#E2652B' : '#161619',
                            border: (isDiscovered || (isWinning && isFlipped))
                              ? '1px solid rgba(255, 255, 255, 0.4)'
                              : '1px solid rgba(255, 255, 255, 0.12)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            boxShadow: (isDiscovered || (isWinning && isFlipped))
                              ? '0 0 20px rgba(226, 101, 43, 0.6)'
                              : 'none',
                          }}
                          className="absolute inset-0 rounded-xl flex items-center justify-center"
                        >
                          {(isDiscovered || (isWinning && isFlipped)) ? (
                            <StarIcon />
                          ) : (
                            <CrossIcon />
                          )}
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Feedback Text */}
              <div className="min-h-[26px] mt-4 flex items-center justify-center text-xs font-mono text-center">
                <AnimatePresence mode="wait">
                  {allFound ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-emerald-400 font-medium text-xs font-mono"
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
                      className="text-xs font-mono"
                    >
                      {feedbackNotice}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ color: '#A1A1AA' }}
                      className="text-xs font-mono"
                    >
                      Discover a highlighted cell to reveal a passion.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Discovered Rows Container */}
            <div
              style={{
                padding: '24px',
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
              }}
              className="lg:col-span-6 xl:col-span-7 flex flex-col w-full"
            >
              {/* Header Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#F3F4F6] font-medium text-xs font-mono uppercase tracking-wider">
                    Discovered So Far
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#E2652B] bg-[#E2652B]/10 px-2.5 py-0.5 rounded-full border border-[#E2652B]/20">
                    {discoveredHobbies.length} / 4
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div
                    style={{ padding: '5px 12px' }}
                    className="rounded-full bg-white/[0.04] border border-[#E2652B]/30 text-xs font-mono font-medium text-[#E2652B] flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        allFound
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                          : 'bg-[#E2652B] shadow-[0_0_8px_#E2652B]'
                      }`}
                    />
                    <span>{allFound ? 'All 4 discovered' : `${discoveredCount} out of 4 found`}</span>
                  </div>

                  <button
                    type="button"
                    onClick={startFreshHunt}
                    style={{ padding: '5px 12px' }}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#F3F4F6] transition-colors cursor-pointer active:scale-95 rounded-full hover:bg-white/5 border border-white/10 whitespace-nowrap shadow-sm"
                    aria-label="Start Again"
                    title="Restart treasure hunt"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start Again</span>
                  </button>
                </div>
              </div>

              {/* Compact Horizontal Rows */}
              <div className="flex flex-col gap-3 w-full">
                {discoveredHobbies.length === 0 ? (
                  <div
                    style={{
                      padding: '28px 20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                    }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs font-mono text-[#71717A] text-center select-none w-full min-h-[160px]"
                  >
                    <Sparkles className="w-4 h-4 text-white/20 shrink-0" />
                    <span>Uncover active tiles in the grid to reveal hidden passions here.</span>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {discoveredHobbies.map((hobby) => (
                      <motion.div
                        key={hobby.id}
                        initial={{ opacity: 0, x: 20, y: 6 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -16, scale: 0.96 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          padding: '16px 20px',
                          background: '#121215',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                        }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-6 hover:border-[#E2652B]/40 hover:bg-[#16161a] transition-all shadow-sm w-full"
                      >
                        {/* Left: Custom SVG Icon + Passion Title */}
                        <div className="shrink-0 flex items-center gap-3 sm:min-w-[190px]">
                          {PASSION_ICONS[hobby.id]}
                          <h4
                            style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              color: '#FFFFFF',
                              lineHeight: 1.3,
                            }}
                            className="font-sans tracking-tight whitespace-nowrap m-0"
                          >
                            {hobby.title}
                          </h4>
                        </div>

                        {/* Right: Short Brief Description */}
                        <p
                          style={{
                            fontSize: '13px',
                            lineHeight: '1.5',
                            color: '#9CA3AF',
                          }}
                          className="font-sans text-left sm:text-right flex-1 m-0"
                        >
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
