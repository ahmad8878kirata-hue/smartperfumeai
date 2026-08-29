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
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Your Personal Fragrance Guide</span>
        </div>
        <h1 className="font-headline-display text-headline-display mb-6 leading-tight">
          The Art of<br />
          <span className="text-secondary-fixed italic">Fine Fragrance</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 opacity-80">
          SmartParfum helps you discover fragrances that match your personal
          preferences through a simple scent quiz and a transparent rule-based
          recommendation system.
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
            Start Scent Quiz
          </Link>
        )}
      </section>

      <section className="relative z-10 pb-24 px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">psychology</span>
            </div>
            <h3 className="font-headline-md text-headline-md">Personalized Matching</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
               Your quiz answers are compared with our fragrance collection to
              find scents that match your preferences.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">rule</span>
            </div>
            <h3 className="font-headline-md text-headline-md">Rule-Based Recommendations</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your preferences are evaluated using clear and predefined rules
              to identify suitable fragrances.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 hover:bg-surface-container-high transition-all">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-secondary-fixed">visibility</span>
            </div>
            <h3 className="font-headline-md text-headline-md">Simple & Transparent</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
               Recommendations are based on understandable criteria such as
              fragrance family, mood, occasion and intensity.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-margin-desktop max-w-container-max mx-auto">
        <div className="glass-card rounded-2xl p-12 md:p-16 text-center">
          <h2 className="font-headline-lg text-headline-lg mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
            {[
              { step: '01', title: 'Start Your Journey', desc: 'Continue as a guest or sign in to your account.' },
              { step: '02', title: 'Take the Quiz', desc: 'Answer a few questions about your fragrance preferences.' },
              { step: '03', title: 'Rule-Based Matching', desc: 'Your answers are evaluated and compared with suitable fragrances.' },
              { step: '04', title: 'Get Your Recommendation', desc: 'Discover fragrances that match your personal preferences.' },
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
