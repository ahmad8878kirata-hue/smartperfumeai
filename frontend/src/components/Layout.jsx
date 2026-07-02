import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Discover', path: '/home', icon: 'explore' },
  { label: 'Collection', path: '/collection', icon: 'inventory_2', needsSurvey: true },
  { label: 'Journal', path: '/journal', icon: 'menu_book', needsSurvey: true },
  { label: 'About', path: '/about', icon: 'info', needsSurvey: true },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { surveyDone } = useSurvey()
  const { totalItems } = useCart()
  const [lockMsg, setLockMsg] = useState(null)

  const handleNavClick = (e, link) => {
    if (link.needsSurvey && !surveyDone) {
      e.preventDefault()
      setLockMsg(`Complete the survey first to access "${link.label}"`)
      setTimeout(() => setLockMsg(null), 3000)
      return
    }
    setLockMsg(null)
  }

  const handleCartClick = () => {
    if (!surveyDone) {
      setLockMsg('Complete the survey first to view your cart')
      setTimeout(() => setLockMsg(null), 3000)
      return
    }
    navigate('/cart')
  }

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex flex-col font-body-md">
      <nav className="w-full top-0 sticky z-50 bg-surface-container/60 backdrop-blur-3xl border-b border-on-surface/10">
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link to="/home" className="font-headline-md text-headline-md text-on-surface tracking-tight cursor-pointer">
            SmartPerfume AI
          </Link>
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`font-body-md text-body-md transition-colors duration-300 ${
                    isActive
                      ? 'text-secondary-fixed border-b-2 border-secondary-fixed pb-1'
                      : 'text-on-surface-variant hover:text-secondary-fixed'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center space-x-6">
            <span
              className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer"
              onClick={() => navigate('/account')}
            >
              account_circle
            </span>
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors">
                shopping_bag
              </span>
              {surveyDone && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            {surveyDone ? (
              <Link
                to="/recommendation"
                className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/10"
              >
                Your Scent
              </Link>
            ) : (
              <Link
                to="/quiz"
                className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/10"
              >
                Complete Survey
              </Link>
            )}
          </div>
        </div>
      </nav>

      {lockMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg bg-error-container/90 text-error border border-error/30 font-label-caps text-label-caps tracking-wider uppercase shadow-2xl animate-pulse">
          {lockMsg}
        </div>
      )}

      <main className="flex-grow">{children}</main>

      <footer className="w-full py-12 bg-surface-dim border-t border-outline-variant/20">
        <div className="flex flex-col items-center justify-center space-y-8 px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center">
            <span className="font-headline-md text-headline-md text-on-surface block mb-2">SmartPerfume AI</span>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
              &copy; 2024 SmartPerfume AI. The Art of Computational Olfaction.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">
              Scent Science
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-secondary-container" />
            <div className="h-1 w-8 rounded-full bg-secondary-container/30" />
            <div className="h-1 w-1 rounded-full bg-secondary-container" />
          </div>
        </div>
      </footer>
    </div>
  )
}
