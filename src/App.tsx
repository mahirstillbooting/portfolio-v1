import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SoundToggle from './components/SoundToggle'

export default function App() {
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      // Don't trigger if inside input or playing game
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      if (e.key === 'g' || e.key === 'G') {
        window.open('https://github.com/mahirstillbooting', '_blank')
      }
      if (e.key === 'j' || e.key === 'J') {
        window.scrollBy({ top: 350, behavior: 'smooth' })
      }
      if (e.key === 'k' || e.key === 'K') {
        window.scrollBy({ top: -350, behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyNav)
    return () => window.removeEventListener('keydown', handleKeyNav)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#0b0b0c] text-[#ededed] font-sans selection:bg-[#e2652b] selection:text-black flex flex-col items-center overflow-x-hidden">
      <Navbar />
      <main className="w-full flex flex-col items-center">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <SoundToggle />
    </div>
  )
}
