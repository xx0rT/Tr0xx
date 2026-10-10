import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollSmoother, reduced } from '../lib/gsap'
import { closePreview, subscribePreview } from '../lib/preview'
import LiveFrame from './LiveFrame'

const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/* The project, fullscreen and interactive. It grows out of the frame you
   clicked (a clip-path from that rectangle to the whole viewport) and
   shrinks back into it on close. The page underneath stops scrolling
   while it is open; Esc closes. */
export default function PreviewModal() {
  const [state, setState] = useState(null)
  const [device, setDevice] = useState('desktop')
  const [shown, setShown] = useState(false)
  const root = useRef(null)
  const closing = useRef(false)

  useEffect(
    () =>
      subscribePreview((s) => {
        if (s) {
          setState(s)
          setDevice(s.device)
          setShown(true)
        }
      }),
    [],
  )

  const insetFrom = (rect) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    return `inset(${rect.top}px ${vw - rect.right}px ${vh - rect.bottom}px ${rect.left}px round 14px)`
  }

  useLayoutEffect(() => {
    if (!shown || !state) return
    const el = root.current
    ScrollSmoother.get()?.paused(true)
    document.documentElement.classList.add('modal-open')
    closing.current = false
    if (reduced()) {
      gsap.set(el, { clipPath: 'inset(0px 0px 0px 0px round 0px)' })
      return
    }
    gsap.timeline()
      .fromTo(
        el,
        { clipPath: insetFrom(state.from) },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.9, ease: 'expo.inOut' },
      )
      .from(el.querySelectorAll('.pm-bar > *'), { y: -16, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0.55)
  }, [shown, state])

  const close = () => {
    if (closing.current || !state) return
    closing.current = true
    const el = root.current
    const done = () => {
      setShown(false)
      setState(null)
      closePreview()
      ScrollSmoother.get()?.paused(false)
      document.documentElement.classList.remove('modal-open')
    }
    if (reduced()) return done()
    gsap.to(el, { clipPath: insetFrom(state.from), duration: 0.75, ease: 'expo.inOut', onComplete: done })
  }

  useEffect(() => {
    if (!shown) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!shown || !state) return null
  const { project } = state

  return (
    <div ref={root} className="pm" role="dialog" aria-modal="true" aria-label={`${project.title} — live preview`}>
      <div className="pm-bar">
        <div className="pm-title">
          <strong>{project.title}</strong>
          <span>{host(project.url)}</span>
        </div>
        <div className="pm-devices" role="tablist" aria-label="Device">
          {['desktop', 'mobile'].map((d) => (
            <button key={d} role="tab" aria-selected={device === d} className={device === d ? 'is-active' : ''} onClick={() => setDevice(d)}>
              {d === 'desktop' ? 'Desktop' : 'Mobile'}
            </button>
          ))}
        </div>
        <div className="pm-actions">
          <a className="btn btn-line" href={project.url} target="_blank" rel="noreferrer">
            Open site ↗
          </a>
          <button className="pm-close" onClick={close} aria-label="Close preview">
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`pm-stage pm-${device}`}>
        <div className={`pm-device ${device === 'mobile' ? 'device device-mobile' : ''}`}>
          <div className="device-screen">
            <LiveFrame
              url={project.url}
              shot={project.shots[device]}
              device={device}
              active
              interactive
              fill={device === 'desktop'}
              title={project.title}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
