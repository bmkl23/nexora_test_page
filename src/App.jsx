import { Routes, Route, Navigate } from 'react-router-dom'
import ThemePicker from './pages/ThemePicker'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ThemePicker />} />
      <Route path="/shop" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
