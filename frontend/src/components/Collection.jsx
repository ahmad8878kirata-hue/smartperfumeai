import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { loadFragrances } from '../data/fragrances'

const allFragrances = loadFragrances()

export default function Collection() {
  const { items, addItem, removeItem } = useCart()
  const [msg, setMsg] = useState(null)

  const inCart = (id) => items.some((i) => i.id === id)

  const toggleCart = (f) => {
    if (inCart(f.id)) {
      removeItem(f.id)
      setMsg(`${f.name} removed from cart.`)
    } else {
      addItem(f)
      setMsg(`${f.name} added to cart!`)
    }
    setTimeout(() => setMsg(null), 2000)
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      {msg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg bg-secondary-container/20 text-secondary-fixed border border-secondary-fixed/30 font-label-caps text-label-caps tracking-wider uppercase shadow-2xl">
          {msg}
        </div>
      )}

      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Fragrance Collection</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Browse our curated selection of fine fragrances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {allFragrances.map((f) => (
          <div key={f.id} className="glass-card rounded-xl p-6 group hover:bg-surface-container-high transition-all">
            <div className="w-full h-48 rounded-xl bg-surface-container-higher mb-5 overflow-hidden relative">
              <img src={f.image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3">
                <h3 className="font-headline-md text-headline-md text-white tracking-wide px-3 text-center">{f.name}</h3>
              </div>
            </div>
            <div className="flex items-start justify-between mb-3">
              <p className="font-label-caps text-label-caps text-on-surface-variant">{f.brand}</p>
              <div className="flex items-center gap-1 text-secondary-fixed">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-body-md text-body-md">{f.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {f.ingredients.map((ing) => (
                <span key={ing} className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-[10px] font-label-caps border border-secondary-fixed/20 uppercase">
                  {ing}
                </span>
              ))}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Notes: </span>
              {f.notes}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
              <span className="font-headline-md text-headline-md text-secondary-fixed">&euro;{f.price.toFixed(2)}</span>
              <button
                onClick={() => toggleCart(f)}
                className={`px-5 py-2 rounded-full font-label-caps text-label-caps transition-all active:scale-95 ${
                  inCart(f.id)
                    ? 'bg-error-container/20 text-error border border-error/30 hover:bg-error-container/30'
                    : 'bg-secondary text-on-secondary hover:opacity-90 shadow-lg shadow-secondary/10'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">{inCart(f.id) ? 'delete' : 'shopping_bag'}</span>
                  {inCart(f.id) ? 'Remove' : 'Add to Cart'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
