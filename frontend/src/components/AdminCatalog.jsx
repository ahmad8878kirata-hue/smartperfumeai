import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { loadFragrances, saveFragrances, defaultFragrances } from '../data/fragrances'

const ADMIN_USERNAME = 'admin'
const AUTH_KEY = 'smartperfume_admin_auth'
const ADMIN_TOKEN_KEY = 'smartperfume_admin_token'
const PAGE_SIZE = 4

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid =
      username === ADMIN_USERNAME &&
      password.length >= 1 &&
      password.length <= 8
    if (!valid) {
      setError('Invalid username or password.')
      return
    }
    let token = null
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        const data = await res.json()
        token = data.token ?? null
      }
    } catch {
      token = null
    }
    onLogin(token)
  }

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-secondary/10 blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl -bottom-20 -right-20" />
      <div className="relative z-10 glass-panel w-full max-w-md p-8 md:p-12 rounded-xl">
        <div className="mb-10 text-center">
          <span className="material-symbols-outlined text-4xl text-secondary mb-4 block">admin_panel_settings</span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Admin Access</h1>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
            Restricted area. Sign in to manage the fragrance catalog.
          </p>
        </div>
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm bg-error-container/20 text-error border border-error/30">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md text-on-surface focus:border-secondary/60 outline-none"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md text-on-surface focus:border-secondary/60 outline-none"
              placeholder="1 to 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-secondary text-on-secondary font-label-caps text-label-caps rounded-lg tracking-widest uppercase transition-all hover:bg-secondary-fixed active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminCatalog() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY))
  const [fragrances, setFragrances] = useState(loadFragrances)
  const [search, setSearch] = useState('')
  const [activeView, setActiveView] = useState('catalog')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingFragrance, setEditingFragrance] = useState(null)

  useEffect(() => {
    saveFragrances(fragrances)
  }, [fragrances])

  const handleLogin = (token) => {
    localStorage.setItem(AUTH_KEY, '1')
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
      setAdminToken(token)
    }
    setAuthed(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setAdminToken(null)
    setAuthed(false)
  }

  const filtered = fragrances.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.brand.toLowerCase().includes(search.toLowerCase()) ||
      f.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const handleDelete = (id) => {
    setFragrances((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSave = (form) => {
    if (editingFragrance) {
      setFragrances((prev) =>
        prev.map((f) =>
          f.id === editingFragrance.id
            ? {
              ...f,
              name: form.name,
              brand: form.brand,
              ingredients: form.ingredients
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean),
              price: Number(form.price),
              notes: form.notes,
              rating: Number(form.rating) || f.rating,
              image: form.image,
            }
            : f
        )
      )
    } else {
      const nextNum =
        Math.max(0, ...fragrances.map((f) => {
          const n = parseInt(f.id.replace(/\D/g, ''), 10)
          return Number.isFinite(n) ? n : 0
        })) + 1
      const newFragrance = {
        id: `PF-${String(nextNum).padStart(3, '0')}`,
        name: form.name,
        brand: form.brand,
        ingredients: form.ingredients
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
        price: Number(form.price),
        notes: form.notes,
        rating: Number(form.rating) || 4.0,
        image: form.image,
      }
      setFragrances((prev) => [...prev, newFragrance])
    }
    setShowModal(false)
    setEditingFragrance(null)
  }

  const openAdd = () => {
    setEditingFragrance(null)
    setShowModal(true)
  }

  const openEdit = (fragrance) => {
    setEditingFragrance(fragrance)
    setShowModal(true)
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'catalog', label: 'Catalog', icon: 'list_alt' },
    { key: 'cart', label: 'Cart Requests', icon: 'shopping_bag' },
  ]

  const avgPrice =
    fragrances.length > 0
      ? fragrances.reduce((sum, f) => sum + f.price, 0) / fragrances.length
      : 0

  return (
    <div className="font-body-md text-body-md bg-surface-dim text-on-surface min-h-screen">
      <aside className="h-screen w-20 lg:w-64 fixed left-0 top-0 bg-surface-container-low backdrop-blur-xl border-r border-on-surface/5 flex flex-col p-4 lg:p-gutter z-50">
        <div className="mb-8 lg:mb-10 text-center lg:text-left">
          <h1 className="font-headline-md text-headline-md text-on-surface hidden lg:block mb-1">Admin Panel</h1>
          <p className="font-label-caps text-label-caps text-on-tertiary-container hidden lg:block">
            Catalog Management
          </p>
          <span className="material-symbols-outlined text-secondary lg:hidden block mx-auto">admin_panel_settings</span>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-lg transition-all duration-150 active:scale-95 ${isActive
                    ? 'text-secondary font-bold bg-surface-container-highest/20'
                    : 'text-on-tertiary-container hover:bg-surface-container-high/50'
                  }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-label-caps text-label-caps hidden lg:inline">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button
          onClick={openAdd}
          className="mb-8 w-full py-3 lg:py-4 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="hidden lg:inline">Add New Perfume</span>
        </button>

        <div className="mt-auto border-t border-outline-variant/20 pt-4 lg:pt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2 rounded-lg text-on-tertiary-container hover:bg-surface-container-high/50 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-caps text-label-caps hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      <main className="ml-20 lg:ml-64 min-h-screen flex flex-col">
        <div className="flex-grow px-margin-mobile md:px-margin-desktop py-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-10">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                {activeView === 'dashboard' ? 'Dashboard' : activeView === 'cart' ? 'Cart Requests' : 'Perfume Catalog'}
              </h2>
              <p className="text-on-surface-variant max-w-lg">
                {activeView === 'dashboard'
                  ? 'An overview of your digital fragrance library.'
                  : activeView === 'cart'
                    ? 'Live requests from shoppers as they add fragrances to their carts.'
                    : 'Manage your digital fragrance library. Refine scent profiles and oversee ingredients for SmartPerfume.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              {activeView === 'catalog' && (
                <div className="glass-panel rounded-full flex items-center px-4 py-2 flex-1 sm:flex-none sm:min-w-[260px]">
                  <span className="material-symbols-outlined text-outline-variant mr-3">search</span>
                  <input
                    className="bg-transparent border-none focus:ring-0 text-body-md w-full placeholder:text-outline-variant"
                    placeholder="Search by name, note, or brand..."
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
              )}
              <button className="glass-panel p-3 rounded-lg hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="glass-panel p-6 rounded-xl">
              <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">Total Perfumes</p>
              <p className="font-headline-md text-headline-md text-secondary">{fragrances.length}</p>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">Average Price</p>
              <p className="font-headline-md text-headline-md text-primary">&euro;{avgPrice.toFixed(2)}</p>
            </div>
          </div>

          {activeView === 'catalog' && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">ID</th>
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Name</th>
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Brand</th>
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Main Ingredients</th>
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Price (&euro;)</th>
                      <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {pageItems.map((f) => (
                      <tr key={f.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6 text-on-surface-variant">{f.id}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-highest flex items-center justify-center">
                              {f.image ? (
                                <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant">spa</span>
                              )}
                            </div>
                            <span className="font-body-lg text-body-lg text-on-surface font-medium">{f.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-on-surface-variant italic">{f.brand}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            {f.ingredients.map((ing) => (
                              <span
                                key={ing}
                                className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-[10px] font-label-caps border border-secondary-fixed/20 uppercase"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-body-lg text-secondary-fixed">&euro;{f.price.toFixed(2)}</td>
                        <td className="px-8 py-6 text-right space-x-2">
                          <button className="p-2 text-outline hover:text-secondary-fixed transition-colors" onClick={() => openEdit(f)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="p-2 text-outline hover:text-error transition-colors" onClick={() => handleDelete(f.id)}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pageItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                          No perfumes match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-low/30">
                <p className="text-on-tertiary-container font-label-caps text-label-caps">
                  {filtered.length === 0
                    ? 'Showing 0 entries'
                    : `Showing ${startIndex + 1} to ${Math.min(startIndex + PAGE_SIZE, filtered.length)} of ${filtered.length} entries`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="glass-panel px-4 py-2 rounded-lg text-label-caps font-label-caps hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="glass-panel px-4 py-2 rounded-lg text-label-caps font-label-caps hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'cart' && <CartRequests token={adminToken} />}
        </div>

        <footer className="w-full py-12 border-t border-outline-variant/20 bg-surface-dim flex flex-col items-center justify-center space-y-base px-margin-desktop">
<<<<<<< HEAD
          <div className="font-headline-md text-headline-md text-on-surface">SmartParfum</div>
          <p className="text-on-surface-variant font-body-md text-body-md">
            &copy; 2026 SmartParfum.
=======
          <div className="font-headline-md text-headline-md text-on-surface">SmartPerfume</div>
          <p className="text-on-surface-variant font-body-md text-body-md">
            &copy; 2026 SmartPerfume. The Art of Fine Fragrance.
>>>>>>> 0f9c54c25f8b07a16c276911abeaf7b99b87addc
          </p>
        </footer>
      </main>

      {showModal && (
        <PerfumeModal
          initial={editingFragrance}
          defaultImage={defaultFragrances[0].image}
          onClose={() => {
            setShowModal(false)
            setEditingFragrance(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function CartRequests({ token }) {
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/admin/carts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Admin session expired. Log out and sign in again.' : 'Failed to load cart requests.')
      }
      const data = await res.json()
      setCarts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [load])

  const rows = carts.flatMap((c) =>
    (c.items ?? []).map((item) => ({ ...item, email: c.email }))
  )
  const userCount = carts.length
  const itemCount = rows.reduce((sum, r) => sum + (Number(r.qty) || 1), 0)
  const totalValue = rows.reduce(
    (sum, r) => sum + Number(r.price || 0) * (Number(r.qty) || 1),
    0
  )

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-8 py-5 flex flex-wrap items-center justify-between gap-6 border-b border-outline-variant/10 bg-surface-container-low/50">
        <div className="flex gap-6 sm:gap-10">
          <div>
            <p className="font-label-caps text-label-caps text-on-tertiary-container mb-1">Shoppers with carts</p>
            <p className="font-headline-md text-headline-md text-secondary">{userCount}</p>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-tertiary-container mb-1">Total items</p>
            <p className="font-headline-md text-headline-md text-secondary">{itemCount}</p>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-tertiary-container mb-1">Cart value</p>
            <p className="font-headline-md text-headline-md text-primary">&euro;{totalValue.toFixed(2)}</p>
          </div>
        </div>
        <button
          onClick={load}
          className="glass-panel px-4 py-2 rounded-lg text-label-caps font-label-caps hover:bg-surface-container-high transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-8 py-4 text-sm bg-error-container/20 text-error border-b border-error/30">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">User</th>
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Fragrance</th>
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Brand</th>
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Qty</th>
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Price (&euro;)</th>
              <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Total (&euro;)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((r, i) => (
              <tr key={`${r.email}-${r.id}-${i}`} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 text-on-surface">{r.email}</td>
                <td className="px-8 py-6 font-body-lg text-body-lg text-on-surface font-medium">{r.name}</td>
                <td className="px-8 py-6 text-on-surface-variant italic">{r.brand}</td>
                <td className="px-8 py-6 text-on-surface-variant">{r.qty}</td>
                <td className="px-8 py-6 text-on-surface-variant">&euro;{Number(r.price || 0).toFixed(2)}</td>
                <td className="px-8 py-6 font-body-lg text-secondary-fixed">
                  &euro;{(Number(r.price || 0) * (Number(r.qty) || 1)).toFixed(2)}
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                  Loading cart requests...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                  No cart requests yet. When a shopper adds items to their cart, they will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PerfumeModal({ initial, defaultImage, onClose, onSave }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? '',
    brand: initial?.brand ?? '',
    price: initial?.price ?? '',
    ingredients: initial ? initial.ingredients.join(', ') : '',
    notes: initial?.notes ?? '',
    rating: initial?.rating ?? '',
    image: initial?.image ?? defaultImage,
  }))
  const [error, setError] = useState(null)

  const imageOptions = defaultFragrances
    .filter((f, i, arr) => arr.findIndex((x) => x.image === f.image) === i)
    .map((f) => ({ image: f.image, label: f.name }))

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.brand.trim() || !form.price || Number(form.price) <= 0) {
      setError('Name, brand, and a valid price are required.')
      return
    }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-lg rounded-xl p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {isEdit ? 'Edit Perfume' : 'Add New Perfume'}
          </h3>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm bg-error-container/20 text-error border border-error/30">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Name</label>
            <input
              type="text"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Brand</label>
            <input
              type="text"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
              value={form.brand}
              onChange={set('brand')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Price (&euro;)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
                value={form.price}
                onChange={set('price')}
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Rating (0&ndash;5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
                value={form.rating}
                onChange={set('rating')}
              />
            </div>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
              placeholder="Bergamot, Oud, Vetiver"
              value={form.ingredients}
              onChange={set('ingredients')}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Notes</label>
            <input
              type="text"
              className="w-full bg-transparent border border-outline-variant/30 rounded-lg px-4 py-3 text-body-md focus:border-secondary/60 outline-none"
              value={form.notes}
              onChange={set('notes')}
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-tertiary-container mb-2 uppercase">Bottle Image</label>
            <div className="grid grid-cols-3 gap-3">
              {imageOptions.map(({ image, label }) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image }))}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    form.image === image ? 'border-secondary' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <p className="px-1 py-1.5 text-[10px] font-label-caps text-on-surface-variant text-center leading-tight">
                    {label}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-outline-variant/40 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed transition-all"
            >
              {isEdit ? 'Save Changes' : 'Add Perfume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

PerfumeModal.propTypes = {
  initial: PropTypes.object,
  defaultImage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

CartRequests.propTypes = {
  token: PropTypes.string,
}
