import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { dampAngle, dampAxis } from './golemMovement'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RADIANS = Math.PI / 180
// Escala para que el alquimista mida ~1 celda; offset de los pies al suelo.
const MODEL_SCALE = 0.4
const FEET_OFFSET = 0

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

  // El grupo no propaga castShadow: se aplica a cada malla cargada.
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) obj.castShadow = true
    })
  }, [scene])

  // Walk mientras isPlaying, Idle al parar, con crossfade.
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

    const from = isMoving ? idle : walk
    const to = isMoving ? walk : idle
    from?.fadeOut(0.2)
    to.reset()
    to.paused = false
    to.fadeIn(0.2)
    to.play()
  }, [actions, isMoving, reducedMotion])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const [x, y, z] = position

    if (reducedMotion) {
      group.position.set(x, y, z)
      group.rotation.y = rotation * RADIANS
      return
    }

    group.position.x = dampAxis(group.position.x, x, delta)
    group.position.y = dampAxis(group.position.y, y, delta)
    group.position.z = dampAxis(group.position.z, z, delta)

    const currentRotation = group.rotation.y / RADIANS
    group.rotation.y = dampAngle(currentRotation, rotation, delta) * RADIANS
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
