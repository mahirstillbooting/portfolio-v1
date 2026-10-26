import { Terminal } from 'lucide-react'
import { GithubIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.12] bg-[#0A0A0C] py-8 px-6 sm:px-8 font-mono text-xs text-[#A1A1AA] flex justify-center select-none shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-[1120px] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Social Profile */}
        <div className="flex items-center gap-4 text-xs">
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
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#F4F4F6]">
            <Terminal className="w-3.5 h-3.5 text-[#E2652B]" />
            <span>STATUS: <strong className="text-[#E2652B] font-semibold">ONLINE</strong></span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-[#E4E4E7] font-medium tracking-wide">MAHIRUDDIN CHOWDHURY</span>
        </div>

      </div>
    </footer>
  )
}
