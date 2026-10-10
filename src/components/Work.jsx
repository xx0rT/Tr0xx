import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, ScrollTrigger, SplitText, reduced } from '../lib/gsap'
import { projects } from '../data/content'
import { openPreview } from '../lib/preview'
import LiveFrame from './LiveFrame'

const TABS = [
  { id: 'live', label: 'Live' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' },
]
const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

function ProjectPanel({ project, index, total }) {
  const root = useRef(null)
  const frame = useRef(null)
  const [tab, setTab] = useState('live')
  const [near, setNear] = useState(false)

  /* The live iframe exists only while the panel is within a screen of
     the viewport. */
  useEffect(() => {
    const el = root.current
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Tab change: the stage dips and comes back with the new view. */
  const switchTo = (id) => {
    if (id === tab) return
    if (reduced()) return setTab(id)
    gsap.to(frame.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setTab(id)
        gsap.fromTo(frame.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: EASE })
      },
    })
  }

  const open = () => {
    const rect = frame.current.getBoundingClientRect()
    openPreview(project, rect, tab === 'mobile' ? 'mobile' : 'desktop')
  }

  const device = tab === 'mobile' ? 'mobile' : 'desktop'
  return (
    <article ref={root} className="panel" data-panel>
      <div className="panel-inner" data-panel-inner>
        <div className="panel-info">
          <p className="panel-index">
            {String(index + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span>
          </p>
          <h3 className="panel-title">{project.title}</h3>
          <p className="panel-kind">{project.kind}</p>
          <p className="panel-desc">{project.description}</p>
          <ul className="panel-stack">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="panel-actions">
            <button className="btn btn-primary" onClick={open}>
              Open live preview
            </button>
            <a className="btn btn-line" href={project.url} target="_blank" rel="noreferrer">
              {host(project.url)} ↗
            </a>
          </div>
        </div>

        <div className="panel-media">
          <div className="tabs" role="tablist" aria-label={`${project.title} preview`}>
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'is-active' : ''}
                onClick={() => switchTo(t.id)}
              >
                {t.id === 'live' && <i className="live-dot" />}
                {t.label}
              </button>
            ))}
          </div>

          <div ref={frame} className={`device device-${device}`} data-cursor="Open" onClick={open}>
            {device === 'desktop' && (
              <div className="device-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="device-url">{host(project.url)}</span>
              </div>
            )}
            <div className="device-screen">
              {tab === 'desktop' ? (
                <img src={project.shots.desktop} alt={`${project.title} — desktop`} className="live-shot" loading="lazy" />
              ) : (
                <LiveFrame
                  url={project.url}
                  shot={project.shots[device]}
                  device={device}
                  active={near}
                  title={project.title}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/* Projects as full-screen panels that stack: each one pins as it reaches
   the top and the next slides up over it, while the one underneath sinks
   back and dims. On narrow screens they simply follow one another. */
export default function Work() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      if (!reduced()) {
        const split = SplitText.create('.work-title', { type: 'lines', mask: 'lines' })
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: '.work-head', start: 'top 75%' },
        })
      }

      mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray('[data-panel]', el)
        panels.forEach((panel, i) => {
          const inner = panel.querySelector('[data-panel-inner]')
          if (i < panels.length - 1) {
            ScrollTrigger.create({ trigger: panel, start: 'top top', pin: true, pinSpacing: false })
            gsap.to(inner, {
              scale: 0.9,
              opacity: 0.35,
              filter: 'blur(2px)',
              ease: 'none',
              scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true },
            })
          }
          gsap.from(panel.querySelectorAll('.panel-info > *'), {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: EASE,
            stagger: 0.06,
            scrollTrigger: { trigger: panel, start: 'top 60%' },
          })
          gsap.from(panel.querySelector('.panel-media'), {
            yPercent: 12,
            opacity: 0,
            duration: 1.2,
            ease: EASE,
            scrollTrigger: { trigger: panel, start: 'top 65%' },
          })
        })
      })
    }, el)
    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="work" ref={root} className="work">
      <header className="work-head screen">
        <p className="section-index">(02) Selected work</p>
        <h2 className="work-title">
          Things I built,
          <br />
          live — not screenshots.
        </h2>
        <p className="work-note">
          Every frame below is the real website running. Switch to desktop or mobile, or open it
          fullscreen and click around.
        </p>
      </header>
      <div className="panels">
        {projects.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} total={projects.length} />
        ))}
      </div>
    </section>
  )
}
