import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Mic, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useChatbot } from '../hooks/useChatbot'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`

interface MobileProps {
  isOpen: boolean
  onToggle: () => void
}

export default function FigmaMobile({ isOpen, onToggle }: MobileProps) {
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const chat = useChatbot(isOpen)

  useEffect(() => {
    if (!isOpen) {
      const animationCycle = () => {
        setButtonState('state3')
        setTimeout(() => setButtonState('state4'), 250)
        setTimeout(() => setButtonState('state5'), 500)
        setTimeout(() => setButtonState('default'), 750)
      }
      const initialTimeout = setTimeout(animationCycle, 2000)
      const interval = setInterval(animationCycle, 1000)
      return () => {
        clearTimeout(initialTimeout)
        clearInterval(interval)
      }
    }
  }, [isOpen])

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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-2xl z-20 flex flex-col h-[480px]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-[6px] pb-[2px] flex-shrink-0">
                <div className="bg-[#e4e4e7] h-[3px] w-[32px] rounded-[22px]" />
              </div>

              {/* Header Bar */}
              <div className="flex items-center px-[10px] py-[6px] gap-[6px] flex-shrink-0">
                {/* Mrkatko small circle */}
                <div className="w-[24px] h-[24px] bg-[#006eb9] rounded-full overflow-hidden flex-shrink-0 relative">
                  <motion.img 
                    alt="Mrkatko" 
                    className="absolute w-[167%] h-[175%] max-w-none left-[-22%] top-[-6%]"
                    src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, ease: "easeIn" }}
                  />
                </div>
                
                {/* Disclaimer */}
                <div className="flex items-center gap-[3px] flex-1 min-w-0">
                  <p className="text-[10px] text-[#8e8e93] truncate">Školím se, mohu udělat chybu</p>
                  <Info className="w-[10px] h-[10px] text-[#8e8e93] flex-shrink-0" />
                </div>
                
                {/* Close button */}
                <motion.button
                  onClick={onToggle}
                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-[14px] h-[14px] text-[#006eb9]" strokeWidth={3} />
                </motion.button>
              </div>

              {/* Scrollable Chat Area */}
              <div className="flex-1 overflow-y-auto px-[12px] pb-[6px] flex flex-col gap-[10px] min-h-0">
                {/* Welcome Title */}
                <h2 className="text-[18px] leading-[24px] font-heading font-bold text-black pt-[2px] pb-[2px]">
                  Ahoj, pomůžu najít nabídky, které ti sednou
                </h2>
                
                {/* Messages */}
                {chat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={msg.sender === 'user' ? 'flex justify-end' : ''}
                  >
                    {msg.sender === 'user' ? (
                      <div className="bg-[#f0f0f3] rounded-[14px] rounded-br-[4px] px-[12px] py-[6px] max-w-[85%]">
                        <p className="text-[13px] leading-[18px] text-black">{msg.text}</p>
                      </div>
                    ) : (
                      <p className="text-[13px] leading-[19px] text-[#1a1a1a] whitespace-pre-line">{msg.text}</p>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {chat.isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-[5px]"
                  >
                    <div className="flex gap-[3px] items-center">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-[4px] h-[4px] bg-[#8e8e93] rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-[4px] h-[4px] bg-[#8e8e93] rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-[4px] h-[4px] bg-[#8e8e93] rounded-full" />
                    </div>
                    <span className="text-[12px] text-[#8e8e93]">{chat.typingText}</span>
                  </motion.div>
                )}
                
                <div ref={chat.messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="px-[8px] pb-[8px] pt-[4px] flex-shrink-0">
                <div className="flex gap-[6px] items-center">
                  <input
                    type="text"
                    value={chat.inputValue}
                    onChange={(e) => chat.setInputValue(e.target.value)}
                    onKeyDown={chat.handleKeyDown}
                    placeholder="Popište svou představu..."
                    className="flex-1 bg-[#f1f3f5] rounded-[18px] px-[14px] py-[8px] text-[13px] leading-[18px] text-black placeholder-[#8e8e93] outline-none border-none focus:ring-2 focus:ring-[#006eb9]/20"
                  />
                  
                  {/* Mic Button */}
                  <button className="w-[32px] h-[32px] bg-[#17181b] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#2a2a2e] transition-colors cursor-pointer">
                    <Mic className="w-[14px] h-[14px] text-white" />
                  </button>
                  
                  {/* Send Button */}
                  <button
                    onClick={chat.sendMessage}
                    className="w-[32px] h-[32px] bg-[#006eb9] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#005a9a] transition-colors cursor-pointer"
                  >
                    <Send className="w-[14px] h-[14px] text-white" />
                  </button>
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
