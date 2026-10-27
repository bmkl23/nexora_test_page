import { createContext, useContext, useEffect, useMemo } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { merge, pick } from '../config/merge'
import { DEFAULT_THEME, DEFAULT_LAYOUT, DEFAULT_BEHAVIOUR, DEFAULT_ACCESSIBILITY } from '../config/defaults'
import { space, sectionGap, radius, shadow, fontStack, readable, MAX_W, BODY, WEIGHT } from './tokens'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

// CSS variables for a layout block (global layout, or a page's own layout override).
export function layoutVars(layout, theme, bp) {
  const l = merge(DEFAULT_LAYOUT, layout)
  const bg = l.background || {}
  const color = bg.color || theme.background_color
  const background = bg.type === 'gradient' && bg.secondary_color
    ? `linear-gradient(${bg.gradient_direction === 'vertical' ? 'to bottom' : 'to right'}, ${color}, ${bg.secondary_color})`
    : color
  return {
    '--maxw': MAX_W[l.max_width] || MAX_W.large,
    '--pad-x': `${space(pick(l.page_padding, bp, 'medium'))}px`,
    '--section-gap': `${sectionGap(l.section_gap)}px`,
    '--bg': background,
  }
}

export function ThemeProvider({ config, children }) {
  const bp = useBreakpoint()
  const value = useMemo(() => {
    const theme = merge(DEFAULT_THEME, config?.theme)
    const behaviour = merge(DEFAULT_BEHAVIOUR, config?.behaviour)
    const a11y = merge(DEFAULT_ACCESSIBILITY, config?.accessibility)
    return { config, theme, behaviour, a11y, reduceMotion: a11y.reduce_motion || !behaviour.enable_animations }
  }, [config])

  const font = fontStack(value.theme.typography.font_family)
  useEffect(() => {
    const id = `gf-${font.family.replace(/\s/g, '')}`
    if (document.getElementById(id)) return
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = font.href
    document.head.appendChild(l)
  }, [font.family, font.href])

  const { theme, a11y, behaviour } = value
  const t = theme.typography
  const hi = a11y.high_contrast
  const text = hi ? readable(theme.background_color, '#fff', '#000') : theme.text_color
  const vars = {
    '--primary': theme.primary_color, '--secondary': theme.secondary_color, '--accent': theme.accent_color,
    '--surface': theme.surface_color, '--text': text, '--muted': theme.muted_text_color,
    '--border': theme.border_color, '--success': theme.success_color, '--warning': theme.warning_color,
    '--error': theme.error_color,
    '--heading': t.heading_color || text, '--body-color': hi ? text : (t.body_color || text),
    '--on-primary': readable(theme.primary_color),
    '--font': font.css,
    '--radius': `${radius(theme.global_border_radius)}px`,
    '--shadow': shadow(theme.global_shadow),
    '--body-size': a11y.large_text ? BODY.large : (BODY[t.body_size] || BODY.medium),
    '--heading-weight': WEIGHT[t.heading_weight] || 600,
    '--body-weight': WEIGHT[t.body_weight] || 400,
    '--align': t.text_alignment || 'left',
    ...layoutVars(config?.layout, theme, bp),
  }

  return (
    <Ctx.Provider value={{ ...value, bp }}>
      <div className="store" style={{ ...vars, scrollBehavior: behaviour.enable_smooth_scroll ? 'smooth' : 'auto' }}
           data-hover={behaviour.enable_hover_effects ? 'on' : 'off'}>
        {children}
      </div>
    </Ctx.Provider>
  )
}
