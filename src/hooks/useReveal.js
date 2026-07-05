import { useEffect, useRef } from 'react'

// adds .visible to .reveal elements when they enter the viewport
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.classList.contains('reveal')
      ? [root]
      : [...root.querySelectorAll('.reveal')]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    targets.forEach((t) => observer.observe(t))

    // observe .reveal elements that mount later (e.g. after an API response)
    const mutation = new MutationObserver(() => {
      root.querySelectorAll('.reveal:not(.visible)').forEach((t) => observer.observe(t))
    })
    mutation.observe(root, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])

  return ref
}
