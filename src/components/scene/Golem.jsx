import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { dampAngle, segmentPoint } from './golemMovement'
import { TICK_INTERVAL_MS } from '../../engine/tick/tickEngine'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RADIANS = Math.PI / 180
// Escala para que el alquimista mida ~1 celda; offset de los pies al suelo.
const MODEL_SCALE = 0.4
const FEET_OFFSET = 0
// Holgura sobre el tick para cubrir el retraso de re-render entre acciones.
const SEGMENT_MS = TICK_INTERVAL_MS + 50

// Los clips llegan como "CharacterArmature|Walk": se busca por el sufijo exacto
// para no confundir "Idle" con "Idle_Attacking" o "Idle_Weapon".
function clip(actions, name) {
  const key = Object.keys(actions).find((k) => k.split('|').pop() === name)
  return key ? actions[key] : null
}

function AlchemistModel({ position, rotation, isMoving, reducedMotion }) {
  const groupRef = useRef(null)
  const { scene, animations } = useGLTF(import.meta.env.BASE_URL + 'models/alchemist.glb')
  const { actions } = useAnimations(animations, groupRef)
  const [initialPosition] = useState(position)
  const [initialRotation] = useState(rotation)
  const [walking, setWalking] = useState(false)
  const targetRef = useRef({ x: initialPosition[0], z: initialPosition[2] })
  const segmentRef = useRef({
    fromX: initialPosition[0],
    fromZ: initialPosition[2],
    elapsed: 0,
    active: false,
  })
  const walkingRef = useRef(false)

  // El grupo no propaga castShadow: se aplica a cada malla cargada.
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) obj.castShadow = true
    })
  }, [scene])

  // Walk mientras avanza, Idle al parar, con crossfade.
  useEffect(() => {
    const walk = clip(actions, 'Walk')
    const idle = clip(actions, 'Idle')
    if (!walk || !idle) return

    if (reducedMotion) {
      // Pose estática: frame 0 de Idle sin avanzar.
      walk.stop()
      idle.reset()
      idle.play()
      idle.paused = true
      return
    }

    const from = walking ? idle : walk
    const to = walking ? walk : idle
    from?.fadeOut(0.2)
    to.reset()
    to.paused = false
    to.fadeIn(0.2)
    to.play()
  }, [actions, walking, reducedMotion])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const [x, y, z] = position

    if (reducedMotion) {
      group.position.set(x, y, z)
      group.rotation.y = rotation * RADIANS
      return
    }

    // Cada nuevo objetivo reinicia el segmento desde la posición actual:
    // avance lineal con velocidad constante que encaja con el tick.
    const target = targetRef.current
    if (x !== target.x || z !== target.z) {
      targetRef.current = { x, z }
      segmentRef.current = {
        fromX: group.position.x,
        fromZ: group.position.z,
        elapsed: 0,
        active: true,
      }
    }

    const segment = segmentRef.current
    if (segment.active) {
      segment.elapsed += delta * 1000
      const progress = segment.elapsed / SEGMENT_MS
      const [nextX, nextZ] = segmentPoint(segment.fromX, segment.fromZ, x, z, progress)
      group.position.x = nextX
      group.position.z = nextZ
      if (progress >= 1) segment.active = false
    } else {
      group.position.x = x
      group.position.z = z
    }
    group.position.y = y

    // Camina solo cuando de verdad avanza; evita pisar en el sitio.
    const nextWalking = isMoving && segment.active
    if (nextWalking !== walkingRef.current) {
      walkingRef.current = nextWalking
      setWalking(nextWalking)
    }

    // Mientras avanza mira hacia el destino; al parar vuelve a la orientación lógica.
    let yawTarget = rotation
    if (nextWalking) {
      const dx = x - segment.fromX
      const dz = z - segment.fromZ
      if (dx !== 0 || dz !== 0) yawTarget = (Math.atan2(dx, dz) * 180) / Math.PI
    }
    const currentYaw = group.rotation.y / RADIANS
    group.rotation.y = dampAngle(currentYaw, yawTarget, delta) * RADIANS
  })

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      rotation={[0, initialRotation * RADIANS, 0]}
      name="golem"
      aria-label="Gólem del jugador"
    >
      <primitive object={scene} scale={MODEL_SCALE} position={[0, FEET_OFFSET, 0]} />
    </group>
  )
}

export function Golem({ position = [0, 0, 0], rotation = 0, isMoving = false }) {
  const reducedMotion = useReducedMotion()

  return (
    <Suspense fallback={null}>
      <AlchemistModel
        position={position}
        rotation={rotation}
        isMoving={isMoving}
        reducedMotion={reducedMotion}
      />
    </Suspense>
  )
}
