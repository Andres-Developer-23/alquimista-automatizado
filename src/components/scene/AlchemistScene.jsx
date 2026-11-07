import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Golem } from './Golem'

const FLOOR_SIZE = 12
const BOARD_MIN = -2
const BOARD_MAX = 2
const TILE_SIZE = 0.92
const PLANTER_COLORS = { empty: '#3f2d1b', planted: '#2f5d2a', grown: '#3f8f37' }

// Genera las baldosas de piedra del tablero 5x5.
function boardTiles() {
  const tiles = []
  for (let x = BOARD_MIN; x <= BOARD_MAX; x += 1) {
    for (let y = BOARD_MIN; y <= BOARD_MAX; y += 1) {
      // Sutil variación de tono para simular losas gastadas.
      const shade = (x + y) % 2 === 0 ? '#a8a29e' : '#9a938c'
      tiles.push({ x, y, shade })
    }
  }
  return tiles
}

const TILES = boardTiles()

export function AlchemistScene({
  golemPosition = [0, 0, 0],
  golemRotation = 0,
  isMoving = false,
  goal = null,
  obstacles = [],
  planters = [],
  stations = [],
  plantersState = {},
}) {
  const planterKey = (p) => `${p.x},${p.y}`
  const hopper = stations.find((station) => station.type === 'hopper')

  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 45 }} shadows>
      <color attach="background" args={['#14120f']} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 7, 0]} intensity={0.9} distance={20} decay={1.5} />

      {/* Suelo base de piedra del laboratorio */}
      <mesh
        name="floor"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#6b655e" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Baldosas de piedra del tablero 5x5 */}
      {TILES.map((tile) => (
        <mesh
          key={`tile-${tile.x}-${tile.y}`}
          name="board-tile"
          position={[tile.x, 0.012, tile.y]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
          <meshStandardMaterial color={tile.shade} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}

      {/* Macetas mágicas: parches de tierra donde se planta y se cosecha */}
      {planters.map((planter) => {
        const state = plantersState[planterKey(planter)] ?? 'empty'
        return (
          <group key={planterKey(planter)} name="planter" position={[planter.x, 0, planter.y]}>
            {/* Caja de madera */}
            <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.12, 0.8]} />
              <meshStandardMaterial color="#5a4632" roughness={0.9} metalness={0.05} />
            </mesh>
            {/* Tierra */}
            <mesh position={[0, 0.13, 0]} receiveShadow>
              <boxGeometry args={[0.66, 0.04, 0.66]} />
              <meshStandardMaterial color={PLANTER_COLORS[state]} roughness={1} metalness={0} />
            </mesh>
            {/* Planta según el estado de crecimiento */}
            {state === 'planted' && (
              <mesh position={[0, 0.2, 0]} castShadow>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#2f7d3a" roughness={0.8} />
              </mesh>
            )}
            {state === 'grown' && (
              <group position={[0, 0.15, 0]}>
                <mesh position={[0, 0.1, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.03, 0.2, 6]} />
                  <meshStandardMaterial color="#2f7d3a" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.24, 0]} castShadow>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#4ade80" roughness={0.7} />
                </mesh>
              </group>
            )}
          </group>
        )
      })}

      {/* Estación fija: caldero humeante (meta) */}
      {goal && (
        <group name="cauldron-station" position={[goal.x, 0, goal.y]}>
          <mesh name="cauldron" position={[0, 0.28, 0]} castShadow receiveShadow>
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

      {/* Estación fija: tolva/cofre para enviar la poción terminada */}
      {hopper && (
        <group name="hopper-station" position={[hopper.x, 0, hopper.y]}>
          {/* Cofre */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.44, 0.5]} />
            <meshStandardMaterial color="#7a5230" roughness={0.85} metalness={0.1} />
          </mesh>
          {/* Tapa del cofre */}
          <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.1, 0.52]} />
            <meshStandardMaterial color="#6b4526" roughness={0.85} metalness={0.1} />
          </mesh>
          {/* Cerradura */}
          <mesh position={[0, 0.3, 0.26]}>
            <boxGeometry args={[0.12, 0.14, 0.04]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Obstáculos: rocas que bloquean el camino */}
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

      <Golem position={golemPosition} rotation={golemRotation} isMoving={isMoving} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={24}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
