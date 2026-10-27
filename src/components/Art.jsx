import { useId } from 'react'

// Procedural artwork used until real product/category images exist.
// Colours come from the active theme's CSS variables, so every generated theme gets its own look.
const mix = (a, pct, b) => `color-mix(in srgb, ${a} ${pct}%, ${b})`

export default function Art({ seed = 0 }) {
  const id = useId().replace(/[^a-z0-9]/gi, '')
  const v = Math.abs(seed) % 5
  const f = seed % 2 ? -1 : 1
  const lines = [0, 1, 2, 3, 4, 5]
  return (
    <svg className="art" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: mix('var(--primary)', 80, '#000') }} />
          <stop offset="1" style={{ stopColor: mix('var(--secondary)', 72, '#000') }} />
        </linearGradient>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <filter id={`b${id}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="48" /></filter>
        <pattern id={`d${id}`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="#fff" /></pattern>
      </defs>
      <rect width="400" height="500" fill={`url(#g${id})`} />
      <g filter={`url(#b${id})`}>
        <circle cx={f > 0 ? 90 : 320} cy="110" r="125" style={{ fill: mix('var(--primary)', 45, '#fff') }} opacity=".5" />
        <circle cx={f > 0 ? 330 : 70} cy="420" r="150" style={{ fill: mix('var(--secondary)', 50, '#fff') }} opacity=".38" />
      </g>
      <g fill="none" stroke="#fff" strokeOpacity=".15" strokeWidth="1.2">
        {v === 0 && lines.map((i) => <circle key={i} cx={f > 0 ? 300 : 100} cy="150" r={50 + i * 46} />)}
        {v === 1 && <rect x="0" y="0" width="400" height="500" fill={`url(#d${id})`} stroke="none" opacity=".22" />}
        {v === 2 && lines.map((i) => <path key={i} d={`M-10 ${120 + i * 62} C 100 ${80 + i * 62}, 300 ${170 + i * 62}, 410 ${120 + i * 62}`} />)}
        {v === 3 && <>
          <polygon points="0,500 220,200 400,500" fill="#fff" fillOpacity=".06" stroke="none" />
          <polygon points="120,500 300,260 400,500" fill="#fff" fillOpacity=".07" stroke="none" />
          <polygon points="0,320 160,120 260,380" fill="#fff" fillOpacity=".05" stroke="none" />
        </>}
        {v === 4 && lines.map((i) => <circle key={i} cx={f > 0 ? 0 : 400} cy="500" r={90 + i * 55} />)}
      </g>
      <rect width="400" height="500" fill={`url(#v${id})`} />
    </svg>
  )
}
