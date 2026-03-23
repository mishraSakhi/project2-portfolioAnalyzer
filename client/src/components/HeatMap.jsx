import styles from './HeatMap.module.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getColor(count) {
  if (!count || count === 0) return 'var(--bg3)'
  if (count <= 2)  return 'rgba(124,106,255,0.3)'
  if (count <= 5)  return 'rgba(124,106,255,0.55)'
  if (count <= 10) return 'rgba(124,106,255,0.75)'
  return '#7c6aff'
}

export default function HeatMap({ heatmapData }) {
  if (!heatmapData) return null

  // Build a 52-week grid (last 52 weeks)
  const today = new Date()
  const weeks = []

  // Start from 52 weeks ago, at the beginning of that week (Sunday)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 52 * 7)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // align to Sunday

  let current = new Date(startDate)
  const monthLabels = []

  for (let w = 0; w < 53; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0]
      const count = heatmapData[dateStr] || 0
      week.push({ date: dateStr, count, dayOfWeek: d })

      // Track month label at start of new month
      if (d === 0 && current.getDate() <= 7) {
        monthLabels.push({ week: w, month: MONTHS[current.getMonth()] })
      }
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }

  const totalContribs = Object.values(heatmapData).reduce((s, c) => s + c, 0)

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <p className="section-title" style={{ marginBottom: 0 }}>Contribution Activity</p>
        <span className={styles.total}>{totalContribs} contributions (last year)</span>
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {/* Month labels */}
          <div className={styles.monthRow}>
            <div className={styles.dayLabelSpacer} />
            <div className={styles.months}>
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className={styles.monthLabel}
                  style={{ gridColumnStart: m.week + 1 }}
                >
                  {m.month}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className={styles.body}>
            {/* Day labels */}
            <div className={styles.dayLabels}>
              {DAYS.map((d, i) => (
                <span key={d} className={styles.dayLabel}>
                  {i % 2 !== 0 ? d : ''}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className={styles.cells}>
              {weeks.map((week, wi) => (
                <div key={wi} className={styles.weekCol}>
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={styles.cell}
                      style={{ background: getColor(day.count) }}
                      title={`${day.date}: ${day.count} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {[0, 2, 5, 8, 12].map((n) => (
          <div key={n} className={styles.legendCell} style={{ background: getColor(n) }} />
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  )
}
