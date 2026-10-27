import PixelInteractiveIcon from './PixelInteractiveIcon'
import TornadoGridMatrix from './TornadoGridMatrix'
import ShinyText from './ShinyText'

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
          <ShinyText
            text="Tech I Know"
            color="#b5b5b5"
            shineColor="#ffffff"
            speed={2}
            shineWidth={40}
            softness={0.8}
            trigger="loop"
            delay={0}
            angle={120}
            bands={1}
            glow={0}
            direction="left"
            easing="smooth"
            yoyo={false}
            followPointer={false}
            pauseOnHover={false}
            disabled={false}
          />
        </h2>
      </div>

      {/* 12-Cell Interactive Grid Matrix */}
      <div className="w-full">
        <TornadoGridMatrix />
      </div>
    </section>
  )
}
