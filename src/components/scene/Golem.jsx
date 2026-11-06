import { Suspense, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { dampAngle, dampAxis } from './golemMovement'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RADIANS = Math.PI / 180

function GolemModel({ position, rotation, reducedMotion }) {
  const meshRef = useRef(null)
  const { scene } = useGLTF('/models/golem.glb')
  const [initialPosition] = useState(position)
  const [initialRotation] = useState(rotation)

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const [x, y, z] = position

    if (reducedMotion) {
      mesh.position.set(x, y, z)
      mesh.rotation.y = rotation * RADIANS
      return
    }

    mesh.position.x = dampAxis(mesh.position.x, x, delta)
    mesh.position.y = dampAxis(mesh.position.y, y, delta)
    mesh.position.z = dampAxis(mesh.position.z, z, delta)

    const currentRotation = mesh.rotation.y / RADIANS
    mesh.rotation.y = dampAngle(currentRotation, rotation, delta) * RADIANS
  })

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      rotation={[0, initialRotation * RADIANS, 0]}
      name="golem"
      aria-label="Gólem del jugador"
      castShadow
    >
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </mesh>
  )
}

export function Golem({ position = [0, 0.5, 0], rotation = 0 }) {
  const reducedMotion = useReducedMotion()

  return (
    <Suspense fallback={null}>
      <GolemModel position={position} rotation={rotation} reducedMotion={reducedMotion} />
    </Suspense>
  )
}
