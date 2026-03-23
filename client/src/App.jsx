import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import Compare from './pages/Compare'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:username" element={<Report />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  )
}
