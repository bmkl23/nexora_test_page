import { useEffect, useRef, useState } from 'react'
import { useStore } from '../theme/ThemeProvider'

// One-time fade/slide-in for a whole section (not every card). Respects reduce-motion.
export default function Reveal({ anim, children, as: Tag = 'section', className = '', style, ...rest }) {
  const { reduceMotion } = useStore()
  const ref = useRef(null)
  const off = reduceMotion || anim?.enabled === false
  const [seen, setSeen] = useState(off)
  useEffect(() => {
    if (off || !ref.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.08 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [off])
  return <Tag ref={ref} style={style} {...rest} className={`${className} ${off ? '' : 'reveal'} ${seen ? 'in' : ''}`}>{children}</Tag>
}
