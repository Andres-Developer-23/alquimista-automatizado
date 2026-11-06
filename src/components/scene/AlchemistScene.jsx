import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Golem } from './Golem'

const FLOOR_SIZE = 12
const WALL_HEIGHT = 1.6
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
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 8, 0]} intensity={0.8} distance={20} decay={1.5} />

      {/* Suelo del taller con patrón de baldosas */}
      <mesh
        name="floor"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#5b6a7a" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Patrón de baldosas sobre el suelo */}
      <gridHelper
        args={[FLOOR_SIZE, FLOOR_SIZE, '#44505a', '#333c44']}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Paredes bajas del taller */}
      <mesh
        name="wall-back"
        position={[0, WALL_HEIGHT / 2, -BOARD_EDGE]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh
        name="wall-front"
        position={[0, WALL_HEIGHT / 2, BOARD_EDGE]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh
        name="wall-left"
        position={[-BOARD_EDGE, WALL_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh
        name="wall-right"
        position={[BOARD_EDGE, WALL_HEIGHT / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FLOOR_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
      </mesh>

      <gridHelper args={[5, 5, '#64748b', '#334155']} />

      {obstacles.map((obstacle) => (
        <mesh
          key={`${obstacle.x},${obstacle.y}`}
          name="obstacle"
          position={[obstacle.x, 0.35, obstacle.y]}
          castShadow
          receiveShadow
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
