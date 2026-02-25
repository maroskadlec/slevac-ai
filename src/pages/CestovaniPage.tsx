import { useState } from 'react'
import FigmaMobileCestovani from '../components/FigmaMobileCestovani'

function CestovaniPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="bg-white">
      <FigmaMobileCestovani 
        isOpen={isMobileOpen} 
        onToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />
    </div>
  )
}

export default CestovaniPage
