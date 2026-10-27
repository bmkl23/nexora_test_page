import { useShop } from '../state/ShopState'
import { merge } from '../config/merge'
import { DEFAULT_CARD } from '../config/defaults'
import { radius, shadow, gap as gapTok } from '../theme/tokens'
import Icon from './Icon'
import Img from './Img'
import Button from './Button'
import Tilt from './Tilt'

const CUR = import.meta.env.VITE_CURRENCY || 'USD'
export const money = (v) => new Intl.NumberFormat('en', { style: 'currency', currency: CUR }).format(v)

// Map whatever the API returns into one shape. The current API only gives name/code/description/images.
export function normalizeProduct(p, i = 0) {
  return {
    id: p._id || p.id || `p${i}`, seed: i,
    name: p.name || 'Untitled product', code: p.code, description: p.description,
    images: Array.isArray(p.images) ? p.images : [],
    price: num(p.price), originalPrice: num(p.original_price ?? p.originalPrice),
    rating: num(p.rating), reviews: num(p.review_count ?? p.reviews),
    badge: p.badge || null, stock: p.stock, category: p.category, active: p.status,
  }
}
const num = (v) => (v === undefined || v === null || v === '' || Number.isNaN(Number(v)) ? null : Number(v))

export default function ProductCard({ product: p, card, onOpen }) {
  const c = merge(DEFAULT_CARD, card)
  const { addToCart, toggleWish, isWished } = useShop()
  const discount = p.price && p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  const bordered = c.border?.enabled || c.style === 'bordered'
  const minimal = c.style === 'minimal'
  const wished = isWished(p.id)
  const ratio = String(c.image_ratio || '3:4').replace(':', ' / ')
  const pad = c.spacing === 'small' ? 10 : c.spacing === 'large' ? 20 : 14

  return (
    <Tilt as="article" className={`pcard hover-${c.hover_effect}`} onClick={onOpen}
      style={{
        background: minimal ? 'transparent' : 'var(--surface)',
        borderRadius: radius(c.border?.radius || 'medium') ,
        border: bordered ? `1px solid ${c.border?.color || 'var(--border)'}` : '1px solid transparent',
        boxShadow: c.shadow?.enabled ? shadow(c.shadow.level) : undefined,
      }}>
      <div className="pcard-media" style={{ aspectRatio: ratio }}>
        <Img src={p.images[0]} alt={p.name} seed={p.seed} label={p.name} fit={c.image_fit} />
        {c.show_badge && (p.badge || discount > 0) && (
          <span className={`badge ${p.badge === 'NEW' ? 'new' : ''}`}>{p.badge || 'SALE'}</span>
        )}
        {c.show_wishlist && (
          <button className={`wish ${wished ? 'on' : ''}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wished} onClick={(e) => { e.stopPropagation(); toggleWish(p) }}>
            <Icon name="heart" size={18} fill={wished} />
          </button>
        )}
        {c.show_add_to_cart && (
          <Button cfg={{ ...c.button, size: 'small' }} full className="quick-add" onClick={(e) => { e.stopPropagation(); addToCart(p) }}>Add to cart</Button>
        )}
      </div>
      <div className="pcard-body" style={{ padding: pad, gap: gapTok('small') / 2, textAlign: c.content_alignment }}>
        {c.show_category && p.category && <span className="muted small">{p.category}</span>}
        {c.show_product_name && <h3 className="pname">{p.name}</h3>}
        {c.show_rating && p.rating != null && (
          <div className="rating" style={{ justifyContent: c.content_alignment === 'center' ? 'center' : 'flex-start' }}>
            <Icon name="star" size={14} fill /> <b>{p.rating.toFixed(1)}</b>
            {c.show_review_count && p.reviews != null && <span className="muted">({p.reviews})</span>}
          </div>
        )}
        {c.show_price && p.price != null && (
          <div className="price" style={{ justifyContent: c.content_alignment === 'center' ? 'center' : 'flex-start' }}>
            <b>{money(p.price)}</b>
            {c.show_original_price && discount > 0 && <s className="muted">{money(p.originalPrice)}</s>}
            {c.show_discount && discount > 0 && <span className="off">-{discount}%</span>}
          </div>
        )}
        {c.show_stock_status && p.stock != null && (
          <span className={p.stock > 0 ? 'ok small' : 'bad small'}>{p.stock > 0 ? 'In stock' : 'Out of stock'}</span>
        )}
        {c.show_add_to_cart && (
          <Button cfg={c.button} full className="body-add" onClick={(e) => { e.stopPropagation(); addToCart(p) }}>Add to cart</Button>
        )}
      </div>
    </Tilt>
  )
}
