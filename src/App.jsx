import { useLayoutEffect, useState } from 'react'
import { ScrollSmoother, isTouch, reduced } from './lib/gsap'
import Cursor from './components/Cursor'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Skills from './components/Skills'
import GithubStats from './components/GithubStats'
import Contact from './components/Contact'
import PreviewModal from './components/PreviewModal'

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
            <Skills />
            <GithubStats />
          </main>
          <Contact />
        </div>
      </div>
    </>
  )
}
