import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowUpRight, Navigation, Sparkles, Camera, X } from 'lucide-react'
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
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isDriving, setIsDriving] = useState<boolean>(false)
  const [cameraAngle, setCameraAngle] = useState<'isometric' | 'topdown'>('isometric')

  const cameraAngleRef = useRef<'isometric' | 'topdown'>('isometric')
  const audioCtxRef = useRef<AudioContext | null>(null)
  const jumpToProjectRef = useRef<((idx: number) => void) | null>(null)
  const motionStateRef = useRef<{
    x: number
    z: number
    isHeroCinematic: boolean
    isAutoNav: boolean
    parkedBeaconId: string | null
  } | null>(null)

  // Toggle between 2 camera angles (Isometric vs Top-down tactical)
  const toggleCameraAngle = () => {
    const nextAngle = cameraAngle === 'isometric' ? 'topdown' : 'isometric'
    setCameraAngle(nextAngle)
    cameraAngleRef.current = nextAngle
  }

  // Dismiss project detail card and resume driving
  const closeProjectCard = () => {
    setIsFocused(false)
    if (motionStateRef.current) {
      motionStateRef.current.isHeroCinematic = false
    }
  }

  // Web Audio mechanical synth chime on beacon lock
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
    scene.fog = new THREE.FogExp2(0x000000, 0.02)

    const isMobile = window.innerWidth < 768
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 54 : 44,
      container.clientWidth / container.clientHeight,
      0.1,
      140
    )

    // Initial isometric chase camera position focused near project 01
    const p0 = PROJECTS[0]
    const camPos = new THREE.Vector3(p0.pos[0] * 0.45, 14, p0.pos[2] + 18)
    const camLookAt = new THREE.Vector3(p0.pos[0], 0.6, p0.pos[2])
    camera.position.copy(camPos)
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

    // 2. Minimal Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(15, 25, 12)
    scene.add(dirLight)

    // 3. Infinite Dot-Matrix Grid Plane & Starfield
    const gridHelper = new THREE.GridHelper(60, 60, 0xd2531d, 0x1f1f1f)
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
      starPos[i * 3] = (Math.random() - 0.5) * 64
      starPos[i * 3 + 1] = Math.random() * 12 + 0.1
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 64
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0x555555,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
    })
    const starMesh = new THREE.Points(starGeo, starMat)
    scene.add(starMesh)

    // 4. Low-Poly Mechanical Reticle/Drone (Player Vehicle)
    const droneGroup = new THREE.Group()

    // Sleek triangular wireframe body
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.5, 2.3)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.25,
      metalness: 0.9,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    bodyMesh.position.y = 0.45
    droneGroup.add(bodyMesh)

    // Stark white wireframe outline
    const wireGeo = new THREE.EdgesGeometry(bodyGeo)
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat)
    wireMesh.position.copy(bodyMesh.position)
    droneGroup.add(wireMesh)

    // Glowing cockpit visor
    const canopyGeo = new THREE.BoxGeometry(1.0, 0.3, 1.1)
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0xd2531d, wireframe: true })
    const canopy = new THREE.Mesh(canopyGeo, canopyMat)
    canopy.position.set(0, 0.75, -0.2)
    droneGroup.add(canopy)

    // Dual front headlights
    const lightL = new THREE.PointLight(0xffffff, 2.0, 10)
    lightL.position.set(-0.55, 0.5, -1.3)
    droneGroup.add(lightL)

    const lightR = new THREE.PointLight(0xffffff, 2.0, 10)
    lightR.position.set(0.55, 0.5, -1.3)
    droneGroup.add(lightR)

    // Glowing Nothing Red thruster
    const thrusterLight = new THREE.PointLight(0xd2531d, 3.5, 8)
    thrusterLight.position.set(0, 0.5, 1.2)
    droneGroup.add(thrusterLight)

    droneGroup.position.set(p0.pos[0], 0, p0.pos[2] + 1.2)
    scene.add(droneGroup)

    // Particle exhaust trail
    const trailMax = 120
    const trailPositions = new Float32Array(trailMax * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    const trailMat = new THREE.PointsMaterial({
      color: 0xd2531d,
      size: 0.24,
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

    // Glowing Ground Target Reticle on Click
    const targetRingGeo = new THREE.RingGeometry(0.5, 0.7, 32)
    targetRingGeo.rotateX(-Math.PI / 2)
    const targetRingMat = new THREE.MeshBasicMaterial({
      color: 0xd2531d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat)
    targetRing.position.y = 0.03
    scene.add(targetRing)

    const showClickReticle = (tx: number, tz: number) => {
      targetRing.position.set(tx, 0.03, tz)
      targetRing.scale.set(0.3, 0.3, 0.3)
      targetRingMat.opacity = 0.95
      gsap.killTweensOf(targetRing.scale)
      gsap.killTweensOf(targetRingMat)
      gsap.to(targetRing.scale, { x: 1.3, z: 1.3, duration: 0.5, ease: 'power2.out' })
      gsap.to(targetRingMat, { opacity: 0, duration: 0.7, delay: 0.25, ease: 'power2.out' })
    }

    // 5. Particle Burst System on Beacon Contact
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
      color: 0xd2531d,
      size: 0.28,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const burstMesh = new THREE.Points(burstGeo, burstMat)
    scene.add(burstMesh)

    const triggerBurst = (origin: THREE.Vector3) => {
      burstMat.opacity = 1.0
      for (let i = 0; i < burstCount; i++) {
        burstPositions[i * 3] = origin.x
        burstPositions[i * 3 + 1] = origin.y + 0.8
        burstPositions[i * 3 + 2] = origin.z

        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.2 + 0.08
        const upSpeed = Math.random() * 0.25 + 0.1
        burstVelocities[i].set(Math.cos(angle) * speed, upSpeed, Math.sin(angle) * speed)
      }
      burstGeo.attributes.position.needsUpdate = true
    }

    // 6. Glowing Red LED Ring Nodes for Each Project
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
        opacity: 0.45,
      })
      const verticalRing = new THREE.Mesh(vRingGeo, vRingMat)
      verticalRing.position.y = 1.3
      nGroup.add(verticalRing)

      // Unique Low-Poly Geometric Artifact per Project
      let artifactGeo: THREE.BufferGeometry
      if (idx === 0) artifactGeo = new THREE.OctahedronGeometry(0.85, 0)
      else if (idx === 1) artifactGeo = new THREE.IcosahedronGeometry(0.8, 0)
      else if (idx === 2) artifactGeo = new THREE.TorusGeometry(0.65, 0.22, 8, 24)
      else if (idx === 3) artifactGeo = new THREE.DodecahedronGeometry(0.8, 0)
      else artifactGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8)

      const artifactMat = new THREE.MeshStandardMaterial({
        color: 0x141414,
        roughness: 0.15,
        metalness: 0.8,
        emissive: 0xd2531d,
        emissiveIntensity: 0.5,
      })
      const crystal = new THREE.Mesh(artifactGeo, artifactMat)
      crystal.position.y = 1.3
      nGroup.add(crystal)

      const crystalWireGeo = new THREE.EdgesGeometry(artifactGeo)
      const crystalWireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
      crystal.add(new THREE.LineSegments(crystalWireGeo, crystalWireMat))

      // Vertical holographic light column
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.35, 6, 16, 1, true)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xd2531d,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.position.y = 3.0
      nGroup.add(beam)

      // Red LED PointLight
      const nLight = new THREE.PointLight(0xd2531d, 3.2, 11)
      nLight.position.y = 1.5
      nGroup.add(nLight)

      scene.add(nGroup)
      nodeMeshes.push({ group: nGroup, data: p, crystal, groundRing, verticalRing, light: nLight })
    })

    // 7. Navigation Motion State & Calibrated Physics
    const state = {
      x: p0.pos[0],
      z: p0.pos[2] + 1.2,
      vx: 0,
      vz: 0,
      heading: 0,
      targetHeading: 0,
      isAutoNav: false,
      isHeroCinematic: false,
      parkedBeaconId: null as string | null,
    }
    motionStateRef.current = state

    // 8. Instant GSAP Transition to Project Node
    const jumpToProject = (idx: number) => {
      const p = PROJECTS[idx]
      if (!p) return

      setActiveProject(p)
      setIsFocused(true)
      state.isAutoNav = true
      state.isHeroCinematic = true
      state.parkedBeaconId = p.id
      setIsDriving(true)
      playChime()
      triggerBurst(new THREE.Vector3(p.pos[0], 0.5, p.pos[2]))

      // 1. Camera transition directly in front of the project artifact
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camLookAt)

      gsap.to(camera.position, {
        x: p.pos[0],
        y: 3.5,
        z: p.pos[2] + 8.5,
        duration: 1.3,
        ease: 'power4.inOut',
      })

      gsap.to(camLookAt, {
        x: p.pos[0],
        y: 1.2,
        z: p.pos[2],
        duration: 1.3,
        ease: 'power4.inOut',
      })

      // 2. Drone glides smoothly to the artifact pad
      gsap.killTweensOf(state)
      gsap.to(state, {
        x: p.pos[0],
        z: p.pos[2] + 1.2,
        duration: 1.3,
        ease: 'power4.inOut',
        onComplete: () => {
          state.isAutoNav = false
          setIsDriving(false)
          state.vx = 0
          state.vz = 0
        },
      })
    }
    jumpToProjectRef.current = jumpToProject

    // Drive drone smoothly to coordinate on ground click/tap
    const driveToCoord = (tx: number, tz: number, targetProject?: ProjectItem) => {
      showClickReticle(tx, tz)

      if (targetProject) {
        jumpToProject(PROJECTS.findIndex((p) => p.id === targetProject.id))
        return
      }

      state.isAutoNav = true
      setIsDriving(true)

      // Exit cinematic focus when driving in free space
      setIsFocused(false)
      state.isHeroCinematic = false
      state.parkedBeaconId = null

      const dist = Math.hypot(tx - state.x, tz - state.z)
      const duration = Math.max(1.2, Math.min(2.8, dist * 0.16))

      gsap.killTweensOf(state)
      gsap.to(state, {
        x: tx,
        z: tz,
        duration,
        ease: 'power2.inOut',
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
          state.vx = 0
          state.vz = 0
        },
      })
    }

    // 9. Keyboard Controls (WASD & 1-5 Quick Keys)
    const keys: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const key = e.key
      // Close project card on Escape
      if (key === 'Escape') {
        setIsFocused(false)
        state.isHeroCinematic = false
        return
      }

      // 1-5 Numeric shortcuts to jump instantly
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const idx = parseInt(key, 10) - 1
        jumpToProject(idx)
        return
      }

      const lk = key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(lk)) {
        keys[lk] = true
        state.isAutoNav = false
        state.isHeroCinematic = false
        setIsFocused(false) // Smoothly fade out glassmorphic card when resuming free flight
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // 10. Pointer Raycasting (Ground Click / Beacon Click)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    let pointerDownPos = { x: 0, y: 0 }

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
      // Ignore if user was dragging or scrolling
      if (dist > 14) return

      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // 1. Check if clicked beacon crystal
      const crystals = nodeMeshes.map((nm) => nm.crystal)
      const hits = raycaster.intersectObjects(crystals, true)
      if (hits.length > 0) {
        const hit = hits[0].object
        const nm = nodeMeshes.find((n) => n.crystal === hit || n.crystal.children.includes(hit as THREE.LineSegments))
        if (nm) {
          const idx = PROJECTS.findIndex((p) => p.id === nm.data.id)
          if (idx !== -1) jumpToProject(idx)
          return
        }
      }

      // 2. Drive smoothly to ground coordinate
      const intersectPoint = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
        const tx = Math.max(-24, Math.min(24, intersectPoint.x))
        const tz = Math.max(-24, Math.min(24, intersectPoint.z))

        let clickedNode: ProjectItem | undefined
        for (const p of PROJECTS) {
          if (Math.hypot(tx - p.pos[0], tz - p.pos[2]) < 2.5) {
            clickedNode = p
            break
          }
        }
        driveToCoord(tx, tz, clickedNode)
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)

    // 11. Main Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Clear parked beacon lock once drone drives away
      if (state.parkedBeaconId) {
        const curProj = PROJECTS.find((p) => p.id === state.parkedBeaconId)
        if (curProj && Math.hypot(state.x - curProj.pos[0], state.z - curProj.pos[2]) > 3.6) {
          state.parkedBeaconId = null
        }
      }

      // WASD direct physics with calibrated cruising speed and smooth drifting
      if (!state.isAutoNav) {
        let ax = 0
        let az = 0
        const accel = 0.024 // Smooth, tactile acceleration
        const maxSpeed = 0.22 // Comfortable, enjoyable cruising speed

        if (keys['w'] || keys['arrowup']) az -= accel
        if (keys['s'] || keys['arrowdown']) az += accel
        if (keys['a'] || keys['arrowleft']) ax -= accel
        if (keys['d'] || keys['arrowright']) ax += accel

        if (ax !== 0 || az !== 0) {
          state.vx += ax
          state.vz += az
          state.targetHeading = Math.atan2(ax, az)
          state.isHeroCinematic = false
          setIsFocused(false)
          setIsDriving(true)
        } else if (state.isHeroCinematic && !state.isAutoNav) {
          // Keep car firmly parked at project node
          state.vx = 0
          state.vz = 0
          setIsDriving(false)
        } else if (Math.hypot(state.vx, state.vz) < 0.01) {
          setIsDriving(false)
        }

        // Clamp to maximum cruising speed
        const currentSpeed = Math.hypot(state.vx, state.vz)
        if (currentSpeed > maxSpeed) {
          state.vx = (state.vx / currentSpeed) * maxSpeed
          state.vz = (state.vz / currentSpeed) * maxSpeed
        }

        // Gentle drift friction
        state.vx *= 0.92
        state.vz *= 0.92
        state.x += state.vx
        state.z += state.vz
        state.x = Math.max(-25, Math.min(25, state.x))
        state.z = Math.max(-25, Math.min(25, state.z))

        // Smooth realistic heading banking
        if (Math.hypot(state.vx, state.vz) > 0.01) {
          const diff = state.targetHeading - state.heading
          state.heading += THREE.MathUtils.clamp(diff, -0.09, 0.09)
        }

        // In free-flight mode, camera smoothly tracks drone based on active camera angle
        if (!state.isHeroCinematic) {
          const isTopDown = cameraAngleRef.current === 'topdown'
          const targetCamX = isTopDown ? state.x : state.x * 0.45
          const targetCamY = isTopDown ? 26 : 14
          const targetCamZ = isTopDown ? state.z + 5 : state.z + 18

          camera.position.x += (targetCamX - camera.position.x) * 0.045
          camera.position.y += (targetCamY - camera.position.y) * 0.045
          camera.position.z += (targetCamZ - camera.position.z) * 0.045

          const targetLookX = state.x
          const targetLookY = isTopDown ? 0 : 0.6
          const targetLookZ = state.z

          camLookAt.x += (targetLookX - camLookAt.x) * 0.06
          camLookAt.y += (targetLookY - camLookAt.y) * 0.06
          camLookAt.z += (targetLookZ - camLookAt.z) * 0.06
        }
      }

      // Update Drone mesh
      droneGroup.position.set(state.x, 0, state.z)
      droneGroup.rotation.y = state.heading

      // Add particle exhaust trail when moving
      if (Math.hypot(state.vx, state.vz) > 0.02 || state.isAutoNav) {
        addTrailPoint(state.x, 0, state.z)
      }

      // Animate Nodes & Detect Proximity to other projects
      nodeMeshes.forEach((nm, idx) => {
        nm.crystal.rotation.y = time * 0.85 + idx * 0.5
        nm.crystal.rotation.x = Math.sin(time * 1.5 + idx) * 0.15
        nm.verticalRing.rotation.y = -time * 1.2
        nm.verticalRing.rotation.x = time * 0.8

        const isCurrent = activeProject.id === nm.data.id
        nm.light.intensity = isCurrent ? 4.5 : 1.8
        nm.groundRing.scale.setScalar(1 + Math.sin(time * 3 + idx) * 0.06)

        // When drone enters another beacon pad during free flight
        if (!state.isAutoNav && !state.isHeroCinematic) {
          const dist = Math.hypot(state.x - nm.data.pos[0], state.z - nm.data.pos[2])
          // Only trigger if arriving at an unvisited/different project
          if (dist < 2.4 && state.parkedBeaconId !== nm.data.id) {
            setActiveProject(nm.data)
            setIsFocused(true)
            state.isHeroCinematic = true
            state.parkedBeaconId = nm.data.id
            state.vx = 0
            state.vz = 0
            setIsDriving(false)
            playChime()
            triggerBurst(new THREE.Vector3(nm.data.pos[0], 0.5, nm.data.pos[2]))

            // Park drone right at the project pad and keep it there
            gsap.killTweensOf(state)
            gsap.to(state, {
              x: nm.data.pos[0],
              z: nm.data.pos[2] + 1.2,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                state.vx = 0
                state.vz = 0
                state.isAutoNav = false
              },
            })

            // Frame project and spatial typography in 3D
            gsap.killTweensOf(camera.position)
            gsap.killTweensOf(camLookAt)
            gsap.to(camera.position, {
              x: nm.data.pos[0],
              y: 3.5,
              z: nm.data.pos[2] + 8.5,
              duration: 1.1,
              ease: 'power3.out',
            })
            gsap.to(camLookAt, {
              x: nm.data.pos[0],
              y: 1.2,
              z: nm.data.pos[2],
              duration: 1.1,
              ease: 'power3.out',
            })
          }
        }
      })

      // Update Burst Particles
      if (burstMat.opacity > 0.01) {
        burstMat.opacity *= 0.94
        for (let i = 0; i < burstCount; i++) {
          burstPositions[i * 3] += burstVelocities[i].x
          burstPositions[i * 3 + 1] += burstVelocities[i].y
          burstPositions[i * 3 + 2] += burstVelocities[i].z
          burstVelocities[i].y -= 0.006
        }
        burstGeo.attributes.position.needsUpdate = true
      }

      // Starfield subtle rotation
      starMesh.rotation.y = time * 0.003

      // Camera orientation
      camera.lookAt(camLookAt)

      renderer.render(scene, camera)
    }

    animate()

    // 12. Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.fov = window.innerWidth < 768 ? 54 : 44
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
      canvas.removeEventListener('pointerup', handlePointerUp)
      renderer.dispose()
    }
  }, [playChime, activeProject.id])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-[580px] sm:h-[680px] lg:h-[740px] rounded-3xl bg-black border border-[#1F1F1F] overflow-hidden select-none outline-none focus:border-[#D2531D]/50 transition-colors"
      style={{ touchAction: 'none' }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair select-none"
      />

      {/* Top Left: Controls Guidance */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 text-xs font-mono text-neutral-400 pointer-events-none">
        <Navigation className="w-3.5 h-3.5 text-[#D2531D]" />
        <span className="text-white font-medium">WASD TO STEER</span>
        <span className="text-neutral-600">•</span>
        <span className="hidden sm:inline text-neutral-400">CLICK GROUND TO DRIFT</span>
      </div>

      {/* Top Right: Camera Angle Switcher + Status */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {/* Camera Angle Toggle Button using Lucide Icon */}
        <button
          type="button"
          onClick={toggleCameraAngle}
          title={cameraAngle === 'isometric' ? 'Switch to Overhead Tactical View' : 'Switch to Isometric Chase View'}
          style={{
            height: '38px',
            padding: '0 14px',
            borderRadius: '12px',
            background: 'rgba(18, 18, 20, 0.78)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          }}
          className="flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-white hover:border-[#D2531D] transition-all cursor-pointer active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-[#D2531D]" />
          <span className="font-semibold uppercase">{cameraAngle === 'isometric' ? 'CAM // ISO' : 'CAM // TOP'}</span>
        </button>

        {/* Drift Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500 bg-black/60 px-3 py-2 rounded-xl border border-white/8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#D2531D] animate-ping" />
          <span className="text-white font-medium">{isDriving ? 'DRIFT ENGAGED' : 'SYS READY'}</span>
        </div>
      </div>

      {/* FLOATING GLASSMORPHIC PROJECT DETAIL CARD (MATCHING NAVBAR) */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
          isFocused ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            background: 'rgba(18, 18, 20, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(210, 83, 29, 0.18)',
            padding: '28px 32px',
          }}
          className="relative flex flex-col text-left select-text"
        >
          {/* Top Bar with Project Number & Close Button */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/8">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#D2531D] uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#D2531D] shadow-[0_0_8px_#D2531D]" />
              <span>PROJECT // {activeProject.num}</span>
            </div>

            <button
              type="button"
              onClick={closeProjectCard}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close card (or press WASD)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Project Title */}
          <h3
            style={{ fontFamily: "'JetBrains Mono', monospace, sans-serif" }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase mb-3"
          >
            {activeProject.title}
          </h3>

          {/* Description */}
          <p className="text-sm font-sans text-neutral-300 leading-relaxed mb-6 font-normal">
            {activeProject.desc}
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#D2531D',
                color: '#000000',
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-2 hover:bg-[#E2652B] transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(210,83,29,0.35)] no-underline"
            >
              <span>VIEW LIVE</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
            </a>

            <a
              href={activeProject.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-medium tracking-wider text-neutral-200 hover:text-white hover:border-white/30 transition-all duration-200 active:scale-95 no-underline flex items-center gap-2"
            >
              <span>CODEBASE</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* Drive away tip */}
          <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>DRIVE WITH WASD OR CLICK GROUND TO RESUME</span>
            <span className="hidden sm:inline">ESC TO CLOSE</span>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM DOCK: CLEAN MINIMAL DOT-BAR NAVIGATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 sm:gap-6 px-6 py-2.5 rounded-full bg-black/85 border border-[#1F1F1F] backdrop-blur-xl">
        {PROJECTS.map((p, idx) => {
          const isSelected = activeProject.id === p.id && isFocused
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

      {/* Initial Guidance Prompt */}
      {!isFocused && !isDriving && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-[11px] font-mono text-neutral-400 pointer-events-none animate-pulse flex items-center gap-2 bg-black/70 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-[#D2531D]" />
          <span>USE WASD OR CLICK/TAP ANYWHERE ON GROUND TO DRIFT</span>
        </div>
      )}
    </div>
  )
}
