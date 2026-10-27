export const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

// Deep merge. null/undefined values in `over` are ignored so LLM nulls never wipe out defaults.
export function merge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined || over === null ? base : over
  const out = { ...base }
  for (const k of Object.keys(over)) {
    const v = over[k]
    if (v === null || v === undefined) continue
    out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v
  }
  return out
}

// Pick a value per breakpoint, falling back to smaller screens when null (e.g. large_desktop: null).
const ORDER = {
  mobile: ['mobile'],
  tablet: ['tablet', 'mobile'],
  desktop: ['desktop', 'tablet', 'mobile'],
  large_desktop: ['large_desktop', 'desktop', 'tablet', 'mobile'],
}
export function pick(obj, bp, fallback) {
  if (!obj) return fallback
  for (const k of ORDER[bp]) if (obj[k] !== null && obj[k] !== undefined) return obj[k]
  return fallback
}
