import { useEffect, useState } from 'react'
import { useStore } from '../theme/ThemeProvider'
import { useShop } from '../state/ShopState'
import { merge } from '../config/merge'
import { DEFAULT_HEADER, DEFAULT_NAV, DEFAULT_MOBILE_NAV, DEFAULT_SEARCH } from '../config/defaults'
import { HEADER_H, radius, shadow } from '../theme/tokens'
import Icon from '../components/Icon'

const WIDTH = { thin: 1, medium: 2, thick: 3 }

export default function Header({ logo, categories = [] }) {
  const { config, bp } = useStore()
  const { cartCount, wishCount } = useShop()
  const h = merge(DEFAULT_HEADER, config.header)
  const nav = merge(DEFAULT_NAV, config.navigation)
  const mnav = merge(DEFAULT_MOBILE_NAV, config.mobile_navigation)
  const search = merge(DEFAULT_SEARCH, config.search)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!h.enabled) return null

  const compact = bp === 'mobile' || bp === 'tablet'
  const links = [
    nav.show_home && 'Home',
    ...(nav.show_categories && h.show_categories ? categories.slice(0, 4).map((c) => c.name) : []),
    nav.show_featured && 'Featured', nav.show_new_arrivals && 'New arrivals', nav.show_sale && 'Sale',
  ].filter(Boolean)

  const bg = h.background_color || 'var(--bg)'
  const fg = h.text_color || 'var(--text)'
  const b = h.border
  const style = {
    '--hdr-h': `${HEADER_H[h.height] || 72}px`, background: `color-mix(in srgb, ${bg} 76%, transparent)`, color: fg,
    position: h.sticky ? 'sticky' : 'relative',
    borderBottom: b?.enabled ? `${WIDTH[b.width] || 1}px ${b.style || 'solid'} ${b.color || 'var(--border)'}` : 'none',
    boxShadow: h.shadow?.enabled ? shadow(h.shadow.level) : 'none',
    borderRadius: b?.enabled ? radius(b.radius === 'medium' ? 'none' : b.radius) : 0,
  }
  const bottomBar = compact && mnav.enabled && mnav.style === 'bottom_bar'
  const submit = (e) => { e.preventDefault() /* TODO: navigate to /search?q= */ }

  const actions = (
    <div className="hdr-actions">
      {h.show_search && compact && <button aria-label="Search"><Icon name="search" /></button>}
      {h.show_wishlist && <button aria-label="Wishlist" className="hdr-badge"><Icon name="heart" />{wishCount > 0 && <i>{wishCount}</i>}</button>}
      {h.show_account && !compact && <button aria-label="Account"><Icon name="user" /></button>}
      {h.show_cart && <button aria-label="Cart" className="hdr-badge"><Icon name="bag" />{cartCount > 0 && <i>{cartCount}</i>}</button>}
    </div>
  )

  return (
    <>
      <header className={`hdr ${scrolled ? 'scrolled' : ''}`} style={style}>
        <div className={`container hdr-row ${h.layout === 'logo-center' ? 'logo-center' : ''}`}>
          {compact && h.show_menu_button_mobile && nav.mobile_style !== 'none' && !bottomBar && (
            <button className="hdr-menu" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" /></button>
          )}
          {h.show_logo && <a className="logo" href="/shop">{logo}</a>}
          {!compact && nav.enabled && (
            <nav className="hdr-nav" aria-label="Main">{links.map((l, i) => <a key={l} className={i === 0 ? 'on' : ''} href="#" onClick={(e) => e.preventDefault()}>{l}</a>)}</nav>
          )}
          {!compact && h.show_search && search.enabled && (
            <form className="hdr-search" onSubmit={submit} role="search">
              <Icon name="search" size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={search.placeholder} aria-label="Search products" />
            </form>
          )}
          {actions}
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-panel" style={{ background: bg, color: fg }}>
            <div className="drawer-top">
              <span className="logo">{logo}</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" /></button>
            </div>
            {search.enabled && (
              <form className="hdr-search full" onSubmit={submit} role="search">
                <Icon name="search" size={16} /><input placeholder={search.placeholder} aria-label="Search products" />
              </form>
            )}
            <nav>{links.map((l) => <a key={l} href="#" onClick={(e) => { e.preventDefault(); setOpen(false) }}>{l}</a>)}</nav>
          </div>
        </div>
      )}

      {bottomBar && (
        <nav className="bottombar" aria-label="Mobile" style={{ background: bg, color: fg }}>
          {mnav.show_home && <a href="/shop"><Icon name="home" /><span>Home</span></a>}
          {mnav.show_categories && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="grid" /><span>Shop</span></a>}
          {mnav.show_search && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="search" /><span>Search</span></a>}
          {mnav.show_wishlist && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="heart" /><span>Saved</span></a>}
          {mnav.show_cart && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="bag" /><span>Cart{cartCount ? ` (${cartCount})` : ''}</span></a>}
          {mnav.show_account && <a href="#" onClick={(e) => e.preventDefault()}><Icon name="user" /><span>Account</span></a>}
        </nav>
      )}
    </>
  )
}
