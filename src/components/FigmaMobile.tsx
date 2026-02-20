import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'
import DealCarousel from './DealCarousel'
import ActivityCarousel from './ActivityCarousel'

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
          <div className="relative bg-[#FCFBFA] px-[12px] pt-[16px] pb-[16px]">
            {/* Container: input + separator + tags */}
            <div className="rounded-[12px] border border-[#CBCCCE] bg-white overflow-hidden">
              {/* Textarea with avatar on the right */}
              <div className="relative">
                {/* Avatar – right side */}
                <div className="absolute top-[10px] right-[-16px] w-[86px] h-[86px] flex-shrink-0">
                  <motion.img 
                    src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                    alt="Mrkatko" 
                    className="w-full h-full object-contain rounded-full"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, ease: "easeIn" }}
                  />
                </div>
                {/* Custom placeholder with mixed font-weights */}
                {!heroInput && (
                  <div className="absolute top-[12px] left-[12px] right-[84px] pointer-events-none text-[14px] leading-[20px] text-[#1a1a1a]">
                    <span className="font-normal">Pomůžu vám najít nabídky, které vám sednou: </span>
                    <span className="font-semibold">např. víkendový pobyt na horách se psem, wellness pro dva tento víkend ...</span>
                  </div>
                )}
                <textarea
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleHeroSend() } }}
                  rows={4}
                  className="w-full bg-transparent pl-[12px] pr-[84px] pt-[12px] pb-[40px] text-[14px] leading-[20px] text-[#1a1a1a] font-semibold outline-none border-none resize-none"
                />
                {/* Buttons inside textarea – bottom right */}
                <div className="absolute bottom-[8px] right-[8px] flex items-center gap-[8px]">
                  <Mic className="w-[22px] h-[22px] text-[#8e8e93] flex-shrink-0 cursor-pointer" />
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleHeroSend() }}
                    className="w-[36px] h-[36px] bg-[#006eb9] rounded-[8px] flex items-center justify-center flex-shrink-0 hover:bg-[#005a9a] transition-all cursor-pointer"
                  >
                    <Send className="w-[16px] h-[16px] text-white" />
                  </button>
                </div>
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-[#CBCCCE]" />

              {/* Tags */}
              <div className="px-[10px] py-[8px] flex flex-wrap gap-[6px]">
                {['🧖 Chci zažít wellness a odpočinout si', '👨‍👩‍👧‍👦 S dětmi na týdenní prázdniny', '💑 Kam vzít holku na rande'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setHeroInput(tag) }}
                    className="bg-white border border-[#CBCCCE] rounded-[16px] px-[10px] py-[4px] text-[13px] text-[#333] font-normal cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
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
              {/* Header Bar – text left, close button right */}
              <div className="flex items-center justify-between px-[18px] pt-[14px] pb-[6px] flex-shrink-0 border-b border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="text-[12px] leading-[16px] text-[#8e8e93]">
                  S reklamací nebo refundací pomůže{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[#006eb9] hover:underline">kolega Slávek</a>.
                </p>
                <motion.button
                  onClick={onToggle}
                  className="w-[28px] h-[28px] flex items-center justify-center cursor-pointer flex-shrink-0 ml-[8px]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-[18px] h-[18px] text-[#006eb9]" strokeWidth={3} />
                </motion.button>
              </div>

              {/* Scrollable Chat Area */}
              <div className="flex-1 overflow-y-auto px-[20px] pb-[6px] flex flex-col gap-[10px] min-h-0 bg-white">
                {/* Welcome Title */}
                <h2 className="text-[32px] leading-[38px] font-heading font-bold text-black pt-[26px] pb-[2px] text-center">
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
                      <div className="bg-[#E5F0F7] rounded-[16px] rounded-br-[4px] px-[14px] py-[8px] max-w-[85%]">
                        <p className="text-[14px] leading-[22px] text-[#1a1a1a]">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#e5e7eb] rounded-[16px] rounded-bl-[4px] px-[14px] py-[10px] max-w-[95%]">
                        {msg.image && <img src={msg.image} alt="" className="w-[32px] h-[32px] mb-[4px]" />}
                        <p className="text-[14px] leading-[22px] text-[#1a1a1a] whitespace-pre-line" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.+?)\*\*/g, '<strong class="underline">$1</strong>') }} />
                        {msg.deals && (
                          <>
                            <p className="text-[13px] leading-[20px] text-[#1a1a1a] font-semibold mt-[8px] mb-[4px]">
                              Tady je 5 z 30 nabídek, seřazených podle hodnocení ostatních.{' '}
                              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#006eb9] font-semibold hover:underline">Zobrazit všechny</a>
                            </p>
                            <DealCarousel deals={msg.deals} compact onFeedback={chat.handleFeedback} />
                          </>
                        )}
                        {msg.activities && <ActivityCarousel activities={msg.activities} compact />}
                      </div>
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

              {/* Footer area: quick tags + input bar */}
              <div className="flex-shrink-0 border-t border-[#e5e7eb]">
              {/* Quick Tags (contextual shortcuts) */}
              {chat.quickTags.length > 0 && (
                <div className="px-[16px] pt-[6px] pb-[2px] flex flex-wrap gap-[6px]">
                  {chat.quickTags.map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => tag.value !== '__fakedoor__' && chat.sendMessageWithText(tag.value)}
                      className="bg-white border border-[#CBCCCE] rounded-[20px] px-[14px] py-[6px] text-[13px] text-[#333] font-normal cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar – textarea with buttons inside */}
              <div className="px-[16px] pb-[14px] pt-[4px]">
                <div className="relative bg-white rounded-[12px] border border-[#d1d5db] focus-within:ring-2 focus-within:ring-[#006eb9]/20 focus-within:border-[#006eb9]/30">
                  <textarea
                    value={chat.inputValue}
                    onChange={(e) => chat.setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        chat.sendMessage()
                      }
                    }}
                    placeholder="Popiš svou představu..."
                    rows={3}
                    className="w-full bg-transparent px-[12px] pt-[8px] pb-[32px] text-[16px] leading-[20px] text-black placeholder-[#8e8e93] outline-none border-none resize-none"
                  />
                  {/* Buttons inside input – bottom right */}
                  <div className="absolute bottom-[8px] right-[8px] flex items-center gap-[8px]">
                    <Mic className="w-[18px] h-[18px] text-[#8e8e93] flex-shrink-0 cursor-pointer" />
                    <button
                      onClick={chat.sendMessage}
                      className="w-[32px] h-[32px] bg-[#006eb9] rounded-[8px] flex items-center justify-center flex-shrink-0 hover:bg-[#005a9a] transition-colors cursor-pointer"
                    >
                      <Send className="w-[14px] h-[14px] text-white" />
                    </button>
                  </div>
                </div>
                {/* Disclaimer text below input */}
                <button
                  onClick={chat.handleDisclaimer}
                  className="mt-[4px] w-full text-center cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <p className="text-[12px] leading-[16px] text-[#8e8e93]">Jsem tu chvilku a učím se. Občas můžu udělat chybku.</p>
                </button>
              </div>
              </div>{/* end footer area */}
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
