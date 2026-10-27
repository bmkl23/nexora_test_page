import { useEffect, useState } from 'react'

const calc = (w) => (w < 640 ? 'mobile' : w < 1024 ? 'tablet' : w < 1440 ? 'desktop' : 'large_desktop')

export function useBreakpoint() {
  const [bp, setBp] = useState(() => calc(window.innerWidth))
  useEffect(() => {
    const on = () => setBp(calc(window.innerWidth))
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return bp
}
