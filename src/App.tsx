import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CursorIdeas from './pages/CursorIdeas'
import FigmaMCP from './pages/FigmaMCP'
import DesktopPage from './pages/DesktopPage'
import InspirePage from './pages/InspirePage'
import CestovaniPage from './pages/CestovaniPage'
import DealDetailPage from './pages/DealDetailPage'

function App() {
  const basename = import.meta.env.PROD ? '/slevac-ai' : ''
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursor-ideas" element={<CursorIdeas />} />
        <Route path="/mobile" element={<FigmaMCP />} />
        <Route path="/mobile/inspire" element={<InspirePage />} />
        <Route path="/mobile/cestovani" element={<CestovaniPage />} />
        <Route path="/mobile/cestovani/detail" element={<DealDetailPage />} />
        <Route path="/desktop" element={<DesktopPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
