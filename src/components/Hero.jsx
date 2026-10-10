import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, SplitText, reduced } from '../lib/gsap'
import { goTo } from './Navbar'

const roles = ['Fullstack web developer', 'Security enthusiast', 'Problem solver']

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Prague' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* Full-viewport opener. The name is the whole composition: it sets letter
   by letter once the intro lifts, and as you scroll away it sinks and
   fades under the next section, so the page never "cuts". */
export default function Hero({ ready }) {
  const root = useRef(null)
  const mark = useRef(null)
  const role = useRef(null)
  const time = useClock()

  useLayoutEffect(() => {
    const el = root.current
    if (!el || !ready) return
    const ctx = gsap.context(() => {
      if (reduced()) return
      const letters = el.querySelectorAll('.hero-letter')
      const lede = SplitText.create(el.querySelector('.hero-lede'), { type: 'lines', mask: 'lines' })
      gsap.timeline()
        .from(letters, { yPercent: 105, duration: 1.4, ease: EASE, stagger: 0.07 })
        .from('.hero-meta > *', { y: 24, opacity: 0, duration: 1, ease: EASE, stagger: 0.08 }, 0.35)
        .from(lede.lines, { yPercent: 110, duration: 1.1, ease: EASE, stagger: 0.08 }, 0.45)
        .from('.hero-foot > *', { y: 20, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.08 }, 0.6)

      gsap.to(mark.current, {
        yPercent: 22,
        scale: 0.94,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [ready])

  /* Role rotator: the line slides up and the next one follows. */
  useEffect(() => {
    if (!ready) return
    const el = role.current
    let i = 0
    const swap = () => {
      i = (i + 1) % roles.length
      if (reduced()) {
        el.textContent = roles[i]
        return
      }
      gsap.timeline()
        .to(el, { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .add(() => {
          el.textContent = roles[i]
        })
        .fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: EASE })
    }
    const id = setInterval(swap, 2800)
    return () => clearInterval(id)
  }, [ready])

  return (
    <section id="home" ref={root} className="hero">
      <div className="hero-meta">
        <span>Denis “Troxx”</span>
        <span className="hero-role-mask">
          <span ref={role} className="hero-role">{roles[0]}</span>
        </span>
        <span>Prague · {time}</span>
      </div>

      <h1 ref={mark} className="hero-mark" aria-label="Troxx">
        {'TROXX'.split('').map((c, i) => (
          <span key={i} className="hero-mask" aria-hidden>
            <span className="hero-letter">{c}</span>
          </span>
        ))}
      </h1>

      <div className="hero-foot">
        <p className="hero-lede">
          I design and build fast, clean web applications — marketplaces, e-commerce and booking
          systems — from the database to the last animation.
        </p>
        <button className="hero-scroll" onClick={() => goTo('about')}>
          <span>Scroll</span>
          <i />
        </button>
      </div>
    </section>
  )
}
