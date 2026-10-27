import { merge } from '../config/merge'
import { DEFAULT_FOOTER, DEFAULT_NEWSLETTER } from '../config/defaults'
import { readable } from '../theme/tokens'
import { useStore } from '../theme/ThemeProvider'
import { NewsletterForm } from './Newsletter'

export default function Footer({ logo, content }) {
  const { config } = useStore()
  const f = merge(DEFAULT_FOOTER, config.footer)
  if (!f.enabled) return null
  const bg = f.background_color || 'var(--surface)'
  const fg = f.text_color || (f.background_color ? readable(f.background_color) : 'var(--text)')
  return (
    <footer className="footer" style={{ background: bg, color: fg, '--heading': fg, '--body-color': fg }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            {f.show_logo && <span className="logo">{logo}</span>}
            {f.show_description && <p>{content.description}</p>}
            {f.show_contact && (
              <ul className="plain">
                {f.show_email && <li>{content.email}</li>}
                {f.show_phone && <li>{content.phone}</li>}
                {f.show_address && <li>{content.address}</li>}
              </ul>
            )}
          </div>
          {content.columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul className="plain">{col.links.map((l) => <li key={l}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        {f.show_newsletter && (
          <div className="footer-nl">
            <b>Join the list</b>
            <NewsletterForm cfg={merge(DEFAULT_NEWSLETTER, {})} compact />
          </div>
        )}
        <div className="footer-bottom">
          {f.show_social_media && <div className="row">{content.social.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}</div>}
          {f.show_payment_methods && <div className="row pay">{content.payments.map((p) => <span key={p}>{p}</span>)}</div>}
          {f.show_copyright && <small>© {new Date().getFullYear()} {logo}. All rights reserved.</small>}
        </div>
      </div>
    </footer>
  )
}
