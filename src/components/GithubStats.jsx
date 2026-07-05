import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useReveal from '../hooks/useReveal'
import { github } from '../data/content'

const LEVEL_COLORS = ['#1e1e24', '#0e4429', '#006d32', '#26a641', '#39d353']

const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Lua: '#000080',
  Astro: '#ff5a03',
}

// group the flat day list into GitHub-style weeks (columns starting on Sunday)
function toWeeks(contributions) {
  const weeks = []
  let week = []
  contributions.forEach((day) => {
    if (new Date(day.date).getDay() === 0 && week.length) {
      weeks.push(week)
      week = []
    }
    week.push(day)
  })
  if (week.length) weeks.push(week)
  return weeks
}

function streakStats(contributions) {
  let longest = 0
  let current = 0
  let bestDay = 0
  let activeDays = 0
  contributions.forEach((day) => {
    if (day.count > 0) {
      current += 1
      activeDays += 1
      if (current > longest) longest = current
      if (day.count > bestDay) bestDay = day.count
    } else {
      current = 0
    }
  })
  return { longest, bestDay, activeDays }
}

function Skyline({ weeks }) {
  const meshRef = useRef()
  const spacing = 0.34
  const size = 0.28

  const { count, maxCount } = useMemo(() => {
    let max = 1
    let n = 0
    weeks.forEach((week) =>
      week.forEach((day) => {
        n += 1
        if (day.count > max) max = day.count
      })
    )
    return { count: n, maxCount: max }
  }, [weeks])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    let i = 0
    weeks.forEach((week, w) => {
      week.forEach((day) => {
        const dayIdx = new Date(day.date).getDay()
        const h = 0.06 + (day.count / maxCount) * 2.6
        dummy.position.set(
          (w - weeks.length / 2) * spacing,
          h / 2,
          (dayIdx - 3) * spacing
        )
        dummy.scale.set(size, h, size)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(i, color.set(LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]))
        i += 1
      })
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [weeks, maxCount])

  const baseWidth = weeks.length * spacing + 0.8

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[baseWidth, 0.2, 7 * spacing + 0.8]} />
        <meshStandardMaterial color="#17171c" />
      </mesh>
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#7aa2ff" />
    </group>
  )
}

// shrink the skyline on narrow canvases so the full year stays visible
function FitToAspect({ full = 2.6, children }) {
  const aspect = useThree((state) => state.size.width / state.size.height)
  return <group scale={Math.min(1, aspect / full)}>{children}</group>
}

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function GithubStats() {
  const ref = useReveal()
  const [contrib, setContrib] = useState(null)
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch(github.contributionsApi).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(github.userApi)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`https://api.github.com/users/${github.username}/repos?per_page=100&sort=pushed`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([contribData, userData, repoData]) => {
        if (!alive) return
        setContrib(contribData)
        setUser(userData)
        setRepos(Array.isArray(repoData) ? repoData : null)
      })
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [])

  const weeks = useMemo(() => (contrib ? toWeeks(contrib.contributions) : null), [contrib])
  const streaks = useMemo(
    () => (contrib ? streakStats(contrib.contributions) : null),
    [contrib]
  )

  const recentRepos = useMemo(
    () => (repos ? repos.filter((r) => !r.fork).slice(0, 6) : null),
    [repos]
  )

  const languages = useMemo(() => {
    if (!repos) return null
    const counts = {}
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }))
  }, [repos])

  const stats = [
    { label: 'Contributions / year', value: contrib?.total.lastYear.toLocaleString() },
    { label: 'Longest streak', value: streaks ? `${streaks.longest} days` : null },
    { label: 'Best day', value: streaks ? `${streaks.bestDay} commits` : null },
    { label: 'Active days', value: streaks ? `${streaks.activeDays}` : null },
    { label: 'Public repos', value: user?.public_repos },
    { label: 'On GitHub since', value: user ? new Date(user.created_at).getFullYear() : null },
  ]

  return (
    <section id="github" ref={ref}>
      <p className="section-label reveal">GitHub</p>
      <h2 className="section-title reveal">A year of contributions, in 3D</h2>

      <div className="card gh-skyline-wrap reveal">
        {error && <p className="gh-error">Couldn't reach the GitHub API — check back later.</p>}
        {!error && !weeks && <p className="gh-loading">Fetching contribution data…</p>}
        {weeks && (
          <Canvas camera={{ position: [0, 6.5, 12.5], fov: 42 }} dpr={[1, 2]}>
            <FitToAspect>
              <Skyline weeks={weeks} />
            </FitToAspect>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.8}
              minPolarAngle={0.6}
              maxPolarAngle={1.45}
            />
          </Canvas>
        )}
        <span className="gh-skyline-hint">DRAG TO ROTATE</span>
      </div>

      <div className="gh-stats-row reveal">
        {stats.map(({ label, value }) => (
          <div className="gh-stat" key={label}>
            <span className="label">{label}</span>
            <span className="value">{value ?? '—'}</span>
          </div>
        ))}
      </div>

      {(recentRepos?.length || languages?.length) && (
        <div className="gh-detail-grid reveal">
          {recentRepos?.length > 0 && (
            <div className="card gh-repos">
              <h3>Recent repositories</h3>
              {recentRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="gh-repo-row"
                >
                  <div>
                    <span className="repo-name">{repo.name}</span>
                    {repo.description && <span className="repo-desc">{repo.description}</span>}
                  </div>
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="repo-lang">
                        <i
                          style={{ background: LANG_COLORS[repo.language] || '#9d9da8' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="repo-time">{timeAgo(repo.pushed_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {languages?.length > 0 && (
            <div className="card gh-langs">
              <h3>Languages</h3>
              {languages.map(({ name, pct }) => (
                <div className="lang-row" key={name}>
                  <span className="lang-name">{name}</span>
                  <div className="lang-bar">
                    <div
                      className="lang-fill"
                      style={{
                        width: `${pct}%`,
                        background: LANG_COLORS[name] || '#9d9da8',
                      }}
                    />
                  </div>
                  <span className="lang-pct">{pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
