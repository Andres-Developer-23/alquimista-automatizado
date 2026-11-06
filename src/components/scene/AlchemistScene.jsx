import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Golem } from './Golem'

const FLOOR_SIZE = 12
const WALL_HEIGHT = 2.2
const WALL_THICKNESS = 0.25
const BOARD_EDGE = 2.6

export function AlchemistScene({
  golemPosition = [0, 0.5, 0],
  golemRotation = 0,
  goal = null,
  obstacles = [],
}) {
  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 45 }} shadows>
      <color attach="background" args={['#1a1814']} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 7, 0]} intensity={0.9} distance={20} decay={1.5} />

      {/* Suelo de madera de la tienda */}
      <mesh
        name="floor"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Alfombra central de la tienda */}
      <mesh
        name="rug"
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#7c4d26" roughness={0.95} metalness={0} />
      </mesh>

      {/* Mostrador de la tienda */}
      <mesh
        name="counter"
        position={[0, 0.75, -2.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[8, 1.5, 1.2]} />
        <meshStandardMaterial color="#6b5b4b" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Tapa del mostrador */}
      <mesh
        name="counter-top"
        position={[0, 1.55, -2.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[8.4, 0.15, 1.4]} />
        <meshStandardMaterial color="#5a4a3d" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Estante izquierdo */}
      <mesh
        name="shelf-left"
        position={[-2.0, 0.9, -2.0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.4, 1.8, 0.4]} />
        <meshStandardMaterial color="#6b5b4b" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Estante derecho */}
      <mesh
        name="shelf-right"
        position={[2.0, 0.9, -2.0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.4, 1.8, 0.4]} />
        <meshStandardMaterial color="#6b5b4b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Productos en exhibición sobre el mostrador */}
      <mesh
        name="product-1"
        position={[-2.5, 1.62, -2.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.35, 0.5, 0.35]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh
        name="product-2"
        position={[-1.2, 1.62, -2.1]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.25, 0.6, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh
        name="product-3"
        position={[0.2, 1.62, -2.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#10b981" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh
        name="product-4"
        position={[1.6, 1.62, -2.1]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Productos en los estantes */}
      <mesh name="shelf-product-1" position={[-2.6, 1.7, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh name="shelf-product-2" position={[-2.0, 1.7, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh name="shelf-product-3" position={[2.0, 1.7, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#a855f7" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh name="shelf-product-4" position={[2.6, 1.7, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.5} metalness={0.4} />
      </mesh>

      <gridHelper args={[5, 5, '#9ca3af', '#6b7280']} />

      {obstacles.map((obstacle) => (
        <mesh
          key={`${obstacle.x},${obstacle.y}`}
          name="obstacle"
          position={[obstacle.x, 0.35, obstacle.y]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.35]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
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
