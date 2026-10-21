import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { Sparkles, Eye, ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './Icons'

export interface ProjectNode {
  id: string
  title: string
  category: string
  summary: string
  stack: string[]
  status: string
  color: string
  collaborators?: { name: string; url: string }[]
}

export const ORBITAL_PROJECTS: ProjectNode[] = [
  {
    id: 'chalokapp',
    title: 'ChalokApp',
    category: 'CAPSTONE // HARDWARE & IOT',
    summary: 'A hybrid IoT platform empowering traditional Bangladeshi auto-rickshaws with live GPS tracking without disrupting grassroots hiring.',
    stack: ['ESP32', 'NEO-M8N GPS', 'C++', 'Node.js', 'React', 'MongoDB'],
    status: 'CAPSTONE IN PROGRESS',
    color: '#E2652B',
    collaborators: [
      { name: '@Smswad', url: 'https://github.com/Smswad' },
      { name: '@Emon-2004', url: 'https://github.com/Emon-2004' },
    ],
  },
  {
    id: 'ars',
    title: 'ARS System',
    category: 'OPEN SOURCE // ARCHITECTURE & QA',
    summary: 'Open-source academic enrollment platform designed for Bangladeshi institutions, compliant with ISO-25010 software quality standards.',
    stack: ['JavaScript', 'HTML5/CSS3', 'System Architecture', 'QA Testing'],
    status: 'ACTIVE DEV',
    color: '#D71921',
  },
  {
    id: 'ivory',
    title: 'Ivory Pastry',
    category: 'E-COMMERCE // WEB APPLICATION',
    summary: 'Live artisanal bakery storefront featuring reactive cart persistence and Firestore NoSQL cloud database integration.',
    stack: ['JavaScript', 'Tailwind CSS', 'Firebase Firestore', 'HTML5'],
    status: 'PRODUCTION LIVE',
    color: '#E6D5B8',
  },
  {
    id: 'waste',
    title: 'Smart Waste Dhaka',
    category: 'CIVIC TECH // MUNICIPAL IOT',
    summary: 'Civic platform bringing schedule transparency and dispute mitigation to door-to-door waste collector crews across Dhaka neighborhoods.',
    stack: ['JavaScript', 'Civic Tech UI', 'IoT Architecture', 'HTML5'],
    status: 'ARCHIVED PROTOTYPE',
    color: '#4ADE80',
  },
  {
    id: 'bookshop',
    title: 'Book Shop DB',
    category: 'DATABASE SYSTEMS // ORACLE APEX',
    summary: 'Enterprise bookstore inventory, relational schema modeling, multi-table joins, and stored PL/SQL procedures on Oracle APEX.',
    stack: ['Oracle APEX', 'Oracle SQL', 'PL/SQL', 'Relational Modeling'],
    status: 'ACADEMIC EXCELLENCE',
    color: '#F1FA8C',
  },
]

export default function ThreeOrbitalProjects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [inspectedProject, setInspectedProject] = useState<ProjectNode | null>(null)

  const activeProject = ORBITAL_PROJECTS[activeIndex]
  const currentRotation = useRef(0)
  const targetRotation = useRef(0)
  const isDragging = useRef(false)
  const prevMouseX = useRef(0)
  const nodesRef = useRef<{ group: THREE.Group; project: ProjectNode; baseAngle: number }[]>([])

  const total = ORBITAL_PROJECTS.length
  const radius = 10

  // Web Audio Synth for Node Swapping
  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(540, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.13)
    } catch {
      // Audio fallback
    }
  }, [])

  const rotateTo = useCallback((index: number) => {
    const norm = (index + total) % total
    setActiveIndex(norm)
    playChime()
    // Snap target rotation so that active node aligns with center front
    const targetAngle = -(norm * (Math.PI * 2 / total))
    gsap.to(targetRotation, {
      current: targetAngle,
      duration: 0.8,
      ease: 'power3.out',
    })
  }, [playChime, total])

  const nextNode = () => rotateTo(activeIndex + 1)
  const prevNode = () => rotateTo(activeIndex - 1)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevNode()
      if (e.key === 'ArrowRight') nextNode()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene setup
    const scene = new THREE.Scene()
    scene.background = null // Transparent so it sits directly on pure #080808!

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 4, 18)
    camera.lookAt(0, 0, 0)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 4. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const orangeDir = new THREE.DirectionalLight(0xe2652b, 2.2)
    orangeDir.position.set(10, 20, 15)
    scene.add(orangeDir)

    const blueDir = new THREE.DirectionalLight(0x4d7cfe, 1.2)
    blueDir.position.set(-10, -10, -15)
    scene.add(blueDir)

    // 5. Floating Dust Particles
    const pCount = 120
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 36
      pPos[i + 1] = (Math.random() - 0.5) * 14
      pPos[i + 2] = (Math.random() - 0.5) * 36
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xe2652b,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
    })
    const dust = new THREE.Points(pGeo, pMat)
    scene.add(dust)

    // 6. Orbital Holographic Project Monoliths
    const nodes: { group: THREE.Group; project: ProjectNode; baseAngle: number }[] = []

    ORBITAL_PROJECTS.forEach((proj, idx) => {
      const baseAngle = (idx / total) * Math.PI * 2
      const group = new THREE.Group()

      // Holographic Gyro Cube (Wireframe)
      const cubeGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4)
      const cubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(proj.color),
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      })
      const cube = new THREE.Mesh(cubeGeo, cubeMat)
      group.add(cube)

      // Solid Glowing Monolith Core (Obsidian)
      const coreGeo = new THREE.BoxGeometry(2.0, 2.8, 2.0)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x141416,
        emissive: new THREE.Color(proj.color),
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      group.add(core)

      // Radar Pulse Ring beneath each node
      const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(proj.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = -1.9
      group.add(ring)

      scene.add(group)
      nodes.push({ group, project: proj, baseAngle })
    })

    nodesRef.current = nodes

    // 7. Raycasting for Clicking on 3D Objects
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      prevMouseX.current = e.clientX
    }

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - prevMouseX.current
        targetRotation.current += deltaX * 0.006
        prevMouseX.current = e.clientX
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false

      // Check click raycast if movement was minimal
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)

      const hits = raycaster.intersectObjects(
        nodes.flatMap((n) => n.group.children),
        true
      )

      if (hits.length > 0) {
        const hit = hits[0].object
        const matchedIndex = nodes.findIndex((n) => n.group.children.includes(hit))
        if (matchedIndex !== -1) {
          rotateTo(matchedIndex)
        }
      }
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // Animation Loop
    let animId: number
    const animate = (time: number) => {
      // Smooth dampening towards target rotation
      currentRotation.current += (targetRotation.current - currentRotation.current) * 0.08

      // Update positions along the 3D orbital ring
      nodes.forEach((item, idx) => {
        const angle = item.baseAngle + currentRotation.current
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius - 2 // push back slightly

        item.group.position.set(x, Math.sin(time * 0.002 + idx) * 0.35, z)
        item.group.rotation.y = -angle // face camera orientation

        // Subtle rotation of the outer wireframe
        item.group.children[0].rotation.y = time * 0.001
        item.group.children[0].rotation.x = Math.sin(time * 0.001 + idx) * 0.15

        // Scale & opacity based on front/back depth
        const depthFactor = (z + radius) / (radius * 2) // 0 (back) to 1 (front)
        const scale = 0.85 + depthFactor * 0.35
        item.group.scale.set(scale, scale, scale)
      })

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    // Resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [rotateTo, total])

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* 3D Canvas Stage (PURE BORDERLESS OVER PURE BLACK BACKGROUND) */}
      <div className="w-full relative h-[440px] sm:h-[500px] overflow-visible select-none cursor-grab active:cursor-grabbing flex items-center justify-center">
        
        {/* Three.js Canvas Container (No border, transparent background!) */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Left / Right Interactive Arrow Buttons */}
        <button
          onClick={prevNode}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#141416]/70 hover:bg-[#E2652B] hover:text-black border border-white/10 text-white transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextNode}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#141416]/70 hover:bg-[#E2652B] hover:text-black border border-white/10 text-white transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Next Project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Active Project Holographic Bar (Seamlessly floating below 3D ring) */}
      <div className="w-full max-w-xl mx-auto -mt-6 sm:-mt-8 z-20 px-4">
        <div className="bento-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#E2652B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#121214]/85 backdrop-blur-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#E2652B] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeProject.category}</span>
            </div>
            <h3 className="text-xl font-sans font-bold text-white tracking-tight">
              {activeProject.title}
            </h3>
            <p className="text-xs font-sans text-[#9CA3AF] max-w-sm leading-relaxed">
              {activeProject.summary}
            </p>
          </div>

          <button
            onClick={() => setInspectedProject(activeProject)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E2652B] hover:bg-[#E2652B]/90 text-black font-mono font-semibold text-xs tracking-wider transition-transform active:scale-95 cursor-pointer shrink-0 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>INSPECT</span>
          </button>
        </div>

        {/* Drag / Arrow keys hint */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-[#6B7280] tracking-widest uppercase">
          <span>DRAG 3D RING • USE [←] [→] KEYS</span>
        </div>
      </div>

      {/* FULL PROJECT INSPECTION DIALOG */}
      {inspectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-xl bg-[#141416] border border-white/12 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setInspectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono mb-2 uppercase">
              <span className="live-dot" />
              <span>{inspectedProject.category}</span>
            </div>

            <h3 className="text-3xl font-sans font-bold text-white mb-1">
              {inspectedProject.title}
            </h3>

            <p className="text-sm font-sans text-[#E2652B] mb-6">
              Status: {inspectedProject.status}
            </p>

            <p className="text-sm font-sans text-[#9CA3AF] leading-relaxed mb-6 pt-4 border-t border-white/8">
              {inspectedProject.summary}
            </p>

            {inspectedProject.collaborators && (
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/6">
                <span className="text-xs text-white font-medium font-mono block mb-2 uppercase tracking-wider">
                  Capstone Collaborators
                </span>
                <div className="flex flex-wrap gap-2">
                  {inspectedProject.collaborators.map((c) => (
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
                {inspectedProject.stack.map((item) => (
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
                STATUS: <strong className="text-white font-normal">{inspectedProject.status}</strong>
              </span>
              <button
                onClick={() => setInspectedProject(null)}
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 transition-transform active:scale-95 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
