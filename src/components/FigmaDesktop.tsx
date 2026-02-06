import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useChatbot } from '../hooks/useChatbot'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`
const closeIconImg = `${import.meta.env.BASE_URL}assets/c1b749a8143858489d026131cbf1d1804e6e2af0.svg`
const sendButtonImg = `${import.meta.env.BASE_URL}assets/7c097206977c16b3e9fcff249f8fd9c86fbd5568.svg`
const voiceButtonBg = `${import.meta.env.BASE_URL}assets/74ad77275199479aea4bf86e7ce94c22d3306a24.svg`
const voiceIcon = `${import.meta.env.BASE_URL}assets/037840fe097f349417e8ae86808dddf316d4ac75.svg`

interface DesktopProps {
  isOpen: boolean
  onToggle: () => void
}

export default function FigmaDesktop({ isOpen, onToggle }: DesktopProps) {
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const chat = useChatbot(isOpen)

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
      <div className="relative w-[1000px] h-[800px] bg-white rounded-lg border-4 border-black overflow-hidden">
        
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

        {/* Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30
              }}
              className="absolute right-[10px] bottom-[10px] w-[380px] h-[480px] bg-white rounded-[8px] border border-[#e3e4e6] shadow-2xl z-20 flex flex-col gap-[10px] items-end p-[10px]"
            >
              {/* Header with Mrkatko and Close Button */}
              <div className="relative w-full h-[24px] flex justify-end">
                {/* Mrkatko positioned to the left */}
                <div className="absolute left-0 top-[-2px] w-[48px] h-[48px] pointer-events-none">
                  <div 
                    className="absolute flex items-center justify-center left-[calc(50%+0.2px)] top-[calc(50%+0.55px)] -translate-x-1/2 -translate-y-1/2"
                    style={{ width: '58.684px', height: '57.054px' }}
                  >
                    <div className="rotate-[345deg]">
                      <div className="relative w-[48.402px] h-[46.098px]">
                        <div className="absolute inset-[0_1.56%_0_-1.56%]">
                          <div className="absolute inset-0 overflow-hidden">
                            <motion.img 
                              alt="Mrkatko" 
                              className="absolute h-[174.82%] left-[-22.38%] max-w-none top-[-6.15%] w-[167.25%]" 
                              src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
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
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={onToggle}
                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer relative z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img alt="Close" className="w-[14px] h-[14px]" src={closeIconImg} />
                </motion.button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col w-full min-h-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-[12px] py-[8px] flex flex-col gap-[8px] scrollbar-thin">
                  {chat.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-[12px] py-[8px] rounded-[12px] text-[14px] leading-[20px] whitespace-pre-line ${
                          msg.sender === 'user'
                            ? 'bg-[#006eb9] text-white rounded-br-[4px]'
                            : 'bg-[#f1f3f5] text-black rounded-bl-[4px]'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {chat.isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#f1f3f5] px-[14px] py-[10px] rounded-[12px] rounded-bl-[4px] flex gap-[4px] items-center">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-[6px] h-[6px] bg-gray-400 rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-[6px] h-[6px] bg-gray-400 rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-[6px] h-[6px] bg-gray-400 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={chat.messagesEndRef} />
                </div>

                {/* Input Footer */}
                <div className="flex flex-col items-center justify-end w-full px-[4px] pb-[4px]">
                  <div className="flex gap-[6px] items-center w-full">
                    <input
                      type="text"
                      value={chat.inputValue}
                      onChange={(e) => chat.setInputValue(e.target.value)}
                      onKeyDown={chat.handleKeyDown}
                      placeholder="Popište mi svou představu .."
                      className="flex-1 bg-[#f1f3f5] px-[16px] py-[8px] rounded-[8px] text-[16px] leading-[22px] text-black placeholder-[#6b6b70] outline-none border-none focus:ring-2 focus:ring-[#006eb9]/30"
                    />
                    
                    {/* Send Button */}
                    <button
                      onClick={chat.sendMessage}
                      className="w-[40px] h-[40px] cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <img src={sendButtonImg} alt="Odeslat" className="w-full h-full" />
                    </button>
                    
                    {/* Voice Button */}
                    <div className="relative w-[40px] h-[40px] flex-shrink-0">
                      <img src={voiceButtonBg} alt="" className="w-full h-full" />
                      <div className="absolute top-[8px] left-[8px] w-[24px] h-[24px] bg-[#17181b] rounded-full flex items-center justify-center">
                        <img src={voiceIcon} alt="" className="w-[11.789px] h-[16px]" />
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
          className="absolute right-[10px] bottom-[10px] flex items-center p-[6px] rounded-[58px] cursor-pointer z-30"
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

