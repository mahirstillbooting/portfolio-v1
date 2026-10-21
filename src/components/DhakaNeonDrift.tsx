import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowUpRight, Navigation } from 'lucide-react'
import { getAudioEnabled } from '../utils/audioState'

export interface ProjectItem {
  id: string
  num: string
  title: string
  desc: string
  pos: [number, number, number]
  liveUrl: string
  codeUrl: string
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'chalokapp',
    num: '01',
    title: 'ChalokApp',
    desc: 'Hardware-assisted vehicle telemetry and real-time GPS tracking system prototyped with ESP32.',
    pos: [-9, 0, -5],
    liveUrl: 'https://github.com/mahirstillbooting/ChalokApp',
    codeUrl: 'https://github.com/mahirstillbooting/ChalokApp',
  },
  {
    id: 'ars',
    num: '02',
    title: 'ARS System',
    desc: 'Open-source academic enrollment architecture compliant with ISO-25010 software quality benchmarks.',
    pos: [8, 0, -6],
    liveUrl: 'https://github.com/mahirstillbooting',
    codeUrl: 'https://github.com/mahirstillbooting',
  },
  {
    id: 'ivory',
    num: '03',
    title: 'Ivory Pastry',
    desc: 'Artisanal storefront featuring reactive cart persistence and Firestore NoSQL cloud synchronization.',
    pos: [-7, 0, 7],
    liveUrl: 'https://ivorypastry.web.app',
    codeUrl: 'https://github.com/mahirstillbooting',
  },
  {
    id: 'waste',
    num: '04',
    title: 'Smart Waste Dhaka',
    desc: 'Civic platform bringing schedule transparency and dispute mitigation to door-to-door collector crews.',
    pos: [9, 0, 6],
    liveUrl: 'https://github.com/mahirstillbooting',
    codeUrl: 'https://github.com/mahirstillbooting',
  },
  {
    id: 'bookshop',
    num: '05',
    title: 'Book Shop DB',
    desc: 'Relational bookstore inventory schema featuring multi-table joins and stored PL/SQL procedures.',
    pos: [0, 0, -11],
    liveUrl: 'https://github.com/mahirstillbooting',
    codeUrl: 'https://github.com/mahirstillbooting',
  },
]

export default function DhakaNeonDrift() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [activeProject, setActiveProject] = useState<ProjectItem>(PROJECTS[0])
  const [isFocused, setIsFocused] = useState<boolean>(true)
  const [hasMoved, setHasMoved] = useState<boolean>(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const jumpToProjectRef = useRef<((idx: number) => void) | null>(null)

  // Web Audio mechanical synth chime
  const playChime = useCallback(() => {
    if (!getAudioEnabled()) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(540, now)
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.18)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.46)
    } catch {
      // Audio fallback
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Pure OLED Black
    scene.fog = new THREE.FogExp2(0x000000, 0.022)

    const isMobile = window.innerWidth < 768
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 44,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    )

    // Initial camera position focused on project 01
    const p0 = PROJECTS[0]
    camera.position.set(p0.pos[0], 2.2, p0.pos[2] + 7.2)
    const camLookAt = new THREE.Vector3(p0.pos[0], 1.1, p0.pos[2])
    camera.lookAt(camLookAt)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 1)

    // 2. Minimal Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(15, 25, 12)
    scene.add(dirLight)

    // 3. Infinite Dot-Matrix Grid Plane & Starfield
    const gridHelper = new THREE.GridHelper(56, 56, 0xd2531d, 0x1f1f1f)
    gridHelper.position.y = -0.01
    scene.add(gridHelper)

    // Concentric coordinate rings
    const ringGroup = new THREE.Group()
    ;[6, 12, 18, 24].forEach((radius) => {
      const ringGeo = new THREE.BufferGeometry()
      const segments = 64
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0.01, Math.sin(theta) * radius))
      }
      ringGeo.setFromPoints(points)
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x1f1f1f,
        transparent: true,
        opacity: 0.8,
      })
      ringGroup.add(new THREE.Line(ringGeo, ringMat))
    })
    scene.add(ringGroup)

    // 600 Floating dot-matrix starfield particles
    const starCount = 600
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60
      starPos[i * 3 + 1] = Math.random() * 12 + 0.1
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0x555555,
      size: 0.16,
      transparent: true,
      opacity: 0.6,
    })
    const starMesh = new THREE.Points(starGeo, starMat)
    scene.add(starMesh)

    // 4. Low-Poly Mechanical Reticle/Drone
    const droneGroup = new THREE.Group()

    // Sleek triangular wireframe body
    const droneGeo = new THREE.ConeGeometry(0.7, 1.8, 3)
    droneGeo.rotateX(Math.PI / 2)
    const droneMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.9,
    })
    const droneMesh = new THREE.Mesh(droneGeo, droneMat)
    droneMesh.position.y = 0.5
    droneGroup.add(droneMesh)

    // Stark white wireframe outline
    const droneWireGeo = new THREE.EdgesGeometry(droneGeo)
    const droneWireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    const droneWire = new THREE.LineSegments(droneWireGeo, droneWireMat)
    droneWire.position.copy(droneMesh.position)
    droneGroup.add(droneWire)

    // Glowing Nothing Red thruster
    const thrusterLight = new THREE.PointLight(0xd2531d, 3.0, 8)
    thrusterLight.position.set(0, 0.5, 0.9)
    droneGroup.add(thrusterLight)

    droneGroup.position.set(p0.pos[0], 0, p0.pos[2] + 1.2)
    scene.add(droneGroup)

    // Particle exhaust trail
    const trailMax = 90
    const trailPositions = new Float32Array(trailMax * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    const trailMat = new THREE.PointsMaterial({
      color: 0xd2531d,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
    const trailMesh = new THREE.Points(trailGeo, trailMat)
    scene.add(trailMesh)

    let trailIdx = 0
    const addTrailPoint = (x: number, y: number, z: number) => {
      trailPositions[trailIdx * 3] = x
      trailPositions[trailIdx * 3 + 1] = y + 0.35
      trailPositions[trailIdx * 3 + 2] = z
      trailIdx = (trailIdx + 1) % trailMax
      trailGeo.attributes.position.needsUpdate = true
    }

    // 5. Glowing Red LED Ring Nodes for Each Project
    interface NodeMeshObj {
      group: THREE.Group
      data: ProjectItem
      crystal: THREE.Mesh
      groundRing: THREE.Mesh
      verticalRing: THREE.Mesh
      light: THREE.PointLight
    }
    const nodeMeshes: NodeMeshObj[] = []

    PROJECTS.forEach((p, idx) => {
      const nGroup = new THREE.Group()
      nGroup.position.set(p.pos[0], p.pos[1], p.pos[2])

      // Horizontal Glowing LED Ring on Ground
      const gRingGeo = new THREE.RingGeometry(1.5, 1.7, 48)
      gRingGeo.rotateX(-Math.PI / 2)
      const gRingMat = new THREE.MeshBasicMaterial({
        color: 0xd2531d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
      const groundRing = new THREE.Mesh(gRingGeo, gRingMat)
      groundRing.position.y = 0.02
      nGroup.add(groundRing)

      // Vertical Pulsing Ring
      const vRingGeo = new THREE.RingGeometry(1.2, 1.32, 32)
      const vRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      })
      const verticalRing = new THREE.Mesh(vRingGeo, vRingMat)
      verticalRing.position.y = 1.2
      nGroup.add(verticalRing)

      // Unique Low-Poly Geometric Artifact per Project
      let artifactGeo: THREE.BufferGeometry
      if (idx === 0) artifactGeo = new THREE.OctahedronGeometry(0.85, 0)
      else if (idx === 1) artifactGeo = new THREE.IcosahedronGeometry(0.8, 0)
      else if (idx === 2) artifactGeo = new THREE.TorusGeometry(0.65, 0.22, 8, 24)
      else if (idx === 3) artifactGeo = new THREE.DodecahedronGeometry(0.8, 0)
      else artifactGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8)

      const artifactMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.15,
        metalness: 0.8,
        emissive: 0xd2531d,
        emissiveIntensity: 0.4,
      })
      const crystal = new THREE.Mesh(artifactGeo, artifactMat)
      crystal.position.y = 1.2
      nGroup.add(crystal)

      const crystalWireGeo = new THREE.EdgesGeometry(artifactGeo)
      const crystalWireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
      crystal.add(new THREE.LineSegments(crystalWireGeo, crystalWireMat))

      // Vertical holographic light column
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.35, 5, 16, 1, true)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xd2531d,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.position.y = 2.5
      nGroup.add(beam)

      // Red LED PointLight
      const nLight = new THREE.PointLight(0xd2531d, 3.0, 10)
      nLight.position.y = 1.4
      nGroup.add(nLight)

      scene.add(nGroup)
      nodeMeshes.push({ group: nGroup, data: p, crystal, groundRing, verticalRing, light: nLight })
    })

    // 6. Navigation Motion State
    const state = {
      x: p0.pos[0],
      z: p0.pos[2] + 1.2,
      vx: 0,
      vz: 0,
      heading: 0,
      targetHeading: 0,
      isAutoNav: false,
    }

    // 7. Instant GSAP Transition to Project
    const jumpToProject = (idx: number) => {
      const p = PROJECTS[idx]
      if (!p) return

      setActiveProject(p)
      setIsFocused(true)
      state.isAutoNav = true
      playChime()

      // 1. Camera transition directly in front of the project artifact
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camLookAt)

      gsap.to(camera.position, {
        x: p.pos[0],
        y: 2.2,
        z: p.pos[2] + 7.2,
        duration: 1.4,
        ease: 'power4.inOut',
      })

      gsap.to(camLookAt, {
        x: p.pos[0],
        y: 1.1,
        z: p.pos[2],
        duration: 1.4,
        ease: 'power4.inOut',
      })

      // 2. Drone glides smoothly in front of the artifact
      gsap.killTweensOf(state)
      gsap.to(state, {
        x: p.pos[0],
        z: p.pos[2] + 1.2,
        duration: 1.4,
        ease: 'power4.inOut',
        onComplete: () => {
          state.isAutoNav = false
        },
      })
    }
    jumpToProjectRef.current = jumpToProject

    // 8. Desktop Keyboard & Steering
    const keys: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const key = e.key
      // 1-5 Instant GSAP jump
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const idx = parseInt(key, 10) - 1
        jumpToProject(idx)
        return
      }

      keys[key.toLowerCase()] = true
      state.isAutoNav = false
      setHasMoved(true)
      setIsFocused(false) // Dismiss spatial typography when steering away
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // 9. Mouse Vector Steering & Click-to-Focus Raycasting
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let isMouseDown = false

    const handlePointerDown = (e: PointerEvent) => {
      isMouseDown = true
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      // Raycast check for project crystals
      raycaster.setFromCamera(mouse, camera)
      const crystals = nodeMeshes.map((nm) => nm.crystal)
      const hits = raycaster.intersectObjects(crystals, true)
      if (hits.length > 0) {
        const hit = hits[0].object
        const nm = nodeMeshes.find((n) => n.crystal === hit || n.crystal.children.includes(hit as THREE.LineSegments))
        if (nm) {
          const idx = PROJECTS.findIndex((p) => p.id === nm.data.id)
          if (idx !== -1) jumpToProject(idx)
        }
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      // Mouse vector steering when held down
      if (isMouseDown && !state.isAutoNav) {
        state.vx += mouse.x * 0.4
        state.vz += -mouse.y * 0.4
        setHasMoved(true)
        setIsFocused(false)
      }
    }

    const handlePointerUp = () => {
      isMouseDown = false
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    // 10. Main Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Manual WASD / Arrow steering
      if (!state.isAutoNav) {
        let ax = 0
        let az = 0
        const accel = 0.55

        if (keys['w'] || keys['arrowup']) az -= accel
        if (keys['s'] || keys['arrowdown']) az += accel
        if (keys['a'] || keys['arrowleft']) ax -= accel
        if (keys['d'] || keys['arrowright']) ax += accel

        if (ax !== 0 || az !== 0) {
          state.vx += ax
          state.vz += az
          state.targetHeading = Math.atan2(ax, az)
        }

        // Soft spring inertia damping
        state.vx *= 0.88
        state.vz *= 0.88
        state.x += state.vx
        state.z += state.vz
        state.x = Math.max(-24, Math.min(24, state.x))
        state.z = Math.max(-24, Math.min(24, state.z))

        // Heading rotation
        if (Math.hypot(state.vx, state.vz) > 0.02) {
          const diff = state.targetHeading - state.heading
          state.heading += THREE.MathUtils.clamp(diff, -0.15, 0.15)

          // Camera smoothly tracks drone in free roaming mode
          camera.position.x += (state.x - camera.position.x) * 0.06
          camera.position.z += (state.z + 10 - camera.position.z) * 0.06
          camera.position.y += (7 - camera.position.y) * 0.06
          camLookAt.x += (state.x - camLookAt.x) * 0.08
          camLookAt.z += (state.z - camLookAt.z) * 0.08
          camLookAt.y += (0.5 - camLookAt.y) * 0.08
        }
      }

      // Update Drone
      droneGroup.position.set(state.x, 0, state.z)
      droneGroup.rotation.y = state.heading

      // Exhaust particle trail
      if (Math.hypot(state.vx, state.vz) > 0.02 || state.isAutoNav) {
        addTrailPoint(state.x, 0, state.z)
      }

      // Animate Nodes & Check Drone Proximity
      nodeMeshes.forEach((nm, idx) => {
        nm.crystal.rotation.y = time * 0.85 + idx * 0.5
        nm.crystal.rotation.x = Math.sin(time * 1.5 + idx) * 0.15
        nm.verticalRing.rotation.y = -time * 1.2
        nm.verticalRing.rotation.x = time * 0.8

        const isCurrent = activeProject.id === nm.data.id
        nm.light.intensity = isCurrent ? 4.5 : 2.0
        nm.groundRing.scale.setScalar(1 + Math.sin(time * 3 + idx) * 0.06)

        // If drone approaches node in free flight, lock onto it
        if (!state.isAutoNav) {
          const dist = Math.hypot(state.x - nm.data.pos[0], state.z - nm.data.pos[2])
          if (dist < 3.2 && activeProject.id !== nm.data.id) {
            setActiveProject(nm.data)
            setIsFocused(true)
            playChime()
          }
        }
      })

      // Starfield twinkle
      starMesh.rotation.y = time * 0.003

      // Camera orientation
      camera.lookAt(camLookAt)

      renderer.render(scene, camera)
    }

    animate()

    // 11. Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.fov = window.innerWidth < 768 ? 55 : 44
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      renderer.dispose()
    }
  }, [playChime, activeProject.id])

  return (
    <div className="relative w-full h-[580px] sm:h-[680px] lg:h-[720px] rounded-3xl bg-black border border-[#1F1F1F] overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair select-none"
      />

      {/* Top Left Indicator: Minimal Reticle Status */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 text-xs font-mono text-neutral-400 pointer-events-none">
        <Navigation className="w-3.5 h-3.5 text-[#D2531D]" />
        <span className="text-white font-medium">WASD / VECTOR STEER</span>
        <span className="text-neutral-600">•</span>
        <span className="hidden sm:inline text-neutral-500">1-5 QUICK FOCUS</span>
      </div>

      {/* SPATIAL FLOATING TYPOGRAPHY IN 3D (NO RECTANGULAR CARDS, NO SIDE PANELS) */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 transition-all duration-700 pointer-events-none ${
          isFocused ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="max-w-2xl text-center flex flex-col items-center pointer-events-auto">
          {/* Spatial Node Marker */}
          <div className="text-xs font-mono tracking-widest text-[#D2531D] mb-3 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2531D]" />
            <span>PROJECT // {activeProject.num}</span>
          </div>

          {/* Massive Stark White Project Title (JetBrains Mono / Dot-matrix aesthetic) */}
          <h3
            style={{ fontFamily: "'JetBrains Mono', monospace, sans-serif" }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase mb-4 drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]"
          >
            {activeProject.title}
          </h3>

          {/* Ultra-concise 1-sentence description */}
          <p className="text-sm sm:text-base font-mono text-neutral-400 max-w-lg mb-8 leading-relaxed">
            {activeProject.desc}
          </p>

          {/* Minimal Spatial Interactive CTA Buttons */}
          <div className="flex items-center gap-4">
            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderColor: '#D2531D',
                color: '#FFFFFF',
              }}
              className="px-6 py-2.5 rounded-full border text-xs font-mono font-medium tracking-wider flex items-center gap-2 hover:bg-[#D2531D] hover:text-black transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(210,83,29,0.3)] no-underline"
            >
              <span>[VIEW LIVE]</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={activeProject.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full border border-neutral-700 text-xs font-mono font-medium tracking-wider text-neutral-300 hover:text-white hover:border-white transition-all duration-200 active:scale-95 no-underline"
            >
              <span>[CODEBASE]</span>
            </a>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM DOCK: CLEAN MINIMAL DOT-BAR NAVIGATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 sm:gap-6 px-6 py-2.5 rounded-full bg-black/85 border border-[#1F1F1F] backdrop-blur-xl">
        {PROJECTS.map((p, idx) => {
          const isSelected = activeProject.id === p.id
          return (
            <button
              key={p.id}
              onClick={() => {
                if (jumpToProjectRef.current) jumpToProjectRef.current(idx)
              }}
              className="group flex items-center gap-2 cursor-pointer transition-all active:scale-90"
              aria-label={`Focus project ${p.num}: ${p.title}`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#D2531D] scale-125 shadow-[0_0_10px_#D2531D]'
                    : 'bg-[#333333] group-hover:bg-neutral-400'
                }`}
              />
              <span
                className={`text-xs font-mono font-semibold transition-colors ${
                  isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {p.num}
              </span>
            </button>
          )
        })}
      </div>

      {/* Soft Initial Movement Prompt */}
      {!hasMoved && !isFocused && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-[11px] font-mono text-neutral-500 pointer-events-none animate-pulse">
          DRAG OR PRESS WASD TO GLIDE
        </div>
      )}
    </div>
  )
}
