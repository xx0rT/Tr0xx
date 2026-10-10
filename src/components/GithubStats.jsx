import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, EASE, reduced } from '../lib/gsap'
import { github } from '../data/content'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* A year of work as a flat grid that ripples in, the yearly total
   counting up beside it, then the repositories as an index. */
export default function GithubStats() {
  const root = useRef(null)
  const [contrib, setContrib] = useState(null)
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(false)
  const [hover, setHover] = useState(null)

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
  const streaks = useMemo(() => (contrib ? streakStats(contrib.contributions) : null), [contrib])
  const recentRepos = useMemo(() => (repos ? repos.filter((r) => !r.fork).slice(0, 6) : null), [repos])

  const languages = useMemo(() => {
    if (!repos) return null
    const counts = {}
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }))
  }, [repos])

  /* Month labels sit over the first week that starts in a new month. */
  const months = useMemo(() => {
    if (!weeks) return []
    const out = []
    let last = -1
    weeks.forEach((w, i) => {
      const m = new Date(w[0].date).getMonth()
      if (m !== last) {
        if (i < weeks.length - 2) out.push({ i, label: MONTHS[m] })
        last = m
      }
    })
    return out
  }, [weeks])

  const total = contrib?.total?.lastYear ?? null
  const stats = [
    { label: 'Longest streak', value: streaks ? `${streaks.longest}` : null, unit: 'days' },
    { label: 'Best day', value: streaks ? `${streaks.bestDay}` : null, unit: 'commits' },
    { label: 'Active days', value: streaks ? `${streaks.activeDays}` : null, unit: 'of 365' },
    { label: 'Public repos', value: user?.public_repos != null ? `${user.public_repos}` : null, unit: '' },
    { label: 'On GitHub since', value: user ? `${new Date(user.created_at).getFullYear()}` : null, unit: '' },
  ]

  /* Heading and labels — always present. */
  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.gh-headline > *', {
        yPercent: 110,
        duration: 1.2,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: { trigger: '.gh-headline', start: 'top 80%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  /* Data-driven parts animate once the data is in. */
  useLayoutEffect(() => {
    const el = root.current
    if (!el || !contrib) return
    if (reduced()) return
    const ctx = gsap.context(() => {
      const st = (trigger, start = 'top 80%') => ({ trigger, start })
      gsap.from('.gh-cell', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        stagger: { grid: 'auto', from: 'start', amount: 1.4 },
        scrollTrigger: st('.gh-graph'),
      })
      if (total != null) {
        const n = { v: 0 }
        const node = el.querySelector('.gh-total-num')
        gsap.to(n, {
          v: total,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => (node.textContent = Math.round(n.v).toLocaleString('en-US')),
          scrollTrigger: st('.gh-graph'),
        })
      }
      gsap.from('.gh-stat', {
        '--line': 0,
        y: 30,
        opacity: 0,
        duration: 1,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: st('.gh-stats'),
      })
      gsap.from('.gh-repo', {
        '--line': 0,
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: st('.gh-repos'),
      })
      gsap.from('.gh-lang-seg', {
        scaleX: 0,
        duration: 1.2,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: st('.gh-langs'),
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrib, repos])

  return (
    <section id="github" ref={root} className="gh screen">
      <p className="section-index">(04) GitHub</p>

      <div className="gh-head">
        <h2 className="gh-headline">
          <span className="gh-total-num">{total != null ? total.toLocaleString('en-US') : '—'}</span>
          <span className="gh-total-label">contributions in the last year</span>
        </h2>
        <a className="btn btn-line" href={github.profile} target="_blank" rel="noreferrer">
          @{github.username} ↗
        </a>
      </div>

      <div className="gh-graph-wrap">
        {error && <p className="gh-note">Couldn’t reach the GitHub API — check back later.</p>}
        {!error && !weeks && <p className="gh-note">Fetching contribution data…</p>}
        {weeks && (
          <div className="gh-graph" style={{ '--weeks': weeks.length }} onMouseLeave={() => setHover(null)}>
            <div className="gh-months">
              {months.map((m) => (
                <span key={m.i} style={{ gridColumn: m.i + 1 }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="gh-cells">
              {weeks.map((week, w) =>
                week.map((day) => (
                  <i
                    key={day.date}
                    className="gh-cell"
                    data-level={day.level}
                    style={{ gridColumn: w + 1, gridRow: new Date(day.date).getDay() + 1 }}
                    onMouseEnter={() => setHover(day)}
                  />
                ))
              )}
            </div>
            <p className="gh-readout">
              {hover ? (
                <>
                  <strong>{hover.count}</strong> {hover.count === 1 ? 'contribution' : 'contributions'} ·{' '}
                  {fmtDate(hover.date)}
                </>
              ) : (
                <>Hover a day</>
              )}
              <span className="gh-scale">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <i key={l} className="gh-cell is-static" data-level={l} />
                ))}
                More
              </span>
            </p>
          </div>
        )}
      </div>

      <dl className="gh-stats">
        {stats.map(({ label, value, unit }) => (
          <div className="gh-stat" key={label}>
            <dt>{label}</dt>
            <dd>
              {value ?? '—'}
              {value && unit && <small>{unit}</small>}
            </dd>
          </div>
        ))}
      </dl>

      {(recentRepos?.length > 0 || languages?.length > 0) && (
        <div className="gh-lower">
          {recentRepos?.length > 0 && (
            <div className="gh-repos">
              <p className="gh-sub">Recently pushed</p>
              {recentRepos.map((repo) => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="gh-repo" data-cursor="Open">
                  <span className="gh-repo-name">{repo.name}</span>
                  {repo.description && <span className="gh-repo-desc">{repo.description}</span>}
                  <span className="gh-repo-meta">
                    {repo.language && <span>{repo.language}</span>}
                    <span>{timeAgo(repo.pushed_at)}</span>
                  </span>
                </a>
              ))}
            </div>
          )}

          {languages?.length > 0 && (
            <div className="gh-langs">
              <p className="gh-sub">Languages by repository</p>
              <div className="gh-lang-bar">
                {languages.map(({ name, pct }, i) => (
                  <i key={name} className="gh-lang-seg" data-rank={i} style={{ flexGrow: pct }} />
                ))}
              </div>
              <ul className="gh-lang-list">
                {languages.map(({ name, pct }, i) => (
                  <li key={name}>
                    <i data-rank={i} />
                    <span>{name}</span>
                    <span>{pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
