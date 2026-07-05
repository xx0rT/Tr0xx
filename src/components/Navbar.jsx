import { useState, useEffect } from 'react'
import asset from '../lib/asset'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="navbar">
      <a href="#home" className="navbar-logo">
        <img src={asset('/assets/workingguy.png')} alt="Troxx avatar" />
        Troxx
      </a>

      <ul className={`navbar-links ${open ? 'open' : ''}`}>
        {tabs.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={active === id ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        {open ? '✕' : '☰'}
      </button>
    </nav>
  )
}
