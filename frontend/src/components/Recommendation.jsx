import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'
import { useCart } from '../context/CartContext'

const product = {
  id: 'PF-005',
  name: "L'Essence C\u00e9leste",
  brand: 'SmartPerfume AI',
  price: 145.00,
}

export default function Recommendation() {
  const navigate = useNavigate()
  const { surveyDone } = useSurvey()
  const { items, addItem, removeItem } = useCart()
  const [cartMsg, setCartMsg] = useState(null)

  const inCart = items.some((i) => i.id === product.id)

  useEffect(() => {
    if (!surveyDone) {
      navigate('/home', { replace: true })
    }
  }, [surveyDone, navigate])

  const handleCartAction = () => {
    if (inCart) {
      removeItem(product.id)
      setCartMsg('Removed from your collection.')
    } else {
      addItem(product)
      setCartMsg('Added to your collection!')
    }
    setTimeout(() => setCartMsg(null), 2500)
  }

  if (!surveyDone) return null

  return (
    <div className="bg-background text-on-surface selection:bg-secondary-fixed/30 font-body-md">
      {cartMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg bg-secondary-container/20 text-secondary-fixed border border-secondary-fixed/30 font-label-caps text-label-caps tracking-wider uppercase shadow-2xl">
          {cartMsg}
        </div>
      )}

      <main className="min-h-screen">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] floating-element" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] floating-element" style={{ animationDelay: '-5s' }} />
        </div>

        <section className="relative z-10 pt-20 pb-12 px-margin-desktop text-center max-w-container-max mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 glass-card rounded-full mb-8">
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Digital Advisor Match</span>
          </div>
          <h1 className="font-headline-display text-headline-display mb-6 leading-tight">
            Your Perfect Match:<br />
            <span className="text-secondary-fixed italic">The Digital Advisor has found your signature scent.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-80">
            Based on your sensory preferences and personality profile, we&apos;ve computationally synthesized a fragrance that
            resonates with your core identity.
          </p>
        </section>

        <section className="relative z-10 pb-32 px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-7 relative h-[600px] rounded-2xl overflow-hidden glass-card group">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-9xl opacity-20">spa</span>
                </div>
              </div>
              <div className="absolute top-8 left-8 glass-card px-4 py-2 rounded-lg border border-secondary/20">
                <span className="font-label-caps text-label-caps text-on-surface">Scientific Synthesis No. 842</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-12 rounded-2xl glass-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <button className="p-3 rounded-full glass-card hover:bg-secondary/20 transition-all active:scale-90">
                  <span className="material-symbols-outlined text-on-surface">favorite</span>
                </button>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-secondary-fixed mb-4 tracking-[0.2em] uppercase">Signature Scent</div>
                <h2 className="font-headline-lg text-headline-lg mb-4">L&apos;Essence C&eacute;leste</h2>
                <div className="flex items-center space-x-4 mb-8">
                  <span className="font-headline-md text-headline-md text-secondary-fixed">&euro;145.00</span>
                  <div className="px-3 py-1 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20">
                    <span className="font-label-caps text-[10px] text-secondary-fixed">IN STOCK</span>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 border-b border-outline-variant/30 pb-2">Olfactory Profile</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 glass-card rounded-full font-label-caps text-label-caps text-on-surface border border-outline-variant/20">Bergamot</span>
                      <span className="px-4 py-2 glass-card rounded-full font-label-caps text-label-caps text-on-surface border border-outline-variant/20">Oud</span>
                      <span className="px-4 py-2 glass-card rounded-full font-label-caps text-label-caps text-on-surface border border-outline-variant/20">Midnight Jasmine</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-surface-container-highest/10 border border-outline-variant/10">
                    <p className="font-body-md text-body-md italic text-on-surface-variant opacity-90">
                      &ldquo;A sophisticated blend designed for the visionary. The brightness of bergamot meets the deep
                      complexity of ancient oud, unified by the elusive charm of night-blooming jasmine.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 space-y-4">
                <button
                  onClick={handleCartAction}
                  className={`w-full py-5 font-label-caps text-label-caps rounded-xl flex items-center justify-center space-x-3 transition-all active:scale-[0.98] ${
                    inCart
                      ? 'bg-error-container/20 text-error border border-error/30 hover:bg-error-container/30'
                      : 'bg-secondary text-on-secondary-fixed hover:shadow-[0_0_30px_rgba(233,195,73,0.3)]'
                  }`}
                >
                  <span className="material-symbols-outlined">{inCart ? 'delete' : 'shopping_bag'}</span>
                  <span>{inCart ? 'Remove from Cart' : 'Add to Cart'}</span>
                </button>
                <div className="flex justify-center">
                  <Link to="/quiz" className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors flex items-center space-x-2 py-2">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span>Retake Quiz</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="p-8 rounded-2xl glass-card group cursor-pointer hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-secondary mb-4">science</span>
              <h4 className="font-headline-md text-headline-md mb-2">Molecular Design</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Every note is analyzed for its psychological impact on the wearer and those around them.</p>
            </div>
            <div className="p-8 rounded-2xl glass-card group cursor-pointer hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-secondary mb-4">eco</span>
              <h4 className="font-headline-md text-headline-md mb-2">Sustainably Sourced</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Our raw materials are ethically harvested from heritage estates across the globe.</p>
            </div>
            <div className="p-8 rounded-2xl glass-card group cursor-pointer hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-secondary mb-4">auto_awesome</span>
              <h4 className="font-headline-md text-headline-md mb-2">Smart Scent Tech</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Adaptive molecular release ensures your signature scent evolves gracefully throughout the day.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
