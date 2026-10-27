import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import UseAnimations from 'react-useanimations'
import github from 'react-useanimations/lib/github'
import discord from 'react-useanimations/lib/discord'
import MicroSlats from './MicroSlats'

function TypewriterOnline() {
  const text = 'ONLINE'
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (charIndex < text.length) {
        timer = setTimeout(() => {
          setDisplayedText(text.slice(0, charIndex + 1))
          setCharIndex((prev) => prev + 1)
        }, 110)
      } else {
        // Hold full 'ONLINE' for 2.6s
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 2600)
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayedText(text.slice(0, charIndex - 1))
          setCharIndex((prev) => prev - 1)
        }, 65)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false)
        }, 500)
      }
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting])

  return (
    <span
      style={{ width: '6.5ch' }}
      className="inline-flex items-center justify-start text-left text-[#E2652B] font-semibold font-mono tracking-wider shrink-0 overflow-visible"
    >
      <span>{displayedText}</span>
      <span
        style={{
          boxShadow: '0 0 8px rgba(226, 101, 43, 0.7)',
          animation: 'caretBlink 1.4s ease-in-out infinite',
        }}
        className="inline-block w-[1.5px] h-[1em] ml-0.5 bg-[#E2652B] align-middle rounded-full shrink-0"
        aria-hidden="true"
      />
    </span>
  )
}

export default function Footer() {
  const discordUrl = 'https://discord.com/users/526274172058468373'
  const githubUrl = 'https://github.com/mahirstillbooting'

  return (
    <footer
      className="w-full relative overflow-hidden flex flex-col justify-center items-center select-none"
      style={{ minHeight: 'clamp(340px, 44vh, 480px)' }}
    >
      {/* Interactive MicroSlats Animated Background with 220px Organic Mask Fade */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.6) 130px, black 220px)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.6) 130px, black 220px)',
        }}
      >
        <MicroSlats
          preset="swell"
          color="#f97316"
          glintColor="#ffffff"
          backgroundColor="#080808"
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

      {/* Deep dark gradient overlay melting from contact section with zero visible border */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#080808] via-[#080808]/90 via-35% to-transparent pointer-events-none z-[1]" />

      {/* Floating Centered Glass Dock in ONE Single Line */}
      <div className="relative z-10 w-full max-w-[1040px] px-3 sm:px-8 py-8 pointer-events-none flex justify-center items-center">
        <div className="w-full flex flex-row items-center justify-between gap-2 sm:gap-5 py-2.5 sm:py-3.5 px-3.5 sm:px-7 rounded-2xl bg-[#08080A]/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(226,101,43,0.06)]">
          
          {/* Left: GitHub Profile Link (Icon only on mobile, text on sm+) */}
          <div className="flex items-center pointer-events-auto shrink-0">
            <UseAnimations
              animation={github}
              size={26}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-lg hover:text-white transition-colors"
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
                  <div className="flex items-center justify-center text-[#E2652B] group-hover:scale-110 transition-transform">
                    <span {...animationProps} />
                  </div>
                  <span className="hidden sm:inline text-xs sm:text-[13px] font-mono font-medium text-[#D4D4D8] group-hover:text-white transition-colors">
                    GitHub
                  </span>
                </a>
              )}
            />
          </div>

          {/* Center: System Status & Brand in matching font-mono, non-bold, Title Case in ONE Line */}
          <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto text-center whitespace-nowrap min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] shrink-0">
              <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E2652B] shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs text-[#D4D4D8] inline-flex items-center">
                STATUS:&nbsp;<TypewriterOnline />
              </span>
            </div>
            <span className="text-white/20 text-xs shrink-0">|</span>
            <span className="font-mono text-[10.5px] sm:text-[13px] font-normal text-[#E4E4E7] tracking-normal sm:tracking-wider select-none truncate">
              Mahiruddin Chowdhury
            </span>
          </div>

          {/* Right: Discord Profile Link (Icon only on mobile, text on sm+) */}
          <div className="flex items-center pointer-events-auto shrink-0">
            <UseAnimations
              animation={discord}
              size={26}
              strokeColor="#E2652B"
              render={(eventProps, animationProps) => (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-lg hover:text-white transition-colors"
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
                  <span className="hidden sm:inline text-xs sm:text-[13px] font-mono font-medium text-[#D4D4D8] group-hover:text-white transition-colors">
                    Discord
                  </span>
                  <div className="flex items-center justify-center text-[#E2652B] group-hover:scale-110 transition-transform">
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
