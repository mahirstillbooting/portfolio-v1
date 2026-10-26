import { useState, useEffect, useRef } from 'react'
import TornadoGridMatrix from './TornadoGridMatrix'

export default function Skills() {
  const [isHeadingInView, setIsHeadingInView] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = headingRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeadingInView(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      className="w-full max-w-[1200px] mx-auto select-none scroll-mt-[28px]"
    >
      {/* Section Heading: Tech I Know (Preserved exact position) */}
      <div
        ref={headingRef}
        style={{
          marginBottom: 'clamp(34px, 3.8vw, 44px)',
        }}
        className="pt-6 shrink-0"
      >
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          <span className={`orange-gradient-word ${isHeadingInView ? 'animate' : 'idle'}`}>
            Tech
          </span>{' '}
          I Know
        </h2>
      </div>

      {/* 12-Cell Interactive Grid Matrix */}
      <div className="w-full">
        <TornadoGridMatrix />
      </div>
    </section>
  )
}
