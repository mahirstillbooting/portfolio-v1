import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  'SYS // ARGON_V1 INITIALIZING...',
  'LOADING PIXEL MATRIX ENGINE...',
  'CALIBRATING DOT-LED GRID [52x52]...',
  'MOUNTING PORTRAIT // VORTEX_READY',
  'CONNECTING SIGNAL >> DHAKA +06:00',
  'BOOT SEQUENCE COMPLETE.',
]

export default function Loader({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    let i = 0
    const lineInterval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100))
        i++
      } else {
        clearInterval(lineInterval)
        setTimeout(onDone, 600)
      }
    }, 280)
    return () => clearInterval(lineInterval)
  }, [onDone])

  // Spinning orb dots on canvas (M5 morph-style)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const N = 8; const R = 9; const size = 28
    const center = size / 2
    let t = 0

    const loop = () => {
      ctx.clearRect(0, 0, size, size)
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2 + t
        // Scatter outward
        const scatter = Math.abs(Math.cos(t * 0.5 + i * 0.4)) * 4
        const x = center + Math.cos(a) * (R + scatter)
        const y = center + Math.sin(a) * (R + scatter)
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 ? '#E2652B' : '#E8EAED'
        ctx.globalAlpha = 0.7 + Math.sin(t + i) * 0.3
        ctx.fill()
      }
      ctx.globalAlpha = 1
      t += 0.06
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#0b0b0c', backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
    >
      {/* Orb */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <canvas ref={canvasRef} width={28} height={28} />
        <span className="font-mono font-bold text-[18px] tracking-widest glow-orange">ARGON</span>
        <span className="text-[10px] tracking-widest" style={{ color: 'var(--muted)' }}>MAHIRUDDIN.DEV // PORTFOLIO_OS</span>
      </div>

      {/* Terminal boot log */}
      <div
        className="w-full max-w-sm rounded-xl p-4"
        style={{ background: 'rgba(22,23,24,0.9)', border: '1px solid var(--border)', minHeight: 140 }}
      >
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] tracking-widest flex gap-2 mb-1"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="glow-orange">{'>'}</span>
              <span style={{ color: i === lines.length - 1 ? 'var(--text)' : 'var(--muted)' }}>{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
          className="text-[10px]"
          style={{ color: 'var(--accent-orange)' }}
        >█</motion.span>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-full max-w-sm">
        <div className="flex justify-between text-[9px] tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
          <span>BOOT // PROGRESS</span>
          <span style={{ color: 'var(--accent-orange)' }}>{progress}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25 }}
            style={{ height: '100%', background: 'var(--accent-orange)', boxShadow: '0 0 8px var(--accent-orange)' }}
          />
        </div>
      </div>
    </div>
  )
}
