import { useState } from 'react'
import FigmaMobileInspire from '../components/FigmaMobileInspire'

function InspirePage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="bg-white">
      <FigmaMobileInspire 
        isOpen={isMobileOpen} 
        onToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />
    </div>
  )
}

export default InspirePage
