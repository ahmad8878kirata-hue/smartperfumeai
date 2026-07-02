import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSurvey } from '../context/SurveyContext'

const questions = [
  {
    question: 'Which scent family resonates with you most today?',
    choices: [
      { label: 'Fresh', icon: 'lemon', desc: 'Bright citrus, sea salt, and crisp morning dew.' },
      { label: 'Woody', icon: 'forest', desc: 'Sandalwood, cedar, and earthy vetiver notes.' },
      { label: 'Oriental', icon: 'local_fire_department', desc: 'Rich spices, warm amber, and exotic resins.' },
      { label: 'Sweet', icon: 'icecream', desc: 'Vanilla, tonka bean, and gourmand delights.' },
    ],
  },
  {
    question: 'What mood do you want your fragrance to evoke?',
    choices: [
      { label: 'Energetic', icon: 'bolt', desc: 'Bright and invigorating, perfect for daytime.' },
      { label: 'Romantic', icon: 'favorite', desc: 'Soft and alluring with floral undertones.' },
      { label: 'Mysterious', icon: 'nights_stay', desc: 'Deep and complex with smoky accents.' },
      { label: 'Serene', icon: 'self_improvement', desc: 'Calm and balanced with gentle notes.' },
    ],
  },
  {
    question: 'Which setting will you wear this most?',
    choices: [
      { label: 'Office', icon: 'business_center', desc: 'Professional and subtle for the workplace.' },
      { label: 'Evening Out', icon: 'nightlife', desc: 'Bold and memorable for special occasions.' },
      { label: 'Daily Wear', icon: 'wb_sunny', desc: 'Versatile and comfortable for everyday use.' },
      { label: 'Travel', icon: 'flight', desc: 'Refreshing and adaptive for any destination.' },
    ],
  },
  {
    question: 'How intense should the sillage be?',
    choices: [
      { label: 'Subtle', icon: 'blur_on', desc: 'A gentle whisper that stays close to the skin.' },
      { label: 'Moderate', icon: 'blur_medium', desc: 'Balanced projection that lingers elegantly.' },
      { label: 'Strong', icon: 'blur_circular', desc: 'Commanding presence that makes a statement.' },
      { label: 'Intense', icon: 'radiance', desc: 'Powerful and unforgettable, leaves a trail.' },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const { setSurveyDone } = useSurvey()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const totalQuestions = questions.length
  const question = questions[currentQ]
  const progress = ((currentQ + 1) / totalQuestions) * 100

  const selectChoice = (label) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: label }))
  }

  const goNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((prev) => prev + 1)
    }
  }

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
    } catch {
      /* continue regardless */
    }
    setSurveyDone(true)
    setSubmitting(false)
    navigate('/recommendation')
  }

  const isLast = currentQ === totalQuestions - 1
  const canProceed = answers[currentQ] != null

  return (
    <div className="bg-surface-dim text-on-surface selection:bg-secondary/30 min-h-screen flex flex-col font-body-md overflow-x-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] floating-element" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] floating-element" style={{ animationDelay: '-5s' }} />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col space-y-12">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-label-caps text-label-caps text-secondary-fixed tracking-widest">
                Question {currentQ + 1} of {totalQuestions}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-fixed progress-glow transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="font-headline-lg text-headline-lg md:text-headline-display text-on-surface max-w-2xl mx-auto leading-tight">
              {question.question}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant/80 max-w-xl mx-auto">
              Your choice helps our AI model the emotional and sensory landscape of your bespoke fragrance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {question.choices.map((choice) => {
              const selected = answers[currentQ] === choice.label
              return (
                <div
                  key={choice.label}
                  className={`glass-card group p-gutter rounded-xl cursor-pointer flex flex-col items-center text-center space-y-6 active:scale-95 transition-all ${
                    selected ? 'selected' : ''
                  }`}
                  onClick={() => selectChoice(choice.label)}
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-colors">
                    <span className="material-symbols-outlined text-4xl text-secondary-fixed">{choice.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{choice.label}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">{choice.desc}</p>
                  </div>
                  <div className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}>
                    <span
                      className="material-symbols-outlined text-secondary-fixed"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-outline-variant/20 gap-gutter">
            <button
              onClick={goPrev}
              disabled={currentQ === 0}
              className={`w-full sm:w-auto px-10 py-4 rounded-lg border border-secondary text-secondary font-label-caps text-label-caps transition-all flex items-center justify-center space-x-2 active:scale-95 ${
                currentQ === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-secondary/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Previous</span>
            </button>
            <div className="hidden sm:block text-on-tertiary-container font-body-md italic opacity-50">
              Discover your essence...
            </div>
            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || submitting}
                className={`w-full sm:w-auto px-12 py-4 rounded-lg font-label-caps text-label-caps transition-all flex items-center justify-center space-x-2 active:scale-95 ${
                  canProceed && !submitting
                    ? 'bg-secondary text-on-secondary hover:opacity-90 shadow-xl shadow-secondary/20'
                    : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                <span>{submitting ? 'Submitting...' : 'See My Scent'}</span>
                <span className="material-symbols-outlined text-base">auto_awesome</span>
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canProceed}
                className={`w-full sm:w-auto px-12 py-4 rounded-lg font-label-caps text-label-caps transition-all flex items-center justify-center space-x-2 active:scale-95 ${
                  canProceed
                    ? 'bg-secondary text-on-secondary hover:opacity-90 shadow-xl shadow-secondary/20'
                    : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                <span>Next Step</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
