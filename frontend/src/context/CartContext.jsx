import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [pendingSync, setPendingSync] = useState(null)
  const fetching = useRef(false)

  const token = user?.token

  const apiCart = useCallback(async (method, body = null) => {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    if (body) opts.body = JSON.stringify(body)
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch('/api/cart', opts)
    if (!res.ok) throw new Error('API error')
    return res.json()
  }, [token])

  useEffect(() => {
    if (fetching.current) return
    fetching.current = true

    if (token) {
      fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((cart) => {
          setItems(cart)
          setLoaded(true)
          fetching.current = false
        })
        .catch(() => {
          const saved = localStorage.getItem('smartperfume_cart')
          setItems(saved ? JSON.parse(saved) : [])
          setLoaded(true)
          fetching.current = false
        })
    } else {
      const saved = localStorage.getItem('smartperfume_cart')
      setItems(saved ? JSON.parse(saved) : [])
      setLoaded(true)
      fetching.current = false
    }
  }, [token])

  useEffect(() => {
    if (!loaded) return
    if (token) return
    localStorage.setItem('smartperfume_cart', JSON.stringify(items))
  }, [items, loaded, token])

  const addItem = async (product) => {
    const newItem = { ...product, qty: 1 }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, newItem]
    })
    if (token) {
      try {
        await apiCart('POST', { id: product.id, name: product.name, brand: product.brand || '', price: product.price, qty: 1 })
      } catch { /* keep local */ }
    }
  }

  const removeItem = async (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (token) {
      try {
        await fetch(`/api/cart/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch { /* keep local */ }
    }
  }

  const updateQty = async (id, qty) => {
    if (qty <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    )
    if (token) {
      try {
        await fetch(`/api/cart/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ qty }),
        })
      } catch { /* keep local */ }
    }
  }

  const clearCart = async () => {
    setItems([])
    if (token) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch { /* keep local */ }
    } else {
      localStorage.removeItem('smartperfume_cart')
    }
  }

  const totalItems = items.reduce((sum, i) => sum + (i.qty || 1), 0)
  const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, loaded }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
