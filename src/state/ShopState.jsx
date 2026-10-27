import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

// Minimal client-side cart + wishlist. Swap for API calls (add_order) when ready.
export function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wish, setWish] = useState(() => new Set())
  const [toast, setToast] = useState('')

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const addToCart = useCallback((p) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id)
      return i >= 0 ? c.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...p, qty: 1 }]
    })
    say(`${p.name} added to cart`)
  }, [])
  const toggleWish = useCallback((p) => setWish((s) => {
    const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n
  }), [])

  const value = useMemo(() => ({
    cart, cartCount: cart.reduce((a, x) => a + x.qty, 0), wishCount: wish.size,
    addToCart, toggleWish, isWished: (id) => wish.has(id),
  }), [cart, wish, addToCart, toggleWish])

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </Ctx.Provider>
  )
}
