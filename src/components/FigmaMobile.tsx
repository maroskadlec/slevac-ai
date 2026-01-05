import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

const mrkatkoImg = "/assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png"
const mrkatkoImgBlink = "/assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png"
const sendButtonImg = "/assets/b566da7dcba8c9f0656e922633217fc36ee35512.svg"
const voiceButtonBg = "/assets/f39427466b7ce9cea4505bd4b8ac65b6e3d74bf3.svg"
const voiceIcon = "/assets/037840fe097f349417e8ae86808dddf316d4ac75.svg"

interface MobileProps {
  isOpen: boolean
  onToggle: () => void
}

export default function FigmaMobile({ isOpen, onToggle }: MobileProps) {
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Floating button pulse animation cycle with 250ms intervals
      const animationCycle = () => {
        setButtonState('state3')        // at 0ms
        setTimeout(() => setButtonState('state4'), 250)   // at 250ms
        setTimeout(() => setButtonState('state5'), 500)   // at 500ms
        setTimeout(() => setButtonState('default'), 750)  // at 750ms
      }

      // Start after 2s, repeat every 1000ms (full cycle duration)
      const initialTimeout = setTimeout(animationCycle, 2000)
      const interval = setInterval(animationCycle, 1000)

      return () => {
        clearTimeout(initialTimeout)
        clearInterval(interval)
      }
    }
  }, [isOpen])

  // Mrkatko blink animation
  useEffect(() => {
    const blinkCycle = () => {
      // Wait 2000ms, then blink
      setTimeout(() => {
        setIsBlinking(true)
        // Stay blinking for 200ms, then return to default
        setTimeout(() => {
          setIsBlinking(false)
        }, 200)
      }, 2000)
    }

    // Start initial blink cycle
    blinkCycle()
    
    // Repeat every 2400ms (2000ms default + 100ms transition + 200ms blink + 100ms transition)
    const interval = setInterval(blinkCycle, 2400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full overflow-visible flex items-center justify-center">
      <div className="relative w-[320px] h-[568px] bg-white rounded-[32px] overflow-hidden border-4 border-gray-900">
        
        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-10"
              onClick={onToggle}
            />
          )}
        </AnimatePresence>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-2xl z-20 flex flex-col gap-[10px] p-[8px] h-[480px]"
            >
              {/* Header */}
              <div className="bg-white h-[30px] overflow-hidden rounded-tl-[8px] rounded-tr-[8px] relative">
                <div className="absolute bg-[#e4e4e7] h-[3px] w-[32px] rounded-[22px] top-[6px] left-1/2 transform -translate-x-1/2" />
                
                <motion.button
                  onClick={onToggle}
                  className="absolute right-[-6px] top-[-9px] w-[48px] h-[48px] cursor-pointer flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-[14px] h-[14px] text-[#006eb9]" strokeWidth={3} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-[10px] w-full">
                <div className="flex-1 flex flex-col gap-[12px] items-center pt-[24px] px-[12px]">
                  <div className="flex flex-col gap-[12px] items-start w-[297px]">
                    <div className="flex flex-col justify-center w-full text-center">
                      <p className="text-[18px] leading-[24px] font-heading font-bold text-black">
                        Co je pro vás u nabídky nejdůležitější?
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-[12px] items-start justify-center w-full cursor-pointer">
                      <button className="bg-white flex gap-[4px] items-center justify-center px-[12px] py-[4px] rounded-[53px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.12)] hover:shadow-md transition-shadow">
                        <p className="text-[14px] leading-[22px] font-medium text-black whitespace-nowrap">
                          🛏 Záleží mi na jídle a službách
                        </p>
                      </button>
                      <button className="bg-white flex gap-[4px] items-center justify-center px-[12px] py-[4px] rounded-[53px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.12)] hover:shadow-md transition-shadow">
                        <p className="text-[14px] leading-[22px] font-medium text-black whitespace-nowrap">
                          🏞 Hezčí výhled
                        </p>
                      </button>
                      <button className="bg-white flex gap-[4px] items-center justify-center px-[12px] py-[4px] rounded-[53px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.12)] hover:shadow-md transition-shadow">
                        <p className="text-[14px] leading-[22px] font-medium text-black whitespace-nowrap">
                          💰 Chci lepší poměr cena/výkon
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col items-center justify-end overflow-hidden w-full">
                  <div className="flex flex-col gap-[8px] items-start py-[4px] px-0 w-full">
                    <div className="flex gap-[4px] items-center w-full">
                      {/* Input */}
                      <div className="flex-1 bg-[#f1f3f5] flex flex-col items-start px-[16px] py-[8px] rounded-[8px]">
                        <div className="flex gap-[8px] items-center justify-center w-full">
                          <p className="flex-1 text-[14px] leading-[22px] text-[#6b6b70] font-medium">
                            Popište mi svou představu ..
                          </p>
                        </div>
                      </div>
                      
                      {/* Send Button */}
                      <div className="w-[32px] h-[32px]">
                        <img src={sendButtonImg} alt="" className="w-full h-full" />
                      </div>
                      
                      {/* Voice Button */}
                      <div className="relative w-[32px] h-[32px]">
                        <img src={voiceButtonBg} alt="" className="w-full h-full" />
                        <div className="absolute top-[6.4px] left-[6.4px] w-[19.2px] h-[19.2px] bg-[#17181b] rounded-full flex items-center justify-center">
                          <img src={voiceIcon} alt="" className="w-[11.789px] h-[16px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={onToggle}
          className="absolute right-[8px] bottom-[8px] flex items-center p-[6px] rounded-[58px] cursor-pointer z-30"
          animate={
            isOpen 
              ? { scale: 0, opacity: 0, backgroundColor: 'transparent' }
              : { 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: buttonState === 'default' 
                    ? 'rgba(0,110,185,0.07)' 
                    : 'rgba(0,110,185,0)'
                }
          }
          transition={
            isOpen 
              ? { duration: 0.2 }
              : {
                  type: "spring",
                  mass: 1,
                  stiffness: 6400,
                  damping: 120,
                  scale: { duration: 0.2 },
                  opacity: { duration: 0.2 }
                }
          }
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(0,110,185,0.12)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="flex items-center p-[6px] rounded-[50px]"
            animate={{
              backgroundColor: buttonState === 'state4' 
                ? 'transparent' 
                : 'rgba(0,110,185,0.16)'
            }}
            transition={{
              type: "spring",
              mass: 1,
              stiffness: 6400,
              damping: 120
            }}
          >
            <div className="bg-[#006eb9] border-2 border-white flex flex-col items-center justify-center rounded-[38px] w-[48px] h-[48px] overflow-hidden">
              <div className="w-[40px] h-[40px] relative">
                <div className="absolute left-1/2 top-[calc(50%-0.25px)] -translate-x-1/2 -translate-y-1/2 w-[39.375px] h-[37.5px]">
                  <div className="absolute inset-[0_1.56%_0_-1.56%]">
                    <div className="absolute inset-0 overflow-visible">
                      <motion.img 
                        src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                        alt="Mrkatko" 
                        className="absolute left-[-22.38%] top-[-6.15%] w-[167.25%] h-[174.82%] max-w-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.1,
                          ease: "easeIn"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.button>
      </div>
    </div>
  )
}

