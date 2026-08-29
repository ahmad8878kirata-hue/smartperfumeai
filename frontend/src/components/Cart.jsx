import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart()

  return (
    <div className="min-h-[70vh] px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Your Cart</h1>
<<<<<<< HEAD
        <p className="font-body-lg text-body-lg text-on-surface-variant">Review your selected fragrances before continuing.</p>
=======
        <p className="font-body-lg text-body-lg text-on-surface-variant">Review your curated fragrance collection.</p>
>>>>>>> 0f9c54c25f8b07a16c276911abeaf7b99b87addc
      </div>

      {items.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-7xl text-on-surface-variant opacity-30 mb-4">shopping_bag</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Your Cart is Empty</h2>
<<<<<<< HEAD
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Explore your recommended fragrance and add it to your cart.</p>
=======
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Explore your recommended fragrance and add it to your collection.</p>
>>>>>>> 0f9c54c25f8b07a16c276911abeaf7b99b87addc
          <Link
            to="/recommendation"
            className="inline-block bg-secondary text-on-secondary px-8 py-3 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
<<<<<<< HEAD
            View Recommendation
=======
            View Your Scent
>>>>>>> 0f9c54c25f8b07a16c276911abeaf7b99b87addc
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex flex-col space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-secondary-fixed">spa</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">{item.name}</h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">{item.brand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-outline-variant/30 rounded-lg">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="px-3 py-2 text-on-surface-variant hover:text-secondary-fixed transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="px-4 py-2 text-on-surface font-body-md min-w-[40px] text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="px-3 py-2 text-on-surface-variant hover:text-secondary-fixed transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <span className="font-headline-md text-headline-md text-secondary-fixed min-w-[80px] text-right">
                    &euro;{(item.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
              <p className="font-headline-lg text-headline-lg text-secondary-fixed">&euro;{totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="px-6 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-all active:scale-95"
              >
                Clear All
              </button>
              <button
                onClick={() => navigate('/recommendation')}
                className="px-8 py-3 rounded-lg bg-secondary text-on-secondary font-label-caps text-label-caps hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
