import { useEffect, useRef } from 'react'
import { gsap, isTouch } from '../lib/gsap'

/* A dot that follows exactly and a ring that trails it. Over anything
   marked [data-cursor] the ring grows into a label ("Open", "Visit"). */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (isTouch()) return
    const d = dot.current
    const r = ring.current
    gsap.set([d, r], { xPercent: -50, yPercent: -50 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.08 })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08 })
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    let current = null
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button')
      if (target === current) return
      current = target
      const text = target?.getAttribute?.('data-cursor') || ''
      label.current.textContent = text
      gsap.to(r, {
        width: text ? 92 : target ? 54 : 34,
        height: text ? 92 : target ? 54 : 34,
        backgroundColor: text ? 'rgba(244,244,245,1)' : target ? 'rgba(244,244,245,0.08)' : 'rgba(244,244,245,0)',
        duration: 0.4,
        ease: 'expo.out',
      })
      gsap.to(d, { scale: text ? 0 : 1, duration: 0.3 })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.classList.add('has-cursor')
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span ref={label} />
      </div>
    </>
  )
}
