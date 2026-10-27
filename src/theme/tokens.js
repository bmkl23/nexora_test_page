// Translate LLM size words into real CSS values. Unknown words fall back to "medium"-ish values.
const look = (map, key, fb) => (map[key] !== undefined ? map[key] : (fb !== undefined ? fb : map.medium))

export const SPACE = { none: 0, xs: 8, small: 16, medium: 24, large: 40, xl: 64, xxl: 96 }
export const GAP = { none: 0, small: 12, medium: 20, large: 32, xl: 48 }
export const SECTION_GAP = { none: 0, small: 32, medium: 56, large: 88, xl: 120 }
export const RADIUS = { none: 0, small: 6, medium: 14, large: 24, xl: 32, full: 999 }
export const SHADOW = {
  none: 'none',
  subtle: '0 1px 3px rgba(0,0,0,.14)',
  small: '0 2px 8px rgba(0,0,0,.18)',
  medium: '0 6px 20px rgba(0,0,0,.2)',
  large: '0 16px 40px rgba(0,0,0,.28)',
}
export const MAX_W = { small: '720px', medium: '1024px', large: '1280px', xl: '1440px', full: '100%' }
export const HERO_H = { small: 280, medium: 400, large: 560, xl: 720 }
export const BLOCK_H = { small: 200, medium: 340, large: 480, xl: 600 }
export const HEADER_H = { small: 56, medium: 72, large: 88 }
export const HEADING = { small: 1.4, medium: 1.9, large: 2.5, xl: 3.2 }
export const BODY = { small: '0.875rem', medium: '1rem', large: '1.125rem' }
export const WEIGHT = { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }
export const FONTS = {
  inter: ['Inter', 'sans-serif'], montserrat: ['Montserrat', 'sans-serif'], poppins: ['Poppins', 'sans-serif'],
  roboto: ['Roboto', 'sans-serif'], playfair: ['Playfair Display', 'serif'], lora: ['Lora', 'serif'],
  oswald: ['Oswald', 'sans-serif'], raleway: ['Raleway', 'sans-serif'], 'dm-sans': ['DM Sans', 'sans-serif'],
}

export const space = (k) => look(SPACE, k)
export const gap = (k) => look(GAP, k)
export const sectionGap = (k) => look(SECTION_GAP, k)
export const radius = (k) => look(RADIUS, k)
export const shadow = (k) => look(SHADOW, k, SHADOW.subtle)

export function fontStack(name = 'inter') {
  const [family, generic] = FONTS[String(name).toLowerCase()] || [String(name).replace(/[-_]/g, ' '), 'sans-serif']
  return { family, css: `'${family}', ${generic}`, href:
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900&display=swap` }
}

// Pick black/white text for a given background so LLM-chosen colours stay readable.
export function readable(hex, light = '#ffffff', dark = '#000000') {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim())
  if (!m) return light
  let h = m[1]; if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? dark : light
}
