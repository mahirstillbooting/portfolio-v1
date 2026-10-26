import { useRef, useEffect, useState, useCallback } from 'react'

interface PixelInteractiveIconProps {
  type: 'code' | 'gamepad'
  className?: string
}

interface Particle {
  homeX: number
  homeY: number
  dist: number
  angle: number
  swirlFactor: number
  maxRadius: number
  size: number
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function PixelInteractiveIcon({ type, className = '' }: PixelInteractiveIconProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const isLoadedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)

  // Generous 128x128 canvas so circular vortex never hits rectangular bounds
  const canvasSize = 128
  const cx = canvasSize / 2
  const cy = canvasSize / 2

  const svgXml =
    type === 'code'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E2652B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E2652B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>`

  // Pre-sample icon pixels into particle targets centered in the 128x128 circle
  useEffect(() => {
    const offscreen = document.createElement('canvas')
    offscreen.width = 24
    offscreen.height = 24
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true })
    if (!offCtx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      offCtx.clearRect(0, 0, 24, 24)
      offCtx.drawImage(img, 0, 0, 24, 24)
      URL.revokeObjectURL(url)

      try {
        const imgData = offCtx.getImageData(0, 0, 24, 24).data
        const sampled: Particle[] = []
        // Scale 24px icon into 32px inside 128px canvas
        const scale = 32 / 24

        for (let y = 0; y < 24; y++) {
          for (let x = 0; x < 24; x++) {
            const idx = (y * 24 + x) * 4
            const alpha = imgData[idx + 3]
            if (alpha > 45) {
              const homeX = cx + (x - 11.5) * scale
              const homeY = cy + (y - 11.5) * scale
              const dx = homeX - cx
              const dy = homeY - cy
              const dist = Math.sqrt(dx * dx + dy * dy)
              const angle = Math.atan2(dy, dx)
              // Circular swirl factor
              const swirlFactor = (Math.random() > 0.5 ? 1 : -1) * (Math.PI * (2.0 + Math.random() * 1.2))
              // Clamped uniform radial expansion so particles form a circular halo
              const maxRadius = 18 + Math.random() * 8
              const size = 1.35 + Math.random() * 0.45

              sampled.push({
                homeX,
                homeY,
                dist,
                angle,
                swirlFactor,
                maxRadius,
                size,
              })
            }
          }
        }

        particlesRef.current = sampled
        isLoadedRef.current = true
      } catch {
        // Fallback
      }
    }

    img.src = url

    return () => {
      URL.revokeObjectURL(url)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [svgXml, cx, cy])

  const handleClick = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    const canvas = canvasRef.current
    if (!canvas) {
      setTimeout(() => setIsAnimating(false), 850)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsAnimating(false)
      return
    }

    const particles = particlesRef.current
    const startTime = performance.now()
    const duration = 900 // 900ms smooth circular pixel swirl & return

    const render = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)

      ctx.clearRect(0, 0, canvasSize, canvasSize)

      if (progress < 0.44) {
        // Phase 1: Swirl Outward into Circular Pixel Halo
        const sub = easeInOutCubic(progress / 0.44)
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const currentAngle = p.angle + sub * p.swirlFactor
          const currentDist = p.dist + sub * p.maxRadius
          const x = cx + Math.cos(currentAngle) * currentDist
          const y = cy + Math.sin(currentAngle) * currentDist
          const alpha = Math.max(0.12, 1 - sub * 0.8)

          ctx.fillStyle = `rgba(226, 101, 43, ${alpha})`
          ctx.shadowColor = 'rgba(226, 101, 43, 0.65)'
          ctx.shadowBlur = 4
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Phase 2: Smooth Reverse Circular Inward Swirl & Magnetically Lock Back Home
        const sub = easeInOutCubic((progress - 0.44) / 0.56)
        const rev = 1 - sub
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const currentAngle = p.angle + rev * p.swirlFactor
          const currentDist = p.dist + rev * p.maxRadius
          const x = cx + Math.cos(currentAngle) * currentDist
          const y = cy + Math.sin(currentAngle) * currentDist
          const alpha = 0.25 + sub * 0.75

          ctx.fillStyle = `rgba(226, 101, 43, ${alpha})`
          ctx.shadowColor = 'rgba(226, 101, 43, 0.65)'
          ctx.shadowBlur = 4
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvasSize, canvasSize)
        setIsAnimating(false)
      }
    }

    animFrameRef.current = requestAnimationFrame(render)
  }, [isAnimating, canvasSize, cx, cy])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      title="Click to interact"
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none transition-transform duration-200 hover:scale-110 active:scale-95 overflow-visible ${className}`}
      style={{
        width: 'clamp(28px, 3.2vw, 40px)',
        height: 'clamp(28px, 3.2vw, 40px)',
      }}
    >
      {/* 1. Sharp Clean Vector Icon (Displayed in idle / ready state) */}
      <div
        className={`w-full h-full flex items-center justify-center text-[#E2652B] transition-opacity duration-150 ${
          isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {type === 'code' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-[#E2652B]"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-[#E2652B]"
          >
            <line x1="6" x2="10" y1="12" y2="12" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="15" x2="15.01" y1="13" y2="13" />
            <line x1="18" x2="18.01" y1="11" y2="11" />
            <rect width="20" height="12" x="2" y="6" rx="2" />
          </svg>
        )}
      </div>

      {/* 2. Unbounded Circular Pixel Disintegration & Funnel Swirl Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-100 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '128px',
          height: '128px',
          maxWidth: 'none',
          maxHeight: 'none',
        }}
      />
    </div>
  )
}
