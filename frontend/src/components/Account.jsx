import { useNavigate } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'
import { useCart } from '../context/CartContext'

export default function Account() {
  const navigate = useNavigate()
  const { surveyDone, setSurveyDone } = useSurvey()
  const { items, totalItems, clearCart } = useCart()

  const handleLogout = () => {
    setSurveyDone(false)
    clearCart()
    navigate('/login')
  }

  return (
    <div className="min-h-[70vh] px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">My Account</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your scent profile and preferences.</p>
      </div>

      {!surveyDone && (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-7xl text-on-surface-variant opacity-30 mb-4">account_circle</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Guest Mode</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
            Sign in or complete the scent survey to unlock your personalized account dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg border border-secondary text-secondary font-label-caps text-label-caps hover:bg-secondary/5 transition-all active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="px-8 py-3 rounded-lg bg-secondary text-on-secondary font-label-caps text-label-caps hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Complete Survey
            </button>
          </div>
        </div>
      )}

      {surveyDone && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-secondary-fixed">account_circle</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Perfume Enthusiast</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Scent Profile: Active</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-surface-container-highest/30">
                  <p className="font-headline-md text-headline-md text-secondary-fixed">1</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Scent Match</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-surface-container-highest/30">
                  <p className="font-headline-md text-headline-md text-secondary-fixed">{totalItems}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Cart Items</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-surface-container-highest/30">
                  <p className="font-headline-md text-headline-md text-secondary-fixed">{surveyDone ? '4/4' : '0/4'}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Quiz Done</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Your Scent Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                    <span className="font-body-md text-body-md text-on-surface">Scent Discovery Quiz</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[10px] border border-secondary-fixed/20">
                    COMPLETED
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                    <span className="font-body-md text-body-md text-on-surface">Fragrance Recommendation</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[10px] border border-secondary-fixed/20">
                    READY
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/20">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${items.length > 0 ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>
                      {items.length > 0 ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">Add to Collection</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-label-caps text-[10px] border ${
                    items.length > 0
                      ? 'bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/20'
                      : 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20'
                  }`}>
                    {items.length > 0 ? `${items.length} ITEM${items.length > 1 ? 'S' : ''}` : 'PENDING'}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-outline-variant/10">
                <button
                  onClick={() => navigate('/recommendation')}
                  className="w-full py-4 bg-secondary text-on-secondary rounded-xl font-label-caps text-label-caps hover:opacity-90 transition-all active:scale-95"
                >
                  View Your Recommended Scent
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-secondary-fixed opacity-50 mb-4">auto_awesome</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Digital Advisor</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Your AI scent profile is active and ready.
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="w-full py-3 rounded-lg border border-secondary/30 text-secondary font-label-caps text-label-caps hover:bg-secondary/5 transition-all active:scale-95"
              >
                Retake Quiz
              </button>
            </div>
            <div className="glass-card rounded-xl p-8">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Settings</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high/50 transition-all"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span className="font-body-md text-body-md">View Cart</span>
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high/50 transition-all"
                >
                  <span className="material-symbols-outlined">home</span>
                  <span className="font-body-md text-body-md">Home</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span className="font-body-md text-body-md">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
