import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SearchBar.module.css'

export default function SearchBar({ initialValue = '', compact = false }) {
  const [username, setUsername] = useState(initialValue)
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return
    navigate(`/report/${trimmed}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${compact ? styles.compact : ''} ${focused ? styles.focused : ''}`}
    >
      <span className={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      </span>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Enter GitHub username..."
        className={styles.input}
        autoComplete="off"
        spellCheck="false"
      />
      <button type="submit" className={`btn btn-primary ${styles.btn}`} disabled={!username.trim()}>
        {compact ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        ) : 'Analyse'}
      </button>
    </form>
  )
}
