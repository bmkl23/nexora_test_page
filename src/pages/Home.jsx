import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { designsApi, shopsApi, productsApi } from '../api/client'
import { ThemeProvider, useStore, layoutVars } from '../theme/ThemeProvider'
import { ShopProvider } from '../state/ShopState'
import { SELECTED_KEY } from './ThemePicker'
import { demoContent, demoProducts } from '../content/demo'
import { normalizeProduct } from '../components/ProductCard'
import Icon from '../components/Icon'
import Header from '../sections/Header'
import Hero from '../sections/Hero'
import Categories from '../sections/Categories'
import ProductSection from '../sections/ProductSection'
import { Promotion, Banner } from '../sections/Promo'
import Newsletter from '../sections/Newsletter'
import Footer from '../sections/Footer'
import ProductCollection from '../components/ProductCollection'
import Reveal from '../components/Reveal'

const CATEGORY = import.meta.env.VITE_DEFAULT_CATEGORY || 'Electronics'

function Recommendations({ products }) {
  const { config } = useStore()
  const r = config.home_page?.recommendations
  if (!r || r.enabled === false) return null
  return (
    <Reveal className="container section">
      {r.show_title !== false && <h2 className="sec-title">{r.title || 'Recommended for you'}</h2>}
      <ProductCollection products={products} config={{ ...r, card: r.product_card }} />
    </Reveal>
  )
}

function ScrollTop() {
  const { behaviour } = useStore()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  if (!behaviour.show_scroll_to_top || !show) return null
  return <button className="totop" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="up" /></button>
}

function Storefront({ shop, products, sample }) {
  const { config, theme, bp } = useStore()
  const content = useMemo(() => demoContent(shop?.name || 'NexOra'), [shop])
  const hp = config.home_page || {}
  const sections = (hp.product_sections || []).filter((s) => s.enabled !== false)
  const pageVars = layoutVars(hp.layout, theme, bp)
  // Config 3 has two sections (New arrivals, Trending). Promotion goes after the first, banners after the rest.
  return (
    <div className="page" style={pageVars}>
      <div className="ambient" aria-hidden="true"><i /><i /></div>
      <Header logo={content.logo} categories={content.categories} />
      {sample && <div className="sample-note" role="note">Showing sample products. This shop has no active products yet.</div>}
      <main>
        <Hero content={content.hero} />
        <Categories items={content.categories} />
        {sections[0] && <ProductSection section={sections[0]} products={products} />}
        {(hp.promotions || []).map((p, i) => <Promotion key={i} cfg={p} content={content.promotion} />)}
        {sections.slice(1).map((s, i) => <ProductSection key={i} section={s} products={[...products].reverse()} />)}
        {(hp.banners || []).map((b, i) => <Banner key={i} cfg={b} content={content.banner} />)}
        <Recommendations products={products} />
        <Newsletter content={content.newsletter} />
      </main>
      <div style={{ height: 'var(--section-gap)' }} />
      <Footer logo={content.logo} content={content.footer} />
      <ScrollTop />
    </div>
  )
}

export default function Home() {
  const [state, setState] = useState({ status: 'loading' })
  const id = Number(localStorage.getItem(SELECTED_KEY)) || null

  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const [designRes, shopRes] = await Promise.all([
          id ? designsApi.get(id) : designsApi.list(),
          shopsApi.byCategory(CATEGORY),
        ])
        const design = Array.isArray(designRes) ? (designRes.find((d) => d.id === id) || designRes[0]) : designRes
        const config = design?.config || design
        if (!config?.theme) throw new Error('The selected theme has no configuration. Pick another theme.')
        const shop = shopRes?.shops?.find((s) => s.config_id === design?.id) || shopRes?.shops?.[0] || null
        let raw = []
        if (shop?.id) { try { raw = (await productsApi.byShop(shop.id))?.products || [] } catch { raw = [] } }
        // status:false = hidden. Show only active ones (flip if your backend means the opposite).
        const active = raw.filter((p) => p.status !== false)
        const list = (active.length ? active : demoProducts).map(normalizeProduct)
        if (live) setState({ status: 'ready', config, shop, products: list, sample: !active.length })
      } catch (e) { if (live) setState({ status: 'error', message: e.message }) }
    })()
    return () => { live = false }
  }, [id])

  if (state.status === 'loading') return <p className="picker-note center" role="status">Loading your store…</p>
  if (state.status === 'error') return (
    <div className="picker-error center" role="alert">
      <p><b>Could not load the store.</b> {state.message}</p>
      <Link className="pbtn" to="/">Back to themes</Link>
    </div>
  )
  return (
    <ThemeProvider config={state.config}>
      <ShopProvider><Storefront shop={state.shop} products={state.products} sample={state.sample} /></ShopProvider>
    </ThemeProvider>
  )
}
