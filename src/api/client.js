// Shops/products live on API Gateway; design configs live on a separate server.
const BASE = import.meta.env.VITE_API_BASE || '/api'
const DESIGN_BASE = import.meta.env.VITE_DESIGN_API_BASE || '/design-api'

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function request(path, { method = 'GET', body, token, timeout = 90000, base = BASE } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    })
    const text = await res.text()
    const data = text ? safeJson(text) : null
    if (!res.ok) throw new ApiError(data?.message || data?.error || `Request failed (${res.status})`, res.status)
    return data
  } catch (e) {
    if (e.name === 'AbortError') throw new ApiError('The request timed out. Try again.', 0)
    if (e instanceof ApiError) throw e
    throw new ApiError('Cannot reach the API. Check your connection or the proxy target in vite.config.js.', 0)
  } finally { clearTimeout(t) }
}
const safeJson = (t) => { try { return JSON.parse(t) } catch { return t } }

// Verify these paths against Postman. They are inferred from your screenshots.
export const designsApi = {
  list: () => request('/design-configs', { base: DESIGN_BASE }),                       // -> [{ id, config }]
  get: (id) => request(`/design-configs/${id}`, { base: DESIGN_BASE }),               // -> { id, config } (or config)
  // Body is the shape from your add_new_design file.
  create: (description) => request('/design-configs', {
    method: 'POST', base: DESIGN_BASE,
    body: { shop_owner_design_description: description },
  }),
}
export const shopsApi = {
  byCategory: (category) => request(`/shop/user/${encodeURIComponent(category)}`), // -> { category, shops: [...] }
}
export const productsApi = {
  byShop: (shopId) => request(`/product/shop/${shopId}`),      // -> { shop_id, products: [...] }
}
