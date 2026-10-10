import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, EASE, reduced, isTouch } from '../lib/gsap'
import { skills } from '../data/content'

function Icon({ skill, className }) {
  return skill.mono ? (
    <i className={`${className} is-mono`} style={{ WebkitMaskImage: `url(${skill.icon})`, maskImage: `url(${skill.icon})` }} />
  ) : (
    <img className={className} src={skill.icon} alt="" draggable={false} />
  )
}

function Column({ title, items, offset = 0 }) {
  return (
    <div className="tools-col">
      <p className="tools-col-head">
        <span>{title}</span>
        <span>{String(items.length).padStart(2, '0')}</span>
      </p>
      <ol className="tools-list">
        {items.map((s, i) => (
          <li key={s.name} className="tool" data-tool={offset + i}>
            <span className="tool-num">{String(i + 1).padStart(2, '0')}</span>
            <Icon skill={s} className="tool-icon" />
            <span className="tool-name">
              <span className="tool-roll">
                <span>{s.name}</span>
                <span aria-hidden>{s.name}</span>
              </span>
            </span>
            <span className="tool-note">{s.note}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* Toolbox as an index: what I build with on the left, what I break
   things with on the right. Hovering a row brings its logo along with
   the cursor. */
export default function Skills() {
  const root = useRef(null)
  const float = useRef(null)
  const all = [...skills.build, ...skills.break]

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.tools-line > span', {
        yPercent: 110,
        duration: 1.2,
        ease: EASE,
        stagger: 0.12,
        scrollTrigger: { trigger: '.tools-title', start: 'top 80%' },
      })
      /* "break it." decodes itself from noise once. */
      const word = el.querySelector('.tools-break')
      const final = word.textContent
      const noise = '!<>-_/[]{}=+*^?#01'
      const p = { v: 0 }
      gsap.to(p, {
        v: 1,
        duration: 1.3,
        delay: 0.45,
        ease: 'power1.inOut',
        onUpdate: () => {
          const shown = Math.floor(p.v * final.length)
          word.textContent = [...final]
            .map((c, i) => (i < shown || c === ' ' ? c : noise[(Math.random() * noise.length) | 0]))
            .join('')
        },
        onComplete: () => (word.textContent = final),
        scrollTrigger: { trigger: '.tools-title', start: 'top 80%' },
      })
      gsap.utils.toArray('.tools-col', el).forEach((col) => {
        const rows = col.querySelectorAll('.tool')
        gsap.from(rows, {
          '--line': 0,
          duration: 1.1,
          ease: EASE,
          stagger: 0.05,
          scrollTrigger: { trigger: col, start: 'top 80%' },
        })
        gsap.from(col.querySelectorAll('.tool > *'), {
          yPercent: 100,
          opacity: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.012,
          scrollTrigger: { trigger: col, start: 'top 80%' },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  /* The floating logo. */
  useEffect(() => {
    if (reduced() || isTouch()) return
    const el = root.current
    const f = float.current
    const x = gsap.quickTo(f, 'x', { duration: 0.55, ease: 'power3' })
    const y = gsap.quickTo(f, 'y', { duration: 0.55, ease: 'power3' })
    let current = -1
    /* The section lives inside ScrollSmoother's transformed content, so
       `fixed` would not be fixed — position against the section itself. */
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x(e.clientX - r.left)
      y(e.clientY - r.top)
      const row = e.target.closest?.('[data-tool]')
      const n = row ? Number(row.dataset.tool) : -1
      if (n === current) return
      current = n
      f.querySelectorAll('[data-float]').forEach((node) => {
        node.style.opacity = Number(node.dataset.float) === n ? 1 : 0
      })
      gsap.to(f, { scale: n < 0 ? 0 : 1, rotate: n < 0 ? -8 : 0, duration: 0.5, ease: EASE })
    }
    const leave = () => {
      current = -1
      gsap.to(f, { scale: 0, duration: 0.4, ease: 'power3.out' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section id="skills" ref={root} className="tools screen">
      <p className="section-index">(03) Toolbox</p>
      <h2 className="tools-title">
        <span className="tools-line"><span>I build it.</span></span>
        <span className="tools-line">
          <span className="tools-dim">
            Then I try to <span className="tools-break">break it.</span>
          </span>
        </span>
      </h2>

      <div className="tools-cols">
        <Column title="Build" items={skills.build} />
        <Column title="Break" items={skills.break} offset={skills.build.length} />
      </div>

      <div ref={float} className="tools-float" aria-hidden>
        {all.map((s, n) => (
          <span key={s.name} data-float={n} className="tools-float-item">
            <Icon skill={s} className="tools-float-icon" />
          </span>
        ))}
      </div>
    </section>
  )
}
