import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center"
    >
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono mb-2 uppercase">
            <Cpu className="w-3.5 h-3.5 text-[#E2652B]" />
            <span>04 // TELEMETRY &amp; CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Technical Matrix
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-mono max-w-md">
          12-cell interactive dot-matrix grid with real-time 650ms particle vortex synthesis on hover.
        </p>
      </div>

      {/* 12-Cell Nothing OS Tornado Grid Matrix */}
      <TornadoGridMatrix />

      {/* Matrix Telemetry Footer */}
      <div className="mt-8 flex items-center justify-between text-[11px] font-mono text-[#6B7280] border-t border-white/6 pt-4">
        <span>GRID: 28x28 LED MATRIX // 650ms CUBIC FUNNEL SWIRL</span>
        <span>PALETTE: #D71921 NOTHING RED // #E2652B WARM ORANGE</span>
      </div>
    </section>
  )
}
