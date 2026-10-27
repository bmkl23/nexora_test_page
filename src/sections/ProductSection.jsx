import { merge } from '../config/merge'
import { DEFAULT_PRODUCT_CONFIG } from '../config/defaults'
import { space } from '../theme/tokens'
import ProductCollection from '../components/ProductCollection'
import Button from '../components/Button'
import Reveal from '../components/Reveal'

// One entry of home_page.product_sections[]
export default function ProductSection({ section, products }) {
  if (section.enabled === false) return null
  const pc = merge(DEFAULT_PRODUCT_CONFIG, section.product_config)
  const sp = section.spacing || {}
  const style = {
    background: section.background_color || undefined,
    paddingTop: space(sp.top || 'none'), paddingBottom: space(sp.bottom || 'none'),
  }
  return (
    <Reveal anim={pc.card?.animation} className="section sec-band" style={style}>
      <div className="container">
        <div className="sec-head">
          <div style={{ textAlign: pc.title_alignment }}>
            {pc.show_title && <h2 className="sec-title">{section.title}</h2>}
            {section.subtitle && <p className="sec-sub">{section.subtitle}</p>}
          </div>
          {pc.show_view_all && <Button cfg={pc.view_all_button}>View all</Button>}
        </div>
        {/* Home sections ignore pc.filter / pc.sorting: those belong on the category and search pages. */}
        <ProductCollection products={products} config={pc} />
      </div>
    </Reveal>
  )
}
