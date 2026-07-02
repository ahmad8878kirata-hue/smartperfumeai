import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Quiz from './components/Quiz'
import AdminCatalog from './components/AdminCatalog'
import Recommendation from './components/Recommendation'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/admin" element={<AdminCatalog />} />
      <Route path="/recommendation" element={<Recommendation />} />
    </Routes>
  )
}
