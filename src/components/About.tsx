import { motion } from 'framer-motion'
import { Award, Gamepad2, Keyboard, MapPin, Compass, Sparkles, Cpu } from 'lucide-react'

export default function About() {
  const passions = [
    {
      icon: Keyboard,
      title: 'Mechanical Keyboards',
      desc: 'Custom switches, lubing sound signatures & tactile feedback.',
    },
    {
      icon: Sparkles,
      title: 'Perfume Notes',
      desc: 'Niche accords, olfactory pyramids & fragrance chemistry.',
    },
    {
      icon: Gamepad2,
      title: 'Retro PC Gaming',
      desc: 'Formative roots in Metal Slug, GTA San Andreas & Rockstar worlds.',
    },
    {
      icon: Cpu,
      title: 'AI Engineering',
      desc: 'High-leverage prompt workflows with Antigravity, Claude & Figma.',
    },
  ]

  return (
    <section
      id="about"
      style={{
        paddingTop: 'clamp(90px, 14vw, 160px)',
        paddingBottom: 'clamp(90px, 14vw, 160px)',
      }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center px-4 sm:px-6 scroll-mt-24"
    >
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14 space-y-2">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
          <Compass className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>03 // ABOUT &amp; MINDSET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          The Honest Journey
        </h2>
      </div>

      {/* Unified Bento Grid Layout: 12-Column CSS Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): Main Bio Box with Explicit Padding and Inner Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="flex flex-col">
            {/* Top Bar Header with Clear Divider */}
            <div className="flex items-center justify-between text-xs font-mono text-[#71717A] tracking-widest pb-4 mb-6 border-b border-white/8">
              <span>SYSTEM PROFILE // IDENTITY</span>
              <span className="text-[#E2652B] font-semibold">EAST WEST UNIVERSITY</span>
            </div>

            {/* Main Bio Text */}
            <div
              style={{
                fontFamily: "'Geist Sans', sans-serif",
              }}
              className="space-y-4 text-sm sm:text-base leading-relaxed text-[#D4D4D8]"
            >
              <p>
                I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I am not a prodigy or seasoned veteran—I struggle often, learn at my own deliberate pace, and work persistently until every assigned problem is resolved with absolute polish.
              </p>
              <p>
                My passion sparked as a kid watching <span className="text-white font-medium">Metal Slug</span> arcades and playing <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, which evolved into hands-on software development and web tinkering. Today, I pair core CS fundamentals in C, C++, and Java with modern JavaScript and high-velocity AI engineering workflows.
              </p>
            </div>
          </div>

          {/* Badges Dedicated Footer Flex Row */}
          <div className="mt-8 pt-5 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">freeCodeCamp Certified: Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#A1A1AA]">
              Native/Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Right Column (5 cols): Vertically Stacked Location and Academic Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Top Card: Location / Dhaka City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#71717A] pb-3 mb-4 border-b border-white/8">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                  LOC // BANGLADESH
                </span>
                <span className="text-[#E2652B] font-semibold">23.81° N, 90.41° E</span>
              </div>

              <h3 className="text-xl font-sans font-semibold text-white mb-2">
                Dhaka City
              </h3>
              <p className="text-sm font-sans text-[#A1A1AA] leading-relaxed">
                Living and engineering in the heart of Dhaka. Fast-paced, resilient, and always active.
              </p>
            </div>

            {/* Clean ASCII / Dot Map Snippet */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-white/8 font-mono text-xs select-none">
              <div className="text-[#8E9298] leading-tight overflow-x-auto whitespace-pre">
                {`  ⣠⠤⠤⠤⠤⠤⣠⠤⠤⡀     ⣀⠤⠤⠤⡀
⢀⠎       ⢸   ⠉⠲⠤⠤⠤⠎   ⢱
⡰⠁  `}
                <span className="text-[#F1FA8C] font-bold">Dhaka</span>
                <span className="text-[#4D7CFE]">∷∷</span>
                {` ⠣⠤⠤⠤⠤⠤⠤⠤⠤⠤⠴⠁
⠣⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤⠤`}
              </div>
            </div>
          </motion.div>

          {/* Bottom Card: Academic Degree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex flex-col justify-center p-6 sm:p-7 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="text-xs font-mono tracking-widest text-[#71717A] pb-2 mb-3 border-b border-white/8">
              ACADEMIC DEGREE
            </div>
            <div className="text-lg font-sans text-white font-bold mb-1 tracking-tight">
              BSc in Computer Science &amp; Engineering
            </div>
            <div className="text-xs font-mono text-[#E2652B] mb-2 font-semibold">
              East West University (4th Year Student)
            </div>
            <p className="text-sm font-sans text-[#A1A1AA] leading-relaxed">
              Software engineering, database architectures, and QA verification.
            </p>
          </motion.div>

        </div>

        {/* Bottom Row (Interest Cards): 4-column row on desktop, 2x2 on mobile */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
          {passions.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-[#0F0F0F] border border-[#222222] hover:border-[#D2531D]/40 transition-colors min-h-[160px] sm:min-h-[175px] shadow-xl overflow-hidden backdrop-blur-xl"
              >
                <div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/8 text-[#E2652B] w-fit mb-4">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2652B]" />
                  </div>
                  <h4 className="text-sm sm:text-[15px] font-sans font-semibold text-white mb-2 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-[13px] font-sans text-[#D4D4D8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>

    </section>
  )
}
