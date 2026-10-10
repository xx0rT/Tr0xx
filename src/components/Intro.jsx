import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, reduced } from '../lib/gsap'

/* A short curtain: a counter runs to 100 while the name sets, then the
   whole panel lifts away. Under 1.6 s, and skipped for reduced motion —
   it is a welcome, not a wait. */
export default function Intro({ onDone }) {
  const root = useRef(null)
  const count = useRef(null)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (reduced()) {
      setGone(true)
      onDone?.()
      return
    }
    document.documentElement.classList.add('is-loading')
    const n = { v: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove('is-loading')
        setGone(true)
      },
    })
    tl.from(el.querySelectorAll('.intro-letter'), { yPercent: 110, duration: 0.9, ease: EASE, stagger: 0.05 }, 0)
      .to(n, {
        v: 100,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0')
        },
      }, 0)
      .to(el.querySelectorAll('.intro-letter'), { yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.03 }, 1.05)
      .add(() => onDone?.(), 1.35)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 1.3)
    return () => {
      tl.kill()
      document.documentElement.classList.remove('is-loading')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="intro" aria-hidden>
      <div className="intro-word">
        {'TROXX'.split('').map((c, i) => (
          <span key={i} className="intro-mask">
            <span className="intro-letter">{c}</span>
          </span>
        ))}
      </div>
      <span ref={count} className="intro-count">000</span>
    </div>
  )
}
