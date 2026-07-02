import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
      fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // redirect to quiz on success
          window.location.href = '/quiz'
        }
      })
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
              Welcome Back to Your Scent Journey
            </h1>
            <p className="font-body-md text-on-surface-variant opacity-80">
              Refine your olfactory identity with computational precision.
            </p>
          </div>
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
              />
            </div>
            <div className="relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="font-label-caps text-label-caps text-on-tertiary-container tracking-[0.2em] uppercase">
                  Security Key
                </label>
                <a
                  className="font-label-caps text-[10px] text-on-surface-variant hover:text-secondary-fixed transition-colors tracking-wider uppercase"
                  href="#"
                >
                  Forgot Password
                </a>
              </div>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/30 transition-all duration-300 input-glow"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="pt-4 space-y-6">
              <button
                type="submit"
                className="w-full bg-secondary py-4 rounded-lg font-label-caps text-label-caps text-on-secondary tracking-widest uppercase transition-all duration-300 hover:bg-secondary-fixed hover:shadow-[0_0_20px_rgba(233,195,73,0.3)] active:scale-[0.98]"
              >
                Sign In
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
                className="w-full border border-secondary/30 py-4 rounded-lg font-label-caps text-label-caps text-secondary tracking-widest uppercase transition-all duration-300 hover:bg-secondary/5 hover:border-secondary active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        <Link
          to="/quiz"
          className="mt-12 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="tracking-widest uppercase">Back to Discover</span>
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
