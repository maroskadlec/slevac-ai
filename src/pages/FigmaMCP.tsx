import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react'
import FigmaDesktop from '../components/FigmaDesktop'
import FigmaMobile from '../components/FigmaMobile'

type ViewMode = 'desktop' | 'mobile'

function FigmaMCP() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
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
          <span className="font-medium">Zpět na rozcestník</span>
        </motion.button>

        {/* Title */}
        <h1 className="text-2xl font-heading font-bold text-gray-900">Figma MCP Prototype</h1>

        {/* Spacer */}
        <div className="w-[140px]" />
      </div>

      {/* Help text */}
      <div className="px-6 pb-4 text-center">
        <motion.div
          className="inline-flex bg-purple-50 text-purple-700 px-4 py-3 rounded-xl border border-purple-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium">
            💡 Checkuj pana Lupičku, pulzuje, mrká a otevírá modál, pokud na něj klikneš.
          </p>
        </motion.div>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 pb-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex bg-white rounded-2xl border border-gray-100 p-1 gap-1"
        >
          <motion.button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Monitor className="w-5 h-5" />
            <span>Desktop</span>
          </motion.button>
          
          <motion.button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Smartphone className="w-5 h-5" />
            <span>Mobile 320</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <motion.div 
          className="h-full rounded-3xl overflow-visible"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {viewMode === 'desktop' ? (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <FigmaDesktop 
                  isOpen={isDesktopOpen} 
                  onToggle={() => setIsDesktopOpen(!isDesktopOpen)} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <FigmaMobile 
                  isOpen={isMobileOpen} 
                  onToggle={() => setIsMobileOpen(!isMobileOpen)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Info Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            Interaktivní prototyp z Figma • {viewMode === 'desktop' ? 'Desktop 1000×800' : 'Mobile 320×568'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default FigmaMCP
