import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        padding: '40px 24px',
        minHeight: 'auto',
        height: 'auto',
        scrollMarginTop: '80px',
        boxSizing: 'border-box',
      }}
      className="w-full max-w-[1200px] mx-auto select-none scroll-mt-[80px]"
    >
      {/* Section Heading: consistent adequate breathing room */}
      <div className="mb-6 sm:mb-8 space-y-1.5 shrink-0">
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
