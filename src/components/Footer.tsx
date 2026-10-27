import { Terminal } from 'lucide-react'
import { GithubIcon } from './Icons'
import MicroSlats from './MicroSlats'

export default function Footer() {
  return (
    <footer
      className="w-full relative border-t border-white/[0.12] overflow-hidden flex flex-col justify-between select-none shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      style={{ minHeight: 'clamp(320px, 42vh, 480px)' }}
    >
      {/* Interactive MicroSlats Animated Background */}
      <div className="absolute inset-0 z-0">
        <MicroSlats
          preset="swell"
          color="#f97316"
          glintColor="#ffffff"
          backgroundColor="#120f17"
          slatWidth={10}
          slatHeight={25}
          gap={3}
          roundness={0.75}
          interactive
          cursorStrength={1}
          cursorSize={40}
          swirl={0}
          trail={1.4}
          lean={0}
          intro
          scale={1.5}
          speed={0.6}
          direction={250}
          chop={0.55}
          stretch={0}
          glint={0.7}
          contrast={1.25}
          perspective={0.55}
          fog={0.55}
          introDuration={1.5}
          paused={false}
        />
      </div>

      {/* Subtle top edge gradient vignette for smooth obsidian transition */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#080808]/90 via-[#120f17]/30 to-transparent pointer-events-none z-[1]" />

      {/* Foreground Content: Anchored & highly legible glass dock */}
      <div className="relative z-10 w-full h-full flex-1 flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-5 rounded-2xl bg-[#08080A]/80 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          
          {/* Left: Social Profile */}
          <div className="flex items-center gap-4 text-xs font-mono pointer-events-auto">
            <a
              href="https://github.com/mahirstillbooting"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[#D4D4D8] hover:text-[#E2652B] transition-colors duration-200 font-medium"
            >
              <GithubIcon className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#E2652B] transition-colors duration-200" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Right: System Status & Brand */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[#F4F4F6]">
              <Terminal className="w-3.5 h-3.5 text-[#E2652B]" />
              <span>
                STATUS: <strong className="text-[#E2652B] font-semibold">ONLINE</strong>
              </span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-[#E4E4E7] font-medium tracking-wide">MAHIRUDDIN CHOWDHURY</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
