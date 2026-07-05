import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'

const roles = ['Fullstack Web Developer', 'Security Enthusiast', 'Problem Solver']

function useTypewriter(words, speed = 70, pause = 2000) {
  const [text, setText] = useState('')

  useEffect(() => {
    let word = 0
    let char = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = words[word]
      char += deleting ? -1 : 1
      setText(current.slice(0, char))

      let delay = deleting ? speed / 2 : speed
      if (!deleting && char === current.length) {
        deleting = true
        delay = pause
      } else if (deleting && char === 0) {
        deleting = false
        word = (word + 1) % words.length
        delay = speed * 3
      }
      timer = setTimeout(tick, delay)
    }

    timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [words, speed, pause])

  return text
}

function HeroObject() {
  const group = useRef()
  const knot = useRef()
  const width = useThree((state) => state.size.width)
  const fit = Math.min(1, width / 520)

  useFrame((state, delta) => {
    knot.current.rotation.x += delta * 0.18
    knot.current.rotation.y += delta * 0.24
    // ease toward the pointer
    const targetY = state.pointer.x * 0.45
    const targetX = -state.pointer.y * 0.3
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
  })

  return (
    <group ref={group} scale={fit}>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.9}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.15, 0.34, 220, 36]} />
          <meshStandardMaterial color="#26262e" metalness={0.55} roughness={0.28} />
        </mesh>
      </Float>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -3, -4]} intensity={1.4} color="#7aa2ff" />
      <pointLight position={[0, -4, 3]} intensity={12} color="#7aa2ff" distance={9} />
    </group>
  )
}

export default function Hero() {
  const typed = useTypewriter(roles)

  return (
    <section id="home" className="hero">
      <div>
        <p className="hero-kicker">Hi, I'm Denis — welcome.</p>
        <h1 className="hero-name">Troxx</h1>
        <p className="hero-role">
          {typed}
          <span className="caret" />
        </p>
        <p className="hero-info">
          A developer with a passion for technology and coding. I build clean, functional web
          applications from front to back.
        </p>
        <div className="hero-actions">
          <a href="mailto:txrxo.troxx@gmail.com" className="btn primary">
            Let's talk
          </a>
          <a href="https://github.com/xx0rT" target="_blank" rel="noreferrer" className="btn ghost">
            GitHub ↗
          </a>
        </div>
      </div>
      <div className="hero-canvas">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <HeroObject />
        </Canvas>
      </div>
      <p className="scroll-hint">
        <span>SCROLL ↓</span>
      </p>
    </section>
  )
}
