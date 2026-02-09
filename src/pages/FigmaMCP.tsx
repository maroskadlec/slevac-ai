import { useState } from 'react'
import FigmaMobile from '../components/FigmaMobile'

function FigmaMCP() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="bg-white">
      <FigmaMobile 
        isOpen={isMobileOpen} 
        onToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />
    </div>
  )
}

export default FigmaMCP
