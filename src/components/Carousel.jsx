import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'

// Scroll-snap carousel: arrows, dots, mouse drag, touch swipe (native), autoplay, infinite wrap.
export default function Carousel({
  items, perView = 4, gap = 20, autoplay = false, interval = 4000, arrows = true, dots = false,
  drag = true, infinite = true, reduceMotion = false, renderItem,
}) {
  const ref = useRef(null)
  const paused = useRef(false)
  const drg = useRef({ on: false, x: 0, left: 0, moved: false })
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const canScroll = items.length > perView

  const stepPx = () => {
    const el = ref.current; const first = el?.children[0]
    return first ? first.getBoundingClientRect().width + gap : el?.clientWidth || 300
  }
  const go = useCallback((dir) => {
    const el = ref.current; if (!el) return
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    const start = el.scrollLeft <= 2
    const behavior = reduceMotion ? 'auto' : 'smooth'
    if (dir > 0 && end) { if (infinite) el.scrollTo({ left: 0, behavior }) }
    else if (dir < 0 && start) { if (infinite) el.scrollTo({ left: el.scrollWidth, behavior }) }
    else el.scrollBy({ left: dir * stepPx(), behavior })
  }, [infinite, reduceMotion, gap]) // eslint-disable-line react-hooks/exhaustive-deps

  // Autoplay always advances forward (content moves right -> left).
  // If the mentor wants "left-to-right" to run in reverse, pass dir = -1 here.
  useEffect(() => {
    if (!autoplay || reduceMotion || !canScroll) return
    const id = setInterval(() => { if (!paused.current && !drg.current.on) go(1) }, interval)
    return () => clearInterval(id)
  }, [autoplay, interval, reduceMotion, canScroll, go])

  const onScroll = () => setActive(Math.round(ref.current.scrollLeft / stepPx()))
  const pages = Math.max(1, items.length - perView + 1)

  const onDown = (e) => {
    if (!drag || e.button !== 0 || !canScroll) return
    const el = ref.current
    drg.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false }
    const move = (ev) => {
      const d = ev.clientX - drg.current.x
      if (Math.abs(d) > 5) { drg.current.moved = true; setDragging(true) }
      el.scrollLeft = drg.current.left - d
    }
    const up = () => {
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up)
      setDragging(false)
      setTimeout(() => { drg.current.on = false }, 0)
      el.scrollTo({ left: Math.round(el.scrollLeft / stepPx()) * stepPx(), behavior: 'smooth' })
    }
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
  }
  const swallowClick = (e) => { if (drg.current.moved) { e.preventDefault(); e.stopPropagation(); drg.current.moved = false } }

  return (
    <div className="carousel" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div ref={ref} className={`track ${dragging ? 'dragging' : ''}`} onScroll={onScroll} onMouseDown={onDown}
           onClickCapture={swallowClick} tabIndex={0} aria-roledescription="carousel"
           onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
           style={{ '--n': perView, '--gap': `${gap}px`, gap, cursor: drag && canScroll ? 'grab' : 'default' }}>
        {items.map((it, i) => <div className="slide" key={it.id ?? i}>{renderItem(it, i)}</div>)}
      </div>
      {arrows && canScroll && (<>
        <button className="arrow arrow-l" aria-label="Previous" onClick={() => go(-1)}><Icon name="left" /></button>
        <button className="arrow arrow-r" aria-label="Next" onClick={() => go(1)}><Icon name="right" /></button>
      </>)}
      {dots && canScroll && (
        <div className="dots">{Array.from({ length: pages }).map((_, i) => (
          <button key={i} aria-label={`Go to slide ${i + 1}`} className={i === Math.min(active, pages - 1) ? 'on' : ''}
            onClick={() => ref.current.scrollTo({ left: i * stepPx(), behavior: 'smooth' })} />
        ))}</div>
      )}
    </div>
  )
}
