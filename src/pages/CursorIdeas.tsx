import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type AnimationVariant = 
  | 'spring-scale' 
  | 'slide-right' 
  | 'expand-from-button' 
  | 'blur-slide'
  | 'button-to-modal'
  | 'ripple-expand'
  | 'flip-expand'
  | 'elastic-morph'
  | 'shared-layout-morph'
  | 'organic-grow'
  | 'bubble-pop'
  | 'liquid-expand'
  | 'hero-transition'
  | 'material-elevation'
  | 'magnetic-pull'
  | 'contextual-bloom'

function CursorIdeas() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [animationVariant, setAnimationVariant] = useState<AnimationVariant>('spring-scale')
  
  // Varianty, kde se button transformuje v modál (křížek bude nahoře)
  const closeButtonInModal = ['button-to-modal', 'ripple-expand', 'flip-expand', 'elastic-morph', 'shared-layout-morph', 'organic-grow', 'bubble-pop', 'liquid-expand', 'hero-transition', 'material-elevation', 'magnetic-pull', 'contextual-bloom']
  const showCloseInModal = isOpen && closeButtonInModal.includes(animationVariant)
  
  // Native-like varianty používají shared element (layoutId)
  const useSharedElement = ['shared-layout-morph', 'organic-grow', 'bubble-pop', 'liquid-expand', 'hero-transition', 'material-elevation', 'magnetic-pull', 'contextual-bloom'].includes(animationVariant)

  const toggleModal = () => setIsOpen(!isOpen)

  // Varianty animací inspirované SwiftUI
  const modalVariants = {
    'spring-scale': {
      initial: { scale: 0, opacity: 0, x: 300, y: 300 },
      animate: { 
        scale: 1, 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }
      },
      exit: { 
        scale: 0, 
        opacity: 0,
        x: 300,
        y: 300,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    },
    'slide-right': {
      initial: { x: '100%', opacity: 0 },
      animate: { 
        x: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 25
        }
      },
      exit: { 
        x: '100%', 
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    },
    'expand-from-button': {
      initial: { 
        scale: 0.1, 
        opacity: 0,
        originX: 1,
        originY: 1,
        borderRadius: '50%'
      },
      animate: { 
        scale: 1, 
        opacity: 1,
        borderRadius: '1rem',
        transition: {
          type: "spring",
          stiffness: 280,
          damping: 25,
          mass: 0.6
        }
      },
      exit: { 
        scale: 0.1, 
        opacity: 0,
        borderRadius: '50%',
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    },
    'blur-slide': {
      initial: { x: 400, opacity: 0, filter: 'blur(10px)' },
      animate: { 
        x: 0, 
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
          type: "spring",
          stiffness: 240,
          damping: 28,
          mass: 0.8
        }
      },
      exit: { 
        x: 400, 
        opacity: 0,
        filter: 'blur(10px)',
        transition: {
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1]
        }
      }
    },
    // NOVÉ EFEKTNÍ VARIANTY
    'button-to-modal': {
      initial: { 
        width: 64,
        height: 64,
        borderRadius: '9999px',
        opacity: 1
      },
      animate: { 
        width: 384,
        height: 500,
        borderRadius: '1rem',
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 22,
          mass: 0.8
        }
      },
      exit: { 
        width: 64,
        height: 64,
        borderRadius: '9999px',
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 25
        }
      }
    },
    'ripple-expand': {
      initial: { 
        scale: 0,
        opacity: 0,
        borderRadius: '50%',
      },
      animate: { 
        scale: [0, 1.2, 0.95, 1],
        opacity: [0, 0.8, 0.9, 1],
        borderRadius: ['50%', '45%', '25%', '1rem'],
        transition: {
          duration: 0.7,
          times: [0, 0.3, 0.7, 1],
          ease: "easeOut"
        }
      },
      exit: { 
        scale: 0,
        opacity: 0,
        borderRadius: '50%',
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.6, 1]
        }
      }
    },
    'flip-expand': {
      initial: { 
        rotateY: -180,
        scale: 0.2,
        opacity: 0,
      },
      animate: { 
        rotateY: 0,
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 1
        }
      },
      exit: { 
        rotateY: 180,
        scale: 0.2,
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 25
        }
      }
    },
    'elastic-morph': {
      initial: { 
        scale: 0,
        scaleX: 0.3,
        scaleY: 1.8,
        rotate: -45,
        opacity: 0,
        borderRadius: '50%'
      },
      animate: { 
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        opacity: 1,
        borderRadius: '1rem',
        transition: {
          type: "spring",
          stiffness: 180,
          damping: 15,
          mass: 1.2
        }
      },
      exit: { 
        scale: 0,
        scaleX: 1.8,
        scaleY: 0.3,
        rotate: 45,
        opacity: 0,
        borderRadius: '50%',
        transition: {
          type: "spring",
          stiffness: 250,
          damping: 25
        }
      }
    }
  }

  const backdropVariants = {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { 
      opacity: 1, 
      backdropFilter: 'blur(8px)',
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      backdropFilter: 'blur(0px)',
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      
      {/* Back button - vlevo nahoře nad selectorem */}
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-gray-900 border border-gray-100"
        whileHover={{ x: -2, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Zpět</span>
      </motion.button>
      
      {/* Selector variant - levý horní roh */}
      <div className="absolute top-20 left-6 z-50 max-h-[calc(90vh-80px)] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">Základní varianty:</p>
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => setAnimationVariant('spring-scale')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animationVariant === 'spring-scale'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1. Spring Scale Transform
            </button>
            <button
              onClick={() => setAnimationVariant('slide-right')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animationVariant === 'slide-right'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              2. Slide from Right
            </button>
            <button
              onClick={() => setAnimationVariant('expand-from-button')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animationVariant === 'expand-from-button'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3. Expand from Button
            </button>
            <button
              onClick={() => setAnimationVariant('blur-slide')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animationVariant === 'blur-slide'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              4. Blur Backdrop Slide
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">✨ Efektní varianty:</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setAnimationVariant('button-to-modal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'button-to-modal'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                5. Button → Modal Transform
              </button>
              <button
                onClick={() => setAnimationVariant('ripple-expand')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'ripple-expand'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                6. Ripple Expand
              </button>
              <button
                onClick={() => setAnimationVariant('flip-expand')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'flip-expand'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7. 3D Flip & Expand
              </button>
              <button
                onClick={() => setAnimationVariant('elastic-morph')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'elastic-morph'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                8. Elastic Morph
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">🎯 Native-like (Shared Element):</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setAnimationVariant('shared-layout-morph')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'shared-layout-morph'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                9. Shared Layout Morph
              </button>
              <button
                onClick={() => setAnimationVariant('organic-grow')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'organic-grow'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                10. Organic Grow
              </button>
              <button
                onClick={() => setAnimationVariant('bubble-pop')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'bubble-pop'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                11. Bubble Pop
              </button>
              <button
                onClick={() => setAnimationVariant('liquid-expand')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'liquid-expand'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                12. Liquid Expand
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">🏆 Best Practice Design:</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setAnimationVariant('hero-transition')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'hero-transition'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                13. Hero Transition
              </button>
              <button
                onClick={() => setAnimationVariant('material-elevation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'material-elevation'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                14. Material Elevation
              </button>
              <button
                onClick={() => setAnimationVariant('magnetic-pull')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'magnetic-pull'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                15. Magnetic Pull
              </button>
              <button
                onClick={() => setAnimationVariant('contextual-bloom')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  animationVariant === 'contextual-bloom'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                16. Contextual Bloom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop s blur efektem */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/20 z-40"
            onClick={toggleModal}
          />
        )}
      </AnimatePresence>

      {/* NATIVE-LIKE VARIANTY - Shared Element s layoutId */}
      {useSharedElement && (
        <motion.div
          layout
          layoutId="floating-button-modal"
          className="fixed z-50 flex items-center justify-center overflow-hidden"
          animate={{
            left: isOpen ? '50%' : 'auto',
            right: isOpen ? 'auto' : 32,
            top: isOpen ? '50%' : 'auto',
            bottom: isOpen ? 'auto' : 32,
            width: isOpen ? 384 : 64,
            height: isOpen ? 500 : 64,
            borderRadius: isOpen ? 16 : 9999,
            x: isOpen ? '-50%' : 0,
            y: isOpen ? '-50%' : 0,
            backgroundColor: isOpen ? '#ffffff' : '#3b82f6',
            
            // BEST PRACTICE VARIANTY - specifické efekty
            scale: 
              // Bubble Pop - playful bounce
              animationVariant === 'bubble-pop' && isOpen ? [1, 1.05, 1] : 
              // Hero Transition - smooth anticipation (optimalizováno)
              animationVariant === 'hero-transition' && isOpen ? 1 :
              // Magnetic Pull - emphasis on pull
              animationVariant === 'magnetic-pull' && isOpen ? [0.9, 1.08, 0.98, 1] :
              1,
            
            rotate: 
              // Liquid Expand - organic rotation
              animationVariant === 'liquid-expand' ? (isOpen ? [0, 5, -3, 0] : 0) : 
              // Contextual Bloom - gentle spin
              animationVariant === 'contextual-bloom' ? (isOpen ? [0, 2, 0] : 0) :
              0,
            
            // Material Elevation - Z-axis shadow simulation
            boxShadow: animationVariant === 'material-elevation' ? 
              (isOpen ? 
                '0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)' :
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              ) :
              // Hero Transition - soft shadow (optimalizováno)
              animationVariant === 'hero-transition' ?
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)' :
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          transition={
            // Hero Transition má speciální timing pro plynulost
            animationVariant === 'hero-transition' ? {
              duration: 0.45,
              ease: [0.25, 0.1, 0.25, 1], // Custom bezier pro iOS feel
            } : {
              type: "spring",
              stiffness: 
                animationVariant === 'shared-layout-morph' ? 260 :
                animationVariant === 'organic-grow' ? 180 :
                animationVariant === 'bubble-pop' ? 320 :
                animationVariant === 'liquid-expand' ? 140 :
                animationVariant === 'material-elevation' ? 240 :
                animationVariant === 'magnetic-pull' ? 200 :
                animationVariant === 'contextual-bloom' ? 220 :
                220,
              damping: 
                animationVariant === 'shared-layout-morph' ? 30 :
                animationVariant === 'organic-grow' ? 22 :
                animationVariant === 'bubble-pop' ? 18 :
                animationVariant === 'liquid-expand' ? 18 :
                animationVariant === 'material-elevation' ? 28 :
                animationVariant === 'magnetic-pull' ? 20 :
                animationVariant === 'contextual-bloom' ? 26 :
                25,
              mass: 
                animationVariant === 'organic-grow' ? 1.3 :
                animationVariant === 'bubble-pop' ? 0.5 :
                animationVariant === 'liquid-expand' ? 2.0 :
                animationVariant === 'material-elevation' ? 1.0 :
                animationVariant === 'magnetic-pull' ? 1.4 :
                animationVariant === 'contextual-bloom' ? 0.9 :
                0.8,
              // Bounce pro playful varianty
              ...(animationVariant === 'bubble-pop' && {
                bounce: 0.4
              }),
              // Velocity pro dynamic varianty
              ...((animationVariant === 'organic-grow' || animationVariant === 'magnetic-pull') && {
                velocity: -50
              })
            }
          }
          onClick={!isOpen ? toggleModal : undefined}
          whileHover={!isOpen ? {
            y: -4,
            backgroundColor: '#1e40af',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25
            }
          } : {}}
          whileTap={!isOpen ? {
            scale: 0.95
          } : {}}
        >
          {/* Obsah buttonu */}
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.div
                key="button-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ 
                  scale: animationVariant === 'hero-transition' ? 0.8 : 0, 
                  opacity: 0 
                }}
                transition={
                  animationVariant === 'hero-transition' ? {
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  } : {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }
              >
                <Hand className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Obsah modálu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="modal-content"
                className="w-full h-full relative"
                initial={{ 
                  opacity: 0,
                  // Hero Transition - subtlní fade (optimalizováno)
                  ...(animationVariant === 'hero-transition' && { y: 12 }),
                  // Material Elevation - fade in
                  ...(animationVariant === 'material-elevation' && { scale: 0.9 }),
                  // Magnetic Pull - pull from distance
                  ...(animationVariant === 'magnetic-pull' && { scale: 0.7, y: 100 }),
                  // Contextual Bloom - bloom from center
                  ...(animationVariant === 'contextual-bloom' && { scale: 0.3 }),
                }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0,
                  // Exit animations pro každou variantu
                  ...(animationVariant === 'hero-transition' && { y: -8, scale: 0.98 }),
                  ...(animationVariant === 'material-elevation' && { scale: 0.95 }),
                  ...(animationVariant === 'magnetic-pull' && { y: 50 }),
                  ...(animationVariant === 'contextual-bloom' && { scale: 0.5 }),
                }}
                transition={{ 
                  delay: animationVariant === 'hero-transition' ? 0.25 :
                         animationVariant === 'material-elevation' ? 0.2 :
                         animationVariant === 'magnetic-pull' ? 0.25 :
                         animationVariant === 'contextual-bloom' ? 0.3 :
                         0.2,
                  duration: animationVariant === 'hero-transition' ? 0.4 :
                           animationVariant === 'material-elevation' ? 0.3 :
                           animationVariant === 'magnetic-pull' ? 0.4 :
                           animationVariant === 'contextual-bloom' ? 0.5 :
                           0.3,
                  ease: animationVariant === 'hero-transition' ? [0.25, 0.1, 0.25, 1] : [0.16, 1, 0.3, 1]
                }}
              >

                {/* Křížek */}
                <motion.button
                  onClick={toggleModal}
                  className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    animationVariant === 'hero-transition' ? {
                      delay: 0.35,
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1]
                    } : {
                      delay: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
                </motion.button>

                {/* Obsah */}
                <div className="relative w-full h-full p-6 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={
                        animationVariant === 'hero-transition' ? {
                          delay: 0.4,
                          duration: 0.35,
                          ease: [0.34, 1.56, 0.64, 1] // Subtle bounce
                        } : {
                          delay: 0.35,
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }
                      }
                    >
                      <Hand className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    <motion.h2 
                      className="text-2xl font-heading font-bold text-gray-800 mb-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        animationVariant === 'hero-transition' ? {
                          delay: 0.5,
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1]
                        } : {
                          delay: 0.45
                        }
                      }
                    >
                      Modální okno
                    </motion.h2>
                    <motion.p 
                      className="text-gray-500"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        animationVariant === 'hero-transition' ? {
                          delay: 0.6,
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1]
                        } : {
                          delay: animationVariant === 'material-elevation' ? 0.55 :
                                 animationVariant === 'magnetic-pull' ? 0.6 :
                                 animationVariant === 'contextual-bloom' ? 0.65 :
                                 0.55
                        }
                      }
                    >
                      {animationVariant === 'shared-layout-morph' && 'Shared Layout Animation'}
                      {animationVariant === 'organic-grow' && 'Organický růst z buttonu'}
                      {animationVariant === 'bubble-pop' && 'Bubble pop efekt'}
                      {animationVariant === 'liquid-expand' && 'Tekutá expanze'}
                      {animationVariant === 'hero-transition' && 'iOS-style progressive disclosure'}
                      {animationVariant === 'material-elevation' && 'Material Design elevation'}
                      {animationVariant === 'magnetic-pull' && 'Magnetické přitahování obsahu'}
                      {animationVariant === 'contextual-bloom' && 'Postupné vrstvené odhalování'}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modální okno - pouze pro non-shared-element varianty */}
      <AnimatePresence>
        {isOpen && !useSharedElement && (
          <motion.div
            variants={modalVariants[animationVariant as keyof typeof modalVariants] || modalVariants['spring-scale']}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`bg-white rounded-2xl shadow-2xl z-50 overflow-hidden ${
              animationVariant === 'button-to-modal' 
                ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
                : 'fixed right-8 bottom-24 w-96 h-[500px]'
            }`}
            style={{
              originX: animationVariant === 'expand-from-button' ? 1 : 0.5,
              originY: animationVariant === 'expand-from-button' ? 1 : 0.5,
              perspective: animationVariant === 'flip-expand' ? '1000px' : undefined,
            }}
          >
            {/* Křížek v pravém horním rohu pro nové varianty */}
            {showCloseInModal && (
              <motion.button
                onClick={toggleModal}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              </motion.button>
            )}
            
            <div className="w-full h-full p-6 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Hand className="w-8 h-8 text-blue-500" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-heading font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Modální okno
                </motion.h2>
                <motion.p 
                  className="text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Zde bude váš obsah
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button - skryje se pro native-like varianty nebo když modál používá button */}
      {!useSharedElement && (!showCloseInModal || !isOpen) && (
        <motion.button
          onClick={toggleModal}
          className="fixed right-8 bottom-8 w-16 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center z-50 group"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: isOpen && closeButtonInModal.includes(animationVariant) ? 0 : 1,
            opacity: isOpen && closeButtonInModal.includes(animationVariant) ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut"
          }}
          whileHover={!isOpen ? { 
            y: -4, 
            backgroundColor: '#1e40af',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25
            }
          } : {}}
          whileTap={!isOpen ? { 
            scale: 0.95,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30
            }
          } : {}}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="hand"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <Hand className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <X className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  )
}

export default CursorIdeas

