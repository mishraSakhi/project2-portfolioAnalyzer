import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import styles from './LangChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Go: '#00add8', Rust: '#dea584', Ruby: '#701516', PHP: '#4f5d95',
  Swift: '#ffac45', Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26',
  CSS: '#563d7c', Shell: '#89e051', Scala: '#c22d40', R: '#198ce7',
  Vue: '#41b883', Svelte: '#ff3e00', default: '#7c6aff',
}

export default function LangChart({ languages }) {
  if (!languages?.length) return null

  const top = languages.slice(0, 8)
  const colors = top.map((l) => LANG_COLORS[l.name] || LANG_COLORS.default)

  const data = {
    labels: top.map((l) => l.name),
    datasets: [{
      data: top.map((l) => l.percent),
      backgroundColor: colors.map((c) => c + 'cc'),
      borderColor: colors,
      borderWidth: 1,
      borderRadius: 4,
    }],
  }

  const options = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#13131e',
        borderColor: '#252535',
        borderWidth: 1,
        titleColor: '#e8e8f0',
        bodyColor: '#9090aa',
        callbacks: { label: (ctx) => ` ${ctx.raw}% of repos` },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#606078', font: { family: "'Space Mono', monospace", size: 10 }, callback: (v) => v + '%' },
        max: 100,
      },
      y: {
        grid: { display: false },
        ticks: { color: '#9090aa', font: { family: "'Space Mono', monospace", size: 11 } },
      },
    },
  }

  return (
    <div className={`card ${styles.card}`}>
      <p className="section-title">Languages</p>
      <Bar data={data} options={options} />
    </div>
  )
}
