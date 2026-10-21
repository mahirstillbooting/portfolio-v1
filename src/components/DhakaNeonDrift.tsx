import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowUpRight, X, Sparkles, Navigation } from 'lucide-react'
import { PROJECTS_LIST, type ProjectCardData } from './Projects'

interface BeaconData {
  id: string
  title: string
  tag: string
  pos: [number, number, number]
  project: ProjectCardData
}

export default function DhakaNeonDrift() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeProject, setActiveProject] = useState<ProjectCardData | null>(null)
  const [activeBeaconId, setActiveBeaconId] = useState<string>('chalokapp')
  const [isDriving, setIsDriving] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Map 5 projects to 3D isometric beacon coordinates
  const beacons: BeaconData[] = [
    {
      id: 'chalokapp',
      title: '01: ChalokApp',
      tag: 'CAPSTONE IOT',
      pos: [-8.5, 0, -3.5],
      project: PROJECTS_LIST[0],
    },
    {
      id: 'ars',
      title: '02: ARS System',
      tag: 'QA ENGINE',
      pos: [7.5, 0, -4.5],
      project: PROJECTS_LIST[1],
    },
    {
      id: 'ivory',
      title: '03: Ivory Pastry',
      tag: 'FIRESTORE APP',
      pos: [-6.5, 0, 5.0],
      project: PROJECTS_LIST[2],
    },
    {
      id: 'waste',
      title: '04: Smart Waste Dhaka',
      tag: 'MUNICIPAL IOT',
      pos: [8.0, 0, 4.5],
      project: PROJECTS_LIST[3],
    },
    {
      id: 'bookshop',
      title: '05: Book Shop DB',
      tag: 'ORACLE APEX',
      pos: [0.5, 0, -8.0],
      project: PROJECTS_LIST[4],
    },
  ]

  // Synthesized mechanical futuristic chime on beacon unlock
  const playBeaconChime = useCallback(() => {
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

      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(520, now)
      osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.18)
      gain1.gain.setValueAtTime(0.14, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.46)

      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(880, now + 0.08)
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.3)
      gain2.gain.setValueAtTime(0.12, now + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.62)
    } catch {
      // Audio fallback
    }
  }, [])

  // Ref to trigger drive from outside Three.js loop
  const driveToRef = useRef<((targetX: number, targetZ: number, beacon?: BeaconData) => void) | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080808, 0.028)

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    const defaultCamPos = new THREE.Vector3(0, 18, 22)
    const defaultCamTarget = new THREE.Vector3(0, 0, 0)
    camera.position.copy(defaultCamPos)
    camera.lookAt(defaultCamTarget)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x080808, 0)

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(15, 25, 10)
    scene.add(dirLight)

    const orangeLight = new THREE.PointLight(0xe2652b, 2.5, 30)
    orangeLight.position.set(0, 4, 0)
    scene.add(orangeLight)

    // 3. Cyber Dot-Matrix Ground Plane
    const gridHelper = new THREE.GridHelper(38, 38, 0xe2652b, 0x1f2124)
    gridHelper.position.y = -0.01
    scene.add(gridHelper)

    // Ground dots
    const dotsCount = 400
    const dotGeo = new THREE.BufferGeometry()
    const dotPos = new Float32Array(dotsCount * 3)
    for (let i = 0; i < dotsCount; i++) {
      dotPos[i * 3] = (Math.random() - 0.5) * 36
      dotPos[i * 3 + 1] = 0.02
      dotPos[i * 3 + 2] = (Math.random() - 0.5) * 36
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3))
    const dotMat = new THREE.PointsMaterial({
      color: 0x9ca3af,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
    })
    const dotsMesh = new THREE.Points(dotGeo, dotMat)
    scene.add(dotsMesh)

    // 4. Controllable 3D Rover Node (Chalok Wireframe Vehicle)
    const roverGroup = new THREE.Group()

    // Main Chassis
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 2.4)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x141517,
      roughness: 0.3,
      metalness: 0.8,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    bodyMesh.position.y = 0.45
    roverGroup.add(bodyMesh)

    // Wireframe glowing exoskeleton
    const wireGeo = new THREE.EdgesGeometry(bodyGeo)
    const wireMat = new THREE.LineBasicMaterial({ color: 0xe2652b, linewidth: 2 })
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat)
    wireMesh.position.copy(bodyMesh.position)
    roverGroup.add(wireMesh)

    // Cockpit / Hood Accent
    const hoodGeo = new THREE.BoxGeometry(1.1, 0.4, 1.2)
    const hoodMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodMat)
    hoodMesh.position.set(0, 0.85, -0.2)
    roverGroup.add(hoodMesh)

    // Twin Headlight Cones
    const lightL = new THREE.PointLight(0xffeedd, 1.8, 8)
    lightL.position.set(-0.55, 0.5, -1.3)
    roverGroup.add(lightL)

    const lightR = new THREE.PointLight(0xffeedd, 1.8, 8)
    lightR.position.set(0.55, 0.5, -1.3)
    roverGroup.add(lightR)

    roverGroup.position.set(0, 0, 0)
    scene.add(roverGroup)

    // 5. Holographic Project Beacons
    interface BeaconMeshObj {
      group: THREE.Group
      data: BeaconData
      crystal: THREE.Mesh
      ring: THREE.Mesh
    }
    const beaconMeshList: BeaconMeshObj[] = []

    beacons.forEach((b) => {
      const bGroup = new THREE.Group()
      bGroup.position.set(b.pos[0], b.pos[1], b.pos[2])

      // Base Pillar Cylinder
      const cylGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.3, 16)
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x18191c,
        metalness: 0.9,
        roughness: 0.2,
      })
      const cylMesh = new THREE.Mesh(cylGeo, cylMat)
      cylMesh.position.y = 0.15
      bGroup.add(cylMesh)

      // Base Neon Ring
      const ringGeo = new THREE.TorusGeometry(1.1, 0.04, 12, 32)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xe2652b })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = Math.PI / 2
      ringMesh.position.y = 0.08
      bGroup.add(ringMesh)

      // Floating Holographic Crystal / Monolith
      const cryGeo = new THREE.OctahedronGeometry(0.85, 0)
      const cryMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
      })
      const cryMesh = new THREE.Mesh(cryGeo, cryMat)
      cryMesh.position.y = 1.8
      bGroup.add(cryMesh)

      // Vertical Light Beam
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 5, 8)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xe2652b,
        transparent: true,
        opacity: 0.6,
      })
      const beamMesh = new THREE.Mesh(beamGeo, beamMat)
      beamMesh.position.y = 2.5
      bGroup.add(beamMesh)

      scene.add(bGroup)
      beaconMeshList.push({ group: bGroup, data: b, crystal: cryMesh, ring: ringMesh })
    })

    // 6. Particle Trail System
    const trailMax = 120
    const trailPos = new Float32Array(trailMax * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
    const trailMat = new THREE.PointsMaterial({
      color: 0xe2652b,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
    })
    const trailMesh = new THREE.Points(trailGeo, trailMat)
    scene.add(trailMesh)

    let trailIndex = 0
    const addTrailPoint = (x: number, y: number, z: number) => {
      trailPos[trailIndex * 3] = x + (Math.random() - 0.5) * 0.25
      trailPos[trailIndex * 3 + 1] = y + 0.15
      trailPos[trailIndex * 3 + 2] = z + (Math.random() - 0.5) * 0.25
      trailIndex = (trailIndex + 1) % trailMax
      trailGeo.attributes.position.needsUpdate = true
    }

    // 7. Particle Burst on Beacon Impact
    const burstCount = 45
    const burstGeo = new THREE.BufferGeometry()
    const burstPositions = new Float32Array(burstCount * 3)
    const burstVelocities: THREE.Vector3[] = []
    for (let i = 0; i < burstCount; i++) {
      burstPositions[i * 3] = 0
      burstPositions[i * 3 + 1] = -999
      burstPositions[i * 3 + 2] = 0
      burstVelocities.push(new THREE.Vector3())
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3))
    const burstMat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.28,
      transparent: true,
      opacity: 0,
    })
    const burstMesh = new THREE.Points(burstGeo, burstMat)
    scene.add(burstMesh)

    const triggerBurst = (origin: THREE.Vector3) => {
      burstMat.opacity = 1
      for (let i = 0; i < burstCount; i++) {
        burstPositions[i * 3] = origin.x
        burstPositions[i * 3 + 1] = origin.y + 0.8
        burstPositions[i * 3 + 2] = origin.z

        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.18 + 0.08
        const upSpeed = Math.random() * 0.25 + 0.1
        burstVelocities[i].set(Math.cos(angle) * speed, upSpeed, Math.sin(angle) * speed)
      }
      burstGeo.attributes.position.needsUpdate = true
    }

    // 8. Vehicle Motion State & Physics
    const state = {
      x: 0,
      z: 0,
      vx: 0,
      vz: 0,
      targetX: 0,
      targetZ: 0,
      heading: 0,
      targetHeading: 0,
      isAutoNav: false,
    }

    const keys: Record<string, boolean> = {}
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      keys[e.key.toLowerCase()] = true
      state.isAutoNav = false
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Drive vehicle smoothly to coordinate with camera target
    const driveTo = (tx: number, tz: number, targetBeacon?: BeaconData) => {
      state.isAutoNav = true
      state.targetX = tx
      state.targetZ = tz
      setIsDriving(true)

      gsap.to(state, {
        x: tx,
        z: tz,
        duration: 1.25,
        ease: 'power2.out',
        onUpdate: () => {
          const dx = tx - state.x
          const dz = tz - state.z
          if (Math.hypot(dx, dz) > 0.2) {
            state.heading = Math.atan2(dx, dz)
          }
        },
        onComplete: () => {
          state.isAutoNav = false
          setIsDriving(false)
          if (targetBeacon) {
            triggerBurst(new THREE.Vector3(tx, 0.5, tz))
            playBeaconChime()
            setActiveProject(targetBeacon.project)
            setActiveBeaconId(targetBeacon.id)

            // Camera subtle zoom toward beacon
            gsap.to(camera.position, {
              x: tx + 0,
              y: 11,
              z: tz + 12,
              duration: 1.1,
              ease: 'power3.out',
            })
          }
        },
      })
    }
    driveToRef.current = driveTo

    // 9. Click on Ground or Beacon to Navigate
    const raycaster = new THREE.Raycaster()
    const mouseNorm = new THREE.Vector2()
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouseNorm, camera)

      // Check beacon intersection first
      const beaconMeshes = beaconMeshList.map((bm) => bm.crystal)
      const hits = raycaster.intersectObjects(beaconMeshes, true)
      if (hits.length > 0) {
        const hitCrystal = hits[0].object
        const bm = beaconMeshList.find((b) => b.crystal === hitCrystal)
        if (bm) {
          driveTo(bm.data.pos[0], bm.data.pos[2], bm.data)
          return
        }
      }

      // Otherwise click on ground
      const hitPoint = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        // Clamp to map boundary
        const clampedX = Math.max(-16, Math.min(16, hitPoint.x))
        const clampedZ = Math.max(-16, Math.min(16, hitPoint.z))
        driveTo(clampedX, clampedZ)
      }
    }
    canvas.addEventListener('click', handleCanvasClick)

    // 10. Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Manual Keyboard Drive
      if (!state.isAutoNav) {
        let ax = 0
        let az = 0
        const speed = 12.0
        if (keys['w'] || keys['arrowup']) az -= 1
        if (keys['s'] || keys['arrowdown']) az += 1
        if (keys['a'] || keys['arrowleft']) ax -= 1
        if (keys['d'] || keys['arrowright']) ax += 1

        if (ax !== 0 || az !== 0) {
          const len = Math.hypot(ax, az)
          ax = (ax / len) * speed * delta
          az = (az / len) * speed * delta
          state.vx += ax
          state.vz += az
          state.targetHeading = Math.atan2(ax, az)
          setIsDriving(true)
        } else {
          setIsDriving(false)
        }

        state.vx *= 0.88
        state.vz *= 0.88
        state.x += state.vx
        state.z += state.vz
        state.x = Math.max(-16, Math.min(16, state.x))
        state.z = Math.max(-16, Math.min(16, state.z))

        // Smooth rotation
        if (Math.hypot(state.vx, state.vz) > 0.02) {
          const diff = state.targetHeading - state.heading
          state.heading += THREE.MathUtils.clamp(diff, -0.15, 0.15)
        }
      }

      // Update Rover Position & Rotation
      roverGroup.position.set(state.x, 0, state.z)
      roverGroup.rotation.y = state.heading

      // Add particle trail when moving
      if (Math.hypot(state.vx, state.vz) > 0.03 || state.isAutoNav) {
        addTrailPoint(state.x, 0, state.z)
      }

      // Update Beacons Rotation & Pulsing
      beaconMeshList.forEach((bm, i) => {
        bm.crystal.rotation.y = time * 0.9 + i * 0.6
        bm.crystal.rotation.x = Math.sin(time * 1.5 + i) * 0.15
        bm.ring.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.08)

        // Check proximity collision with beacons
        const dist = Math.hypot(state.x - bm.data.pos[0], state.z - bm.data.pos[2])
        if (dist < 2.0 && activeBeaconId !== bm.data.id) {
          setActiveBeaconId(bm.data.id)
          setActiveProject(bm.data.project)
          playBeaconChime()
          triggerBurst(new THREE.Vector3(bm.data.pos[0], 0.5, bm.data.pos[2]))
        }
      })

      // Update Burst Particles
      if (burstMat.opacity > 0.01) {
        burstMat.opacity *= 0.94
        for (let i = 0; i < burstCount; i++) {
          burstPositions[i * 3] += burstVelocities[i].x
          burstPositions[i * 3 + 1] += burstVelocities[i].y
          burstPositions[i * 3 + 2] += burstVelocities[i].z
          burstVelocities[i].y -= 0.007 // gravity
        }
        burstGeo.attributes.position.needsUpdate = true
      }

      // Ground dots subtle twinkle
      dotsMesh.rotation.y = time * 0.006

      renderer.render(scene, camera)
    }

    animate()

    // 11. Resize Handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('click', handleCanvasClick)
      renderer.dispose()
    }
  }, [playBeaconChime, activeBeaconId])

  // Reset camera view
  const resetCamera = () => {
    setActiveProject(null)
  }

  // Quick-select beacon click
  const selectBeacon = (beacon: BeaconData) => {
    if (driveToRef.current) {
      driveToRef.current(beacon.pos[0], beacon.pos[2], beacon)
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* 3D GAME STAGE (BORDERLESS WITH RADIAL CSS MASK FADING TO #080808) */}
      <div
        ref={containerRef}
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 52%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 52%, transparent 78%)',
        }}
        className="relative w-full h-[520px] bg-transparent overflow-hidden cursor-crosshair select-none"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Minimal HUD telemetry status overlay */}
        <div className="absolute top-4 left-6 flex items-center gap-3 text-[11px] font-mono tracking-widest text-[#9CA3AF] pointer-events-none uppercase bg-black/40 px-3.5 py-1.5 rounded-full border border-white/6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E2652B]" />
          <span className="text-[#E2652B] font-semibold">DHAKA NEON DRIFT // 3D</span>
          <span className="text-white/20">•</span>
          <span className="hidden sm:inline text-white/70">
            {isDriving ? 'DRIFTING / MOTORS ACTIVE' : 'STEER WITH WASD OR CLICK TO DRIFT'}
          </span>
        </div>

        {/* Floating Glassmorphism Project Drawer Overlay */}
        {activeProject && (
          <div className="absolute top-6 right-6 bottom-6 w-full max-w-[380px] bg-[#111214]/94 border border-white/12 rounded-2xl p-7 shadow-2xl backdrop-blur-2xl flex flex-col justify-between z-20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/8">
                <span className="text-[10px] font-mono text-[#E2652B] tracking-widest uppercase font-semibold">
                  {activeProject.category}
                </span>
                <button
                  onClick={resetCamera}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                  }}
                  className="flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/8"
                  aria-label="Close project preview"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <h3 className="mt-4 text-2xl font-sans font-bold text-white tracking-tight">
                {activeProject.title}
              </h3>

              <p className="mt-3 text-xs font-sans text-[#D1D5DB] leading-relaxed">
                {activeProject.summary}
              </p>

              {/* Collaborators for ChalokApp */}
              {activeProject.collaborators && (
                <div className="mt-4 pt-3 border-t border-white/6 flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#6B7280]">TEAM:</span>
                  {activeProject.collaborators.map((c) => (
                    <a
                      key={c.name}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E2652B] hover:underline"
                    >
                      {c.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Stack Pills with exact padding: 6px 12px, gap: 8px */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {activeProject.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    style={{ padding: '6px 12px' }}
                    className="text-[11px] font-mono text-[#9CA3AF] bg-white/[0.04] border border-white/8 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                {activeProject.status}
              </span>
              <a
                href="#projects-grid"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E2652B] hover:text-white transition-colors no-underline font-medium"
              >
                <span>Read details</span>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* QUICK-SELECT FALLBACK TABS */}
      <div className="w-full max-w-[900px] mt-4 flex flex-wrap items-center justify-center gap-2 px-4 z-10">
        <span className="text-[10px] font-mono text-[#6B7280] tracking-widest mr-2 uppercase flex items-center gap-1">
          <Navigation className="w-3 h-3 text-[#E2652B]" />
          <span>ROVER AUTOPILOT:</span>
        </span>
        {beacons.map((b) => (
          <button
            key={b.id}
            onClick={() => selectBeacon(b)}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-full border transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              activeBeaconId === b.id
                ? 'bg-[#E2652B] text-black border-[#E2652B] font-semibold shadow-[0_0_16px_rgba(226,101,43,0.35)]'
                : 'bg-white/[0.04] text-[#9CA3AF] border-white/8 hover:text-white hover:border-white/20'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{b.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
