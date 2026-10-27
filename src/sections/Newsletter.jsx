import { useState } from 'react'
import { merge } from '../config/merge'
import { DEFAULT_NEWSLETTER } from '../config/defaults'
import { useStore } from '../theme/ThemeProvider'
import Button from '../components/Button'
import Reveal from '../components/Reveal'

export function NewsletterForm({ cfg, compact }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  if (done) return <p role="status">Thanks. You are on the list.</p>
  return (
    <form className={`nl-form nl-${cfg.input_style}`} onSubmit={(e) => { e.preventDefault(); if (email) setDone(true) /* TODO: POST subscribe */ }}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" />
      <Button cfg={{ ...cfg.button, size: compact ? 'small' : cfg.button.size }} type="submit" onClick={undefined}>Subscribe</Button>
    </form>
  )
}

export default function Newsletter({ content }) {
  const { config } = useStore()
  const n = merge(DEFAULT_NEWSLETTER, config.home_page?.newsletter)
  if (!n.enabled) return null
  return (
    <Reveal className="container section">
      <div className={`nl nl-${n.layout}`} style={{ textAlign: n.title_alignment }}>
        <div>
          {n.show_title && <h2 className="sec-title">{content.title}</h2>}
          {n.show_description && <p>{content.description}</p>}
        </div>
        <NewsletterForm cfg={n} />
      </div>
    </Reveal>
  )
}
