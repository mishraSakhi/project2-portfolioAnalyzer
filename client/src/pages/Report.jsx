import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProfile } from '../utils/api'
import ScoreCard from '../components/ScoreCard'
import RadarChart from '../components/RadarChart'
import HeatMap from '../components/HeatMap'
import RepoList from '../components/RepoList'
import LangChart from '../components/LangChart'
import SearchBar from '../components/SearchBar'
import styles from './Report.module.css'

function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Analysing GitHub profile...</p>
      <span>Fetching repos, and computing scores</span>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error}>
      <span className={styles.errorIcon}>⚠️</span>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
        <Link to="/" className="btn btn-ghost">Go Home</Link>
      </div>
    </div>
  )
}

export default function Report() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchProfile(username)
      setData(result)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch profile.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [username])

  // Update OpenGraph meta tags dynamically
  useEffect(() => {
    if (!data) return
    document.title = `${data.name || data.username} — DevScore`
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.setAttribute('content', `${data.name || data.username}'s GitHub Score: ${data.scores?.overall}/100`)
    if (ogDesc) ogDesc.setAttribute('content', `Activity: ${data.scores?.activity} · Code Quality: ${data.scores?.codeQuality} · Diversity: ${data.scores?.diversity} · Community: ${data.scores?.community} · Hiring Ready: ${data.scores?.hiringReady}`)
  }, [data])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const profile = data ? {
    username: data.username,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    followers: data.followers,
    following: data.following,
    publicRepos: data.publicRepos,
    location: data.location,
    blog: data.blog,
    email: data.email,
  } : null

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navInner}>
            <Link to="/" className={styles.logo}>DevScore</Link>
            <SearchBar compact initialValue={username} />
          </div>
        </div>
      </nav>

      <div className="container">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={load} />}

        {data && !loading && (
          <div className={styles.content}>
            {/* Top bar */}
            <div className={styles.topBar}>
              <div className={styles.breadcrumb}>
                <Link to="/">Home</Link>
                <span>/</span>
                <span>@{username}</span>
              </div>
              <div className={styles.actions}>
                {data.fromCache && (
                  <span className="badge">📦 Cached</span>
                )}
                <button className="btn btn-ghost" onClick={copyLink}>
                  {copied ? '✓ Copied!' : '🔗 Share'}
                </button>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  View on GitHub ↗
                </a>
                <Link to="/compare" className="btn btn-ghost">
                  Compare ⇄
                </Link>
              </div>
            </div>

            {/* Main grid */}
            <div className={styles.mainGrid}>
              {/* Left column */}
              <div className={styles.left}>
                <ScoreCard scores={data.scores} profile={profile} />
                <HeatMap heatmapData={data.heatmapData} />
                <RepoList repos={data.topRepos} />
              </div>

              {/* Right column */}
              <div className={styles.right}>
                <RadarChart scores={data.scores} />
                <LangChart languages={data.languages} />

                {/* Score breakdown details */}
                {data.scoreDetails && (
                  <div className={`card ${styles.details}`}>
                    <p className="section-title">Score Breakdown</p>
                    <div className={styles.detailList}>
                      <div className={styles.detailItem}>
                        <span>Commits (last 90d)</span>
                        <strong>{data.scoreDetails.activity?.commitCount ?? '—'}</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Longest streak</span>
                        <strong>{data.scoreDetails.activity?.maxStreak ?? '—'} days</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Languages used</span>
                        <strong>{data.scoreDetails.diversity?.languages ?? '—'}</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Project categories</span>
                        <strong>{data.scoreDetails.diversity?.categories ?? '—'}</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Total stars</span>
                        <strong>{data.scoreDetails.community?.totalStars?.toLocaleString() ?? '—'}</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Total forks</span>
                        <strong>{data.scoreDetails.community?.totalForks?.toLocaleString() ?? '—'}</strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Has bio</span>
                        <strong style={{ color: data.scoreDetails.hiringReady?.hasBio ? 'var(--green)' : 'var(--red)' }}>
                          {data.scoreDetails.hiringReady?.hasBio ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Has website</span>
                        <strong style={{ color: data.scoreDetails.hiringReady?.hasWebsite ? 'var(--green)' : 'var(--red)' }}>
                          {data.scoreDetails.hiringReady?.hasWebsite ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Public email</span>
                        <strong style={{ color: data.scoreDetails.hiringReady?.hasEmail ? 'var(--green)' : 'var(--red)' }}>
                          {data.scoreDetails.hiringReady?.hasEmail ? 'Yes' : 'No'}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
