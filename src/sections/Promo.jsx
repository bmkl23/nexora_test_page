import { BLOCK_H, radius } from '../theme/tokens'
import { useStore } from '../theme/ThemeProvider'
import Button from '../components/Button'
import Img from '../components/Img'
import Reveal from '../components/Reveal'

const BORDER_W = { thin: 1, medium: 2, thick: 3 }

// Split promotion (image + text) – home_page.promotions[]
export function Promotion({ cfg, content, seed = 5 }) {
  const { bp } = useStore()
  if (cfg.enabled === false) return null
  const compact = bp === 'mobile'
  const h = BLOCK_H[cfg.height] || 340
  const flip = cfg.layout === 'split-reverse'
  return (
    <Reveal anim={cfg.animation} className="container section">
      <div className="promo" style={{ minHeight: compact ? undefined : h, gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
        borderRadius: radius('medium'), border: cfg.border?.enabled ? `${BORDER_W[cfg.border.width] || 1}px solid ${cfg.border.color || 'var(--border)'}` : 'none' }}>
        <div className="promo-media" style={{ order: flip ? 2 : 0, minHeight: compact ? 240 : undefined }}>
          <Img src={content.image} seed={seed} alt="" />
          {cfg.overlay && <div className="overlay" style={{ opacity: cfg.overlay_opacity }} />}
        </div>
        <div className="promo-text" style={{ textAlign: cfg.title_alignment }}>
          {cfg.show_title && <h2 className="sec-title">{content.title}</h2>}
          {cfg.show_description && <p>{content.description}</p>}
          {cfg.show_button && <div><Button cfg={cfg.button}>{content.cta}</Button></div>}
        </div>
      </div>
    </Reveal>
  )
}

// Full-width campaign banner – home_page.banners[]
export function Banner({ cfg, content }) {
  if (cfg.enabled === false) return null
  const h = BLOCK_H[cfg.height] || 340
  return (
    <Reveal anim={cfg.animation} className="container section">
      <div className="banner on-image" style={{ minHeight: h, borderRadius: radius('medium'), textAlign: cfg.text_alignment }}>
        <div className="banner-img"><Img src={content.image} seed={6} alt="" /></div>
        <div className="overlay" style={{ opacity: 0.45 }} />
        <div className="banner-inner">
          {cfg.show_title && <h2 className="banner-title">{content.title}</h2>}
          {cfg.show_description && <p>{content.description}</p>}
          {cfg.show_button && <Button cfg={cfg.button}>{content.cta}</Button>}
        </div>
      </div>
    </Reveal>
  )
}
