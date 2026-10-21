export default function Footer() {
  return (
    <footer className="w-full border-t border-white/6 bg-[#060608] py-10 px-6 sm:px-8 font-mono text-xs text-[#6B7280] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* TUI Vim-Style Keybind Hints */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 text-[11px]">
          <div>
            <span className="kbd-tag mr-1.5">arrows/hjkl</span>
            <span>Nav</span>
          </div>
          <div>
            <span className="kbd-tag mr-1.5">c</span>
            <span>Braille</span>
          </div>
          <div>
            <span className="kbd-tag mr-1.5">g</span>
            <a
              href="https://github.com/mahirstillbooting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9CA3AF] hover:text-[#E2652B] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Center / Right: System Status & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#E5E7EB]">
            <span className="live-dot" />
            <span>STATUS: <strong className="text-[#E2652B] font-normal">ONLINE</strong></span>
          </div>
          <span className="text-white/20">|</span>
          <span>ARGON // MAHIRUDDIN CHOWDHURY</span>
        </div>

      </div>
    </footer>
  )
}
