import { describe, expect, it, vi } from 'vitest'

// Mock de @react-three/fiber y drei para evitar dependencia de WebGL en jsdom
vi.mock('@react-three/fiber', () => {
  const actual = vi.importActual('@react-three/fiber')
  return {
    ...actual,
    Canvas: ({ children }) => <div data-testid="r3f-canvas">{children}</div>,
    useFrame: (cb) => cb,
  }
})

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  useGLTF: () => ({ scene: { name: 'golem-scene', traverse: () => {} }, animations: [] }),
  useAnimations: () => ({ actions: {} }),
}))

import { render, screen } from '@testing-library/react'
import { AlchemistScene } from '../../src/components/scene/AlchemistScene'
import { Golem } from '../../src/components/scene/Golem'

describe('AlchemistScene - terreno y Gólem', () => {
  it('renderiza la escena con suelo, paredes, gólem y controles', () => {
    render(
      <AlchemistScene
        golemPosition={[0, 0, 0]}
        golemRotation={0}
        goal={{ x: 2, y: 2 }}
        obstacles={[{ x: 0, y: 0 }]}
      />
    )

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })

  it('renderiza el Gólem con posición y rotación', () => {
    render(<Golem position={[1, 0, -1]} rotation={90} isMoving />)

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
