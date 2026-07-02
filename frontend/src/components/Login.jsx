import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const endpoint = isRegistering ? '/api/register' : '/api/login'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error })
        return
      }

      login(data.user.email, data.token)
      setMessage({ type: 'success', text: isRegistering ? 'Account created! Redirecting...' : 'Signed in! Redirecting...' })

      if (!isRegistering) {
        setTimeout(() => navigate('/home'), 800)
      } else {
        setTimeout(() => {
          setIsRegistering(false)
          setMessage(null)
          setPassword('')
        }, 1200)
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' })
    }
  }

  const toggleMode = () => {
    setIsRegistering((prev) => !prev)
    setMessage(null)
    setPassword('')
  }

  return (
    <div className="font-body-md text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
      <div className="scent-glow top-[-10%] left-[-10%]" />
      <div
        className="scent-glow bottom-[-10%] right-[-10%]"
        style={{
          background:
            'radial-gradient(circle, rgba(193, 198, 218, 0.05) 0%, rgba(13, 19, 31, 0) 70%)',
          animationDelay: '-5s',
        }}
      />
      <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-24 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-widest uppercase mb-2">
            SmartPerfume AI
          </h2>
          <div className="h-px w-12 bg-secondary mx-auto opacity-50" />
        </div>
        <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-xl transition-all duration-500 hover:border-on-surface/20">
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4 leading-tight">
              {isRegistering ? 'Begin Your Scent Journey' : 'Welcome Back to Your Scent Journey'}
            </h1>
            <p className="font-body-md text-on-surface-variant opacity-80">
              {isRegistering
                ? 'Create an account to unlock your personalized fragrance profile.'
                : 'Refine your olfactory identity with computational precision.'}
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-label-caps text-label-caps tracking-wider uppercase ${
                message.type === 'error'
                  ? 'bg-error-container/20 text-error border border-error/30'
                  : 'bg-secondary-container/20 text-secondary-fixed border border-secondary-fixed/30'
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-on-tertiary-container mb-2 block tracking-[0.2em] uppercase">
                Email Address
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 input-glow"
                placeholder="perfumer@studio.ai"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-on-tertiary-container tracking-[0.2em] uppercase block mb-2">
                Security Key
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 input-glow"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pt-4 space-y-6">
              <button
                type="submit"
                className="w-full bg-secondary py-4 rounded-lg font-label-caps text-label-caps text-on-secondary tracking-widest uppercase transition-all duration-300 hover:bg-secondary-fixed hover:shadow-[0_0_20px_rgba(233,195,73,0.3)] active:scale-[0.98]"
              >
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/10" />
                </div>
                <span className="relative bg-transparent px-4 font-label-caps text-[10px] text-on-tertiary-container tracking-widest uppercase">
                  Or
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMode}
                className="w-full border border-secondary/30 py-4 rounded-lg font-label-caps text-label-caps text-secondary tracking-widest uppercase transition-all duration-300 hover:bg-secondary/5 hover:border-secondary active:scale-[0.98]"
              >
                {isRegistering ? 'Sign In Instead' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
        <Link
          to="/home"
          className="mt-12 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="tracking-widest uppercase">Continue as Guest</span>
        </Link>
      </main>
      <footer className="w-full py-12 bg-surface-dim border-t border-outline-variant/20 relative z-20">
        <div className="flex flex-col items-center justify-center space-y-8 px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center">
            <span className="font-headline-md text-headline-md text-on-surface block mb-2">
              SmartPerfume AI
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
              &copy; 2024 SmartPerfume AI. The Art of Computational Olfaction.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
              Privacy Policy
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
              Terms of Service
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
              Scent Science
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
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
