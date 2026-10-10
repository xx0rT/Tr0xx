import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, EASE, reduced } from '../lib/gsap'
import SkillsCloud from './SkillsCloud'
import { skills } from '../data/content'

export default function Skills({ onMount }) {
  const root = useRef(null)
  useEffect(() => {
    onMount?.()
  }, [onMount])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.skills-list li', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: EASE,
        stagger: 0.04,
        scrollTrigger: { trigger: '.skills-list', start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={root} className="skills screen">
      <p className="section-index">(03) Toolbox</p>
      <div className="skills-grid">
        <div>
          <h2 className="skills-title">Tools I reach for.</h2>
          <ul className="skills-list">
            {skills.map((s) => (
              <li key={s.name}>{s.name.toLowerCase()}</li>
            ))}
          </ul>
        </div>
        <div className="skills-stage" data-cursor="Drag">
          <SkillsCloud />
        </div>
      </div>
    </section>
  )
}
