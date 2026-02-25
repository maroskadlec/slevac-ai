import { useState } from 'react'
import FigmaMobileDealDetail from '../components/FigmaMobileDealDetail'

function DealDetailPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="bg-white">
      <FigmaMobileDealDetail
        isOpen={isMobileOpen}
        onToggle={() => setIsMobileOpen(!isMobileOpen)}
      />
    </div>
  )
}

export default DealDetailPage
