import { merge, pick } from '../config/merge'
import { DEFAULT_CATEGORIES } from '../config/defaults'
import { gap as gapTok, radius, shadow } from '../theme/tokens'
import { useStore } from '../theme/ThemeProvider'
import Carousel from '../components/Carousel'
import Img from '../components/Img'
import Reveal from '../components/Reveal'

const SHAPE = { portrait: '3 / 4', square: '1 / 1', landscape: '4 / 3' }

export default function Categories({ items }) {
  const { config, bp, reduceMotion } = useStore()
  const c = merge(DEFAULT_CATEGORIES, config.home_page?.categories)
  if (!c.enabled || !items.length) return null
  const card = c.card
  const overlay = card.style === 'image-overlay'
  const perView = pick(c.items_per_view, bp, 4)
  const bordered = card.border?.enabled

  const render = (cat, i) => (
    <a href="#" onClick={(e) => e.preventDefault()} className={`cat hover-${card.hover_effect}`}
      style={{ textAlign: card.text_alignment, borderRadius: radius(card.border?.radius || 'medium'),
        border: bordered ? `1px solid ${card.border.color || 'var(--border)'}` : 'none',
        boxShadow: card.shadow?.enabled ? shadow(card.shadow.level) : 'none' }}>
      <div className="cat-media" style={{ aspectRatio: SHAPE[card.image_shape] || SHAPE.portrait, borderRadius: 'inherit' }}>
        <Img src={cat.image} seed={i + 4} alt={cat.name} fit={card.image_fit} />
        {overlay && card.show_name && <div className="cat-over"><b>{cat.name}</b></div>}
      </div>
      {!overlay && card.show_name && (
        <div className="cat-name"><b>{cat.name}</b>{card.show_product_count && <span className="muted"> ({cat.count})</span>}</div>
      )}
    </a>
  )

  return (
    <Reveal className="container section">
      {c.show_title && <h2 className="sec-title" style={{ textAlign: c.title_alignment }}>Shop by category</h2>}
      <Carousel items={items} perView={perView} gap={gapTok(c.gap)} arrows={!!c.navigation} autoplay={c.autoplay}
        interval={c.autoplay_interval} reduceMotion={reduceMotion} renderItem={render} infinite={false} />
    </Reveal>
  )
}
