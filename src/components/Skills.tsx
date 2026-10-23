import { Cpu } from 'lucide-react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        paddingTop: 'clamp(90px, 14vw, 160px)',
        paddingBottom: 'clamp(90px, 14vw, 160px)',
      }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center px-4 sm:px-8 scroll-mt-24"
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
