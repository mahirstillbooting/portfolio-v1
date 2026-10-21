import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Wrench, Sparkles, BarChart3 } from 'lucide-react'

export default function Skills() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Reference telemetry heights (from Reference Image #1)
  const telemetryBars = [
    { label: 'JS', height: 68 },
    { label: 'SQL', height: 48 },
    { label: 'C++', height: 32 },
    { label: 'C', height: 38 },
    { label: 'JAVA', height: 56 },
    { label: 'HTML', height: 92 },
    { label: 'CSS', height: 90 },
    { label: 'ESP32', height: 52 },
    { label: 'AI', height: 44 },
    { label: 'FIGMA', height: 74 },
  ]

  const skillGroups = [
    {
      category: 'LANGUAGES & FOUNDATIONS',
      icon: Code2,
      skills: [
        { name: 'JavaScript (ES6+)', level: 'Active focus & core interest' },
        { name: 'HTML5 & Modern CSS3', level: 'Responsive flexbox & grid design' },
        { name: 'SQL & Relational DBs', level: 'Queries, joins & schema modeling' },
        { name: 'C & C++', level: 'Data structures & embedded systems' },
        { name: 'Java', level: 'OOP principles & architecture' },
      ],
    },
    {
      category: 'HARDWARE & CLOUD TOOLS',
      icon: Wrench,
      skills: [
        { name: 'ESP32 & Sensors', level: 'NEO-M8N GPS & serial telemetry' },
        { name: 'Firebase Firestore', level: 'NoSQL cloud auth & database' },
        { name: 'Git & GitHub', level: 'Version control & branch management' },
        { name: 'Oracle APEX', level: 'Enterprise relational application design' },
        { name: 'Figma', level: 'Wireframing & design prototyping' },
      ],
    },
    {
      category: 'ENGINEERING WORKFLOWS',
      icon: Sparkles,
      skills: [
        { name: 'AI Workflows & Prompting', level: 'Antigravity, Claude, ChatGPT' },
        { name: 'Software QA Testing', level: 'ISO-25010 verification & testing' },
        { name: 'Responsive Web Design', level: 'freeCodeCamp certified' },
        { name: 'Technical English', level: 'Fluent written & verbal communication' },
      ],
    },
  ]

  return (
    <section
      id="skills"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col justify-center"
    >
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono mb-2 uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-[#E2652B]" />
            <span>04 // TELEMETRY &amp; CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Technical Matrix
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#9CA3AF] font-mono max-w-md">
          Authentic tools, languages, and hardware applied across university and personal projects.
        </p>
      </div>

      {/* Telemetry Bar Chart Widget (Height: 220px, Padding: 36px) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ padding: '36px' }}
        className="bento-card corner-plus mb-12"
      >
        <div className="flex items-center justify-between text-xs font-mono mb-6">
          <div className="flex items-center gap-2 text-[#EDEDED]">
            <BarChart3 className="w-4 h-4 text-[#E2652B]" />
            <span className="font-mono text-xs font-semibold tracking-wider">
              TELEMETRY DISTRIBUTION // 10D SAMPLING
            </span>
          </div>
          <div className="text-[11px] text-[#6B7280] font-mono">
            {hoveredBar !== null ? (
              <span className="text-[#E2652B]">
                {telemetryBars[hoveredBar].label}: {telemetryBars[hoveredBar].height}% ACTIVITY
              </span>
            ) : (
              'HOVER BARS FOR METRICS'
            )}
          </div>
        </div>

        {/* Chart container reduced to 220px height with clean cream #E6D5B8 bars */}
        <div
          style={{ height: '220px' }}
          className="flex items-end justify-between gap-3 sm:gap-6 pt-4 px-4 bg-[#0A0A0C] rounded-2xl border border-white/6"
        >
          {telemetryBars.map((bar, idx) => (
            <div
              key={bar.label}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
              className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
            >
              <div
                style={{ height: `${bar.height}%` }}
                className="w-full max-w-[28px] bg-[#E6D5B8] group-hover:bg-[#E2652B] transition-all duration-200 shadow-sm relative rounded-t-xs"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-[#6B7280] group-hover:text-white mt-3 transition-colors">
                {bar.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#6B7280] border-t border-white/6 pt-3">
          <span>SOURCE: REPOSITORY LOGS</span>
          <span>PALETTE: #E6D5B8 CREAM // #E2652B ACCENT</span>
        </div>
      </motion.div>

      {/* 3 Skill Cards spaced cleanly (gap: 28px) */}
      <div style={{ gap: '28px' }} className="grid grid-cols-1 md:grid-cols-3">
        {skillGroups.map((group, idx) => {
          const Icon = group.icon
          return (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="bento-card corner-plus flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 text-xs text-[#E2652B] font-mono tracking-wider mb-6 pb-3 border-b border-white/6">
                  <Icon className="w-4 h-4" />
                  <span>{group.category}</span>
                </div>

                <div className="space-y-4">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="text-sm text-white font-medium font-sans">
                        {skill.name}
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-mono mt-0.5">
                        {skill.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/6 text-[10px] font-mono text-[#6B7280] flex justify-between">
                <span>VERIFIED // CSE</span>
                <span>EAST WEST UNIVERSITY</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
