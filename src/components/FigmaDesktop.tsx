import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Info, Mic, Send } from 'lucide-react'
import { useChatbot } from '../hooks/useChatbot'
import DealCarousel from './DealCarousel'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`

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
              className="absolute right-[10px] bottom-[10px] w-[380px] h-[480px] bg-white rounded-[8px] border border-[#e3e4e6] shadow-2xl z-20 flex flex-col"
            >
              {/* Header Bar */}
              <div className="flex items-center px-[12px] py-[8px] gap-[6px] flex-shrink-0">
                {/* Mrkatko small circle */}
                <div className="w-[28px] h-[28px] bg-[#006eb9] rounded-full overflow-hidden flex-shrink-0 relative">
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
                <div className="flex items-center gap-[4px] flex-1 min-w-0">
                  <p className="text-[11px] text-[#8e8e93] truncate">Školím se, mohu udělat chybu</p>
                  <Info className="w-[12px] h-[12px] text-[#8e8e93] flex-shrink-0" />
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
              <div className="flex-1 overflow-y-auto px-[16px] pb-[8px] flex flex-col gap-[12px] min-h-0">
                {/* Welcome Title */}
                <h2 className="text-[20px] leading-[26px] font-heading font-bold text-black pt-[4px] pb-[4px]">
                  Ahoj, pomůžu najít nabídky, které ti sednou
                </h2>
                
                {/* Messages */}
                {chat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`${msg.sender === 'user' ? 'flex justify-end' : 'flex flex-col gap-[10px]'}`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="bg-[#f0f0f3] rounded-[16px] rounded-br-[4px] px-[14px] py-[8px] max-w-[80%]">
                        <p className="text-[14px] leading-[20px] text-black">{msg.text}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[14px] leading-[21px] text-[#1a1a1a] whitespace-pre-line">{msg.text}</p>
                        {msg.deals && <DealCarousel deals={msg.deals} />}
                      </>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {chat.isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-[6px]"
                  >
                    <div className="flex gap-[3px] items-center">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-[5px] h-[5px] bg-[#8e8e93] rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-[5px] h-[5px] bg-[#8e8e93] rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-[5px] h-[5px] bg-[#8e8e93] rounded-full" />
                    </div>
                    <span className="text-[13px] text-[#8e8e93]">{chat.typingText}</span>
                  </motion.div>
                )}
                
                <div ref={chat.messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="px-[10px] pb-[10px] pt-[6px] flex-shrink-0">
                <div className="flex gap-[8px] items-center">
                  {/* Input with mic inside */}
                  <div className="flex-1 flex items-center bg-white rounded-[20px] border border-[#d1d5db] px-[4px] py-[3px] focus-within:ring-2 focus-within:ring-[#006eb9]/20 focus-within:border-[#006eb9]/30">
                    <input
                      type="text"
                      value={chat.inputValue}
                      onChange={(e) => chat.setInputValue(e.target.value)}
                      onKeyDown={chat.handleKeyDown}
                      placeholder="Popište svou představu..."
                      className="flex-1 bg-transparent px-[12px] py-[6px] text-[14px] leading-[20px] text-black placeholder-[#8e8e93] outline-none border-none"
                    />
                    {/* Mic Button inside input */}
                    <button className="w-[30px] h-[30px] rounded-full border border-[#d1d5db] flex items-center justify-center flex-shrink-0 hover:bg-[#f1f3f5] transition-colors cursor-pointer bg-white">
                      <Mic className="w-[14px] h-[14px] text-[#6b7280]" />
                    </button>
                  </div>
                  
                  {/* Send Button */}
                  <button
                    onClick={chat.sendMessage}
                    className="w-[36px] h-[36px] bg-[#006eb9] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#005a9a] transition-colors cursor-pointer"
                  >
                    <Send className="w-[16px] h-[16px] text-white" />
                  </button>
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
