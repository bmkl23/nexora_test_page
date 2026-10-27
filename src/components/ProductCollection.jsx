import { merge, pick } from '../config/merge'
import { DEFAULT_PRODUCT_CONFIG } from '../config/defaults'
import { gap as gapTok } from '../theme/tokens'
import { useStore } from '../theme/ThemeProvider'
import Carousel from './Carousel'
import ProductCard from './ProductCard'

// Renders products as a grid or carousel, driven by product_config / recommendations config.
export default function ProductCollection({ products, config, card }) {
  const { bp, reduceMotion } = useStore()
  const cfg = merge(DEFAULT_PRODUCT_CONFIG, config)
  const g = gapTok(cfg.gap)
  const cardCfg = card || cfg.card
  const mode = cfg.display_mode
  const nav = cfg.navigation || {}
  const cols = pick(cfg.columns, bp, 4)
  const perView = pick(cfg.items_per_view, bp, cols)

  if (!products.length) return <p className="muted">No products to show yet.</p>

  if (mode === 'grid') {
    return (
      <div className="pgrid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: g }}>
        {products.map((p) => <ProductCard key={p.id} product={p} card={cardCfg} />)}
      </div>
    )
  }
  return (
    <Carousel
      items={products} perView={perView} gap={g} reduceMotion={reduceMotion}
      autoplay={!!cfg.autoplay} interval={cfg.autoplay_interval}
      arrows={nav.enabled !== false && nav.arrows !== false} dots={!!nav.dots}
      drag={nav.drag !== false} infinite={nav.infinite !== false && cfg.infinite_scroll !== false}
      renderItem={(p) => <ProductCard product={p} card={cardCfg} />}
    />
  )
}
