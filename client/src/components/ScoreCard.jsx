import styles from './ScoreCard.module.css'

const CATEGORIES = [
  { key: 'activity',    label: 'Activity',      color: '#7c6aff', icon: '⚡' },
  { key: 'codeQuality', label: 'CodeQuality',  color: '#6affd4', icon: '🔬' },
  { key: 'diversity',   label: 'Diversity',     color: '#fbbf24', icon: '🌐' },
  { key: 'community',   label: 'Community',     color: '#ff6a9b', icon: '⭐' },
  { key: 'hiringReady', label: 'Hiring Ready',  color: '#4ade80', icon: '💼' },
]

function getRating(score) {
  if (score >= 80) return { label: 'Excellent!', color: '#4ade80' }
  if (score >= 60) return { label: 'Good!',      color: '#7c6aff' }
  if (score >= 40) return { label: 'Fair!',      color: '#fbbf24' }
  return                   { label: 'Needs Work!', color: '#f87171' }
}

function CircleRing({ score, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference
  const rating = getRating(score)

  return (
    <div className={styles.ringWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--bg3)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={rating.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className={styles.ringLabel}>
        <span className={styles.ringScore}>{score}</span>
        <span className={styles.ringMax}>/100</span>
        <span className={styles.ringRating} style={{ color: rating.color }}>
          {rating.label}
        </span>
      </div>
    </div>
  )
}

function CategoryBar({ label, score, color, icon }) {
  return (
    <div className={styles.catRow}>
      <span className={styles.catLabel}>
        <span>{icon}</span> {label}
      </span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className={styles.catScore} style={{ color }}>{score}</span>
    </div>
  )
}

export default function ScoreCard({ scores, profile }) {
  if (!scores) return null

  return (
    <div className={`card ${styles.card}`}>
      <p className="section-title">Overall Score</p>

      <div className={styles.top}>
        <CircleRing score={scores.overall} />
        <div className={styles.profileInfo}>
          {profile?.avatarUrl && (
            <img src={profile.avatarUrl} alt={profile.name} className={styles.avatar} />
          )}
          <div>
            <h2 className={styles.name}>{profile?.name || profile?.username}</h2>
            <span className={styles.handle}>@{profile?.username}</span>
            {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
            <div className={styles.stats}>
              <span>{profile?.followers?.toLocaleString()} followers</span>
              <span>·</span>
              <span>{profile?.publicRepos} repos</span>
              {profile?.location && <><span>·</span><span>📍 {profile.location}</span></>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map((cat) => (
          <CategoryBar
            key={cat.key}
            label={cat.label}
            score={scores[cat.key] ?? 0}
            color={cat.color}
            icon={cat.icon}
          />
        ))}
      </div>
    </div>
  )
}
