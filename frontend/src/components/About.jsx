import { Link } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'

const team = [
  { name: 'Dr. Elena Voss', role: 'Chief Science Officer', desc: 'Ph.D. in Computational Chemistry, 15 years in fragrance AI research.' },
  { name: 'Marcus Chen', role: 'Lead Perfumer', desc: 'Master perfumer blending traditional artistry with algorithmic precision.' },
  { name: 'Priya Kapoor', role: 'AI Research Lead', desc: 'Specializing in neural networks for molecular scent prediction.' },
]

export default function About() {
  const { surveyDone } = useSurvey()

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 glass-card rounded-full mb-6">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">About SmartPerfume AI</span>
        </div>
        <h1 className="font-headline-display text-headline-display mb-6 leading-tight">
          The Art of<br />
          <span className="text-secondary-fixed italic">Computational Olfaction</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto opacity-80">
          We are on a mission to democratize luxury fragrance through artificial intelligence,
          making bespoke, scientifically-crafted scents accessible to everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-16">
        <div className="glass-card rounded-2xl p-10">
          <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4">flag</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Mission</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            SmartPerfume AI combines cutting-edge machine learning with the timeless art of perfumery
            to create personalized fragrances that adapt to your unique identity. Our AI analyzes thousands
            of molecular combinations, psychological profiles, and sensory preferences to recommend the
            perfect scent -- something that was once reserved for celebrity perfumers and luxury houses.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-10">
          <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4">visibility</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Vision</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            We envision a world where every individual can express their identity through a signature
            fragrance designed specifically for them. By removing the barriers of traditional perfumery
            and leveraging computational power, we make bespoke scent creation scalable, sustainable,
            and accessible to all who seek olfactory self-expression.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {team.map((m) => (
            <div key={m.name} className="glass-card rounded-xl p-8 text-center hover:bg-surface-container-high transition-all">
              <div className="w-20 h-20 mx-auto rounded-full bg-secondary-container/20 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-4xl text-secondary-fixed">person</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{m.name}</h3>
              <p className="font-label-caps text-label-caps text-secondary-fixed mb-3">{m.role}</p>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-12 md:p-16 text-center">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Ready to Find Your Signature Scent?</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
          Let our AI analyze your sensory profile and discover a fragrance that truly represents you.
        </p>
        {surveyDone ? (
          <Link to="/recommendation" className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase">
            View Your Scent
          </Link>
        ) : (
          <Link to="/quiz" className="inline-block bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-secondary/20 text-lg tracking-widest uppercase">
            Start Your Journey
          </Link>
        )}
      </div>
    </div>
  )
}
