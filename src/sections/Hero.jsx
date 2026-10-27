import { useRef } from 'react'
import { merge } from '../config/merge'
import { DEFAULT_HERO } from '../config/defaults'
import { HERO_H } from '../theme/tokens'
import { useStore } from '../theme/ThemeProvider'
import Button from '../components/Button'
import Img from '../components/Img'
import Reveal from '../components/Reveal'

const V = { top: 'flex-start', center: 'center', bottom: 'flex-end' }
const H = { left: 'flex-start', center: 'center', right: 'flex-end' }

// Layered 3D scene. Layers move at different depths as the mouse moves over the hero.
function Stage({ content }) {
  return (
    <div className="stage" aria-hidden="true">
      <div className="st st-back"><Img src={content.image} seed={1} /></div>
      <div className="st st-mid"><Img seed={3} /></div>
      <div className="st st-chip"><b>{content.chip}</b><span>{content.chipSub}</span></div>
    </div>
  )
}

export default function Hero({ content }) {
  const { config, bp, reduceMotion, behaviour } = useStore()
  const scene = useRef(null)
  const h = merge(DEFAULT_HERO, config.home_page?.hero)
  if (!h.enabled) return null
  const fx = !reduceMotion && behaviour.enable_hover_effects
  const onMove = (e) => {
    if (!fx || !scene.current) return
    const el = scene.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', (x * 2 - 1).toFixed(3)); el.style.setProperty('--my', (y * 2 - 1).toFixed(3))
    el.style.setProperty('--sx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--sy', `${(y * 100).toFixed(1)}%`)
  }
  const onLeave = () => { const el = scene.current; if (el) { el.style.setProperty('--mx', 0); el.style.setProperty('--my', 0) } }

  const bgMode = h.layout === 'image-background'
  const compact = bp === 'mobile'
  const height = HERO_H[h.height] || 560
  const align = h.text_alignment
  const text = (
    <div className={`hero-text ${bgMode ? 'on-image' : ''}`}
      style={{ textAlign: align, alignItems: H[align] || 'flex-start', justifyContent: V[h.vertical_alignment] || 'center' }}>
      {h.show_title && <h1 className="hero-title">{content.title}</h1>}
      {h.show_description && <p className="hero-desc">{content.description}</p>}
      <div className="hero-cta" style={{ justifyContent: H[align] }}>
        {h.show_primary_button && <Button cfg={h.primary_button}>{content.cta}</Button>}
        {h.show_secondary_button && <Button cfg={h.secondary_button}>{content.cta2}</Button>}
      </div>
    </div>
  )

  if (bgMode) {
    return (
      <Reveal as="section" anim={h.animation} className="hero hero-bg">
        <div ref={scene} className="hero-scene on-image" onMouseMove={onMove} onMouseLeave={onLeave} style={{ minHeight: height }}>
          <div className="hero-img"><Img src={content.image} seed={1} alt="" /></div>
          {h.overlay && <div className="overlay" style={{ opacity: h.overlay_opacity }} />}
          <div className="container hero-inner" style={{ minHeight: height }}>{text}</div>
        </div>
      </Reveal>
    )
  }
  const imageLeft = h.layout === 'image-left'
  return (
    <Reveal as="section" anim={h.animation} className="container hero hero-split">
      <div ref={scene} className="hero-scene hero-split-grid" onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ gridTemplateColumns: compact ? '1fr' : '1fr 1fr', minHeight: compact ? undefined : height }}>
        <div style={{ order: imageLeft && !compact ? 2 : 0, display: 'flex', position: 'relative', zIndex: 1 }}>{text}</div>
        <div className="hero-media" style={{ order: imageLeft && !compact ? 1 : 0, minHeight: compact ? 340 : undefined }}>
          <Stage content={content} />
        </div>
      </div>
    </Reveal>
  )
}
