import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText, reduced } from '../lib/gsap'

const facts = [
  ['Name', 'Denis “Troxx”'],
  ['Role', 'Fullstack developer'],
  ['Education', 'High School of Aviation & Computer Technology, ’25'],
  ['Next', 'University'],
]

/* One statement that lights up word by word as it scrolls through the
   viewport — read at the pace you scroll. */
export default function About() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
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
      gsap.from('.about-row', {
        '--line': 0,
        y: 24,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.about-facts', start: 'top 90%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="about screen">
      <p className="section-index">(01) About</p>
      <p className="about-statement">
        I work across the whole stack — JavaScript, TypeScript, React, Node.js and the databases
        behind them. I like clean, functional products, interfaces that move with intent, and
        turning an idea into something real people use every day.
      </p>
      <dl className="about-facts">
        {facts.map(([k, v]) => (
          <div key={k} className="about-row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
