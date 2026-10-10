import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, SplitText, reduced, isTouch } from '../lib/gsap'
import { projects } from '../data/content'
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

/* A small reel of the work below: each project wipes in over the last,
   and a click jumps straight to its panel. It only runs while the hero
   is on screen. */
function Reel({ ready }) {
  const root = useRef(null)
  const [i, setI] = useState(0)
  const p = projects[i]

  useEffect(() => {
    if (!ready || reduced()) return
    const el = root.current
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const id = setInterval(() => visible && setI((n) => (n + 1) % projects.length), 2600)
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [ready])

  useLayoutEffect(() => {
    if (reduced() || i === 0) return
    const el = root.current
    const img = el.querySelector(`[data-shot="${i}"]`)
    gsap.set(el.querySelectorAll('[data-shot]'), { zIndex: 0 })
    gsap.set(el.querySelector(`[data-shot="${(i - 1 + projects.length) % projects.length}"]`), { zIndex: 1 })
    gsap.set(img, { zIndex: 2 })
    gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: EASE })
    gsap.fromTo(el.querySelectorAll('.reel-mask > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: EASE, stagger: 0.05 })
  }, [i])

  return (
    <button ref={root} className="reel" onClick={() => goTo(`work-${p.slug}`)} data-cursor="View" aria-label={`See ${p.title}`}>
      <span className="reel-frame">
        {projects.map((proj, n) => (
          <img key={proj.slug} data-shot={n} src={proj.shots.desktop} alt="" draggable={false} style={{ zIndex: n === 0 ? 2 : 0 }} />
        ))}
      </span>
      <span className="reel-cap">
        <span className="reel-mask"><span className="reel-num">{String(i + 1).padStart(2, '0')}</span></span>
        <span className="reel-mask"><span className="reel-title">{p.title}</span></span>
        <span className="reel-mask"><span className="reel-kind">{p.kind}</span></span>
      </span>
    </button>
  )
}

/* Full-viewport opener. The name runs edge to edge along the bottom and
   sets letter by letter once the intro lifts; letters lean towards the
   cursor, and as you scroll away they sink at different speeds. */
export default function Hero({ ready }) {
  const root = useRef(null)
  const mark = useRef(null)
  const role = useRef(null)
  const time = useClock()

  /* Fit the mark to the content width exactly. */
  useLayoutEffect(() => {
    const el = mark.current
    const fit = () => {
      el.style.fontSize = '100px'
      const w = el.scrollWidth
      const target = el.parentElement.clientWidth
      el.style.fontSize = `${(100 * target) / w}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || !ready) return
    const ctx = gsap.context(() => {
      if (reduced()) return
      const letters = el.querySelectorAll('.hero-letter')
      const lede = SplitText.create(el.querySelector('.hero-lede'), { type: 'lines', mask: 'lines' })
      gsap.timeline()
        .from(letters, { yPercent: 105, duration: 1.4, ease: EASE, stagger: 0.07 })
        .from('.hero-meta > *', { y: 24, opacity: 0, duration: 1, ease: EASE, stagger: 0.08 }, 0.3)
        .from(lede.lines, { yPercent: 110, duration: 1.1, ease: EASE, stagger: 0.08 }, 0.4)
        .from('.reel', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: EASE }, 0.5)
        .from('.hero-scroll', { opacity: 0, duration: 0.8 }, 0.9)

      /* Scroll away: each letter sinks at its own rate. */
      gsap.utils.toArray('.hero-mask', el).forEach((m, n) => {
        gsap.to(m, {
          yPercent: [18, 42, 26, 50, 32][n] ?? 30,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      gsap.to('.hero-top', {
        yPercent: -25,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '60% top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [ready])

  /* Letters lift towards the pointer. */
  useEffect(() => {
    if (!ready || reduced() || isTouch()) return
    const el = root.current
    const masks = [...el.querySelectorAll('.hero-mask')]
    const lifts = masks.map((m) => gsap.quickTo(m, 'y', { duration: 0.7, ease: 'power3' }))
    const move = (e) => {
      masks.forEach((m, n) => {
        const r = m.getBoundingClientRect()
        const d = Math.abs(e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.2)
        const near = e.clientY > r.top - 200
        lifts[n](near ? -Math.max(0, 1 - d) * r.height * 0.07 : 0)
      })
    }
    const leave = () => lifts.forEach((q) => q(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
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
      <div className="hero-top">
        <div className="hero-meta">
          <span>Denis “Troxx”</span>
          <span className="hero-role-mask">
            <span ref={role} className="hero-role">{roles[0]}</span>
          </span>
          <span>Prague · {time}</span>
        </div>

        <div className="hero-body">
          <p className="hero-lede">
            I design and build fast, clean web applications — marketplaces, e-commerce and booking
            systems — from the database to the last animation.
          </p>
          <div className="hero-side">
            <Reel ready={ready} />
            <button className="hero-scroll" onClick={() => goTo('about')}>
              <span>Scroll</span>
              <i />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-mark-wrap">
        <h1 ref={mark} className="hero-mark" aria-label="Troxx">
          {'TROXX'.split('').map((c, i) => (
            <span key={i} className="hero-mask" aria-hidden>
              <span className="hero-letter">{c}</span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
