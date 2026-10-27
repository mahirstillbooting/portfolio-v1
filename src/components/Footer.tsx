import { Terminal } from 'lucide-react'
import UseAnimations from 'react-useanimations'
import github from 'react-useanimations/lib/github'
import discord from 'react-useanimations/lib/discord'
import MicroSlats from './MicroSlats'

export default function Footer() {
  const discordUrl = 'https://discord.com/users/526274172058468373'
  const githubUrl = 'https://github.com/mahirstillbooting'

  return (
    <footer
      className="w-full relative overflow-hidden flex flex-col justify-center items-center select-none shadow-[0_-20px_50px_rgba(0,0,0,0.7)]"
      style={{ minHeight: 'clamp(360px, 46vh, 520px)' }}
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

      {/* Deep dark gradient fade from contact section into slats - seamless, no horizontal line */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#080808] via-[#080808]/90 via-35% to-transparent pointer-events-none z-[1]" />

      {/* Floating Centered Glass Dock with Enlarged Typography */}
      <div className="relative z-10 w-full max-w-[1120px] px-4 sm:px-8 py-8 pointer-events-none flex justify-center items-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 py-5 px-6 sm:px-8 rounded-2xl bg-[#0A0A0D]/85 backdrop-blur-xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_24px_rgba(226,101,43,0.08)]">
          
          {/* Left: GitHub Profile Link with Animated Icon */}
          <div className="flex items-center pointer-events-auto">
            <UseAnimations
              animation={github}
              size={32}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 py-2 px-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200"
                  {...eventProps}
                  onPointerEnter={(e) => {
                    eventProps.onPointerEnter({ ...e, pointerType: 'mouse' } as React.PointerEvent<HTMLElement>)
                  }}
                  onTouchStart={() => {
                    eventProps.onMouseEnter({ defaultPrevented: false } as React.MouseEvent<HTMLElement>)
                  }}
                  onTouchEnd={() => {
                    setTimeout(() => {
                      eventProps.onMouseLeave({ defaultPrevented: false } as React.MouseEvent<HTMLElement>)
                    }, 1400)
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E2652B] group-hover:border-[#E2652B]/40 transition-colors">
                    <span {...animationProps} />
                  </div>
                  <span className="text-sm sm:text-base font-mono font-semibold text-[#E4E4E7] group-hover:text-white transition-colors">
                    GitHub
                  </span>
                </a>
              )}
            />
          </div>

          {/* Center: System Status & Brand with Enlarged Prominence */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 pointer-events-auto text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <Terminal className="w-4 h-4 text-[#E2652B]" />
              <span className="font-mono text-xs sm:text-sm text-[#D4D4D8]">
                STATUS: <strong className="text-[#E2652B] font-bold">ONLINE</strong>
              </span>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="font-sans text-sm sm:text-base font-bold tracking-wider text-white">
              MAHIRUDDIN CHOWDHURY
            </span>
          </div>

          {/* Right: Discord Profile Link with Animated Icon */}
          <div className="flex items-center pointer-events-auto">
            <UseAnimations
              animation={discord}
              size={32}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 py-2 px-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200"
                  {...eventProps}
                  onPointerEnter={(e) => {
                    eventProps.onPointerEnter({ ...e, pointerType: 'mouse' } as React.PointerEvent<HTMLElement>)
                  }}
                  onTouchStart={() => {
                    eventProps.onMouseEnter({ defaultPrevented: false } as React.MouseEvent<HTMLElement>)
                  }}
                  onTouchEnd={() => {
                    setTimeout(() => {
                      eventProps.onMouseLeave({ defaultPrevented: false } as React.MouseEvent<HTMLElement>)
                    }, 1400)
                  }}
                >
                  <span className="text-sm sm:text-base font-mono font-semibold text-[#E4E4E7] group-hover:text-white transition-colors">
                    Discord
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E2652B] group-hover:border-[#E2652B]/40 transition-colors">
                    <span {...animationProps} />
                  </div>
                </a>
              )}
            />
          </div>

        </div>
      </div>
    </footer>
  )
}
