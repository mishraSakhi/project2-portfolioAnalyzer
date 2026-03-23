import { useState } from 'react'
import { Link } from 'react-router-dom'
import { compareProfiles } from '../utils/api'
import RadarChart from '../components/RadarChart'
import RepoList from '../components/RepoList'
import styles from './Compare.module.css'

const CATEGORIES = [
  { key: 'activity',    label: 'Activity',      color1: '#7c6aff', color2: '#ff6a9b' },
  { key: 'codeQuality', label: 'Code Quality',  color1: '#7c6aff', color2: '#ff6a9b' },
  { key: 'diversity',   label: 'Diversity',     color1: '#7c6aff', color2: '#ff6a9b' },
  { key: 'community',   label: 'Community',     color1: '#7c6aff', color2: '#ff6a9b' },
  { key: 'hiringReady', label: 'Hiring Ready',  color1: '#7c6aff', color2: '#ff6a9b' },
]

function UserInput({ label, value, onChange }) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      <div className={styles.inputWrap}>
        <span className={styles.at}>@</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="github-username"
          className={styles.input}
          spellCheck="false"
        />
      </div>
    </div>
  )
}

function CategoryRow({ label, s1, s2 }) {
  const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0
  return (
    <div className={styles.catRow}>
      <span className={`${styles.catScore} ${winner === 1 ? styles.winner : ''}`}>{s1}</span>
      <div className={styles.catMid}>
        <span className={styles.catLabel}>{label}</span>
        <div className={styles.bars}>
          <div className={styles.barLeft}>
            <div className={styles.barFill1} style={{ width: `${s1}%` }} />
          </div>
          <div className={styles.barRight}>
            <div className={styles.barFill2} style={{ width: `${s2}%` }} />
          </div>
        </div>
      </div>
      <span className={`${styles.catScore} ${winner === 2 ? styles.winner : ''}`}>{s2}</span>
    </div>
  )
}

export default function Compare() {
  const [u1, setU1] = useState('')
  const [u2, setU2] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCompare = async () => {
    if (!u1.trim() || !u2.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await compareProfiles(u1.trim(), u2.trim())
      setData(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare profiles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navInner}>
            <Link to="/" className={styles.logo}>DevScore</Link>
            <Link to="/" className="btn btn-ghost" style={{ fontSize: 13 }}>← Back</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>Compare Profiles</h1>
          <p className={styles.sub}>Enter two GitHub usernames to compare them side by side.</p>

          <div className={styles.form}>
            <UserInput label="User 1" value={u1} onChange={setU1} />
            <span className={styles.vs}>VS</span>
            <UserInput label="User 2" value={u2} onChange={setU2} />
            <button
              className="btn btn-primary"
              onClick={handleCompare}
              disabled={loading || !u1.trim() || !u2.trim()}
            >
              {loading ? 'Comparing...' : 'Compare'}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {data && !loading && (
            <div className={styles.results}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.userHead}>
                  {data.user1.profile?.avatar_url && (
                    <img src={data.user1.profile.avatar_url} alt="" className={styles.avatar} />
                  )}
                  <div>
                    <p className={styles.userName}>{data.user1.profile?.name || data.user1.username}</p>
                    <p className={styles.userHandle}>@{data.user1.username}</p>
                  </div>
                </div>
                <div className={styles.overallScores}>
                  <span className={styles.overall} style={{ color: '#7c6aff' }}>
                    {data.user1.scores.overall}
                  </span>
                  <span className={styles.overallLabel}>Overall</span>
                  <span className={styles.overall} style={{ color: '#ff6a9b' }}>
                    {data.user2.scores.overall}
                  </span>
                </div>
                <div className={styles.userHead} style={{ textAlign: 'right' }}>
                  <div>
                    <p className={styles.userName}>{data.user2.profile?.name || data.user2.username}</p>
                    <p className={styles.userHandle}>@{data.user2.username}</p>
                  </div>
                  {data.user2.profile?.avatar_url && (
                    <img src={data.user2.profile.avatar_url} alt="" className={styles.avatar} />
                  )}
                </div>
              </div>

              {/* Category breakdown */}
              <div className="card" style={{ marginBottom: 20 }}>
                <p className="section-title">Category Breakdown</p>
                <div className={styles.categories}>
                  {CATEGORIES.map((cat) => (
                    <CategoryRow
                      key={cat.key}
                      label={cat.label}
                      s1={data.user1.scores[cat.key] ?? 0}
                      s2={data.user2.scores[cat.key] ?? 0}
                    />
                  ))}
                </div>
              </div>

              {/* Radar overlay */}
              <RadarChart
                scores={data.user1.scores}
                compareScores={data.user2.scores}
                compareLabel={`@${data.user2.username}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
