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
      <div className="mb-12">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono mb-2 uppercase">
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
