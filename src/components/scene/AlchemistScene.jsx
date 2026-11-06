import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Golem } from './Golem'

export function AlchemistScene({
  golemPosition = [0, 0.5, 0],
  golemRotation = 0,
  goal = null,
  obstacles = [],
}) {
  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <gridHelper args={[5, 5, '#64748b', '#334155']} />

      {obstacles.map((obstacle) => (
        <mesh
          key={`${obstacle.x},${obstacle.y}`}
          name="obstacle"
          position={[obstacle.x, 0.35, obstacle.y]}
        >
          <dodecahedronGeometry args={[0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
        </mesh>
      ))}

      {goal && (
        <group name="goal" position={[goal.x, 0, goal.y]}>
          <mesh name="cauldron" position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.42, 0.32, 0.56, 20]} />
            <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.35} />
          </mesh>
          <mesh name="cauldron-rim" position={[0, 0.58, 0]}>
            <torusGeometry args={[0.42, 0.06, 10, 20]} />
            <meshStandardMaterial color="#f59e0b" emissive="#92400e" emissiveIntensity={0.7} />
          </mesh>
          <pointLight color="#fbbf24" distance={3} intensity={1.4} position={[0, 1, 0]} />
        </group>
      )}

      <Golem position={golemPosition} rotation={golemRotation} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
