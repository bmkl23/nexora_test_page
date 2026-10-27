import { useRef } from 'react'
import { useStore } from '../theme/ThemeProvider'

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches

// Subtle 3D tilt + light glare that follows the mouse. Off for touch, reduced motion, or hover effects disabled.
export default function Tilt({ as: Tag = 'div', max = 5, className = '', children, ...rest }) {
  const { reduceMotion, behaviour } = useStore()
  const ref = useRef(null)
  const on = !reduceMotion && behaviour.enable_hover_effects && finePointer()
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
  }
  const leave = () => { const el = ref.current; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
  return (
    <Tag ref={ref} className={`${className} ${on ? 'tilt' : ''}`} onMouseMove={on ? move : undefined}
      onMouseLeave={on ? leave : undefined} {...rest}>{children}</Tag>
  )
}
