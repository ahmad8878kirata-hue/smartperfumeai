import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SurveyProvider } from './context/SurveyContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import Login from './components/Login'
import HomePage from './components/HomePage'
import Quiz from './components/Quiz'
import Recommendation from './components/Recommendation'
import Cart from './components/Cart'
import Account from './components/Account'
import Collection from './components/Collection'
import Journal from './components/Journal'
import About from './components/About'
import AdminCatalog from './components/AdminCatalog'

export default function App() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <CartProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Layout><HomePage /></Layout>} />
          <Route path="/quiz" element={<Layout><Quiz /></Layout>} />

          <Route path="/recommendation" element={<Layout><Recommendation /></Layout>} />

          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/account" element={<Layout><Account /></Layout>} />

          <Route path="/collection" element={<Layout><Collection /></Layout>} />
          <Route path="/journal" element={<Layout><Journal /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />

          <Route path="/admin" element={<AdminCatalog />} />
        </Routes>
        </CartProvider>
      </SurveyProvider>
    </AuthProvider>
  )
}
