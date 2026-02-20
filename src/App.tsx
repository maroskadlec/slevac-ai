import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CursorIdeas from './pages/CursorIdeas'
import FigmaMCP from './pages/FigmaMCP'
import DesktopPage from './pages/DesktopPage'
import InspirePage from './pages/InspirePage'

function App() {
  const basename = import.meta.env.PROD ? '/slevac-ai' : ''
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursor-ideas" element={<CursorIdeas />} />
        <Route path="/mobile" element={<FigmaMCP />} />
        <Route path="/mobile/inspire" element={<InspirePage />} />
        <Route path="/desktop" element={<DesktopPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
