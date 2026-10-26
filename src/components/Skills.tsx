import PixelInteractiveIcon from './PixelInteractiveIcon'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  return (
    <section
      id="skills"
      className="w-full max-w-[1200px] mx-auto select-none scroll-mt-[28px]"
    >
      {/* Section Heading: Tech I Know (Preserved exact position) */}
      <div
        style={{
          marginBottom: 'clamp(34px, 3.8vw, 44px)',
        }}
        className="pt-6 shrink-0"
      >
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight flex items-center gap-2.5 sm:gap-3.5">
          <PixelInteractiveIcon type="code" />
          <span>Tech I Know</span>
        </h2>
      </div>

      {/* 12-Cell Interactive Grid Matrix */}
      <div className="w-full">
        <TornadoGridMatrix />
      </div>
    </section>
  )
}
