import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, ScrollSmoother, reduced } from '../lib/gsap'

const links = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
]

/* Scroll to a section through ScrollSmoother when it is running, so the
   jump eases instead of snapping; native smooth scroll otherwise. */
export const goTo = (id) => {
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(`#${id}`, true, 'top top')
  else document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menu = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    /* Skills and GitHub are lazy-loaded, so they are not in the DOM yet
       on mount — keep looking until every section is being watched. */
    const watched = new Set()
    const attach = () => {
      ;['home', ...links.map((l) => l.id)].forEach((id) => {
        const el = document.getElementById(id)
        if (el && !watched.has(el)) {
          watched.add(el)
          io.observe(el)
        }
      })
      return watched.size === links.length + 1
    }
    attach()
    const timer = setInterval(() => attach() && clearInterval(timer), 800)
    return () => {
      clearInterval(timer)
      io.disconnect()
    }
  }, [])

  /* Mobile menu: a full-screen sheet that wipes down, links rising in. */
  useLayoutEffect(() => {
    const el = menu.current
    if (!el) return
    const items = el.querySelectorAll('.menu-link')
    if (reduced()) {
      gsap.set(el, { clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' })
      return
    }
    const tl = gsap.timeline()
    if (open) {
      tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
        .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: EASE, stagger: 0.06 }, 0.25)
    } else {
      tl.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.55, ease: 'expo.inOut' })
    }
    return () => tl.kill()
  }, [open])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  const pick = (id) => {
    setOpen(false)
    goTo(id)
  }

  return (
    <>
      <header className="nav">
        <button className="nav-logo" onClick={() => goTo('home')} aria-label="Back to top">
          TROXX
        </button>
        <nav className="nav-links" aria-label="Sections">
          {links.map((l) => (
            <button key={l.id} className={active === l.id ? 'is-active' : ''} onClick={() => goTo(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
        <a className="nav-cta" href="mailto:txrxo.troxx@gmail.com">
          Let’s talk
        </a>
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </header>

      <div ref={menu} className="menu" style={{ clipPath: 'inset(0 0 100% 0)' }} aria-hidden={!open}>
        <ul>
          {links.map((l, i) => (
            <li key={l.id} className="menu-mask">
              <button className="menu-link" onClick={() => pick(l.id)} tabIndex={open ? 0 : -1}>
                <span className="menu-num">0{i + 1}</span>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <a className="menu-mail" href="mailto:txrxo.troxx@gmail.com" tabIndex={open ? 0 : -1}>
          txrxo.troxx@gmail.com
        </a>
      </div>
    </>
  )
}
