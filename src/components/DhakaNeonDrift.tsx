import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowUpRight, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { GithubIcon } from './Icons'
import { getAudioEnabled } from '../utils/audioState'
import engineStartSoundUrl from '../assets/mixkit-car-engine-start-1566.wav'
import projectSelectSoundUrl from '../assets/mixkit-quick-win-video-game-notification-269.wav'

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
  const activeProjectIdRef = useRef<string>(PROJECTS[0].id)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const selectProject = useCallback((p: ProjectItem) => {
    activeProjectIdRef.current = p.id
    setActiveProject(p)
  }, [])

  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineSoundRef = useRef<{
    osc1: OscillatorNode
    osc2: OscillatorNode
    filter: BiquadFilterNode
    gain: GainNode
    isStarted: boolean
  } | null>(null)

  const jumpToProjectRef = useRef<((idx: number) => void) | null>(null)
  const virtualKeyRef = useRef<((key: 'w' | 'a' | 's' | 'd', isPressed: boolean) => void) | null>(null)
  const lockUntilRef = useRef<number>(0)
  const engineStartAudioRef = useRef<HTMLAudioElement | null>(null)
  const projectSelectAudioRef = useRef<HTMLAudioElement | null>(null)
  const hasEngineStartedRef = useRef(false)

  // Ensure AudioContext is ready on user gesture
  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
    }
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    return ctx
  }, [])

  // Setup rich video-game style cyber engine synthesizer
  const ensureEngineSound = useCallback(() => {
    if (engineSoundRef.current) return engineSoundRef.current
    try {
      const ctx = ensureAudioContext()
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(68, ctx.currentTime)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(46, ctx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(260, ctx.currentTime)
      filter.Q.setValueAtTime(2.8, ctx.currentTime)

      gain.gain.setValueAtTime(0.0001, ctx.currentTime)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc1.start()
      osc2.start()

      const engine = { osc1, osc2, filter, gain, isStarted: true }
      engineSoundRef.current = engine
      return engine
    } catch {
      return null
    }
  }, [ensureAudioContext])

  // Play mixkit car engine start sound when the car is ignited / driven for the first time
  const triggerEngineStartSound = useCallback(() => {
    ensureAudioContext()
    ensureEngineSound()

    if (hasEngineStartedRef.current) return
    hasEngineStartedRef.current = true

    if (!getAudioEnabled()) return

    try {
      if (!engineStartAudioRef.current) {
        engineStartAudioRef.current = new Audio(engineStartSoundUrl)
      }
      const audio = engineStartAudioRef.current
      audio.volume = 0.45 // Gently calibrated engine ignition volume
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {
      // Audio fallback
    }
  }, [ensureAudioContext, ensureEngineSound])

  // Dynamic engine sound modulation matching car velocity
  const updateEngineAudio = useCallback((speed: number) => {
    if (!getAudioEnabled()) {
      if (engineSoundRef.current && audioCtxRef.current) {
        engineSoundRef.current.gain.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.05)
      }
      return
    }

    const engine = ensureEngineSound()
    if (!engine || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const now = ctx.currentTime

    const norm = Math.min(1, Math.max(0, speed / 0.22))
    if (norm > 0.02) {
      // Accelerating cyber engine pitch & resonance (refined subtle driving sound)
      const targetFreq = 68 + norm * 105
      const targetFilter = 260 + norm * 450
      const targetVol = 0.015 + norm * 0.045 // Smooth ambient driving volume

      engine.osc1.frequency.setTargetAtTime(targetFreq, now, 0.05)
      engine.osc2.frequency.setTargetAtTime(targetFreq * 0.68, now, 0.05)
      engine.filter.frequency.setTargetAtTime(targetFilter, now, 0.05)
      engine.gain.gain.setTargetAtTime(targetVol, now, 0.04)
    } else {
      // Idle / stopped
      engine.gain.gain.setTargetAtTime(0.0001, now, 0.08)
    }
  }, [ensureEngineSound, ensureAudioContext])

  // Play only the new notification sound effect when selecting or driving to any project
  const playLockSound = useCallback(() => {
    if (!getAudioEnabled()) return

    try {
      if (!projectSelectAudioRef.current) {
        projectSelectAudioRef.current = new Audio(projectSelectSoundUrl)
      }
      const audio = projectSelectAudioRef.current
      audio.volume = 0.65
      audio.currentTime = 0
      audio.play().catch(() => {})
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
    scene.background = new THREE.Color(0x0b0b0c) // Matches portfolio background perfectly
    scene.fog = new THREE.FogExp2(0x0b0b0c, 0.022)

    const isMobile = window.innerWidth < 768
    const initialW = window.innerWidth
    const initialH = container.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 52 : 42,
      initialW / initialH,
      0.1,
      140
    )

    // Initial camera position positioned nicely for overview of the central car
    const camPos = new THREE.Vector3(0, isMobile ? 15 : 13, isMobile ? 22 : 18)
    const camLookAt = new THREE.Vector3(0, 0.6, 0)
    camera.position.copy(camPos)
    camera.lookAt(camLookAt)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(initialW, initialH)
    renderer.setClearColor(0x0b0b0c, 1)

    // 2. Minimal Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
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

    // Center Spawn Hub / Launch Pad at (0, 0, 0)
    const hubGroup = new THREE.Group()
    const hubRingGeo = new THREE.RingGeometry(2.2, 2.26, 64)
    const hubRingMat = new THREE.MeshBasicMaterial({
      color: 0xd2531d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    })
    const hubRing = new THREE.Mesh(hubRingGeo, hubRingMat)
    hubRing.rotation.x = -Math.PI / 2
    hubRing.position.y = 0.012
    hubGroup.add(hubRing)

    const hubInnerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 0.84, 48),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    )
    hubInnerRing.rotation.x = -Math.PI / 2
    hubInnerRing.position.y = 0.013
    hubGroup.add(hubInnerRing)
    scene.add(hubGroup)

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

    // 4. Procedural 3D Cyber Sports Car (Player Vehicle)
    const droneGroup = new THREE.Group()

    // Materials
    const darkBodyMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.25,
      metalness: 0.85,
    })
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d0e,
      roughness: 0.45,
      metalness: 0.6,
    })
    const canopyGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1f2226,
      roughness: 0.08,
      metalness: 0.95,
      transparent: true,
      opacity: 0.92,
    })
    const neonOrangeMat = new THREE.MeshBasicMaterial({ color: 0xd2531d })
    const neonHeadlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xa0a0a5,
      roughness: 0.2,
      metalness: 0.95,
    })
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181a,
      roughness: 0.8,
      metalness: 0.1,
    })
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })

    // A. Main Lower Chassis Wedge (Aerodynamic belly pan)
    const lowerChassisGeo = new THREE.BoxGeometry(1.42, 0.22, 2.5)
    const lowerChassis = new THREE.Mesh(lowerChassisGeo, carbonMat)
    lowerChassis.position.y = 0.24
    droneGroup.add(lowerChassis)

    // B. Sculpted Upper Body (Tapered sleek sports car hood and rear deck)
    const upperBodyGeo = new THREE.BoxGeometry(1.28, 0.24, 2.3)
    const upperBody = new THREE.Mesh(upperBodyGeo, darkBodyMat)
    upperBody.position.set(0, 0.4, 0.05)
    droneGroup.add(upperBody)

    const bodyEdges = new THREE.LineSegments(new THREE.EdgesGeometry(upperBodyGeo), wireMat)
    bodyEdges.position.copy(upperBody.position)
    droneGroup.add(bodyEdges)

    // C. Low-Slung Front Hood Wedge & Splitter
    const hoodGeo = new THREE.BoxGeometry(1.22, 0.12, 0.85)
    const hood = new THREE.Mesh(hoodGeo, darkBodyMat)
    hood.position.set(0, 0.32, -0.9)
    hood.rotation.x = 0.1
    droneGroup.add(hood)

    const splitterGeo = new THREE.BoxGeometry(1.48, 0.04, 0.45)
    const splitter = new THREE.Mesh(splitterGeo, carbonMat)
    splitter.position.set(0, 0.13, -1.35)
    droneGroup.add(splitter)

    // Splitter neon edge accent
    const splitterLipGeo = new THREE.BoxGeometry(1.48, 0.02, 0.04)
    const splitterLip = new THREE.Mesh(splitterLipGeo, neonOrangeMat)
    splitterLip.position.set(0, 0.13, -1.57)
    droneGroup.add(splitterLip)

    // D. Sleek Aerodynamic Canopy (Fastback Windshield & Roof)
    const canopyGeo = new THREE.BoxGeometry(0.96, 0.28, 1.15)
    const canopy = new THREE.Mesh(canopyGeo, canopyGlassMat)
    canopy.position.set(0, 0.62, -0.1)
    canopy.rotation.x = -0.06
    droneGroup.add(canopy)

    const canopyEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(canopyGeo),
      new THREE.LineBasicMaterial({ color: 0xd2531d, transparent: true, opacity: 0.6 })
    )
    canopyEdges.position.copy(canopy.position)
    canopyEdges.rotation.copy(canopy.rotation)
    droneGroup.add(canopyEdges)

    // E. GT Rear Wing & Diffuser
    const wingPylonL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.14), carbonMat)
    wingPylonL.position.set(-0.45, 0.62, 1.05)
    wingPylonL.rotation.x = -0.2
    droneGroup.add(wingPylonL)

    const wingPylonR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.14), carbonMat)
    wingPylonR.position.set(0.45, 0.62, 1.05)
    wingPylonR.rotation.x = -0.2
    droneGroup.add(wingPylonR)

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.04, 0.28), carbonMat)
    wingBlade.position.set(0, 0.76, 1.1)
    droneGroup.add(wingBlade)

    const wingFinL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.32), neonOrangeMat)
    wingFinL.position.set(-0.73, 0.76, 1.1)
    droneGroup.add(wingFinL)

    const wingFinR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.32), neonOrangeMat)
    wingFinR.position.set(0.73, 0.76, 1.1)
    droneGroup.add(wingFinR)

    // Rear diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.36, 0.08, 0.35)
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMat)
    diffuser.position.set(0, 0.18, 1.3)
    diffuser.rotation.x = 0.25
    droneGroup.add(diffuser)

    // F. Lights: Twin Angular Headlights & Tail-light Bar
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.06), neonHeadlightMat)
    headL.position.set(-0.5, 0.36, -1.32)
    droneGroup.add(headL)

    const headR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.06), neonHeadlightMat)
    headR.position.set(0.5, 0.36, -1.32)
    droneGroup.add(headR)

    const lightL = new THREE.PointLight(0xffffff, 2.2, 12)
    lightL.position.set(-0.5, 0.38, -1.45)
    droneGroup.add(lightL)

    const lightR = new THREE.PointLight(0xffffff, 2.2, 12)
    lightR.position.set(0.5, 0.38, -1.45)
    droneGroup.add(lightR)

    // Full-width Cyber Red Taillight Bar
    const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.04, 0.04), neonOrangeMat)
    taillightBar.position.set(0, 0.44, 1.25)
    droneGroup.add(taillightBar)

    const tailLightPoint = new THREE.PointLight(0xd2531d, 1.8, 6)
    tailLightPoint.position.set(0, 0.44, 1.4)
    droneGroup.add(tailLightPoint)

    // G. Neon Ground Underglow (Red/Orange glow under car chassis)
    const underglowLight = new THREE.PointLight(0xd2531d, 3.8, 4.5)
    underglowLight.position.set(0, 0.08, 0)
    droneGroup.add(underglowLight)

    // H. 4 Realistic Wheels with Rims and Front Steering
    const frontSteeringL = new THREE.Group()
    frontSteeringL.position.set(-0.76, 0.26, -0.82)
    droneGroup.add(frontSteeringL)

    const frontSteeringR = new THREE.Group()
    frontSteeringR.position.set(0.76, 0.26, -0.82)
    droneGroup.add(frontSteeringR)

    const rearWheelGroupL = new THREE.Group()
    rearWheelGroupL.position.set(-0.78, 0.27, 0.85)
    droneGroup.add(rearWheelGroupL)

    const rearWheelGroupR = new THREE.Group()
    rearWheelGroupR.position.set(0.78, 0.27, 0.85)
    droneGroup.add(rearWheelGroupR)

    const rotatingWheels: THREE.Group[] = []

    const buildWheel = (radius = 0.26, width = 0.15) => {
      const wGroup = new THREE.Group()
      // Outer rubber tire
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24)
      tireGeo.rotateZ(Math.PI / 2)
      const tireMesh = new THREE.Mesh(tireGeo, tireMat)
      wGroup.add(tireMesh)

      // Inner alloy rim
      const rimGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width + 0.005, 16)
      rimGeo.rotateZ(Math.PI / 2)
      const rimMesh = new THREE.Mesh(rimGeo, rimMat)
      wGroup.add(rimMesh)

      // Rim Center Cap (Red accent)
      const capGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, width + 0.015, 12)
      capGeo.rotateZ(Math.PI / 2)
      const capMesh = new THREE.Mesh(capGeo, neonOrangeMat)
      wGroup.add(capMesh)

      // Rim Spoke wires
      const spokeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(rimGeo),
        new THREE.LineBasicMaterial({ color: 0x333333 })
      )
      wGroup.add(spokeLines)

      return wGroup
    }

    const wheelFL = buildWheel(0.26, 0.15)
    frontSteeringL.add(wheelFL)
    rotatingWheels.push(wheelFL)

    const wheelFR = buildWheel(0.26, 0.15)
    frontSteeringR.add(wheelFR)
    rotatingWheels.push(wheelFR)

    const wheelRL = buildWheel(0.27, 0.18)
    rearWheelGroupL.add(wheelRL)
    rotatingWheels.push(wheelRL)

    const wheelRR = buildWheel(0.27, 0.18)
    rearWheelGroupR.add(wheelRR)
    rotatingWheels.push(wheelRR)

    scene.add(droneGroup)

    // 5. Interactive Particle Trail & Bursts
    const maxTrail = 80
    const trailPositions = new Float32Array(maxTrail * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    const trailMat = new THREE.PointsMaterial({
      color: 0xd2531d,
      size: 0.22,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const trailPoints = new THREE.Points(trailGeo, trailMat)
    scene.add(trailPoints)

    let trailIdx = 0
    const addTrailPoint = (x: number, y: number, z: number) => {
      trailPositions[trailIdx * 3] = x + (Math.random() - 0.5) * 0.2
      trailPositions[trailIdx * 3 + 1] = y + 0.35 + (Math.random() - 0.5) * 0.1
      trailPositions[trailIdx * 3 + 2] = z + 1.2
      trailIdx = (trailIdx + 1) % maxTrail
      trailGeo.attributes.position.needsUpdate = true
    }

    // Spark burst system
    const burstCount = 60
    const burstGeo = new THREE.BufferGeometry()
    const burstPositions = new Float32Array(burstCount * 3)
    const burstVelocities: THREE.Vector3[] = []
    for (let i = 0; i < burstCount; i++) {
      burstPositions[i * 3] = 0
      burstPositions[i * 3 + 1] = -100
      burstPositions[i * 3 + 2] = 0
      burstVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.35,
          Math.random() * 0.35 + 0.1,
          (Math.random() - 0.5) * 0.35
        )
      )
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3))
    const burstMat = new THREE.PointsMaterial({
      color: 0xd2531d,
      size: 0.3,
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
        burstPositions[i * 3 + 1] = origin.y
        burstPositions[i * 3 + 2] = origin.z
        burstVelocities[i].set(
          (Math.random() - 0.5) * 0.38,
          Math.random() * 0.38 + 0.12,
          (Math.random() - 0.5) * 0.38
        )
      }
      burstGeo.attributes.position.needsUpdate = true
    }

    // Ground Click Ripple
    const reticleGeo = new THREE.RingGeometry(0.2, 0.26, 32)
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xd2531d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    })
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat)
    reticleMesh.rotation.x = -Math.PI / 2
    reticleMesh.position.y = 0.02
    scene.add(reticleMesh)

    const showClickReticle = (x: number, z: number) => {
      reticleMesh.position.x = x
      reticleMesh.position.z = z
      reticleMesh.scale.set(1, 1, 1)
      reticleMat.opacity = 0.95
      gsap.killTweensOf(reticleMesh.scale)
      gsap.killTweensOf(reticleMat)
      gsap.to(reticleMesh.scale, { x: 3.2, y: 3.2, duration: 0.65, ease: 'power2.out' })
      gsap.to(reticleMat, { opacity: 0, duration: 0.65, ease: 'power2.out' })
    }

    // 6. Interactive Red LED Project Ring Nodes & 3D Artifacts
    const nodeMeshes: {
      group: THREE.Group
      data: ProjectItem
      crystal: THREE.Mesh
      groundRing: THREE.Mesh
      verticalRing: THREE.Mesh
      light: THREE.PointLight
      label: THREE.Sprite
    }[] = []

    // Helper to generate clean floating 3D billboard label with number and name simply
    const createLabelSprite = (num: string, title: string) => {
      const textCanvas = document.createElement('canvas')
      textCanvas.width = 512
      textCanvas.height = 120
      const ctx = textCanvas.getContext('2d')
      if (ctx) {
        // Frosted Pill background
        ctx.fillStyle = 'rgba(14, 14, 16, 0.88)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 3.5
        const r = 28
        const w = 460
        const h = 80
        const x = 26
        const y = 20
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Pure clean text: Number and Name simply (NO DOT)
        ctx.font = 'bold 36px "JetBrains Mono", monospace'
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${num}  ${title.toUpperCase()}`, 256, y + h / 2)
      }

      const texture = new THREE.CanvasTexture(textCanvas)
      texture.minFilter = THREE.LinearFilter
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(3.4, 0.82, 1)
      sprite.position.y = 2.8
      return sprite
    }

    PROJECTS.forEach((p, idx) => {
      const nGroup = new THREE.Group()
      nGroup.position.set(p.pos[0], 0, p.pos[2])

      // LED Ring Node Base
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.15, 32)
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x080808,
        metalness: 0.9,
        roughness: 0.2,
      })
      const baseMesh = new THREE.Mesh(baseGeo, baseMat)
      baseMesh.position.y = 0.08
      nGroup.add(baseMesh)

      // Crimson LED Floor Ring
      const gRingGeo = new THREE.RingGeometry(1.4, 1.7, 48)
      const gRingMat = new THREE.MeshBasicMaterial({
        color: 0xd2531d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
      const groundRing = new THREE.Mesh(gRingGeo, gRingMat)
      groundRing.rotation.x = -Math.PI / 2
      groundRing.position.y = 0.17
      nGroup.add(groundRing)

      // Revolving Orbital Gyro Ring
      const vRingGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 64)
      const vRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
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

      // Red LED PointLight
      const nLight = new THREE.PointLight(0xd2531d, 3.2, 11)
      nLight.position.y = 1.5
      nGroup.add(nLight)

      // Floating 3D Billboard Label with Project Number & Name
      const label = createLabelSprite(p.num, p.title)
      nGroup.add(label)

      scene.add(nGroup)
      nodeMeshes.push({ group: nGroup, data: p, crystal, groundRing, verticalRing, light: nLight, label })
    })

    // 7. Navigation Motion State & Calibrated Physics (Free-roam spawn at center hub)
    const state = {
      x: 0,
      z: 0,
      vx: 0,
      vz: 0,
      heading: 0,
      targetHeading: 0,
      isAutoNav: false,
      isHeroCinematic: false,
      parkedBeaconId: null as string | null,
    }

    // 8. Instant GSAP Transition to Project Node
    const jumpToProject = (idx: number) => {
      triggerEngineStartSound()
      const p = PROJECTS[idx]
      if (!p) return

      selectProject(p)
      setIsFocused(true)
      state.isAutoNav = true
      state.isHeroCinematic = true
      state.parkedBeaconId = p.id
      lockUntilRef.current = Date.now() + 650

      playLockSound()
      triggerBurst(new THREE.Vector3(p.pos[0], 0.5, p.pos[2]))

      // 1. Camera transition directly in front of the project artifact in space
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camLookAt)

      gsap.to(camera.position, {
        x: p.pos[0] - 2.8,
        y: 2.8,
        z: p.pos[2] + 7.5,
        duration: 1.3,
        ease: 'power4.inOut',
      })

      gsap.to(camLookAt, {
        x: p.pos[0] + 0.6,
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
          state.vx = 0
          state.vz = 0
        },
      })
    }
    jumpToProjectRef.current = jumpToProject

    // Drive drone smoothly to coordinate on ground click/tap
    const driveToCoord = (tx: number, tz: number, targetProject?: ProjectItem) => {
      triggerEngineStartSound()
      showClickReticle(tx, tz)

      if (targetProject) {
        jumpToProject(PROJECTS.findIndex((p) => p.id === targetProject.id))
        return
      }

      state.isAutoNav = true

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
            state.heading = Math.atan2(-dx, -dz)
          }
        },
        onComplete: () => {
          state.isAutoNav = false
          state.vx = 0
          state.vz = 0
        },
      })
    }

    // 9. Keyboard Controls (WASD & 1-5 Quick Keys)
    const keys: Record<string, boolean> = {}

    // Link mobile on-screen D-Pad directly to vehicle controls
    virtualKeyRef.current = (key: 'w' | 'a' | 's' | 'd', isPressed: boolean) => {
      keys[key] = isPressed
      if (isPressed) {
        ensureAudioContext()
        triggerEngineStartSound()
        state.isAutoNav = false
        if (Date.now() > lockUntilRef.current) {
          state.isHeroCinematic = false
          setIsFocused(false)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const key = e.key
      // Close project HUD card on Escape
      if (key === 'Escape') {
        setIsFocused(false)
        state.isHeroCinematic = false
        return
      }

      // 1-5 Numeric shortcuts to jump instantly
      if (['1', '2', '3', '4', '5'].includes(key)) {
        ensureAudioContext()
        const idx = parseInt(key, 10) - 1
        jumpToProject(idx)
        return
      }

      const lk = key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(lk)) {
        ensureAudioContext()
        triggerEngineStartSound()
        keys[lk] = true
        state.isAutoNav = false
        // Only break cinematic lock if grace period has passed
        if (Date.now() > lockUntilRef.current) {
          state.isHeroCinematic = false
          setIsFocused(false)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // 10. Pointer Raycasting (Ground Click / Beacon Click & Native Touch Drag)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    let pointerDownPos = { x: 0, y: 0 }
    let isPointerDown = false
    let isDraggingTouch = false

    const handlePointerDown = (e: PointerEvent) => {
      ensureAudioContext()
      isPointerDown = true
      isDraggingTouch = false
      pointerDownPos = { x: e.clientX, y: e.clientY }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
      // If moved more than 10px, treat as touch drag / steer
      if (dist > 10) {
        isDraggingTouch = true
        const rect = canvas.getBoundingClientRect()
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersectPoint = new THREE.Vector3()
        if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
          triggerEngineStartSound()
          state.isAutoNav = false
          if (Date.now() > lockUntilRef.current) {
            state.isHeroCinematic = false
            setIsFocused(false)
          }

          const dx = intersectPoint.x - state.x
          const dz = intersectPoint.z - state.z
          const len = Math.hypot(dx, dz)
          if (len > 0.3) {
            const dragSpeed = 0.16
            state.vx = (dx / len) * dragSpeed
            state.vz = (dz / len) * dragSpeed
            state.targetHeading = Math.atan2(-dx, -dz)
          }
        }
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      const wasDragging = isDraggingTouch
      isPointerDown = false
      isDraggingTouch = false

      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
      // Ignore click if user was dragging or swiping
      if (wasDragging || dist > 8) return

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
          if (Math.hypot(tx - p.pos[0], tz - p.pos[2]) < 3.2) {
            clickedNode = p
            break
          }
        }
        driveToCoord(tx, tz, clickedNode)
      }
    }

    const handlePointerCancel = () => {
      isPointerDown = false
      isDraggingTouch = false
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerCancel)

    // 11. Main Animation Loop
    let animId: number
    const clock = new THREE.Clock()
    let isVisible = true

    // Reset car and camera to the center hub
    const resetCarToHub = () => {
      gsap.killTweensOf(state)
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camLookAt)

      state.x = 0
      state.z = 0
      state.vx = 0
      state.vz = 0
      state.heading = 0
      state.targetHeading = 0
      state.isAutoNav = false
      state.isHeroCinematic = false
      state.parkedBeaconId = null
      setIsFocused(false)

      camera.position.set(0, isMobile ? 15 : 13, isMobile ? 22 : 18)
      camLookAt.set(0, 0.6, 0)
      camera.lookAt(camLookAt)

      droneGroup.position.set(0, 0, 0)
      droneGroup.rotation.y = 0

      if (engineSoundRef.current && audioCtxRef.current) {
        engineSoundRef.current.gain.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.05)
      }
    }

    // Pause physics, mute audio, and reset car position when scrolled outside Projects section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting && entry.intersectionRatio > 0.08
          if (!inView) {
            isVisible = false
            resetCarToHub()
          } else {
            isVisible = true
          }
        })
      },
      { threshold: [0, 0.08, 0.25] }
    )
    observer.observe(container)

    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Sleep loop when section is scrolled out of viewport
      if (!isVisible) {
        if (engineSoundRef.current && audioCtxRef.current) {
          engineSoundRef.current.gain.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.05)
        }
        return
      }

      const time = clock.getElapsedTime()

      // Clear parked beacon lock once car drives safely away
      if (state.parkedBeaconId) {
        const curProj = PROJECTS.find((p) => p.id === state.parkedBeaconId)
        if (curProj && Math.hypot(state.x - curProj.pos[0], state.z - curProj.pos[2]) > 3.6) {
          state.parkedBeaconId = null
          setIsFocused(false)
        }
      }

      // WASD direct physics with calibrated cruising speed and smooth drifting
      if (!state.isAutoNav) {
        let ax = 0
        let az = 0
        const accel = 0.024 // Tactile acceleration
        const maxSpeed = 0.22 // Comfortable cruising speed

        if (keys['w'] || keys['arrowup']) az -= accel
        if (keys['s'] || keys['arrowdown']) az += accel
        if (keys['a'] || keys['arrowleft']) ax -= accel
        if (keys['d'] || keys['arrowright']) ax += accel

        if (ax !== 0 || az !== 0) {
          state.vx += ax
          state.vz += az
          // Orient car so front is at the front (towards movement direction)
          state.targetHeading = Math.atan2(-ax, -az)
          if (Date.now() > lockUntilRef.current) {
            state.isHeroCinematic = false
            setIsFocused(false)
          }
        } else if (state.isHeroCinematic) {
          state.vx = 0
          state.vz = 0
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

        // Smooth realistic heading banking with angle wrap-around protection
        if (Math.hypot(state.vx, state.vz) > 0.01) {
          let diff = (state.targetHeading - state.heading) % (Math.PI * 2)
          if (diff > Math.PI) diff -= Math.PI * 2
          if (diff < -Math.PI) diff += Math.PI * 2
          state.heading += THREE.MathUtils.clamp(diff, -0.12, 0.12)
        }

        // In free-flight mode, camera smoothly tracks car
        if (!state.isHeroCinematic) {
          const targetCamX = state.x * 0.45
          const targetCamY = isMobile ? 15 : 13
          const targetCamZ = state.z + (isMobile ? 21 : 18)

          camera.position.x += (targetCamX - camera.position.x) * 0.045
          camera.position.y += (targetCamY - camera.position.y) * 0.045
          camera.position.z += (targetCamZ - camera.position.z) * 0.045

          const targetLookX = state.x
          const targetLookY = 0.6
          const targetLookZ = state.z

          camLookAt.x += (targetLookX - camLookAt.x) * 0.06
          camLookAt.y += (targetLookY - camLookAt.y) * 0.06
          camLookAt.z += (targetLookZ - camLookAt.z) * 0.06
        }
      }

      // Update video-game engine noise in real-time
      const liveSpeed = Math.hypot(state.vx, state.vz)
      updateEngineAudio(state.isAutoNav ? 0.16 : liveSpeed)

      // Animate 3D wheels rotation with velocity
      if (liveSpeed > 0.001 || state.isAutoNav) {
        const rotDelta = state.isAutoNav ? 0.14 : liveSpeed * 3.4
        rotatingWheels.forEach((w) => {
          w.rotation.x -= rotDelta
        })
      }

      // Front wheel dynamic steering response
      let steerInput = 0
      if (keys['a'] || keys['arrowleft']) steerInput += 0.36
      if (keys['d'] || keys['arrowright']) steerInput -= 0.36
      frontSteeringL.rotation.y = THREE.MathUtils.lerp(frontSteeringL.rotation.y, steerInput, 0.2)
      frontSteeringR.rotation.y = THREE.MathUtils.lerp(frontSteeringR.rotation.y, steerInput, 0.2)

      // Update car mesh position and orientation
      droneGroup.position.set(state.x, 0, state.z)
      droneGroup.rotation.y = state.heading

      // Add particle exhaust trail when moving
      if (liveSpeed > 0.02 || state.isAutoNav) {
        addTrailPoint(state.x, 0, state.z)
      }

      // Animate Nodes & Detect Proximity to projects
      nodeMeshes.forEach((nm, idx) => {
        nm.crystal.rotation.y = time * 0.85 + idx * 0.5
        nm.crystal.rotation.x = Math.sin(time * 1.5 + idx) * 0.15
        nm.verticalRing.rotation.y = -time * 1.2
        nm.verticalRing.rotation.x = time * 0.8
        nm.label.position.y = 2.8 + Math.sin(time * 2.4 + idx * 1.2) * 0.08

        const isCurrent = activeProjectIdRef.current === nm.data.id
        nm.light.intensity = isCurrent ? 4.8 : 1.8
        nm.groundRing.scale.setScalar(1 + Math.sin(time * 3 + idx) * 0.06)

        // When car enters a beacon pad (free drive or ground nav)
        if (!state.isHeroCinematic) {
          const dist = Math.hypot(state.x - nm.data.pos[0], state.z - nm.data.pos[2])
          // Precise trigger radius (2.8 units) so car drives up to the beacon
          if (dist < 2.8 && state.parkedBeaconId !== nm.data.id) {
            selectProject(nm.data)
            setIsFocused(true)
            state.isHeroCinematic = true
            state.parkedBeaconId = nm.data.id
            state.vx = 0
            state.vz = 0
            lockUntilRef.current = Date.now() + 650

            playLockSound()
            triggerBurst(new THREE.Vector3(nm.data.pos[0], 0.5, nm.data.pos[2]))

            // Park drone right at the project pad
            gsap.killTweensOf(state)
            gsap.to(state, {
              x: nm.data.pos[0],
              z: nm.data.pos[2] + 1.2,
              duration: 0.55,
              ease: 'power2.out',
              onComplete: () => {
                state.vx = 0
                state.vz = 0
                state.isAutoNav = false
              },
            })

            // Orbit camera in space framing the artifact
            gsap.killTweensOf(camera.position)
            gsap.killTweensOf(camLookAt)
            gsap.to(camera.position, {
              x: nm.data.pos[0] - 2.8,
              y: 2.8,
              z: nm.data.pos[2] + 7.5,
              duration: 1.2,
              ease: 'power3.out',
            })
            gsap.to(camLookAt, {
              x: nm.data.pos[0] + 0.6,
              y: 1.2,
              z: nm.data.pos[2],
              duration: 1.2,
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

    // 12. Full-Bleed Resize Handler (100vw / 100vh)
    const handleResize = () => {
      const w = window.innerWidth
      const h = container?.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.fov = window.innerWidth < 768 ? 52 : 42
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      virtualKeyRef.current = null
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerCancel)
      renderer.dispose()

      if (engineSoundRef.current) {
        try {
          engineSoundRef.current.osc1.stop()
          engineSoundRef.current.osc2.stop()
        } catch {
          // cleanup
        }
        engineSoundRef.current = null
      }

      if (engineStartAudioRef.current) {
        try {
          engineStartAudioRef.current.pause()
        } catch {}
      }

      if (projectSelectAudioRef.current) {
        try {
          projectSelectAudioRef.current.pause()
        } catch {}
      }
    }
  }, [playLockSound, selectProject, updateEngineAudio, triggerEngineStartSound])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-[85vh] min-h-[580px] sm:h-screen sm:min-h-[640px] bg-[#0b0b0c] overflow-hidden select-none outline-none"
      style={{
        touchAction: 'pan-y',
      }}
    >
      {/* 3D WebGL Canvas (Full-bleed with subtle top/bottom ambient fade) */}
      <canvas
        ref={canvasRef}
        style={{
          touchAction: 'pan-y',
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000000 8%, #000000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000000 8%, #000000 92%, transparent 100%)',
        }}
        className="w-full h-full block cursor-crosshair select-none z-0"
      />

      {/* FLOATING PAGINATION DOCK (01 - 05): Top on phone screens, bottom on desktop screens */}
      <div className="absolute top-20 sm:top-auto sm:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-4 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/85 border border-[#222222] backdrop-blur-xl shadow-2xl pointer-events-auto">
        {PROJECTS.map((p, idx) => {
          const isSelected = activeProject.id === p.id && isFocused
          return (
            <button
              key={p.id}
              onClick={() => {
                if (jumpToProjectRef.current) jumpToProjectRef.current(idx)
              }}
              className="group flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-90 px-1 py-0.5"
              aria-label={`Select ${p.num}: ${p.title}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#D2531D] scale-125 shadow-[0_0_8px_#D2531D]'
                    : 'bg-[#444444] group-hover:bg-neutral-300'
                }`}
              />
              <span
                className={`text-[11px] sm:text-xs font-mono font-medium transition-colors ${
                  isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {p.num}
              </span>
            </button>
          )
        })}
      </div>

      {/* SPATIAL PROJECT DETAIL MODAL / CARD (ULTRA-CLEAN GLASSMORPHIC HUD) */}
      <div
        style={{
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isFocused ? 1 : 0,
          transform: isFocused ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          pointerEvents: isFocused ? 'auto' : 'none',
        }}
        className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 lg:left-14 w-[calc(100%-24px)] sm:w-auto max-w-xl z-40 select-text"
      >
        <div
          style={{
            background: 'rgba(14, 14, 16, 0.82)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(210, 83, 29, 0.15)',
          }}
          className="relative flex flex-col text-left p-6 sm:p-9"
        >
          {/* Top Bar: Project Index Pill + Close Button */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2531D]/15 border border-[#D2531D]/30 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#E2652B] uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] shadow-[0_0_8px_#E2652B] animate-pulse" />
              <span>PROJECT {activeProject.num} // 05</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Close card (or drive away / Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Massive Project Title */}
          <h2
            style={{ fontFamily: "'JetBrains Mono', monospace, sans-serif" }}
            className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase mb-2.5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]"
          >
            {activeProject.title}
          </h2>

          {/* Concise Single-Sentence Description */}
          <p className="text-xs sm:text-sm font-sans text-neutral-300 leading-relaxed mb-6 font-normal">
            {activeProject.desc}
          </p>

          {/* Modern Glassmorphic Blurred Transparent Button */}
          <div className="flex items-center">
            <a
              href={activeProject.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
              className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-semibold tracking-wider text-white hover:bg-white/15 hover:border-white/40 hover:shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-all duration-200 active:scale-95 flex items-center gap-2.5 sm:gap-3 no-underline cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 opacity-90" />
              <span>CODEBASE</span>
              <ArrowUpRight className="w-4 h-4 opacity-75" />
            </a>
          </div>

          {/* Navigation tip */}
          <div className="mt-6 pt-3.5 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>WASD TO DRIVE AWAY</span>
            <span className="hidden sm:inline">ESC TO DISMISS</span>
          </div>
        </div>
      </div>

      {/* TACTILE LARGER MOBILE D-PAD (Centered at bottom on phone screens) */}
      <div
        className={`sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto ${
          isFocused ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* UP */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation()
            virtualKeyRef.current?.('w', true)
          }}
          onPointerUp={() => virtualKeyRef.current?.('w', false)}
          onPointerLeave={() => virtualKeyRef.current?.('w', false)}
          className="w-11 h-11 rounded-xl bg-[#121214]/90 border border-white/16 backdrop-blur-md flex items-center justify-center text-neutral-200 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-95 transition-all select-none shadow-lg cursor-pointer"
          aria-label="Drive Forward"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* LEFT / CENTER / RIGHT */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation()
              virtualKeyRef.current?.('a', true)
            }}
            onPointerUp={() => virtualKeyRef.current?.('a', false)}
            onPointerLeave={() => virtualKeyRef.current?.('a', false)}
            className="w-11 h-11 rounded-xl bg-[#121214]/90 border border-white/16 backdrop-blur-md flex items-center justify-center text-neutral-200 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-95 transition-all select-none shadow-lg cursor-pointer"
            aria-label="Steer Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-5 h-5 rounded-full flex items-center justify-center pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#E2652B] shadow-[0_0_8px_#E2652B]" />
          </div>

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation()
              virtualKeyRef.current?.('d', true)
            }}
            onPointerUp={() => virtualKeyRef.current?.('d', false)}
            onPointerLeave={() => virtualKeyRef.current?.('d', false)}
            className="w-11 h-11 rounded-xl bg-[#121214]/90 border border-white/16 backdrop-blur-md flex items-center justify-center text-neutral-200 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-95 transition-all select-none shadow-lg cursor-pointer"
            aria-label="Steer Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* DOWN */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation()
            virtualKeyRef.current?.('s', true)
          }}
          onPointerUp={() => virtualKeyRef.current?.('s', false)}
          onPointerLeave={() => virtualKeyRef.current?.('s', false)}
          className="w-11 h-11 rounded-xl bg-[#121214]/90 border border-white/16 backdrop-blur-md flex items-center justify-center text-neutral-200 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-95 transition-all select-none shadow-lg cursor-pointer"
          aria-label="Drive Reverse"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
