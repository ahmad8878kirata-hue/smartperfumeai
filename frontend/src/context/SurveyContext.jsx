import { createContext, useContext, useState, useEffect } from 'react'

const SurveyContext = createContext()

export function SurveyProvider({ children }) {
  const [surveyDone, setSurveyDone] = useState(() => {
    return localStorage.getItem('smartperfume_survey_done') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('smartperfume_survey_done', surveyDone)
  }, [surveyDone])

  return (
    <SurveyContext.Provider value={{ surveyDone, setSurveyDone }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  return useContext(SurveyContext)
}
