import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 pt-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-xl w-full text-center"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl font-heading font-bold text-gray-900 mb-4">
            Rozhovor se Slevomatem
          </h1>
          <p className="text-xl text-gray-600">
            9.2.2026
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 items-center">
          {/* Primary Button → Figma MCP page */}
          <motion.button
            onClick={() => navigate('/mobile')}
            className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Jdeme na to
          </motion.button>

          {/* Secondary Button → Figma prototype */}
          <motion.a
            href="https://www.figma.com/proto/zvc9bqZGmvrfW1vhS9BGzN/Slevomat-Mobil?page-id=19028%3A78613&node-id=19645-78206&viewport=1225%2C451%2C0.19&t=lbxh0cfGJpKg8H8o-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=19741%3A78519"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-2xl px-8 py-4 border-2 border-gray-300 hover:border-gray-400 transition-all cursor-pointer text-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            A k tomuhle se vrátíme později
          </motion.a>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default HomePage
