import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Send, ChevronRight } from 'lucide-react'
import BottomNavBar from './BottomNavBar'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'
import DealCarousel from './DealCarousel'
import ActivityCarousel from './ActivityCarousel'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`

interface MobileInspireProps {
  isOpen: boolean
  onToggle: () => void
}

const occasionTags = [
  { label: 'Víkend', bold: '20. 2. – 22. 2.' },
  { label: 'Víkend', bold: '27. 2. – 1. 3.' },
  { label: 'Jarní prázdniny', bold: null },
  { label: 'Velikonoce', bold: null },
  { label: 'Svátek', bold: '1. 5.', flag: true },
  { label: 'Svátek', bold: '8. 5.', flag: true },
]

export default function FigmaMobileInspire({ isOpen, onToggle }: MobileInspireProps) {
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const [heroInput, setHeroInput] = useState('')
  const chat = useChatbot(isOpen)

  const handleHeroSend = () => {
    const text = heroInput.trim()
    if (!text) return
    setHeroInput('')
    onToggle() // Open modal
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
        <div className="h-full overflow-y-auto z-0 bg-[#FCFBFA]">
          
          {/* Header */}
          {/* Top Header */}
          <Link to="/mobile">
            <img src={`${import.meta.env.BASE_URL}assets/top-header.jpg`} alt="Top Header" className="w-full h-auto block" />
          </Link>

          {/* Header */}
          <img src={`${import.meta.env.BASE_URL}assets/header-inspire.jpg`} alt="Header" className="w-full h-auto block" />

          {/* Hero Section – Inspire variant */}
          <div className="relative px-[12px] pt-[16px] pb-[16px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/background.jpg)` }}>
            {/* Title */}
            <h2 className="text-[24px] leading-[30px] font-bold text-black mb-[12px]">
              Pobyty a cestování plné zážitků
            </h2>

            {/* Occasion Tags */}
            <div className="flex flex-wrap gap-[6px] mb-[12px]">
              {occasionTags.map((tag, i) => (
                <button
                  key={i}
                  className="bg-white border border-[#CBCCCE] rounded-full px-[13px] py-[5px] text-[14px] leading-[20px] text-black cursor-pointer hover:bg-[#f5f5f5] transition-colors flex items-center gap-[4px]"
                >
                  {tag.flag && <span className="text-[14px]">🇨🇿</span>}
                  <span>{tag.label}{' '}</span>
                  {tag.bold && <span className="font-bold">{tag.bold}</span>}
                </button>
              ))}
            </div>

            {/* White card with shadow: input + separator + tags */}
            <div className="rounded-[16px] bg-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.18)] overflow-hidden p-[8px]">
              {/* Input area */}
              <div className="rounded-[12px] border border-[#e3e4e6] overflow-hidden">
                <div className="relative p-[16px]">
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
                  {/* Custom placeholder */}
                  {!heroInput && (
                    <div className="absolute top-[16px] left-[16px] right-[84px] pointer-events-none text-[16px] leading-[24px]">
                      <span className="italic text-[#6b6b70]">Pomůžu vám najít nabídky, které vám sednou: např. </span>
                      <span className="italic font-semibold text-black">víkendový pobyt na horách se psem, wellness pro dva tento víkend ...</span>
                    </div>
                  )}
                  <textarea
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleHeroSend() } }}
                    rows={3}
                    className="w-full bg-transparent pr-[84px] text-[16px] leading-[24px] text-black font-semibold outline-none border-none resize-none"
                  />
                  {/* Buttons inside textarea – bottom right */}
                  <div className="flex items-center gap-[4px] justify-end mt-[8px]">
                    <button className="w-[44px] h-[44px] border border-[#CBCCCE] rounded-[4px] flex items-center justify-center bg-white cursor-pointer hover:bg-[#f5f5f5] transition-colors">
                      <Mic className="w-[20px] h-[20px] text-[#333]" />
                    </button>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleHeroSend() }}
                      className="w-[44px] h-[44px] bg-[#006eb9] rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-[#005a9a] transition-colors"
                    >
                      <Send className="w-[20px] h-[20px] text-white" />
                    </button>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-[#e3e4e6]" />

                {/* Quick Tags */}
                <div className="p-[8px] flex flex-wrap gap-[8px]">
                  {['⛷️ Kam vyrazit s dětmi na jarní prázdniny?', '❤️ Kam vzít holku na rande?', '🎁 Tipy na zážitkový dárek pro tátu'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setHeroInput(tag) }}
                      className="bg-white border border-[#CBCCCE] rounded-full px-[12px] py-[4px] text-[14px] leading-[20px] text-black font-normal cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zobrazit vše button */}
              <div className="pt-[8px] pb-[4px] px-[4px]">
                <Link
                  to="/mobile/cestovani"
                  className="inline-flex items-center gap-[4px] border border-[#CBCCCE] rounded-[8px] px-[14px] py-[6px] text-[14px] leading-[20px] text-black font-medium hover:bg-[#f5f5f5] transition-colors"
                >
                  Zobrazit vše
                  <ChevronRight className="w-[14px] h-[14px] text-[#666]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Category Cards Grid + Nedávno prohlížené */}
          <div className="px-[10px] pt-[24px]">
            <img src={`${import.meta.env.BASE_URL}assets/grid2.jpg`} alt="Kategorie a nedávno prohlížené" className="w-full h-auto block" />
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
              <div ref={chat.scrollContainerRef} className="flex-1 overflow-y-auto px-[20px] pb-[6px] flex flex-col gap-[10px] min-h-0 bg-white">
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

        {/* Bottom Nav Bar */}
        {!isOpen && <BottomNavBar />}

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
