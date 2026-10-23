import DhakaNeonDrift from './DhakaNeonDrift'

export default function Projects() {
  return (
    <section
      id="projects"
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '80px',
      }}
      className="w-full relative min-h-screen bg-[#0b0b0c] overflow-hidden select-none scroll-mt-[80px]"
    >
      {/* Top Transition Fade from Hero */}
      <div
        className="absolute top-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #0b0b0c 0%, rgba(11, 11, 12, 0.85) 35%, transparent 100%)',
        }}
      />

      <DhakaNeonDrift />

      {/* Bottom Transition Fade to About */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #0b0b0c 0%, rgba(11, 11, 12, 0.85) 35%, transparent 100%)',
        }}
      />
    </section>
  )
}
