import { useState } from 'react'
import { Link } from 'react-router-dom'

const scentFamilies = ['Fresh', 'Woody', 'Oriental', 'Sweet']
const scentIcons = ['lemon', 'forest', 'local_fire_department', 'icecream']

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(1)
  const totalQuestions = 4

  const selectCard = (index) => setSelected(index)

  return (
    <div className="bg-surface-dim text-on-surface selection:bg-secondary/30 min-h-screen flex flex-col font-body-md overflow-x-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] floating-element" />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] floating-element"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      <nav className="w-full top-0 sticky z-50 bg-surface-container/60 backdrop-blur-3xl border-b border-on-surface/10">
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-md text-on-surface tracking-tight cursor-pointer">
            SmartPerfume AI
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300" href="#">
              Discover
            </a>
            <a className="font-body-md text-body-md text-secondary-fixed border-b-2 border-secondary-fixed pb-1" href="#">
              Collection
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300" href="#">
              Journal
            </a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300" href="#">
              About
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer">
              account_circle
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer">
              shopping_bag
            </span>
            <Link
              to="/recommendation"
              className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-secondary/10"
            >
              Create Scent
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col space-y-12">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-label-caps text-label-caps text-secondary-fixed tracking-widest">
                Question {currentQ + 1} of {totalQuestions}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                {Math.round(((currentQ + 1) / totalQuestions) * 100)}% Complete
              </span>
            </div>
            <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-fixed progress-glow transition-all duration-1000 ease-out"
                style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="font-headline-lg text-headline-lg md:text-headline-display text-on-surface max-w-2xl mx-auto leading-tight">
              Which scent family resonates with you most today?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant/80 max-w-xl mx-auto">
              Your choice helps our AI model the emotional and sensory landscape of your bespoke fragrance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {scentFamilies.map((family, i) => (
              <div
                key={family}
                className={`glass-card group p-gutter rounded-xl cursor-pointer flex flex-col items-center text-center space-y-6 active:scale-95 ${selected === i ? 'selected' : ''}`}
                onClick={() => selectCard(i)}
              >
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-colors">
                  <span className="material-symbols-outlined text-4xl text-secondary-fixed">
                    {scentIcons[i]}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface">{family}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {family === 'Fresh' && 'Bright citrus, sea salt, and crisp morning dew.'}
                    {family === 'Woody' && 'Sandalwood, cedar, and earthy vetiver notes.'}
                    {family === 'Oriental' && 'Rich spices, warm amber, and exotic resins.'}
                    {family === 'Sweet' && 'Vanilla, tonka bean, and gourmand delights.'}
                  </p>
                </div>
                <div className="opacity-0 group-[.selected]:opacity-100 transition-opacity">
                  <span
                    className="material-symbols-outlined text-secondary-fixed"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-outline-variant/20 gap-gutter">
            <button className="w-full sm:w-auto px-10 py-4 rounded-lg border border-secondary text-secondary font-label-caps text-label-caps hover:bg-secondary/5 transition-all flex items-center justify-center space-x-2 active:scale-95">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Previous</span>
            </button>
            <div className="hidden sm:block text-on-tertiary-container font-body-md italic opacity-50">
              Discover your essence...
            </div>
            <button className="w-full sm:w-auto px-12 py-4 rounded-lg bg-secondary text-on-secondary font-label-caps text-label-caps hover:opacity-90 shadow-xl shadow-secondary/20 transition-all flex items-center justify-center space-x-2 active:scale-95">
              <span>Next Step</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 bg-surface-dim border-t border-outline-variant/20">
        <div className="flex flex-col items-center justify-center space-y-base px-margin-desktop max-w-container-max mx-auto text-center">
          <div className="font-headline-md text-headline-md text-on-surface mb-4">SmartPerfume AI</div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
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
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
            &copy; 2024 SmartPerfume AI. The Art of Computational Olfaction.
          </p>
        </div>
      </footer>
    </div>
  )
}
