import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { skills } from '../data/content'

// distribute points evenly on a sphere (fibonacci lattice)
function spherePositions(count, radius) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius])
  }
  return pts
}

function Cloud() {
  const group = useRef()
  const positions = useMemo(() => spherePositions(skills.length, 2.4), [])

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.15
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
  })

  return (
    <group ref={group}>
      {skills.map((skill, i) => (
        <Html
          key={skill.name}
          position={positions[i]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <img className="skill-chip-img" src={skill.icon} alt={skill.name} title={skill.name} />
        </Html>
      ))}
      <mesh>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshBasicMaterial color="#9d9da8" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

export default function SkillsCloud() {
  return (
    <div className="skills-canvas-wrap">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 50 }} dpr={[1, 2]}>
        <Cloud />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
      </Canvas>
      <span className="skills-canvas-hint">DRAG TO ROTATE</span>
    </div>
  )
}
