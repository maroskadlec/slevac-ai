import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Mic, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'
import DealCarousel from './DealCarousel'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`

interface MobileProps {
  isOpen: boolean
  onToggle: () => void
}

export default function FigmaMobile({ isOpen, onToggle }: MobileProps) {
  const navigate = useNavigate()
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const [heroInput, setHeroInput] = useState('')
  const chat = useChatbot(isOpen)

  const handleHeroSend = () => {
    const text = heroInput.trim()
    if (!text) return
    setHeroInput('')
    onToggle() // Open modal
    // Small delay to let modal open, then send message
    setTimeout(() => {
      chat.sendMessageWithText(text)
    }, 400)
  }

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
    <div className="relative w-full max-w-[400px] h-[100dvh] bg-white overflow-hidden mx-auto">
        
        {/* ===== SLEVOMAT APP LAYOUT ===== */}
        <div className="h-full overflow-y-auto z-0">
          
          {/* Header */}
          <img src={`${import.meta.env.BASE_URL}assets/header.jpg`} alt="Header" className="w-full h-auto block" />

          {/* Hero Section */}
          <div className="relative bg-[#E5F0F7] px-[14px] pt-[16px] pb-[20px] overflow-hidden">
            {/* Mrkatko avatar - absolute positioned */}
            <div className="absolute top-[10px] right-[10px] w-[110px] h-[110px]">
              <motion.img 
                src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                alt="Mrkatko" 
                className="w-full h-full object-contain"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: "easeIn" }}
              />
            </div>
            
            <h2 className="text-[#1a1a1a] font-bold text-[20px] leading-[24px] pr-[110px]">
              Pomůžu vám najít nabídky, které vám sednou
            </h2>

            {/* Search Input */}
            <div className="mt-[12px] bg-white rounded-[8px] px-[6px] py-[4px] flex items-center border border-solid border-[#CBCCCE]">
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleHeroSend() }}
                placeholder="Popište mi, co chcete zažít ..."
                className="flex-1 bg-transparent text-[16px] text-[#333] placeholder-[#999] outline-none border-none"
              />
              <Mic className="w-[16px] h-[16px] text-[#333] flex-shrink-0 ml-[8px]" />
              {heroInput.trim().length > 0 && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleHeroSend}
                  className="w-[28px] h-[28px] bg-[#006eb9] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#005a9a] transition-colors cursor-pointer ml-[6px]"
                >
                  <Send className="w-[12px] h-[12px] text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Promo Banner */}
          <div className="mx-[10px] mt-[10px] rounded-[10px] overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}assets/banner.jpg`} alt="Promo banner" className="w-full h-auto block" />
          </div>

          {/* Location */}
          <div className="px-[10px] py-[10px] flex items-center justify-center gap-[4px] text-[11px]">
            <span className="text-[#333]">Praha a okolí</span>
            <span className="text-[#333]">·</span>
            <span className="text-[#00a84f] font-medium cursor-pointer hover:underline" onClick={() => navigate('/')}>Změnit lokalitu</span>
          </div>

          {/* Category Cards Grid + Nedávno prohlížené */}
          <div className="px-[10px]">
            <img src={`${import.meta.env.BASE_URL}assets/grid.jpg`} alt="Kategorie a nedávno prohlížené" className="w-full h-auto block" />
          </div>

          {/* Bottom spacer for floating button */}
          <div className="h-[80px]" />
        </div>

        {/* ===== CHATBOT OVERLAY ===== */}
        
        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-30"
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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-2xl z-40 flex flex-col h-[85dvh]"
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
                <button
                  onClick={chat.handleDisclaimer}
                  className="flex items-center gap-[3px] flex-1 min-w-0 cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <p className="text-[14px] leading-[22px] text-[#8e8e93] truncate">Školím se, mohu udělat chybu</p>
                  <Info className="w-[14px] h-[14px] text-[#8e8e93] flex-shrink-0" />
                </button>
                
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
                <h2 className="text-[24px] leading-[30px] font-heading font-bold text-black pt-[2px] pb-[2px]">
                  Ahoj, pomůžu najít nabídky, které ti sednou
                </h2>
                
                {/* Messages */}
                {chat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`${msg.sender === 'user' ? 'flex justify-end' : 'flex flex-col gap-[8px]'}`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="bg-[#f0f0f3] rounded-[14px] rounded-br-[4px] px-[12px] py-[6px] max-w-[85%]">
                        <p className="text-[14px] leading-[22px] text-black">{msg.text}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[14px] leading-[22px] text-[#1a1a1a] whitespace-pre-line">{msg.text}</p>
                        {msg.deals && <DealCarousel deals={msg.deals} compact onFeedback={chat.handleFeedback} />}
                      </>
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
                    <span className="text-[14px] leading-[22px] text-[#8e8e93]">{chat.typingText}</span>
                  </motion.div>
                )}
                
                <div ref={chat.messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="px-[8px] pb-[8px] pt-[4px] flex-shrink-0">
                <div className="flex gap-[6px] items-center">
                  {/* Input with mic inside */}
                  <div className="flex-1 flex items-center bg-white rounded-[18px] border border-[#d1d5db] px-[3px] py-[2px] focus-within:ring-2 focus-within:ring-[#006eb9]/20 focus-within:border-[#006eb9]/30">
                    <input
                      type="text"
                      value={chat.inputValue}
                      onChange={(e) => chat.setInputValue(e.target.value)}
                      onKeyDown={chat.handleKeyDown}
                      placeholder="Popište svou představu..."
                      className="flex-1 bg-transparent px-[10px] py-[5px] text-[16px] leading-[20px] text-black placeholder-[#8e8e93] outline-none border-none"
                    />
                    {/* Mic Button inside input */}
                    <button className="w-[26px] h-[26px] rounded-full border border-[#d1d5db] flex items-center justify-center flex-shrink-0 hover:bg-[#f1f3f5] transition-colors cursor-pointer bg-white">
                      <Mic className="w-[12px] h-[12px] text-[#6b7280]" />
                    </button>
                  </div>
                  
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

        {/* Floating Button - HIGH Z-INDEX */}
        <motion.button
          onClick={onToggle}
          className="absolute right-[8px] bottom-[8px] flex items-center p-[6px] rounded-[58px] cursor-pointer z-50"
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
  )
}
