import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FigmaMobile from '../components/FigmaMobile'

function FigmaMCP() {
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Zpět</span>
        </motion.button>

        {/* Spacer */}
        <div className="w-[140px]" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
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
