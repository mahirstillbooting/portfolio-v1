import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ArrowUpRight, ExternalLink, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { GithubIcon } from './Icons'
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
      osc1.frequency.setValueAtTime(60, ctx.currentTime)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(40, ctx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, ctx.currentTime)
      filter.Q.setValueAtTime(3.0, ctx.currentTime)

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
    const now = ctx.currentTime

    const norm = Math.min(1, Math.max(0, speed / 0.22))
    if (norm > 0.03) {
      // Accelerating cyber engine pitch & resonance
      const targetFreq = 58 + norm * 82
      const targetFilter = 220 + norm * 400
      const targetVol = 0.004 + norm * 0.026

      engine.osc1.frequency.setTargetAtTime(targetFreq, now, 0.08)
      engine.osc2.frequency.setTargetAtTime(targetFreq * 0.66, now, 0.08)
      engine.filter.frequency.setTargetAtTime(targetFilter, now, 0.08)
      engine.gain.gain.setTargetAtTime(targetVol, now, 0.06)
    } else {
      // Idle / stopped
      engine.gain.gain.setTargetAtTime(0.0001, now, 0.12)
    }
  }, [ensureEngineSound])

  // Futuristic video game lock-on chime
  const playLockSound = useCallback(() => {
    if (!getAudioEnabled()) return
    try {
      const ctx = ensureAudioContext()
      const now = ctx.currentTime

      // 1. Primary high harmonic crystal ping
      const ping1 = ctx.createOscillator()
      const pingGain1 = ctx.createGain()
      ping1.type = 'sine'
      ping1.frequency.setValueAtTime(587.33, now) // D5
      ping1.frequency.exponentialRampToValueAtTime(880, now + 0.12) // A5
      pingGain1.gain.setValueAtTime(0.14, now)
      pingGain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
      ping1.connect(pingGain1)
      pingGain1.connect(ctx.destination)
      ping1.start(now)
      ping1.stop(now + 0.45)

      // 2. Secondary chime overtone
      const ping2 = ctx.createOscillator()
      const pingGain2 = ctx.createGain()
      ping2.type = 'triangle'
      ping2.frequency.setValueAtTime(880, now + 0.06)
      ping2.frequency.exponentialRampToValueAtTime(1760, now + 0.22)
      pingGain2.gain.setValueAtTime(0.001, now)
      pingGain2.gain.setValueAtTime(0.08, now + 0.06)
      pingGain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
      ping2.connect(pingGain2)
      pingGain2.connect(ctx.destination)
      ping2.start(now + 0.06)
      ping2.stop(now + 0.52)

      // 3. Tactile sub lock thud
      const sub = ctx.createOscillator()
      const subGain = ctx.createGain()
      sub.type = 'sine'
      sub.frequency.setValueAtTime(95, now)
      sub.frequency.exponentialRampToValueAtTime(38, now + 0.18)
      subGain.gain.setValueAtTime(0.09, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
      sub.connect(subGain)
      subGain.connect(ctx.destination)
      sub.start(now)
      sub.stop(now + 0.24)
    } catch {
      // Audio fallback
    }
  }, [ensureAudioContext])

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

    // Initial camera position framed on first project
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

    // Helper to generate crisp floating 3D billboard sprite with project number & title
    const createLabelSprite = (num: string, title: string) => {
      const textCanvas = document.createElement('canvas')
      textCanvas.width = 512
      textCanvas.height = 128
      const ctx = textCanvas.getContext('2d')
      if (ctx) {
        // Pill background
        ctx.fillStyle = 'rgba(12, 12, 14, 0.85)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
        ctx.lineWidth = 4
        const r = 32
        const w = 480
        const h = 88
        const x = 16
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

        // Orange dot
        ctx.fillStyle = '#E2652B'
        ctx.beginPath()
        ctx.arc(x + 38, y + h / 2, 9, 0, Math.PI * 2)
        ctx.fill()

        // Text
        ctx.font = 'bold 36px "JetBrains Mono", monospace'
        ctx.fillStyle = '#FFFFFF'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${num} // ${title.toUpperCase()}`, x + 62, y + h / 2 + 2)
      }

      const texture = new THREE.CanvasTexture(textCanvas)
      texture.minFilter = THREE.LinearFilter
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(3.8, 0.95, 1)
      sprite.position.y = 4.3
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

      // Floating 3D Billboard Label with Project Number & Name
      const label = createLabelSprite(p.num, p.title)
      nGroup.add(label)

      scene.add(nGroup)
      nodeMeshes.push({ group: nGroup, data: p, crystal, groundRing, verticalRing, light: nLight, label })
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

    // 8. Instant GSAP Transition to Project Node
    const jumpToProject = (idx: number) => {
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
            state.heading = Math.atan2(dx, dz)
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
        const idx = parseInt(key, 10) - 1
        jumpToProject(idx)
        return
      }

      const lk = key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(lk)) {
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
      // Ignore if user was scrolling/swiping on mobile or dragging
      if (dist > 8) return

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

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)

    // 11. Main Animation Loop
    let animId: number
    const clock = new THREE.Clock()
    let isVisible = true

    // Pause physics & mute audio when scrolled outside Projects section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05
          if (!isVisible && engineSoundRef.current && audioCtxRef.current) {
            engineSoundRef.current.gain.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.05)
          }
        })
      },
      { threshold: [0, 0.05, 0.2] }
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

      // Clear parked beacon lock once drone drives safely away
      if (state.parkedBeaconId) {
        const curProj = PROJECTS.find((p) => p.id === state.parkedBeaconId)
        if (curProj && Math.hypot(state.x - curProj.pos[0], state.z - curProj.pos[2]) > 4.2) {
          state.parkedBeaconId = null
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
          state.targetHeading = Math.atan2(ax, az)
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

        // Smooth realistic heading banking
        if (Math.hypot(state.vx, state.vz) > 0.01) {
          const diff = state.targetHeading - state.heading
          state.heading += THREE.MathUtils.clamp(diff, -0.09, 0.09)
        }

        // In free-flight mode, camera smoothly tracks drone
        if (!state.isHeroCinematic) {
          const targetCamX = state.x * 0.45
          const targetCamY = 14
          const targetCamZ = state.z + 18

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

      // Update Drone mesh
      droneGroup.position.set(state.x, 0, state.z)
      droneGroup.rotation.y = state.heading

      // Add particle exhaust trail when moving
      if (liveSpeed > 0.02 || state.isAutoNav) {
        addTrailPoint(state.x, 0, state.z)
      }

      // Animate Nodes & Detect Proximity to other projects
      nodeMeshes.forEach((nm, idx) => {
        nm.crystal.rotation.y = time * 0.85 + idx * 0.5
        nm.crystal.rotation.x = Math.sin(time * 1.5 + idx) * 0.15
        nm.verticalRing.rotation.y = -time * 1.2
        nm.verticalRing.rotation.x = time * 0.8
        nm.label.position.y = 4.3 + Math.sin(time * 2.4 + idx * 1.2) * 0.12

        const isCurrent = activeProjectIdRef.current === nm.data.id
        nm.light.intensity = isCurrent ? 4.8 : 1.8
        nm.groundRing.scale.setScalar(1 + Math.sin(time * 3 + idx) * 0.06)

        // When drone enters another beacon pad (free flight or ground nav)
        if (!state.isHeroCinematic) {
          const dist = Math.hypot(state.x - nm.data.pos[0], state.z - nm.data.pos[2])
          // Robust trigger radius (3.2 units) to prevent missing nodes
          if (dist < 3.2 && state.parkedBeaconId !== nm.data.id) {
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
      canvas.removeEventListener('pointerup', handlePointerUp)
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
    }
  }, [playLockSound, selectProject, updateEngineAudio])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-[85vh] min-h-[580px] sm:h-screen sm:min-h-[640px] bg-[#0b0b0c] overflow-hidden select-none outline-none"
      style={{
        touchAction: 'pan-y',
        maskImage: 'linear-gradient(to bottom, transparent 0%, #000000 12%, #000000 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000000 12%, #000000 88%, transparent 100%)',
      }}
    >
      {/* 3D WebGL Canvas (Full-bleed) */}
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'pan-y' }}
        className="w-full h-full block cursor-crosshair select-none"
      />

      {/* Clean Minimal Header at Top Left */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-12 z-20 flex items-center gap-2.5 text-xs font-mono tracking-widest text-[#D2531D] uppercase font-semibold pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D2531D] shadow-[0_0_8px_#D2531D]" />
        <span>// SELECTED WORKS</span>
      </div>

      {/* SPATIAL PROJECT DETAIL MODAL / CARD (ULTRA-CLEAN GLASSMORPHIC HUD) */}
      <div
        style={{
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isFocused ? 1 : 0,
          transform: isFocused ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          pointerEvents: isFocused ? 'auto' : 'none',
        }}
        className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-10 lg:left-14 w-[calc(100%-32px)] sm:w-auto max-w-xl z-20 select-text"
      >
        <div
          style={{
            background: 'rgba(14, 14, 16, 0.78)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '28px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(210, 83, 29, 0.15)',
            padding: '32px 36px',
          }}
          className="relative flex flex-col text-left"
        >
          {/* Top Bar: Project Index Pill + Close Button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2531D]/15 border border-[#D2531D]/30 text-[11px] font-mono tracking-widest text-[#E2652B] uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B] shadow-[0_0_8px_#E2652B] animate-pulse" />
              <span>PROJECT {activeProject.num} // 05</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Close card (or press WASD / Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Massive Project Title */}
          <h2
            style={{ fontFamily: "'JetBrains Mono', monospace, sans-serif" }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase mb-3 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]"
          >
            {activeProject.title}
          </h2>

          {/* Concise Single-Sentence Description */}
          <p className="text-sm sm:text-base font-sans text-neutral-300 leading-relaxed mb-7 font-normal">
            {activeProject.desc}
          </p>

          {/* Modern Glassmorphic Blurred Transparent Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(226, 101, 43, 0.18)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(226, 101, 43, 0.5)',
              }}
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold tracking-wider text-white hover:bg-[#E2652B] hover:text-black hover:border-[#E2652B] hover:shadow-[0_0_30px_rgba(226,101,43,0.55)] transition-all duration-200 active:scale-95 flex items-center gap-2 no-underline cursor-pointer"
            >
              <span>VIEW LIVE</span>
              <ExternalLink className="w-4 h-4" strokeWidth={2.2} />
            </a>

            <a
              href={activeProject.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
              }}
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-mono font-medium tracking-wider text-neutral-200 hover:bg-white/12 hover:border-white/35 hover:text-white transition-all duration-200 active:scale-95 flex items-center gap-2 no-underline cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 opacity-80" />
              <span>CODEBASE</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* Navigation tip */}
          <div className="mt-6 pt-3.5 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>WASD TO DRIVE AWAY</span>
            <span className="hidden sm:inline">ESC TO DISMISS</span>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM DOCK: PAGINATION DOCK (01 - 05) */}
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-5 px-5 py-2.5 rounded-full bg-black/75 border border-[#222222] backdrop-blur-xl">
        {PROJECTS.map((p, idx) => {
          const isSelected = activeProject.id === p.id && isFocused
          return (
            <button
              key={p.id}
              onClick={() => {
                if (jumpToProjectRef.current) jumpToProjectRef.current(idx)
              }}
              className="group flex items-center gap-2 cursor-pointer transition-all active:scale-90"
              aria-label={`Select ${p.num}: ${p.title}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#D2531D] scale-125 shadow-[0_0_8px_#D2531D]'
                    : 'bg-[#333333] group-hover:bg-neutral-400'
                }`}
              />
              <span
                className={`text-xs font-mono font-medium transition-colors ${
                  isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {p.num}
              </span>
            </button>
          )
        })}
      </div>

      {/* MINIMAL MOBILE D-PAD (Only visible on mobile, auto-hides when project card is open) */}
      <div
        className={`sm:hidden absolute bottom-6 left-4 z-30 flex flex-col items-center gap-1 transition-all duration-300 ${
          isFocused ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 pointer-events-auto scale-100'
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
          className="w-9 h-9 rounded-xl bg-[#121214]/80 border border-white/14 backdrop-blur-md flex items-center justify-center text-neutral-300 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-90 transition-all select-none shadow-md"
          aria-label="Drive Forward"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* LEFT / CENTER / RIGHT */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation()
              virtualKeyRef.current?.('a', true)
            }}
            onPointerUp={() => virtualKeyRef.current?.('a', false)}
            onPointerLeave={() => virtualKeyRef.current?.('a', false)}
            className="w-9 h-9 rounded-xl bg-[#121214]/80 border border-white/14 backdrop-blur-md flex items-center justify-center text-neutral-300 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-90 transition-all select-none shadow-md"
            aria-label="Steer Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="w-5 h-5 rounded-full flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2652B]/60" />
          </div>

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation()
              virtualKeyRef.current?.('d', true)
            }}
            onPointerUp={() => virtualKeyRef.current?.('d', false)}
            onPointerLeave={() => virtualKeyRef.current?.('d', false)}
            className="w-9 h-9 rounded-xl bg-[#121214]/80 border border-white/14 backdrop-blur-md flex items-center justify-center text-neutral-300 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-90 transition-all select-none shadow-md"
            aria-label="Steer Right"
          >
            <ChevronRight className="w-4 h-4" />
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
          className="w-9 h-9 rounded-xl bg-[#121214]/80 border border-white/14 backdrop-blur-md flex items-center justify-center text-neutral-300 active:bg-[#E2652B] active:text-black active:border-[#E2652B] active:scale-90 transition-all select-none shadow-md"
          aria-label="Drive Reverse"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
