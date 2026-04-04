import styles from './RepoList.module.css'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', Go: '#00add8', Rust: '#dea584',
  Ruby: '#701516', Swift: '#ffac45', Kotlin: '#A97BFF', HTML: '#e34c26',
  CSS: '#563d7c', default: '#7c6aff',
}

function StarIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function ForkIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M6 9v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
    </svg>
  )
}

export default function RepoList({ repos }) {
  if (!repos?.length) return null

  return (
    <div className={`card ${styles.card}`}>
      <p className="section-title">Top Repositories</p>
      <div className={styles.grid}>
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repo}
          >
            <div className={styles.repoHeader}>
              <span className={styles.repoName}>{repo.name}</span>
              {repo.language && (
                <span
                  className={styles.langPill}
                  style={{ background: (LANG_COLORS[repo.language] || LANG_COLORS.default) + '22',
                           color: LANG_COLORS[repo.language] || LANG_COLORS.default,
                           borderColor: (LANG_COLORS[repo.language] || LANG_COLORS.default) + '55' }}
                >
                  {repo.language}
                </span>
              )}
            </div>
            {repo.description && (
              <p className={styles.desc}>{repo.description}</p>
            )}
            {repo.topics?.length > 0 && (
              <div className={styles.topics}>
                {repo.topics.slice(0, 3).map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            )}
            <div className={styles.stats}>
              <span><StarIcon /> {repo.stars?.toLocaleString()}</span>
              <span><ForkIcon /> {repo.forks?.toLocaleString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
