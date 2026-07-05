import useReveal from '../hooks/useReveal'
import SkillsCloud from './SkillsCloud'
import { skills } from '../data/content'

export default function Skills() {
  const ref = useReveal()

  return (
    <section id="skills" ref={ref}>
      <p className="section-label reveal">Skills</p>
      <h2 className="section-title reveal">Tools & technologies</h2>
      <div className="card skills-canvas-wrap reveal">
        <SkillsCloud />
        <span className="skills-canvas-hint">DRAG TO ROTATE</span>
      </div>
      <div className="skills-legend reveal">
        {skills.map((skill) => (
          <span key={skill.name}>{skill.name}</span>
        ))}
      </div>
    </section>
  )
}
