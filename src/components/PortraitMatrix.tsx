import { useEffect, useRef, useState } from 'react'

interface PortraitMatrixProps {
  imageSrc: string
  size?: number
  gridCount?: number
  className?: string
}

interface Particle {
  ox: number; oy: number
  x: number; y: number
  vx: number; vy: number
  r0: number; a0: number
  lum: number; startLum: number; targetLum: number
  colorType: number; targetColorType: number
  cellSize: number
  heat: number
  delay: number
  totalSpin: number
}

interface Shockwave {
  r: number; alpha: number; color: string
}

const STATES = ['01_PORTRAIT', '02_DEV_GLYPH', '03_TELEMETRY'] as const
const BRAILLE = [' ', '⠁', '⠃', '⠇', '⠏', '⠟', '⠿', '⣿']

export default function PortraitMatrix({ imageSrc, size = 480, gridCount: initGrid = 52, className = '' }: PortraitMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const shockwavesRef = useRef<Shockwave[]>([])
  const mouseRef = useRef({ x: -999, y: -999, active: false, radius: 72 })
  const morphRef = useRef({ progress: 1, startTime: 0, duration: 820, spinDir: 1 })
  const sourceImgRef = useRef<HTMLImageElement | HTMLCanvasElement | null>(null)
  const gridRef = useRef(initGrid)
  const modeRef = useRef<'dots' | 'blocks' | 'braille'>('dots')
  const animFrameRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const [renderMode, setRenderMode] = useState<'dots' | 'blocks' | 'braille'>('dots')
  const [stateLabel, setStateLabel] = useState('01_PORTRAIT')
  const [gridLabel, setGridLabel] = useState(`${initGrid}x${initGrid}`)
  const [morphPct, setMorphPct] = useState(100)

  const center = size / 2

  const easeInOutQuint = (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2

  function playVortexSound(nextIdx: number) {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    const startF = nextIdx === 0 ? 240 : nextIdx === 1 ? 520 : 380
    const endF = nextIdx === 0 ? 580 : 160
    osc1.frequency.setValueAtTime(startF, now)
    osc1.frequency.exponentialRampToValueAtTime(endF, now + 0.05)
    gain1.gain.setValueAtTime(0.16, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
    osc1.connect(gain1); gain1.connect(ctx.destination)
    osc1.start(now); osc1.stop(now + 0.06)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(65, now)
    osc2.frequency.exponentialRampToValueAtTime(145, now + 0.3)
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.65)
    gain2.gain.setValueAtTime(0.01, now)
    gain2.gain.linearRampToValueAtTime(0.09, now + 0.25)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65)
    osc2.connect(gain2); gain2.connect(ctx.destination)
    osc2.start(now); osc2.stop(now + 0.66)
  }

  function computeTargets(stateIdx: number, gc: number): { lum: number; colorType: number }[] {
    const targets: { lum: number; colorType: number }[] = []
    const sampleCanvas = document.createElement('canvas')
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!

    if (stateIdx === 0) {
      sampleCanvas.width = gc; sampleCanvas.height = gc
      sampleCtx.fillStyle = '#000'; sampleCtx.fillRect(0, 0, gc, gc)
      if (sourceImgRef.current) {
        const src = sourceImgRef.current
        const sw = (src as HTMLImageElement).naturalWidth || (src as HTMLCanvasElement).width
        const sh = (src as HTMLImageElement).naturalHeight || (src as HTMLCanvasElement).height
        const minSide = Math.min(sw, sh)
        sampleCtx.drawImage(src, (sw - minSide) / 2, (sh - minSide) / 2, minSide, minSide, 0, 0, gc, gc)
      }
      const imgData = sampleCtx.getImageData(0, 0, gc, gc).data
      for (let r = 0; r < gc; r++) {
        for (let c = 0; c < gc; c++) {
          const i = (r * gc + c) * 4
          const a = imgData[i + 3] / 255
          let lum = ((0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2]) / 255) * a
          lum = Math.pow(lum, 1.12)
          targets.push({ lum, colorType: 0 })
        }
      }
    } else if (stateIdx === 1) {
      // Dev glyph terminal state
      for (let r = 0; r < gc; r++) {
        for (let c = 0; c < gc; c++) {
          const nx = (c / (gc - 1)) * 2 - 1
          const ny = (r / (gc - 1)) * 2 - 1
          const dist = Math.hypot(nx, ny)
          let lum = 0.02; let colorType = 0

          if (dist > 0.70 && dist < 0.82) {
            const angle = Math.atan2(ny, nx)
            if (Math.sin(angle * 8) > -0.2) {
              lum = 0.88; colorType = (nx > 0.3 && ny < -0.3) ? 2 : 0
            }
          }
          const chevX = nx + 0.25; const chevY = ny
          if (Math.abs(chevY) < 0.32 && Math.abs(chevX - (0.28 - Math.abs(chevY))) < 0.09) {
            lum = 0.98; colorType = 1
          }
          if (nx > 0.08 && nx < 0.45 && ny > 0.18 && ny < 0.32) {
            lum = 0.95; colorType = 2
          }
          targets.push({ lum, colorType })
        }
      }
    } else {
      // Telemetry bars
      const barHeights = [0.68, 0.48, 0.30, 0.38, 0.56, 0.92, 0.90, 0.52, 0.44, 0.74]
      for (let r = 0; r < gc; r++) {
        for (let c = 0; c < gc; c++) {
          const normX = c / gc; const normY = 1 - (r / gc)
          let lum = 0.02; let colorType = 0
          if (normX >= 0.1 && normX <= 0.9 && normY >= 0.12) {
            const barF = ((normX - 0.1) / 0.8) * barHeights.length
            const barIdx = Math.floor(barF)
            const inGap = (barF - barIdx) > 0.76
            if (!inGap && barIdx >= 0 && barIdx < barHeights.length) {
              const maxH = 0.12 + barHeights[barIdx] * 0.75
              if (normY <= maxH) { lum = 0.92; colorType = normY > maxH - 0.06 ? 1 : 3 }
            }
          }
          targets.push({ lum, colorType })
        }
      }
    }
    return targets
  }

  function buildMatrix(gc: number) {
    const cellSize = size / gc
    const targets = computeTargets(stateRef.current, gc)
    particlesRef.current = []
    for (let r = 0; r < gc; r++) {
      for (let c = 0; c < gc; c++) {
        const i = r * gc + c
        const ox = c * cellSize + cellSize / 2
        const oy = r * cellSize + cellSize / 2
        const t = targets[i]
        const dx = ox - center; const dy = oy - center
        particlesRef.current.push({
          ox, oy, x: ox, y: oy, vx: 0, vy: 0,
          r0: Math.hypot(dx, dy), a0: Math.atan2(dy, dx),
          lum: t.lum, startLum: t.lum, targetLum: t.lum,
          colorType: t.colorType, targetColorType: t.colorType,
          cellSize, heat: 0,
          delay: (1 - Math.min(Math.hypot(dx, dy) / (size * 0.65), 1)) * 0.18 + Math.random() * 0.04,
          totalSpin: 0
        })
      }
    }
    gridRef.current = gc
    setGridLabel(`${gc}x${gc}`)
  }

  function triggerSwirl() {
    const nextIdx = (stateRef.current + 1) % STATES.length
    stateRef.current = nextIdx
    setStateLabel(STATES[nextIdx])
    playVortexSound(nextIdx)

    const nextTargets = computeTargets(nextIdx, gridRef.current)
    morphRef.current.spinDir *= -1

    particlesRef.current.forEach((p, i) => {
      p.startLum = p.lum; p.targetLum = nextTargets[i].lum
      p.targetColorType = nextTargets[i].colorType
      const extraTurns = (1.15 + (p.r0 / size) * 0.85) * Math.PI * 2
      p.totalSpin = extraTurns * morphRef.current.spinDir
    })

    morphRef.current.startTime = performance.now()
    morphRef.current.progress = 0

    const sw = shockwavesRef.current
    sw.push({ r: 16, alpha: 0.7, color: nextIdx === 1 ? '#E2652B' : nextIdx === 2 ? '#E6D5B8' : '#D71921' })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr; canvas.height = size * dpr
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.scale(dpr, dpr)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { sourceImgRef.current = img; buildMatrix(initGrid) }
    img.onerror = () => { buildMatrix(initGrid) }
    img.src = imageSrc

    function loop(now: number) {
      const morph = morphRef.current
      const isMorphing = morph.progress < 1

      if (isMorphing) {
        morph.progress = Math.min((now - morph.startTime) / morph.duration, 1)
        ctx.fillStyle = 'rgba(11,11,13,0.32)'
        ctx.fillRect(0, 0, size, size)
        setMorphPct(Math.round(morph.progress * 100))
      } else {
        ctx.clearRect(0, 0, size, size)
        setMorphPct(100)
      }

      // Shockwaves
      const sw = shockwavesRef.current
      for (let i = sw.length - 1; i >= 0; i--) {
        const s = sw[i]
        s.r += 5.2; s.alpha *= 0.91
        ctx.save()
        ctx.strokeStyle = s.color; ctx.globalAlpha = s.alpha
        ctx.lineWidth = 1.5; ctx.setLineDash([5, 8])
        ctx.beginPath(); ctx.arc(center, center, s.r, 0, Math.PI * 2); ctx.stroke()
        ctx.restore()
        if (s.alpha < 0.02) sw.splice(i, 1)
      }

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const mode = modeRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (isMorphing) {
          let lp = (morph.progress - p.delay) / (1 - p.delay)
          lp = Math.max(0, Math.min(1, lp))
          const ep = easeInOutQuint(lp)
          const bell = Math.sin(ep * Math.PI)
          const sWaveX = Math.sin(ep * Math.PI * 2) * (size * 0.16) * bell
          const sWaveY = Math.cos(ep * Math.PI * 2) * (size * 0.05) * bell
          const funnel = 1 - bell * 0.76
          const curR = p.r0 * funnel
          const curA = p.a0 + ep * p.totalSpin
          p.x = center + curR * Math.cos(curA) + sWaveX
          p.y = center + curR * Math.sin(curA) + sWaveY
          p.lum = p.startLum * (1 - ep) + p.targetLum * ep
          p.heat = bell * 0.65
          if (lp > 0.5) p.colorType = p.targetColorType
        } else {
          p.lum += (p.targetLum - p.lum) * 0.15
          p.colorType = p.targetColorType

          if (mouse.active) {
            const dx = p.x - mouse.x; const dy = p.y - mouse.y
            const dist = Math.hypot(dx, dy)
            if (dist < mouse.radius && dist > 0.1) {
              const force = Math.pow((mouse.radius - dist) / mouse.radius, 2)
              const angle = Math.atan2(dy, dx)
              p.vx += Math.cos(angle + 0.4) * force * 4.2
              p.vy += Math.sin(angle + 0.4) * force * 4.2
              p.heat = Math.min(1, p.heat + force * 0.45)
            }
          }
          p.vx += (p.ox - p.x) * 0.13; p.vy += (p.oy - p.y) * 0.13
          p.vx *= 0.82; p.vy *= 0.82
          p.x += p.vx; p.y += p.vy
          p.heat *= 0.91
        }

        if (p.lum < 0.05 && p.heat < 0.07) continue

        if (p.heat > 0.22) {
          ctx.fillStyle = p.heat > 0.55 ? '#E2652B' : '#D71921'
        } else if (p.colorType === 1) ctx.fillStyle = '#E2652B'
        else if (p.colorType === 2) ctx.fillStyle = '#D71921'
        else if (p.colorType === 3) ctx.fillStyle = '#E6D5B8'
        else { const b = Math.round(55 + p.lum * 200); ctx.fillStyle = `rgb(${b},${b},${b})` }

        const activeLum = Math.max(0.18, p.lum + p.heat * 0.25)

        if (mode === 'dots') {
          const r = (p.cellSize * 0.44) * Math.min(1, activeLum)
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill()
        } else if (mode === 'blocks') {
          const s = (p.cellSize * 0.85) * Math.min(1, activeLum)
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s)
        } else {
          const ci = Math.min(BRAILLE.length - 1, Math.floor(activeLum * BRAILLE.length))
          ctx.font = `${Math.floor(p.cellSize * 1.05)}px monospace`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(BRAILLE[ci], p.x, p.y)
        }
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animFrameRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, size, initGrid])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * size
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * size
    mouseRef.current.active = true
  }

  const handleMouseLeave = () => { mouseRef.current.active = false }

  const handleClick = () => triggerSwirl()

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const t = e.touches[0]
    mouseRef.current.x = ((t.clientX - rect.left) / rect.width) * size
    mouseRef.current.y = ((t.clientY - rect.top) / rect.height) * size
    mouseRef.current.active = true
  }

  const setMode = (m: 'dots' | 'blocks' | 'braille') => {
    modeRef.current = m; setRenderMode(m)
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Top bar */}
      <div className="flex justify-between items-center text-[10px] tracking-widest">
        <div className="flex items-center gap-2 font-nd" style={{ color: 'var(--text)', fontSize: 13 }}>
          <span className="live-dot" />
          VORTEX // MATRIX_OS
        </div>
        <div className="flex gap-2 items-center" style={{ color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent-orange)' }}>STATE // {stateLabel}</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full scanlines cursor-pointer select-none"
        style={{
          aspectRatio: '1/1',
          background: 'radial-gradient(circle at center, #141416 0%, #09090a 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.9)',
        }}
        onClick={handleClick}
      >
        <span className="absolute top-[10px] left-[12px] z-10 text-[9px] tracking-widest pointer-events-none" style={{ color: 'var(--muted)' }}>SCAN // LUMINANCE</span>
        <span className="absolute top-[10px] right-[12px] z-10 text-[9px] tracking-widest pointer-events-none" style={{ color: 'var(--accent-orange)' }}>MODE: {renderMode.toUpperCase()}</span>
        <span className="absolute bottom-[10px] left-[12px] z-10 text-[9px] tracking-widest pointer-events-none" style={{ color: 'var(--muted)' }}>GRID: {gridLabel}</span>
        <span className="absolute bottom-[10px] right-[12px] z-10 text-[9px] tracking-widest pointer-events-none" style={{ color: 'var(--text)' }}>
          {morphPct < 100 ? `VORTEX // ${morphPct}%` : 'CLICK: SWIRL'}
        </span>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => { mouseRef.current.active = false }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2">
          {(['dots', 'blocks', 'braille'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="text-[9px] tracking-widest uppercase cursor-pointer transition-all duration-200"
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                border: renderMode === m ? '1px solid var(--accent-orange)' : '1px solid var(--border)',
                background: renderMode === m ? 'rgba(226,101,43,0.14)' : '#141416',
                color: renderMode === m ? 'var(--text)' : 'var(--muted)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {m === 'dots' ? 'DOT LED' : m === 'blocks' ? 'PIXEL BLOCK' : 'BRAILLE'}
            </button>
          ))}
        </div>
        <button
          onClick={triggerSwirl}
          className="text-[9px] tracking-widest uppercase cursor-pointer transition-all duration-200"
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            border: '1px solid var(--accent-orange)',
            background: 'rgba(226,101,43,0.14)',
            color: 'var(--text)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          ↻ SWIRL MORPH
        </button>
      </div>
    </div>
  )
}
