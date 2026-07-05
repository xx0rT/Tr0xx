import { useRef } from 'react'
import useReveal from '../hooks/useReveal'
import { projects } from '../data/content'

function TiltCard({ project }) {
  const cardRef = useRef(null)

  const handleMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`
  }

  const handleLeave = () => {
    cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      className="card project-card reveal"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="thumb">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
      </div>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="stack-tags">
          {project.stack.map((tag) => (
            <i key={tag}>{tag}</i>
          ))}
        </div>
        <a href={project.link} target="_blank" rel="noreferrer" className="card-link">
          Visit site ↗
        </a>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useReveal()

  return (
    <section id="projects" ref={ref}>
      <p className="section-label reveal">Projects</p>
      <h2 className="section-title reveal">Selected work</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <TiltCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
