import DhakaNeonDrift from './DhakaNeonDrift'

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ padding: '120px 24px' }}
      className="w-full max-w-[1400px] mx-auto relative flex flex-col items-center select-none"
    >
      {/* Stripped-Down Minimalist Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest text-[#D2531D] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#D2531D] shadow-[0_0_8px_#D2531D]" />
          <span>02 // BUILDS &amp; EXPERIMENTS</span>
        </div>
        <div className="text-xs font-mono text-neutral-500">
          [SPATIAL 3D REPOSITORY]
        </div>
      </div>

      {/* FULL-SCREEN IMMERSIVE 3D RETRO-FUTURISTIC GAME SHOWCASE */}
      <div className="w-full">
        <DhakaNeonDrift />
      </div>
    </section>
  )
}
