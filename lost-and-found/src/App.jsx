import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ReportLost from './pages/ReportLost'
import ReportFound from './pages/ReportFound'
import MatchResult from './pages/MatchResult'
import AboutUs from './pages/AboutUs'
import Reports from './pages/Reports'
import ReportSubmitted from './pages/ReportSubmitted'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/match-result" element={<MatchResult />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/report-submitted" element={<ReportSubmitted />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App