import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
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

// Dynamically generate a fresh randomized matrix with subtle palette variations
function generateRandomMatrix(): Omit<CellConfig, 'id'>[] {
  // Inactive / "No activity recorded" cells:
  // Made distinguishable and brighter than previous pitch black (#0E0E10)
  const inactiveVariants = [
    { bgStyle: '#191C20', borderStyle: 'rgba(255, 255, 255, 0.08)' },
    { bgStyle: '#1C1F24', borderStyle: 'rgba(255, 255, 255, 0.09)' },
    { bgStyle: '#171A1E', borderStyle: 'rgba(255, 255, 255, 0.08)' },
    { bgStyle: '#1E2227', borderStyle: 'rgba(255, 255, 255, 0.09)' },
  ]

  // Charcoal cells (low activity):
  const charcoalVariants = [
    { bgStyle: '#242930', borderStyle: 'rgba(255, 255, 255, 0.12)' },
    { bgStyle: '#272C34', borderStyle: 'rgba(255, 255, 255, 0.12)' },
    { bgStyle: '#21252C', borderStyle: 'rgba(255, 255, 255, 0.11)' },
    { bgStyle: '#2A2F37', borderStyle: 'rgba(255, 255, 255, 0.13)' },
  ]

  // Warm brown cells (medium activity):
  const warmBrownVariants = [
    { bgStyle: '#3D251A', borderStyle: 'rgba(226, 101, 43, 0.35)' },
    { bgStyle: '#44291D', borderStyle: 'rgba(226, 101, 43, 0.38)' },
    { bgStyle: '#372016', borderStyle: 'rgba(226, 101, 43, 0.32)' },
    { bgStyle: '#4A2D20', borderStyle: 'rgba(226, 101, 43, 0.4)' },
  ]

  // Burnt orange cells (high activity / highlight):
  const orangeVariants = [
    { bgStyle: '#E2652B', borderStyle: 'rgba(226, 101, 43, 0.75)' },
    { bgStyle: '#D95C22', borderStyle: 'rgba(226, 101, 43, 0.7)' },
    { bgStyle: '#E86D33', borderStyle: 'rgba(226, 101, 43, 0.8)' },
    { bgStyle: '#DF6227', borderStyle: 'rgba(226, 101, 43, 0.72)' },
  ]

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  const pool: Omit<CellConfig, 'id'>[] = []

  // 5 inactive cells (distinguishable, brighter dark)
  for (let i = 0; i < 5; i++) {
    const v = pick(inactiveVariants)
    pool.push({ colorClass: 'black', bgStyle: v.bgStyle, borderStyle: v.borderStyle, isBlack: true })
  }

  // 7 charcoal cells
  for (let i = 0; i < 7; i++) {
    const v = pick(charcoalVariants)
    pool.push({ colorClass: 'charcoal', bgStyle: v.bgStyle, borderStyle: v.borderStyle, isBlack: false })
  }

  // 5 warm brown cells
  for (let i = 0; i < 5; i++) {
    const v = pick(warmBrownVariants)
    pool.push({ colorClass: 'warm_brown', bgStyle: v.bgStyle, borderStyle: v.borderStyle, isBlack: false })
  }

  // 4 burnt orange cells
  for (let i = 0; i < 4; i++) {
    const v = pick(orangeVariants)
    pool.push({ colorClass: 'burnt_orange', bgStyle: v.bgStyle, borderStyle: v.borderStyle, isBlack: false })
  }

  // Shuffle all 21 cells randomly
  return pool.sort(() => Math.random() - 0.5)
}

export default function About() {
  const [gridCellStyles, setGridCellStyles] = useState<Omit<CellConfig, 'id'>[]>(() => generateRandomMatrix())
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
    const newStyles = generateRandomMatrix()
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
          }}
          className="lg:col-span-12 w-full p-4 sm:p-6 lg:p-7 hover:border-[#e2652b]/30 transition-colors shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-4 sm:mb-[22px]">
            <h3
              style={{
                color: '#f3f4f6',
                letterSpacing: '-0.01em',
              }}
              className="text-lg sm:text-xl lg:text-[1.35rem] font-bold font-sans mb-1"
            >
              Beside Coding...
            </h3>
            <p
              style={{
                color: '#7e8794',
              }}
              className="text-xs sm:text-[0.88rem] font-sans leading-relaxed"
            >
              Four little things that keep me curious. You may try to find them.
            </p>
          </div>

          {/* 2 Columns: strictly locked to equal height on desktop, fluid stack on mobile */}
          <div
            style={{
              display: 'grid',
              alignItems: 'stretch',
            }}
            className="grid grid-cols-1 min-[769px]:grid-cols-[1fr_1.15fr] gap-3.5 sm:gap-[18px] items-stretch w-full"
          >
            {/* LEFT MATRIX */}
            <div
              style={{
                background: '#0c0f12',
                border: '1px solid #1a1e23',
                borderRadius: '14px',
              }}
              className="flex flex-col justify-between h-full w-full min-w-0 overflow-hidden p-3.5 sm:p-5"
            >
              <div
                role="grid"
                aria-label="Passion discovery contribution grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  width: '100%',
                }}
                className="gap-1.5 sm:gap-2 mb-3 sm:mb-4 w-full"
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
                  color: '#7e8794',
                  textAlign: 'center',
                  letterSpacing: '-0.01em',
                  minHeight: '18px',
                }}
                className="text-[11px] sm:text-[0.74rem] mt-1 sm:mt-0"
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
              }}
              className="flex flex-col justify-between h-full w-full min-w-0 p-3.5 sm:p-5"
            >
              {/* Status Bar */}
              <div
                className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/[0.06] font-mono"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <span
                    style={{
                      color: '#f3f4f6',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                    className="text-[10px] sm:text-xs truncate"
                  >
                    DISCOVERED SO FAR
                  </span>
                  <span
                    style={{
                      color: '#e2652b',
                      fontWeight: 700,
                    }}
                    className="text-[10px] sm:text-xs shrink-0"
                  >
                    {discoveredHobbies.length} / 4
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Badge without the filled circle */}
                  <span
                    style={{
                      background: '#251711',
                      border: '1px solid #4a2717',
                      color: '#e2652b',
                      borderRadius: '14px',
                    }}
                    className="px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[0.72rem] font-medium whitespace-nowrap inline-flex items-center"
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
                      cursor: 'pointer',
                    }}
                    className="hover:text-white transition-colors active:scale-95 flex items-center gap-1 text-[11px] sm:text-[0.75rem]"
                    aria-label="Start Again"
                    title="Restart treasure hunt"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Start Again</span>
                  </button>
                </div>
              </div>

              {/* THE COMPACT 2x2 CONTAINER */}
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  border: '1px dashed #20252b',
                  borderRadius: '12px',
                  padding: '8px',
                }}
                className="grid grid-cols-1 sm:grid-cols-2 min-[769px]:grid-rows-2 gap-2 w-full min-w-0"
              >
                {discoveredHobbies.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 row-span-2 flex flex-col items-center justify-center gap-2 p-3 sm:p-4 text-xs font-mono text-[#7e8794] text-center select-none w-full h-full min-h-[110px] sm:min-h-[140px]">
                    <Sparkles className="w-4 h-4 text-white/20 shrink-0" />
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
                        }}
                        className="flex flex-col justify-center p-2.5 sm:p-[9px_11px] hover:bg-[#e2652b]/[0.04] hover:border-[#4a2717] transition-all group min-w-0"
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '2px',
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
                        }}
                        className="hidden sm:flex flex-col items-center justify-center text-center opacity-40 select-none min-h-[56px] p-2"
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
