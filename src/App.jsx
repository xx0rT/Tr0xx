import { lazy, Suspense, useLayoutEffect, useState } from 'react'
import { ScrollSmoother, ScrollTrigger, isTouch, reduced } from './lib/gsap'
import Cursor from './components/Cursor'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Contact from './components/Contact'
import PreviewModal from './components/PreviewModal'

/* The two Three.js sections are the heavy part of the bundle and sit
   far below the fold — they load after the page is interactive. */
const Skills = lazy(() => import('./components/Skills'))
const GithubStats = lazy(() => import('./components/GithubStats'))

export default function App() {
  const [ready, setReady] = useState(false)

  /* Smooth scrolling on desktop pointers only — touch keeps native,
     momentum scrolling, which no emulation beats. */
  useLayoutEffect(() => {
    if (reduced() || isTouch()) return
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
      normalizeScroll: false,
    })
    return () => smoother.kill()
  }, [])

  /* Lazy sections change the page height after mount. */
  const refresh = () => ScrollTrigger.refresh()

  return (
    <>
      <Cursor />
      <Intro onDone={() => setReady(true)} />
      <Navbar />
      <PreviewModal />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero ready={ready} />
            <About />
            <Work />
            <Suspense fallback={<div className="lazy-pad" />}>
              <Skills onMount={refresh} />
              <GithubStats />
            </Suspense>
          </main>
          <Contact />
        </div>
      </div>
    </>
  )
}
