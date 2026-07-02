import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const allFragrances = [
  { id: 'PF-001', name: 'Midnight Oud', brand: "L'Artiste Digital", ingredients: ['Oud', 'Saffron', 'Leather'], price: 185, notes: 'Woody, Smoky, Luxurious', rating: 4.8 },
  { id: 'PF-002', name: 'Solaris Mist', brand: 'Neo-Olfactive', ingredients: ['Bergamot', 'Amber', 'Sea Salt'], price: 140, notes: 'Fresh, Aquatic, Warm', rating: 4.6 },
  { id: 'PF-003', name: 'Cipher Green', brand: 'Algorithm Scent', ingredients: ['Vetiver', 'Oakmoss', 'Green Tea'], price: 210, notes: 'Earthy, Green, Sophisticated', rating: 4.7 },
  { id: 'PF-004', name: 'Velvet Logic', brand: 'SmartPerfume AI', ingredients: ['Rose', 'Patchouli', 'Vanilla'], price: 245, notes: 'Floral, Deep, Sensual', rating: 4.9 },
  { id: 'PF-005', name: "L'Essence C\u00e9leste", brand: 'SmartPerfume AI', ingredients: ['Bergamot', 'Oud', 'Midnight Jasmine'], price: 145, notes: 'Elegant, Complex, Visionary', rating: 5.0 },
]

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
        <p className="font-body-lg text-body-lg text-on-surface-variant">Browse our AI-curated selection of computational fragrances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {allFragrances.map((f) => (
          <div key={f.id} className="glass-card rounded-xl p-6 group hover:bg-surface-container-high transition-all">
            <div className="w-full h-48 rounded-xl bg-surface-container-higher mb-5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/10 to-surface-container-highest" />
              <span className="material-symbols-outlined text-7xl text-secondary-fixed opacity-30 relative z-10">spa</span>
            </div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{f.name}</h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">{f.brand}</p>
              </div>
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
