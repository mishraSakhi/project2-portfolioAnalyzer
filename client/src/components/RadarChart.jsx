import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import styles from './RadarChart.module.css'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const LABELS = ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready']

export default function RadarChart({ scores, compareScores = null, compareLabel = null }) {
  if (!scores) return null

  const values1 = [
    scores.activity ?? 0,
    scores.codeQuality ?? 0,
    scores.diversity ?? 0,
    scores.community ?? 0,
    scores.hiringReady ?? 0,
  ]

  const datasets = [
    {
      label: 'Score',
      data: values1,
      backgroundColor: 'rgba(124, 106, 255, 0.15)',
      borderColor: 'rgba(124, 106, 255, 0.9)',
      borderWidth: 2,
      pointBackgroundColor: '#7c6aff',
      pointRadius: 4,
    },
  ]

  if (compareScores) {
    datasets.push({
      label: compareLabel || 'Compare',
      data: [
        compareScores.activity ?? 0,
        compareScores.codeQuality ?? 0,
        compareScores.diversity ?? 0,
        compareScores.community ?? 0,
        compareScores.hiringReady ?? 0,
      ],
      backgroundColor: 'rgba(255, 106, 155, 0.15)',
      borderColor: 'rgba(255, 106, 155, 0.9)',
      borderWidth: 2,
      pointBackgroundColor: '#ff6a9b',
      pointRadius: 4,
    })
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
          stepSize: 25,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: {
          color: '#9090aa',
          font: { family: "'Space Mono', monospace", size: 11 },
        },
      },
    },
    plugins: {
      legend: {
        display: !!compareScores,
        labels: {
          color: '#9090aa',
          font: { family: "'Space Mono', monospace", size: 11 },
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: '#13131e',
        borderColor: '#252535',
        borderWidth: 1,
        titleColor: '#e8e8f0',
        bodyColor: '#9090aa',
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/100`,
        },
      },
    },
  }

  return (
    <div className={`card ${styles.card}`}>
      <p className="section-title">Skill Radar</p>
      <div className={styles.chartWrap}>
        <Radar data={{ labels: LABELS, datasets }} options={options} />
      </div>
    </div>
  )
}
