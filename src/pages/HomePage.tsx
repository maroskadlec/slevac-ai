import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Figma } from 'lucide-react'
import { useState, useEffect } from 'react'

const mrkatkoImg = "http://localhost:3845/assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png"
const mrkatkoImgBlink = "http://localhost:3845/assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png"

function HomePage() {
  const navigate = useNavigate()
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const blinkCycle = () => {
      setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setIsBlinking(false)
        }, 200)
      }, 2000)
    }
    blinkCycle()
    const interval = setInterval(blinkCycle, 2400)
    return () => clearInterval(interval)
  }, [])

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
            className="inline-block mb-0"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden">
              <motion.img
                src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                alt="Mrkatko"
                className="w-20 h-20 object-cover mt-6 ml-[10px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  ease: "easeIn"
                }}
              />
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-heading font-bold text-gray-900 mb-4">
            Opening Lupičky na Sleváči
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interakční playground s animacemi pro otevření / zavření pana Lupičky.
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
              
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Cursor Ideas
              </h2>
              
              <p className="text-gray-600 mb-6">
                16 variant animací floating button → modal. Cursor vymýšlel podle textového kontextu.
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
              
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Figma MCP
              </h2>
              
              <p className="text-gray-600 mb-6">
                Integrace s Figma pomocí MCP. Cursor natáhl Figma zdroje, ale byl nutný manuální zásah a ladění.
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

