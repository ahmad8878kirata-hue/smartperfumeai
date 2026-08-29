import { Link } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'


export default function About() {
  const { surveyDone } = useSurvey()

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 glass-card rounded-full mb-6">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">About SmartPerfume</span>
        </div>
        <h1 className="font-headline-display text-headline-display mb-6 leading-tight">
          The Art of<br />
          <span className="text-secondary-fixed italic">Fine Fragrance</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-80">
         SmartParfum helps users discover suitable fragrances through
          a simple scent quiz and a transparent rule-based recommendation system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-16">
        <div className="glass-card rounded-2xl p-10">
          <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4">flag</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Mission</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
             Our mission is to make fragrance selection easier and more understandable.
             SmartParfum collects personal preferences through an interactive scent quiz
             and uses a rule-based recommendation system to suggest perfumes that match
             the user's choices.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-10">
          <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4">visibility</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Vision</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Our vision is to support customers during fragrance selection both online
            and in stores. SmartParfum provides a simple digital consultation that
            helps users make more confident decisions and can also support retailers
            during the sales process.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-12 md:p-16 text-center">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Ready to Find Your Scent?</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
          Discover a fragrance that truly represents you.
        </p>
        {surveyDone ? (
          <Link to="/recommendation" className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase">
            View Your Scent
          </Link>
        ) : (
          <Link to="/quiz" className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase">
            Start Scent Quiz
          </Link>
        )}
      </div>
    </div>
  )
}
