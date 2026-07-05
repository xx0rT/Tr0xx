// prefix public-dir paths with Vite's base so they work under a subpath deploy
export default function asset(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
