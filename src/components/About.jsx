import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText, reduced } from '../lib/gsap'

/* The path so far, oldest first. `now` marks where the line ends today. */
const road = [
  { when: '2025', what: 'High School of Aviation & Computer Technology', sub: 'Graduated' },
  { when: 'Now', what: 'Information Technology', sub: 'University of Finance and Administration (VŠFS)', now: true },
  { when: 'Alongside', what: 'Fullstack developer', sub: 'Marketplaces, e-commerce and booking systems for clients' },
]

/* One statement that lights up word by word as it scrolls through the
   viewport, then the roadmap: its line draws as you scroll and each stop
   lights up when the line reaches it. Horizontal on wide screens,
   vertical on phones. */
export default function About() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const split = SplitText.create('.about-statement', { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )

      const track = el.querySelector('.road')
      const fill = el.querySelector('.road-fill')
      const steps = gsap.utils.toArray('.road-step', el)

      const build = (vertical) => {
        /* Where each stop sits along the track, as a fraction of it. */
        const at = (i) => {
          const r = track.getBoundingClientRect()
          const n = steps[i].querySelector('.road-node').getBoundingClientRect()
          return vertical ? (n.top + n.height / 2 - r.top) / r.height : (n.left + n.width / 2 - r.left) / r.width
        }
        const axis = vertical ? 'scaleY' : 'scaleX'
        gsap.set(fill, { [axis]: 0 })
        gsap.set(steps, { opacity: 0.3 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: vertical ? 'top 75%' : 'top 85%',
            end: vertical ? 'bottom 55%' : 'top 35%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        steps.forEach((step, i) => {
          tl.to(fill, { [axis]: () => at(i), ease: 'none', duration: i === 0 ? 0.2 : 1 })
          tl.to(step, { opacity: 1, duration: 0.25 }, '<75%')
          tl.to(step.querySelector('.road-node'), { scale: 1, backgroundColor: '#7aa2ff', borderColor: '#7aa2ff', duration: 0.25 }, '<')
        })
        /* …and on past the last stop: the road keeps going. */
        tl.to(fill, { [axis]: 1, ease: 'none', duration: 0.8 })
      }
      mm.add('(min-width: 761px)', () => build(false))
      mm.add('(max-width: 760px)', () => build(true))
    }, el)
    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="about" ref={root} className="about screen">
      <p className="section-index">(01) About</p>
      <p className="about-statement">
        I work across the whole stack — JavaScript, TypeScript, React, Node.js and the databases
        behind them. I like clean, functional products, interfaces that move with intent, and
        turning an idea into something real people use every day.
      </p>
      <ol className="road" aria-label="Roadmap">
        <li className="road-track" aria-hidden>
          <i className="road-fill" />
        </li>
        {road.map((s) => (
          <li key={s.what} className={`road-step${s.now ? ' is-now' : ''}`}>
            <span className="road-node" aria-hidden />
            <p className="road-when">{s.when}</p>
            <p className="road-what">{s.what}</p>
            <p className="road-sub">{s.sub}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
