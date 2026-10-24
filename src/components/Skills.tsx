import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      className="w-full max-w-[1200px] mx-auto select-none scroll-mt-[28px]"
    >
      {/* Section Heading: balanced breathing room above cards */}
      <div
        style={{
          marginBottom: 'clamp(34px, 3.8vw, 44px)',
        }}
        className="space-y-2 shrink-0"
      >
        <div className="flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>04 · CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          Tech I Know
        </h2>
      </div>

      {/* 12-Cell Interactive Grid Matrix */}
      <div className="w-full">
        <TornadoGridMatrix />
      </div>
    </section>
  )
}
