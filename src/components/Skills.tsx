import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        minHeight: '100vh',
        padding: '36px 24px 80px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '96px',
      }}
      className="w-full max-w-[1200px] mx-auto scroll-mt-[96px]"
    >
      {/* Section Heading with generous breathing room above and below */}
      <div className="pt-4 sm:pt-6 mb-12 sm:mb-16 lg:mb-20 space-y-3">
        <div className="flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>04 · CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          Tech I Know
        </h2>
      </div>

      {/* 12-Cell Interactive Grid Matrix */}
      <TornadoGridMatrix />
    </section>
  )
}
