import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

interface PortraitCanvasProps {
  imageSrc: string
}

interface DotParticle {
  ox: number
  oy: number
  x: number
  y: number
  vx: number
  vy: number
  r0: number
  a0: number
  lum: number
  baseRadius: number
  heat: number
  delay: number
  totalSpin: number
  scatterAngle: number
  scatterDist: number
  isAmbient: boolean
}

interface Shockwave {
  r: number
  alpha: number
  maxR: number
}

// High-contrast fallback silhouette if image is loading or offline
function createFallbackPortrait(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 400
  c.height = 400
  const g = c.getContext('2d')!
  g.fillStyle = '#000'
  g.fillRect(0, 0, 400, 400)

  // Head & face shading
  const headGrad = g.createRadialGradient(195, 165, 15, 200, 180, 120)
  headGrad.addColorStop(0, '#ffffff')
  headGrad.addColorStop(0.55, '#888888')
  headGrad.addColorStop(1, '#000000')
  g.fillStyle = headGrad
  g.beginPath()
  g.ellipse(200, 175, 80, 105, 0, 0, Math.PI * 2)
  g.fill()

  // Shoulders
  const bodyGrad = g.createRadialGradient(200, 360, 20, 200, 370, 150)
  bodyGrad.addColorStop(0, '#bbbbbb')
  bodyGrad.addColorStop(1, '#000000')
  g.fillStyle = bodyGrad
  g.beginPath()
  g.ellipse(200, 370, 140, 90, 0, 0, Math.PI * 2)
  g.fill()

  // Stylized cyber glasses / visor
  g.fillStyle = '#111111'
  g.fillRect(145, 150, 48, 22)
  g.fillRect(207, 150, 48, 22)
  g.fillStyle = '#ffffff'
  g.fillRect(152, 155, 16, 4)
  g.fillRect(214, 155, 16, 4)

  return c
}

export default function PortraitCanvas({ imageSrc }: PortraitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<DotParticle[]>([])
  const shockwavesRef = useRef<Shockwave[]>([])
  const dimsRef = useRef({ width: 0, height: 0, dpr: 1 })
  const mouseRef = useRef({ x: -999, y: -999, active: false, radius: 125 })
  const vortexRef = useRef({
    active: false,
    startTime: 0,
    duration: 880,
    spinDir: 1,
  })
  const scrollDispersionRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [, setIsSwirling] = useState(false)
  const imgRef = useRef<HTMLImageElement | HTMLCanvasElement | null>(null)

  const playVortexAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(480, now)
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.06)
      gain1.gain.setValueAtTime(0.16, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.065)

      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(70, now)
      osc2.frequency.exponentialRampToValueAtTime(160, now + 0.28)
      osc2.frequency.exponentialRampToValueAtTime(55, now + 0.7)
      gain2.gain.setValueAtTime(0.01, now)
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.25)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now)
      osc2.stop(now + 0.72)
    } catch {
      // Audio fallback
    }
  }, [])

  const triggerVortex = useCallback(() => {
    playVortexAudio()
    setIsSwirling(true)
    const v = vortexRef.current
    v.active = true
    v.startTime = performance.now()
    v.spinDir *= -1

    const width = dimsRef.current.width || 1200
    shockwavesRef.current.push({
      r: 20,
      alpha: 0.85,
      maxR: Math.max(width * 0.65, 550),
    })

    const particles = particlesRef.current
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const extraRotations = (1.1 + (p.r0 / (width * 0.45)) * 1.2) * Math.PI * 2
      p.totalSpin = extraRotations * v.spinDir
    }
  }, [playVortexAudio])

  // GSAP scroll-triggered pixel dispersion & fade
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 520
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      scrollDispersionRef.current = progress

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 1 - progress * 1.25,
          scale: 1 - progress * 0.1,
          y: -progress * 65,
          duration: 0.15,
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize and populate both face particles and wide ambient scattered particles
  const initParticles = useCallback((width: number, height: number) => {
    if (!width || !height) return

    const centerX = width / 2
    const centerY = Math.min(height * 0.44, 310)
    const faceRadius = Math.min(width * 0.35, 280, height * 0.44)
    const gridCount = 64
    const cellSize = (faceRadius * 2) / gridCount

    const newParticles: DotParticle[] = []
    const imgSource = imgRef.current || createFallbackPortrait()

    // 1. Central Face Portrait LED sampling
    const offscreen = document.createElement('canvas')
    offscreen.width = gridCount
    offscreen.height = gridCount
    const octx = offscreen.getContext('2d', { willReadFrequently: true })!
    octx.fillStyle = '#000'
    octx.fillRect(0, 0, gridCount, gridCount)

    const sw = (imgSource as HTMLImageElement).naturalWidth || imgSource.width
    const sh = (imgSource as HTMLImageElement).naturalHeight || imgSource.height
    if (sw > 0 && sh > 0) {
      const minDim = Math.min(sw, sh)
      const sx = (sw - minDim) / 2
      const sy = (sh - minDim) / 2
      octx.drawImage(imgSource, sx, sy, minDim, minDim, 0, 0, gridCount, gridCount)
    }

    const imgData = octx.getImageData(0, 0, gridCount, gridCount).data

    for (let r = 0; r < gridCount; r++) {
      for (let c = 0; c < gridCount; c++) {
        const idx = (r * gridCount + c) * 4
        const red = imgData[idx]
        const green = imgData[idx + 1]
        const blue = imgData[idx + 2]
        const alpha = imgData[idx + 3] / 255

        let lum = ((0.299 * red + 0.587 * green + 0.114 * blue) / 255) * alpha
        lum = Math.pow(lum, 1.18) // Punchy shadows & high-contrast LEDs

        const ox = centerX - faceRadius + c * cellSize + cellSize / 2
        const oy = centerY - faceRadius + r * cellSize + cellSize / 2
        const dx = ox - centerX
        const dy = oy - centerY
        const r0 = Math.hypot(dx, dy)

        if (r0 > faceRadius) continue

        // Feather boundary smoothly into ambient field
        const edgeFade =
          r0 > faceRadius * 0.74
            ? Math.max(0, 1 - (r0 - faceRadius * 0.74) / (faceRadius * 0.26))
            : 1
        lum *= edgeFade

        if (lum < 0.04) continue

        const a0 = Math.atan2(dy, dx)

        newParticles.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          r0,
          a0,
          lum,
          baseRadius: Math.max(0.7, (cellSize * 0.46) * Math.max(0.18, lum)),
          heat: 0,
          delay: (1 - Math.min(r0 / faceRadius, 1)) * 0.16 + Math.random() * 0.03,
          totalSpin: 0,
          scatterAngle: a0 + (Math.random() - 0.5) * 0.8,
          scatterDist: (Math.random() * 140 + 50) * (1 + r0 / faceRadius),
          isAmbient: false,
        })
      }
    }

    // 2. Wide Peripheral Scattered Particles across the entire canvas (Left & Right voids)
    // Spans from slight bright near the portrait to dark obsidian near the outer borders
    const stepX = 22
    const stepY = 22
    const maxDistX = width * 0.5

    for (let gx = 10; gx < width - 10; gx += stepX) {
      for (let gy = 10; gy < height - 10; gy += stepY) {
        const dx = gx - centerX
        const dy = gy - centerY
        const dist = Math.hypot(dx, dy * 1.08)

        // Skip inside the core of the face so face particles remain crisp
        if (dist < faceRadius * 0.82) continue

        // Organic jitter for natural scattered dot-matrix feel
        const ox = gx + (Math.random() - 0.5) * 14
        const oy = gy + (Math.random() - 0.5) * 14

        const distFromFace = Math.max(0, dist - faceRadius * 0.82)
        const normDist = Math.min(1, distFromFace / maxDistX)

        // Smooth exponential falloff: bright near face -> dark at peripheral edges
        const falloff = Math.exp(-normDist * 2.3)

        // Denser close to face, organically sparser towards peripheral void
        const keepProb = 0.54 + falloff * 0.38
        if (Math.random() > keepProb) continue

        // Luminance: slight bright (0.65..0.8) smoothly fading to dark embers (0.07..0.15)
        const lum = Math.min(
          0.82,
          Math.max(0.06, (0.07 + 0.73 * falloff) * (0.8 + Math.random() * 0.4))
        )

        // Subtle smaller particle radius for ambient field (0.75px to 1.5px)
        const baseRadius = 0.75 + falloff * 0.75 + Math.random() * 0.35

        const r0 = Math.hypot(ox - centerX, oy - centerY)
        const a0 = Math.atan2(oy - centerY, ox - centerX)

        newParticles.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          r0,
          a0,
          lum,
          baseRadius,
          heat: 0,
          delay: (1 - Math.min(r0 / (width * 0.6), 1)) * 0.22 + Math.random() * 0.04,
          totalSpin: 0,
          scatterAngle: a0 + (Math.random() - 0.5) * 0.8,
          scatterDist: (Math.random() * 160 + 50) * (1 + r0 / (width * 0.4)),
          isAmbient: true,
        })
      }
    }

    particlesRef.current = newParticles
  }, [])

  // Canvas setup, resize listener, image loader, and main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animId: number
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.floor(rect.width) || 1200
      const height = Math.floor(rect.height) || 600
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimsRef.current = { width, height, dpr }
      initParticles(width, height)
    }

    // Load Image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      handleResize()
    }
    img.onerror = () => {
      imgRef.current = createFallbackPortrait()
      handleResize()
    }
    img.src = imageSrc

    // Initial sizing immediately
    handleResize()

    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      const w = Math.floor(rect.width)
      const h = Math.floor(rect.height)
      if (Math.abs(w - dimsRef.current.width) > 20 || Math.abs(h - dimsRef.current.height) > 20) {
        handleResize()
      }
    })
    ro.observe(container)

    const easeInOutQuint = (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2

    const renderLoop = (now: number) => {
      const { width, height } = dimsRef.current
      if (!width || !height) {
        animId = requestAnimationFrame(renderLoop)
        return
      }

      const centerX = width / 2
      const centerY = Math.min(height * 0.44, 310)
      const v = vortexRef.current
      const isVortex = v.active
      const scrollDispersion = scrollDispersionRef.current

      if (isVortex) {
        const elapsed = now - v.startTime
        const progress = Math.min(elapsed / v.duration, 1)

        // Phosphor motion blur
        ctx.fillStyle = 'rgba(8, 8, 8, 0.28)'
        ctx.fillRect(0, 0, width, height)

        if (progress >= 1) {
          v.active = false
          setIsSwirling(false)
        }
      } else {
        ctx.clearRect(0, 0, width, height)
      }

      // Render expanding shockwaves
      const shockwaves = shockwavesRef.current
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const s = shockwaves[i]
        s.r += 8.0
        s.alpha *= 0.93
        ctx.save()
        ctx.strokeStyle = '#E2652B'
        ctx.globalAlpha = s.alpha
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 6])
        ctx.beginPath()
        ctx.arc(centerX, centerY, s.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
        if (s.alpha < 0.02 || s.r > s.maxR) shockwaves.splice(i, 1)
      }

      const particles = particlesRef.current
      const mouse = mouseRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (isVortex) {
          const elapsed = now - v.startTime
          const rawP = Math.min(elapsed / v.duration, 1)
          let localP = (rawP - p.delay) / (1 - p.delay)
          localP = Math.max(0, Math.min(1, localP))

          const ep = easeInOutQuint(localP)
          const sinBell = Math.sin(ep * Math.PI)

          const funnelFactor = p.isAmbient ? 0.42 : 0.78
          const funnel = 1 - sinBell * funnelFactor

          const waveScale = p.isAmbient ? 0.6 : 1.0
          const sWaveX = Math.sin(ep * Math.PI * 2) * (110 * waveScale) * sinBell
          const sWaveY = Math.cos(ep * Math.PI * 2) * (35 * waveScale) * sinBell

          const curR = p.r0 * funnel
          const curA = p.a0 + ep * p.totalSpin

          p.x = centerX + curR * Math.cos(curA) + sWaveX
          p.y = centerY + curR * Math.sin(curA) + sWaveY
          p.heat = sinBell * (p.isAmbient ? 0.5 : 0.8)
        } else {
          let targetX = p.ox
          let targetY = p.oy

          if (scrollDispersion > 0.01) {
            const dFactor = Math.pow(scrollDispersion, 1.4)
            targetX += Math.cos(p.scatterAngle) * p.scatterDist * dFactor
            targetY += Math.sin(p.scatterAngle) * p.scatterDist * dFactor
          }

          // Interactive magnetic cursor repulsion across the full canvas
          if (mouse.active && scrollDispersion < 0.35) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const dist = Math.hypot(dx, dy)
            if (dist < mouse.radius && dist > 0.1) {
              const force = Math.pow((mouse.radius - dist) / mouse.radius, 1.8)
              const angle = Math.atan2(dy, dx)
              p.vx += Math.cos(angle + 0.25) * force * 4.6
              p.vy += Math.sin(angle + 0.25) * force * 4.6
              p.heat = Math.min(1, p.heat + force * 0.45)
            }
          }

          // Damped spring return
          p.vx += (targetX - p.x) * 0.13
          p.vy += (targetY - p.y) * 0.13
          p.vx *= 0.81
          p.vy *= 0.81
          p.x += p.vx
          p.y += p.vy
          p.heat *= 0.91
        }

        // Skip essentially invisible dark particles
        if (p.lum < 0.04 && p.heat < 0.05) continue

        const scrollHeat = scrollDispersion * 0.6
        const totalHeat = Math.max(p.heat, scrollHeat)

        if (totalHeat > 0.25) {
          ctx.fillStyle = totalHeat > 0.55 ? '#E2652B' : '#D71921'
        } else {
          // Smooth luminance to color/alpha: slight bright (silver/white) to dark (charcoal/obsidian)
          const val = Math.round(20 + p.lum * 220)
          const alpha = Math.min(0.95, Math.max(0.18, p.lum * 1.15))
          ctx.fillStyle = `rgba(${val}, ${val}, ${val}, ${alpha})`
        }

        const sizeFade = Math.max(0.15, 1 - scrollDispersion * 0.85)
        const r = Math.max(0.5, p.baseRadius * (1 + p.heat * 0.35) * sizeFade)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(renderLoop)
    }

    animId = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [imageSrc, initParticles])

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
    mouseRef.current.active = true
  }

  const handlePointerLeave = () => {
    mouseRef.current.active = false
  }

  return (
    <div
      ref={containerRef}
      onClick={triggerVortex}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex flex-col items-center justify-center will-change-transform select-none cursor-pointer overflow-visible"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  )
}
