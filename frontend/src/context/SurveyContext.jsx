import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SurveyContext = createContext()

function storageKey(email) {
  return email ? `smartperfume_survey_done_${email}` : 'smartperfume_survey_done'
}

export function SurveyProvider({ children }) {
  const { user } = useAuth()
  const email = user?.email

  const [surveyDone, setSurveyDoneState] = useState(() => {
    return localStorage.getItem(storageKey(email)) === 'true'
  })

  useEffect(() => {
    setSurveyDoneState(localStorage.getItem(storageKey(email)) === 'true')
  }, [email])

  const setSurveyDone = (val) => {
    setSurveyDoneState(val)
    localStorage.setItem(storageKey(email), val)
  }

  return (
    <SurveyContext.Provider value={{ surveyDone, setSurveyDone }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  return useContext(SurveyContext)
}
