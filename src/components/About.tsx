import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Award, MapPin, Compass } from 'lucide-react'
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

// Exact original palette: only the "no activity" tile (#161619) is made slightly brighter and distinguishable
const BASE_GRID_CELLS: Omit<CellConfig, 'id'>[] = [
  // 6 Charcoal tiles (#1C1C1E)
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },
  { colorClass: 'charcoal', bgStyle: '#1C1C1E', borderStyle: 'rgba(255, 255, 255, 0.08)', isBlack: false },

  // 6 Warm Brown tiles (#3A2218)
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },
  { colorClass: 'warm_brown', bgStyle: '#3A2218', borderStyle: 'rgba(226, 101, 43, 0.3)', isBlack: false },

  // 3 Burnt Orange tiles (#E2652B)
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },
  { colorClass: 'burnt_orange', bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.7)', isBlack: false },

  // 6 No Activity tiles: made a bit brighter (#161619) so it is distinguishable from black and other cells
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
  { colorClass: 'black', bgStyle: '#161619', borderStyle: 'rgba(255, 255, 255, 0.06)', isBlack: true },
]

function generateShuffledMatrix(): Omit<CellConfig, 'id'>[] {
  return [...BASE_GRID_CELLS].sort(() => Math.random() - 0.5)
}

export default function About() {
  const [gridCellStyles, setGridCellStyles] = useState<Omit<CellConfig, 'id'>[]>(() => generateShuffledMatrix())
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
    // Re-roll grid color matrix pattern on every reset
    const newStyles = generateShuffledMatrix()
    setGridCellStyles(newStyles)

    // Randomize active passion coordinates across valid candidates
    const validCandidateIndices: number[] = []
    newStyles.forEach((cell, idx) => {
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
    const cellConfig = gridCellStyles[cellIndex]

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
      className="w-full max-w-[1200px] mx-auto relative select-none scroll-mt-[80px]"
    >
      {/* Section Heading: Player Details & The Honest Journey with spacious pleasing margin */}
      <div className="pt-2 sm:pt-4 mb-7 sm:mb-9 lg:mb-10 space-y-2 shrink-0">
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
        
        {/* Left Bio Card: Generous spacious internal padding and comfortable typography */}
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
          className="lg:col-span-7 flex flex-col p-6 sm:p-7 lg:p-8 hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Header Divider: DETAILS */}
          <div className="flex items-center justify-between text-xs font-mono text-[#71717A] tracking-wider pb-3.5 mb-4 border-b border-white/[0.08]">
            <span className="text-[#F3F4F6]/90 font-medium">DETAILS</span>
            <span className="text-[#E2652B] font-semibold">EAST WEST UNIVERSITY</span>
          </div>

          {/* Clean Geist Sans Typography with ample line-height and paragraph spacing */}
          <div
            style={{
              fontFamily: "'Geist Sans', sans-serif",
              fontSize: '15px',
              lineHeight: '1.75',
              color: '#D4D4D8',
            }}
            className="space-y-3.5 font-normal"
          >
            <p>
              I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I learn at my own pace and work persistently until problems are solved.
            </p>
            <p>
              My passion began with <span className="text-white font-medium">Metal Slug</span> arcades and <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, evolving into software development, web tinkering, and AI engineering.
            </p>
          </div>

          {/* Badges Footer Row */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px]">freeCodeCamp · Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#A1A1AA]">
              Native &amp; Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Right Column: Combined Location & Academic Education Card with enhanced breathing room */}
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
          className="lg:col-span-5 flex flex-col p-6 sm:p-7 lg:p-8 hover:border-[#E2652B]/40 transition-colors shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Top Section: Dhaka City Telemetry */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-3 mb-3.5 border-b border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-[#F3F4F6]/90 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                LOCATION
              </span>
              <span className="text-[#E2652B] font-semibold">23.81° N, 90.41° E</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '19px', fontWeight: 700, marginBottom: '6px' }}
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
          <div className="border-t border-white/[0.08] my-4 sm:my-5" />

          {/* Bottom Section: Integrated Academic Degree & Education Details */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#71717A] pb-3 mb-3.5 border-b border-white/[0.08]">
              <span className="text-[#F3F4F6]/90 font-medium">ACADEMIC DEGREE</span>
              <span className="text-[#E2652B] font-semibold">CSE</span>
            </div>

            <h3
              style={{ color: '#F3F4F6', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}
              className="font-sans tracking-tight"
            >
              BSc in Computer Science &amp; Engineering
            </h3>
            <p
              style={{ color: '#E2652B', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, marginBottom: '6px' }}
            >
              East West University
            </p>
            <p
              style={{ color: '#A1A1AA', fontSize: '13.5px', lineHeight: '1.6' }}
              className="font-sans"
            >
              Software engineering, database architectures, and QA verification.
            </p>
          </div>
        </motion.div>

        {/* Beside Coding... Compact Pixel-Match Interactive Discovery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: '#111417',
            border: '1px solid #1d2127',
            borderRadius: '20px',
            padding: '28px',
          }}
          className="lg:col-span-12 w-full hover:border-[#e2652b]/30 transition-colors shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-[22px]">
            <h3
              style={{
                color: '#f3f4f6',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                marginBottom: '6px',
              }}
              className="font-sans"
            >
              Beside Coding...
            </h3>
            <p
              style={{
                color: '#7e8794',
                fontSize: '0.88rem',
              }}
              className="font-sans"
            >
              Four little things that keep me curious. You may try to find them.
            </p>
          </div>

          {/* 2 Columns: strictly locked to equal height */}
          <div
            style={{
              display: 'grid',
              alignItems: 'stretch',
            }}
            className="grid grid-cols-1 min-[769px]:grid-cols-[1fr_1.15fr] gap-[18px] items-stretch w-full"
          >
            {/* LEFT MATRIX */}
            <div
              style={{
                background: '#0c0f12',
                border: '1px solid #1a1e23',
                borderRadius: '14px',
                padding: '22px 20px',
              }}
              className="flex flex-col justify-between h-full w-full min-w-0 overflow-hidden"
            >
              <div
                role="grid"
                aria-label="Passion discovery contribution grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  width: '100%',
                  gap: '8px',
                  marginBottom: '18px',
                }}
                className="w-full"
              >
                {gridCellStyles.map((cellStyle, idx) => {
                  const isFlipped = flippedCells.includes(idx)
                  const isDiscovered = discoveredCells.includes(idx)
                  const isCheckedInactive = checkedInactiveCells.includes(idx)
                  const isWinning = Boolean(winningCellMap[idx])

                  return (
                    <div
                      key={idx}
                      style={{
                        aspectRatio: '1 / 1',
                        perspective: '1000px',
                      }}
                      className="relative w-full min-w-0"
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
                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: 0,
                        }}
                        className={`w-full h-full min-w-0 rounded-[9px] relative cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#e2652b] active:scale-95 transition-transform ${
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
                            borderRadius: '9px',
                          }}
                          className={`absolute inset-0 flex items-center justify-center transition-all ${
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
                            backgroundColor: (isDiscovered || (isWinning && isFlipped)) ? '#e2652b' : '#161619',
                            border: (isDiscovered || (isWinning && isFlipped))
                              ? '1px solid rgba(255, 255, 255, 0.4)'
                              : '1px solid rgba(255, 255, 255, 0.12)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderRadius: '9px',
                            boxShadow: (isDiscovered || (isWinning && isFlipped))
                              ? '0 0 12px rgba(226, 101, 43, 0.35)'
                              : 'none',
                          }}
                          className="absolute inset-0 flex items-center justify-center"
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

              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  color: '#7e8794',
                  textAlign: 'center',
                  letterSpacing: '-0.01em',
                  minHeight: '18px',
                }}
              >
                {allFound
                  ? 'All four passions discovered.'
                  : feedbackNotice || 'Discover a highlighted cell to reveal a passion.'}
              </div>
            </div>

            {/* RIGHT PANEL: Compact 2x2 Grid inside Dashed Container */}
            <div
              style={{
                background: '#0c0f12',
                border: '1px solid #1a1e23',
                borderRadius: '14px',
                padding: '22px 20px',
              }}
              className="flex flex-col justify-between h-full w-full min-w-0"
            >
              {/* Status Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <span
                    style={{
                      color: '#f3f4f6',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    DISCOVERED SO FAR
                  </span>
                  <span
                    style={{
                      color: '#e2652b',
                      marginLeft: '4px',
                      fontWeight: 700,
                    }}
                  >
                    {discoveredHobbies.length} / 4
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Badge: clean text without filled circle */}
                  <span
                    style={{
                      background: '#251711',
                      border: '1px solid #4a2717',
                      color: '#e2652b',
                      padding: '3px 10px',
                      borderRadius: '14px',
                      fontSize: '0.72rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <span>{allFound ? '4 out of 4 found' : `${discoveredCount} out of 4 found`}</span>
                  </span>

                  <button
                    type="button"
                    onClick={startFreshHunt}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#7e8794',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    className="hover:text-white transition-colors active:scale-95"
                    aria-label="Start Again"
                    title="Restart treasure hunt"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start Again</span>
                  </button>
                </div>
              </div>

              {/* THE COMPACT 2x2 CONTAINER */}
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
                  gap: '8px',
                  border: '1px dashed #20252b',
                  borderRadius: '12px',
                  padding: '8px',
                }}
                className="grid max-[768px]:grid-cols-1 max-[768px]:grid-rows-none w-full"
              >
                {discoveredHobbies.length === 0 ? (
                  <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-2.5 p-4 text-xs font-mono text-[#7e8794] text-center select-none w-full h-full min-h-[140px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-gift preview-icon text-white/30 shrink-0"
                    >
                      <path d="M12 7v14" />
                      <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                      <path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
                      <rect x="3" y="7" width="18" height="4" rx="1" />
                    </svg>
                    <span>Uncover active tiles in the grid to reveal hidden passions here.</span>
                  </div>
                ) : (
                  <>
                    {discoveredHobbies.map((hobby) => (
                      <motion.div
                        key={hobby.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid #1c2025',
                          borderRadius: '8px',
                          padding: '9px 11px',
                        }}
                        className="flex flex-col justify-center hover:bg-[#e2652b]/[0.04] hover:border-[#4a2717] transition-all group min-w-0"
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '3px',
                          }}
                        >
                          <span
                            style={{
                              color: '#e2652b',
                              fontSize: '0.85rem',
                              lineHeight: 1,
                            }}
                            className="shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5"
                          >
                            {PASSION_ICONS[hobby.id]}
                          </span>
                          <span
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#fff',
                            }}
                            className="tracking-tight"
                          >
                            {hobby.title}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.71rem',
                            color: '#7e8794',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            margin: 0,
                          }}
                        >
                          {hobby.desc}
                        </p>
                      </motion.div>
                    ))}
                    {Array.from({ length: 4 - discoveredHobbies.length }).map((_, idx) => (
                      <div
                        key={`empty-slot-${idx}`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px dashed #1c2025',
                          borderRadius: '8px',
                          padding: '9px 11px',
                        }}
                        className="flex flex-col items-center justify-center text-center opacity-40 select-none min-h-[56px]"
                      >
                        <span className="font-mono text-[10px] text-[#4b535e] tracking-wider">
                          ···
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
