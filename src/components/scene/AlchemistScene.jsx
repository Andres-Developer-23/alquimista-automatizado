import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Golem } from './Golem'

export function AlchemistScene() {
  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <gridHelper args={[5, 5, '#64748b', '#334155']} />
      <Golem />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
