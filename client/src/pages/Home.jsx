import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import styles from './Home.module.css'

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803']

const FEATURES = [
  { icon: '⚡', label: 'Activity', desc: 'Commit streaks & push frequency' },
  { icon: '🔬', label: 'CodeQuality', desc: 'README, license, tests detection' },
  { icon: '🌐', label: 'Diversity', desc: 'Languages & project categories' },
  { icon: '⭐', label: 'Community', desc: 'Stars, forks & followers' },
  { icon: '💼', label: 'Hiring Ready', desc: 'Bio, website, email completeness' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className="container">
          <span className={styles.logo}>DevScore</span>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>
              <span className="badge">⚡ GitHub Portfolio Analyser</span>
            </div>
            <h1 className={styles.headline}>
              Know your GitHub<br />
              <span className={styles.gradient}>score in seconds</span>
            </h1>
            <p className={styles.sub}>
              Enter any GitHub username and get a detailed report covering activity,
              code quality, project diversity, community impact, and hiring readiness.
              No sign-up required.
            </p>

            <SearchBar />

            <div className={styles.examples}>
              <span className={styles.exLabel}>Try: </span>
              {EXAMPLE_USERS.map((u) => (
                <button
                  key={u}
                  className={styles.exBtn}
                  onClick={() => navigate(`/report/${u}`)}
                >
                  @{u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <p className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>
            5 scoring categories
          </p>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.label} className={`card ${styles.featureCard}`}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureLabel}>{f.label}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <span>Built with the GitHub REST API · No AI · No paid APIs · 100% free</span>
        </div>
      </footer>
    </div>
  )
}
