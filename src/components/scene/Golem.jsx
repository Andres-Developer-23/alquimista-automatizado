export function Golem({ position = [0, 0.5, 0] }) {
  return (
    <mesh position={position} name="golem">
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2563eb" roughness={0.35} metalness={0.25} />
    </mesh>
  )
}
