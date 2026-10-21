import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { GithubIcon } from './Icons'
import ThreeOrbitalProjects from './ThreeOrbitalProjects'

export interface ProjectCardData {
  id: string
  title: string
  category: string
  summary: string // STRICT: max 25 words!
  stack: string[]
  status: string
  collaborators?: { name: string; url: string }[]
  colSpan: string // Bento 12-column span
}

export const PROJECTS_LIST: ProjectCardData[] = [
  {
    id: 'chalokapp',
    title: 'ChalokApp',
    category: 'CAPSTONE // HARDWARE & IOT',
    summary:
      'A hybrid IoT platform modernizing Bangladeshi auto-rickshaws with live ESP32 GPS tracking without disrupting grassroots hiring.',
    stack: ['ESP32', 'NEO-M8N GPS', 'C++', 'Node.js', 'React', 'MongoDB'],
    status: 'CAPSTONE IN PROGRESS',
    colSpan: 'col-span-12', // Hero prominent bento card across full 12 cols
    collaborators: [
      { name: '@Smswad', url: 'https://github.com/Smswad' },
      { name: '@Emon-2004', url: 'https://github.com/Emon-2004' },
    ],
  },
  {
    id: 'ars',
    title: 'ARS System',
    category: 'OPEN SOURCE // ARCHITECTURE & QA',
    summary:
      'Open-source academic enrollment engine built for Bangladeshi institutions, compliant with ISO-25010 software quality benchmarks.',
    stack: ['JavaScript', 'HTML5/CSS3', 'System Architecture', 'QA Testing'],
    status: 'ACTIVE DEV',
    colSpan: 'col-span-12 md:col-span-6',
  },
  {
    id: 'ivory',
    title: 'Ivory Pastry',
    category: 'E-COMMERCE // WEB APPLICATION',
    summary:
      'Artisanal bakery storefront featuring reactive cart persistence and Firestore NoSQL cloud database integration.',
    stack: ['JavaScript', 'Tailwind CSS', 'Firebase Firestore', 'HTML5'],
    status: 'PRODUCTION LIVE',
    colSpan: 'col-span-12 md:col-span-6',
  },
  {
    id: 'waste',
    title: 'Smart Waste Dhaka',
    category: 'CIVIC TECH // MUNICIPAL IOT',
    summary:
      'Civic platform bringing schedule transparency and dispute mitigation to door-to-door waste collector crews across Dhaka.',
    stack: ['JavaScript', 'Civic Tech UI', 'IoT Architecture', 'HTML5'],
    status: 'ARCHIVED PROTOTYPE',
    colSpan: 'col-span-12 md:col-span-6',
  },
  {
    id: 'bookshop',
    title: 'Book Shop DB',
    category: 'DATABASE SYSTEMS // ORACLE APEX',
    summary:
      'Enterprise bookstore inventory, relational schema modeling, multi-table joins, and stored PL/SQL procedures on Oracle APEX.',
    stack: ['Oracle APEX', 'Oracle SQL', 'PL/SQL', 'Database Modeling'],
    status: 'ACADEMIC EXCELLENCE',
    colSpan: 'col-span-12 md:col-span-6',
  },
]

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null)

  return (
    <section
      id="projects"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col items-center"
    >
      {/* Section Header */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
            <span className="live-dot" />
            <span>02 // SELECTED WORKS &amp; CAPSTONE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-white">
            Builds &amp; Experiments
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#9CA3AF] max-w-xl leading-relaxed">
            Real engineering projects built during my degree at East West University and technical explorations.
          </p>
        </div>

        <div className="text-xs font-mono text-[#6B7280] shrink-0">
          [5 VERIFIED SYSTEMS]
        </div>
      </div>

      {/* 1. BORDERLESS 3D THREE.JS PROJECT ORBITAL CAROUSEL */}
      <div className="w-full mb-20">
        <ThreeOrbitalProjects />
      </div>

      {/* 2. STRICT BENTO GRID (12-COLUMNS, GAP: 28PX, PADDING: 36PX) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '28px',
        }}
        className="w-full"
      >
        {PROJECTS_LIST.map((proj) => (
          <motion.div
            key={proj.id}
            onClick={() => setSelectedProject(proj)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`bento-card ${proj.colSpan} flex flex-col justify-between corner-plus cursor-pointer group hover:border-[#E2652B]/40 transition-all`}
          >
            <div>
              {/* 1. Small Geist Mono Category Tag (11px, #E2652B) */}
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono tracking-widest text-[#E2652B]">
                <span>{proj.category}</span>
                <span className="text-[10px] text-[#6B7280] border border-white/8 px-2.5 py-0.5 rounded-full">
                  {proj.status}
                </span>
              </div>

              {/* 2. Project Title (Geist Sans, 24px, font-weight: 600, margin: 12px 0) */}
              <h3
                style={{ margin: '12px 0', fontSize: '24px', fontWeight: 600 }}
                className="font-sans text-white group-hover:text-[#E2652B] transition-colors tracking-tight flex items-center justify-between"
              >
                <span>{proj.title}</span>
                <ArrowUpRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#E2652B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </h3>

              {/* 3. Maximum 2-sentence summary (Geist Sans, 15px, line-height: 1.6, color: #9CA3AF) */}
              <p
                style={{ fontSize: '15px', lineHeight: 1.6, color: '#9CA3AF' }}
                className="font-sans"
              >
                {proj.summary}
              </p>
            </div>

            <div>
              {/* Collaborators row if present (ChalokApp) */}
              {proj.collaborators && proj.collaborators.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/6 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono tracking-wider text-[#6B7280]">
                    COLLABORATORS:
                  </span>
                  {proj.collaborators.map((c) => (
                    <a
                      key={c.name}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-[#E2652B] text-white hover:text-black border border-white/8 hover:border-[#E2652B] text-xs font-mono transition-all no-underline"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{c.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </div>
              )}

              {/* 4. Clean minimal tech pills at the bottom (margin-top: 24px) */}
              <div style={{ marginTop: '24px' }} className="flex flex-wrap gap-2">
                {proj.stack.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs font-mono text-[#9CA3AF] bg-white/[0.03] border border-white/6 rounded-lg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QUICK SPECS DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-[#141416] border border-white/12 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto font-sans"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono mb-2 uppercase">
                <span className="live-dot" />
                <span>{selectedProject.category}</span>
              </div>

              <h3 className="text-3xl font-sans font-bold text-white mb-2">
                {selectedProject.title}
              </h3>

              <p className="text-sm font-mono text-[#E2652B] mb-6">
                Status: {selectedProject.status}
              </p>

              <p className="text-base font-sans text-[#9CA3AF] leading-relaxed mb-6 pt-4 border-t border-white/8">
                {selectedProject.summary}
              </p>

              {selectedProject.collaborators && (
                <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/6">
                  <span className="text-xs text-white font-medium font-mono block mb-2 uppercase tracking-wider">
                    Capstone Collaborators
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.collaborators.map((c) => (
                      <a
                        key={c.name}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#E2652B] text-white hover:text-black border border-white/10 text-xs font-mono transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>{c.name}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <span className="text-xs text-white font-medium font-mono block mb-3 uppercase tracking-wider">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-xs font-mono text-[#9CA3AF] bg-white/[0.04] border border-white/8 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/8 flex items-center justify-between font-mono">
                <span className="text-xs text-[#6B7280]">
                  SYS.VERIFIED // EWU
                </span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 transition-transform active:scale-95 cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
