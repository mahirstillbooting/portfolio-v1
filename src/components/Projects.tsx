import { Cpu } from 'lucide-react'
import DhakaNeonDrift from './DhakaNeonDrift'

export interface ProjectCardData {
  id: string
  title: string
  category: string
  summary: string // STRICT: max 25 words!
  stack: string[]
  status: string
  collaborators?: { name: string; url: string }[]
}

export const PROJECTS_LIST: ProjectCardData[] = [
  {
    id: 'chalokapp',
    title: 'ChalokApp',
    category: 'CAPSTONE // WEB & TRACKING',
    summary:
      'Collaborating with my capstone team to prototype a basic ESP32 and GPS tracking module for auto-rickshaw management in Bangladesh.',
    stack: ['ESP32', 'NEO-M8N GPS', 'C++', 'Node.js', 'React', 'MongoDB'],
    status: 'CAPSTONE IN PROGRESS',
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
  },
  {
    id: 'ivory',
    title: 'Ivory Pastry',
    category: 'E-COMMERCE // WEB APPLICATION',
    summary:
      'Artisanal bakery storefront featuring reactive cart persistence and Firestore NoSQL cloud database integration.',
    stack: ['JavaScript', 'Tailwind CSS', 'Firebase Firestore', 'HTML5'],
    status: 'PRODUCTION LIVE',
  },
  {
    id: 'waste',
    title: 'Smart Waste Dhaka',
    category: 'CIVIC TECH // WEB PLATFORM',
    summary:
      'Civic platform bringing schedule transparency and dispute mitigation to door-to-door waste collector crews across Dhaka.',
    stack: ['JavaScript', 'Civic Tech UI', 'System Architecture', 'HTML5'],
    status: 'ARCHIVED PROTOTYPE',
  },
  {
    id: 'bookshop',
    title: 'Book Shop DB',
    category: 'DATABASE SYSTEMS // ORACLE APEX',
    summary:
      'Enterprise bookstore inventory, relational schema modeling, multi-table joins, and stored PL/SQL procedures on Oracle APEX.',
    stack: ['Oracle APEX', 'Oracle SQL', 'PL/SQL', 'Database Modeling'],
    status: 'ACADEMIC EXCELLENCE',
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1280px] mx-auto relative flex flex-col items-center select-none"
    >
      {/* Section Header */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#E2652B] font-mono uppercase">
            <Cpu className="w-3.5 h-3.5 text-[#E2652B]" />
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

      {/* 1. BORDERLESS 3D THREE.JS PROJECT ROVER GAME: DHAKA NEON DRIFT WITH SPLIT VIEWPORT */}
      <div className="w-full">
        <DhakaNeonDrift />
      </div>
    </section>
  )
}
