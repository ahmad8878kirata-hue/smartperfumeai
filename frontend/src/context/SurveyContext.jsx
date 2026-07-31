import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SurveyContext = createContext()

function surveyKey(email) {
  return email ? `smartperfume_survey_done_${email}` : 'smartperfume_survey_done'
}

function recKey(email) {
  return email ? `smartperfume_recommendation_${email}` : 'smartperfume_recommendation'
}

function loadRecommendation(email) {
  const saved = localStorage.getItem(recKey(email))
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.id) return parsed
    } catch {
      /* ignore corrupted value */
    }
  }
  return null
}

export function SurveyProvider({ children }) {
  const { user } = useAuth()
  const email = user?.email

  const [surveyDone, setSurveyDoneState] = useState(() => {
    return localStorage.getItem(surveyKey(email)) === 'true'
  })

  const [recommendation, setRecommendationState] = useState(() => {
    return loadRecommendation(email)
  })

  useEffect(() => {
    setSurveyDoneState(localStorage.getItem(surveyKey(email)) === 'true')
    setRecommendationState(loadRecommendation(email))
  }, [email])

  const setSurveyDone = (val) => {
    setSurveyDoneState(val)
    localStorage.setItem(surveyKey(email), val)
  }

  const setRecommendation = (rec) => {
    setRecommendationState(rec)
    if (rec) {
      localStorage.setItem(recKey(email), JSON.stringify(rec))
    } else {
      localStorage.removeItem(recKey(email))
    }
  }

  return (
    <SurveyContext.Provider value={{ surveyDone, setSurveyDone, recommendation, setRecommendation }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  return useContext(SurveyContext)
}
