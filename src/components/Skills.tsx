import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        minHeight: '100vh',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '110px',
      }}
      className="w-full max-w-[1200px] mx-auto scroll-mt-[110px]"
    >
      {/* Section Heading with generous breathing room above and below */}
      <div className="pt-2 sm:pt-6 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono mb-3 sm:mb-4 uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>04 // CAPABILITIES</span>
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
