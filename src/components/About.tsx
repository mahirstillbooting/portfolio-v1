import { motion } from 'framer-motion'
import { Award, Gamepad2, Keyboard, MapPin, Compass } from 'lucide-react'
import { PerfumeBottleIcon } from './Icons'

export default function About() {
  const passions = [
    {
      icon: Keyboard,
      title: 'Mechanical Keyboards',
      desc: 'Custom switches, lubing sound signatures & tactile feedback.',
    },
    {
      icon: PerfumeBottleIcon,
      title: 'Perfume Notes',
      desc: 'Niche accords, olfactory pyramids & fragrance chemistry.',
    },
    {
      icon: Gamepad2,
      title: 'Retro PC Gaming',
      desc: 'Formative roots in Metal Slug, GTA San Andreas & Rockstar worlds.',
    },
    {
      icon: Compass,
      title: 'AI Engineering',
      desc: 'High-leverage prompt workflows with Antigravity, Claude & Figma.',
    },
  ]

  return (
    <section
      id="about"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center"
    >
      {/* Section Heading */}
      <div className="mb-14 space-y-2">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
          <Compass className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>03 // ABOUT &amp; MINDSET</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          The Honest Journey
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Main Biography Card (STRICT: 2 short, punchy paragraphs with line-height: 1.8, font-size: 16px) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 bento-card flex flex-col justify-between corner-plus"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#6B7280] tracking-widest pb-4 mb-6 border-b border-white/6">
              <span>SYSTEM PROFILE // IDENTITY</span>
              <span className="text-[#E2652B]">EAST WEST UNIVERSITY</span>
            </div>

            <div style={{ maxWidth: '65ch' }} className="space-y-6 text-[16px] font-sans text-[#9CA3AF] leading-[1.8]">
              <p>
                I am <strong className="text-white font-medium">Mahiruddin Chowdhury</strong>, a 4th-year Computer Science and Engineering student at East West University in Dhaka, Bangladesh. I am not a prodigy or seasoned veteran—I struggle often, learn at my own deliberate pace, and work persistently until every assigned problem is resolved with absolute polish.
              </p>
              <p>
                My passion sparked as a kid watching <span className="text-white font-medium">Metal Slug</span> arcades and playing <span className="text-[#E2652B] font-medium">GTA: San Andreas</span>, which evolved into hands-on software development and web tinkering. Today, I pair core CS fundamentals in C, C++, and Java with modern JavaScript and high-velocity AI engineering workflows.
              </p>
            </div>
          </div>

          {/* Cert & English Pill */}
          <div className="mt-8 pt-6 border-t border-white/6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">freeCodeCamp Certified: Responsive Web Design</span>
            </div>

            <div className="text-[11px] text-[#6B7280]">
              Native/Professional English Proficiency
            </div>
          </div>
        </motion.div>

        {/* Side Cards: Telemetry & Location */}
        <div className="lg:col-span-4 flex flex-col gap-7">
          
          {/* Dot-matrix Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bento-card corner-plus flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#6B7280] mb-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E2652B]" />
                  LOC // BANGLADESH
                </span>
                <span className="text-[#E2652B]">23.81° N, 90.41° E</span>
              </div>

              <h3 className="text-lg font-sans font-semibold text-white mb-1">
                Dhaka City
              </h3>
              <p className="text-xs font-sans text-[#9CA3AF] leading-relaxed">
                Living and engineering in the heart of Dhaka. Fast-paced, resilient, and always active.
              </p>
            </div>

            {/* Braille Map snippet */}
            <div className="mt-5 p-3 rounded-xl bg-black/60 border border-white/6 font-mono text-xs select-none">
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

          {/* Education Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bento-card corner-plus"
          >
            <div className="text-xs font-mono tracking-widest text-[#6B7280] mb-2">
              ACADEMIC DEGREE
            </div>
            <div className="text-sm font-sans text-white font-medium mb-1">
              BSc in Computer Science &amp; Engineering
            </div>
            <div className="text-xs font-mono text-[#E2652B] mb-2">
              East West University (4th Year Student)
            </div>
            <p className="text-xs font-sans text-[#9CA3AF] leading-relaxed">
              Software engineering, database architectures, and QA verification.
            </p>
          </motion.div>

        </div>

      </div>

      {/* HOBBY CARDS: CLEAN 4-COLUMN ROW (gap: 24px, padding: 28px each) */}
      <div style={{ gap: '24px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {passions.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              style={{ padding: '28px' }}
              className="bento-card corner-plus flex flex-col justify-between hover:border-[#E2652B]/40 transition-colors"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/6 text-[#E2652B] w-fit mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-sans font-semibold text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs font-sans text-[#9CA3AF] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

    </section>
  )
}
