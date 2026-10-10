import { useEffect, useRef, useState } from 'react'

/* A real website rendered at a real viewport size (1440×900 desktop,
   390×844 mobile) and scaled down to fit its box — so the preview is the
   actual layout, not a squeezed one. The screenshot sits underneath
   until the iframe has painted, and stays as the fallback.

   `active` controls whether the iframe exists at all: frames far from
   the viewport are unloaded, because seven live sites (one of them
   WebGL) at once would cost every visitor their battery. */
const VIEWPORT = { desktop: [1440, 900], mobile: [390, 844] }

/* `fill`: render at the box's own size instead of a fixed viewport —
   used fullscreen, where the site should simply BE the screen rather than
   a scaled-down 1440px page with bars at the sides. */
export default function LiveFrame({ url, shot, device = 'desktop', active, interactive = false, fill = false, title }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0)
  const [size, setSize] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [w, h] = fill && size ? size : VIEWPORT[device]

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (fill) {
        setSize([Math.round(width), Math.round(height)])
        setScale(1)
      } else {
        setScale(Math.min(width / w, height / h))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h, fill])

  useEffect(() => {
    if (!active) setLoaded(false)
  }, [active, url, device])

  return (
    <div ref={box} className="live">
      <img src={shot} alt={`${title} — ${device} screenshot`} className="live-shot" loading="lazy" draggable={false} />
      {active && scale > 0 && (
        <iframe
          key={`${url}-${device}`}
          src={url}
          title={`${title} — live preview`}
          loading="lazy"
          className={`live-frame ${loaded ? 'is-loaded' : ''}`}
          style={{
            width: w,
            height: h,
            transform: `translate(-50%, -50%) scale(${scale})`,
            pointerEvents: interactive ? 'auto' : 'none',
          }}
          tabIndex={interactive ? 0 : -1}
          onLoad={() => setTimeout(() => setLoaded(true), 450)}
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  )
}
