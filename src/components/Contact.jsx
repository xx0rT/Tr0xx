import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, SplitText, reduced, isTouch } from '../lib/gsap'
import { goTo } from './Navbar'

const MAIL = 'txrxo.troxx@gmail.com'

/* The closing screen: one line, one address, and the name set huge,
   rising out from under the page edge. The mail link leans toward the
   pointer (magnetic) and copies itself on a long press-free click of the
   copy button. */
export default function Contact() {
  const root = useRef(null)
  const mail = useRef(null)
  const [copied, setCopied] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      const split = SplitText.create('.contact-title', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
      })
      gsap.from('.contact-row > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: '.contact-row', start: 'top 90%' },
      })
      gsap.from('.contact-letter', {
        yPercent: 100,
        duration: 1.3,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: { trigger: '.contact-mark', start: 'top 95%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  /* Magnetic mail link. */
  useEffect(() => {
    const el = mail.current
    if (!el || isTouch() || reduced()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the mailto link is right there */
    }
  }

  return (
    <footer id="contact" ref={root} className="contact">
      <div className="contact-body screen">
        <p className="section-index">(05) Contact</p>
        <h2 className="contact-title">
          Got a project?
          <br />
          Let’s build it.
        </h2>
        <a ref={mail} href={`mailto:${MAIL}`} className="contact-mail" data-cursor="Write">
          {MAIL}
        </a>
        <div className="contact-row">
          <button className="btn btn-line" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy address'}
          </button>
          <a className="btn btn-line" href="https://github.com/xx0rT" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <button className="btn btn-ghost" onClick={() => goTo('home')}>
            Back to top ↑
          </button>
        </div>
      </div>
      <div className="contact-mark" aria-hidden>
        {'TROXX'.split('').map((c, i) => (
          <span key={i} className="contact-mask">
            <span className="contact-letter">{c}</span>
          </span>
        ))}
      </div>
      <p className="contact-legal">Designed & built by Troxx · © {new Date().getFullYear()}</p>
    </footer>
  )
}
