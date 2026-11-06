import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { dampAxis } from './golemMovement'

export function Golem({ position = [0, 0.5, 0] }) {
  const meshRef = useRef(null)
  const [initialPosition] = useState(position)

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const [x, y, z] = position
    mesh.position.x = dampAxis(mesh.position.x, x, delta)
    mesh.position.y = dampAxis(mesh.position.y, y, delta)
    mesh.position.z = dampAxis(mesh.position.z, z, delta)
  })

  return (
    <mesh ref={meshRef} position={initialPosition} name="golem">
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2563eb" roughness={0.35} metalness={0.25} />
    </mesh>
  )
}
