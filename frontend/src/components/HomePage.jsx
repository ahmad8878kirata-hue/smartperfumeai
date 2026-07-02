import { Link } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'

export default function HomePage() {
  const { surveyDone } = useSurvey()

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-secondary/8 rounded-full blur-[140px] floating-element" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] floating-element" style={{ animationDelay: '-5s' }} />
      </div>

      <section className="relative z-10 pt-24 pb-16 px-margin-desktop text-center max-w-container-max mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 glass-card rounded-full mb-8">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">The Future of Fragrance</span>
        </div>
        <h1 className="font-headline-display text-headline-display mb-6 leading-tight">
          Where Code Meets<br />
          <span className="text-secondary-fixed italic">Olfactory Art</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 opacity-80">
          SmartPerfume AI uses advanced computational olfaction to analyze your unique sensory profile
          and craft a bespoke fragrance that resonates with your identity. No two scents are ever alike.
        </p>
        {surveyDone ? (
          <Link
            to="/recommendation"
            className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase"
          >
            View Your Scent
          </Link>
        ) : (
          <Link
            to="/quiz"
            className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase"
          >
            Start Your Scent Journey
          </Link>
        )}
      </section>

      <section className="relative z-10 pb-24 px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">psychology</span>
            </div>
            <h3 className="font-headline-md text-headline-md">AI-Powered Analysis</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Our machine learning model evaluates thousands of molecular combinations to find your perfect match.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">science</span>
            </div>
            <h3 className="font-headline-md text-headline-md">Molecular Design</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every note is computationally designed for optimal harmony and lasting impression.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">eco</span>
            </div>
            <h3 className="font-headline-md text-headline-md">Sustainable Luxury</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Ethically sourced ingredients combined with precision AI to minimize waste and maximize quality.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-margin-desktop max-w-container-max mx-auto">
        <div className="glass-card rounded-2xl p-12 md:p-16 text-center">
          <h2 className="font-headline-lg text-headline-lg mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
            {[
              { step: '01', title: 'Create Profile', desc: 'Sign in and tell us about your scent preferences.' },
              { step: '02', title: 'Take the Quiz', desc: 'Answer a few questions about the scents you love.' },
              { step: '03', title: 'AI Analysis', desc: 'Our engine computes your unique olfactory fingerprint.' },
              { step: '04', title: 'Discover Your Scent', desc: 'Receive your personalized fragrance recommendation.' },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <span className="text-secondary-fixed font-headline-md text-3xl opacity-40">{item.step}</span>
                <h4 className="font-headline-md text-headline-md text-on-surface">{item.title}</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
