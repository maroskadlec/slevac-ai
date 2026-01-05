import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Figma } from 'lucide-react'

function HomePage() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2
            }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Slevomat AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interakční design playground s pokročilými animacemi a integrací s Figma
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          
          {/* Cursor Ideas Card */}
          <motion.button
            onClick={() => navigate('/cursor-ideas')}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow overflow-hidden text-left"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Cursor Ideas
              </h2>
              
              <p className="text-gray-600 mb-6">
                16 variant animací floating button → modal. Od klasických po best practice interaction design patterns.
              </p>
              
              <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                Otevřít playground
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>

          {/* Figma MCP Card */}
          <motion.button
            onClick={() => navigate('/figma-mcp')}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow overflow-hidden text-left"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Figma className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Figma MCP
              </h2>
              
              <p className="text-gray-600 mb-6">
                Integrace s Figma pomocí Model Context Protocol. Přímá synchronizace designu s implementací.
              </p>
              
              <div className="flex items-center text-purple-500 font-semibold group-hover:translate-x-2 transition-transform">
                Otevřít projekt
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.button>

        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Vytvořeno v collabu Figma & Cursor & Claude Code
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HomePage

