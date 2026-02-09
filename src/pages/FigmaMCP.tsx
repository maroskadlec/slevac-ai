import { useState } from 'react'
import { motion } from 'framer-motion'
import FigmaMobile from '../components/FigmaMobile'

function FigmaMCP() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 px-6 py-6">
        <motion.div 
          className="h-full rounded-3xl overflow-visible"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <FigmaMobile 
              isOpen={isMobileOpen} 
              onToggle={() => setIsMobileOpen(!isMobileOpen)} 
            />
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}

export default FigmaMCP
