/* Tiny store for the fullscreen preview: any project frame can open it,
   the single <PreviewModal> renders it. `from` is the frame's rect, so the
   modal can grow out of it and shrink back into it. */
const listeners = new Set()
let state = null

export const openPreview = (project, from, device = 'desktop') => {
  state = { project, from, device }
  listeners.forEach((fn) => fn(state))
}
export const closePreview = () => {
  state = null
  listeners.forEach((fn) => fn(state))
}
export const subscribePreview = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
