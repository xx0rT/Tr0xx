import useReveal from '../hooks/useReveal'

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" ref={ref}>
      <p className="section-label reveal">About</p>
      <h2 className="section-title reveal">A bit about me</h2>
      <div className="about-grid">
        <div className="card about-text reveal">
          <p>
            I work with a classic tech stack, including <strong>JavaScript</strong>,{' '}
            <strong>Node.js</strong>, <strong>React</strong>, <strong>HTML</strong>, and other
            common tools. I enjoy building clean, functional applications and learning new
            technologies that help me improve my skills.
          </p>
          <p>
            Whether it's front-end or back-end development, I like solving problems and turning
            ideas into real, working projects.
          </p>
          <p>
            I graduated from the High School of Aviation and Computer Technology in 2025. My next
            goal is to continue my education at a university and deepen my knowledge in the field.
          </p>
        </div>

        <div className="card about-facts reveal">
          <img src="/assets/workingguy.png" alt="Troxx avatar" />
          <div className="fact-list">
            <div className="fact-row">
              <span className="k">Name</span>
              <span className="v">Denis "Troxx"</span>
            </div>
            <div className="fact-row">
              <span className="k">Role</span>
              <span className="v">Fullstack Developer</span>
            </div>
            <div className="fact-row">
              <span className="k">Education</span>
              <span className="v">Aviation & Computer Tech '25</span>
            </div>
            <div className="fact-row">
              <span className="k">Next goal</span>
              <span className="v">University</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
