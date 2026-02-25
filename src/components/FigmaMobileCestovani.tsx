import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Send, SlidersHorizontal, Map, ArrowUpDown, ChevronRight } from 'lucide-react'
import BottomNavBar from './BottomNavBar'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'
import DealCarousel from './DealCarousel'
import ActivityCarousel from './ActivityCarousel'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`
const BASE = import.meta.env.BASE_URL

interface MobileCestovaniProps {
  isOpen: boolean
  onToggle: () => void
}

const categoryPills = [
  { name: 'S wellness', count: 1462, image: `${BASE}assets/pills/wellness.png` },
  { name: 'S dětmi', count: 1702, image: `${BASE}assets/pills/deti.png` },
  { name: 'Exotická dovolená', count: 128, image: `${BASE}assets/pills/exoticka.png` },
  { name: 'Výlety do zahraničí', count: 244, image: `${BASE}assets/pills/vylety.png` },
  { name: 'Lyžování', count: 896, image: `${BASE}assets/pills/lyzovani.png` },
  { name: 'Netradiční ubytování', count: 297, image: `${BASE}assets/pills/netradicni.png` },
  { name: 'Bez dětí', count: 69, image: `${BASE}assets/pills/bezdeti.png` },
  { name: 'Romantika pro dva', count: 684, image: `${BASE}assets/pills/romantika.png` },
]

const productCards = [
  {
    id: 'p1',
    image: `${BASE}assets/deals/d1.jpg`,
    title: '5* polské Beskydy: wellness, herny i výlety, děti zdarma',
    price: 3451,
    originalPrice: 3727,
    discount: 7,
    ratingLabel: 'Skvělé',
    rating: 4.7,
    reviewCount: 1400,
    provider: 'Crystal Mountain',
    location: 'Wisła – Polsko',
    distance: 'cca 90 km / 1 h 15 min',
    persons: '2 osoby (1 osoba = 1 725,50 Kč), 2 dny',
    daysExtra: '(až 15 dní)',
    features: ['Platba na zálohu', 'Pojištění storna', 'Změna'],
  },
  {
    id: 'p2',
    image: `${BASE}assets/deals/d2.jpg`,
    title: 'Pobyt v Jeseníkách: wellness, sport a polopenze',
    price: 7474,
    ratingLabel: 'Skvělé',
    rating: 4.6,
    reviewCount: 732,
    provider: 'Hotel Kamzík',
    location: 'Jeseníky',
    distance: 'cca 90 km / 1 h 30 min',
    persons: '2 osoby (1 osoba = 3 737 Kč), 3 dny',
    daysExtra: '(až 15 dní)',
    features: ['Platba na zálohu', 'Pojištění storna', 'Benefity'],
  },
  {
    id: 'p3',
    image: `${BASE}assets/deals/d3.jpg`,
    title: 'Termály Malé Bielice: polopenze a vstup do termálního komplexu',
    price: 4244,
    ratingLabel: '',
    rating: 4.4,
    reviewCount: 2122,
    provider: 'Termály Malé Bielice',
    location: 'Záp. Slovensko',
    distance: 'cca 200 km / 2 h 45 min',
    persons: '2 osoby (1 osoba = 2 122 Kč), 2 dny',
    daysExtra: '(až 15 dní)',
    features: ['Pojištění storna', 'Benefity'],
  },
  {
    id: 'p4',
    image: `${BASE}assets/deals/d4.jpg`,
    title: 'Rodinný pobyt v resortu ve Visle: aquapark a jídlo',
    price: 4519,
    originalPrice: 4859,
    ratingLabel: 'Skvělé',
    rating: 4.7,
    reviewCount: 886,
    provider: 'Hotel Gołębiewski w Wiśle',
    location: 'Wisła – Polsko',
    distance: 'cca 80 km / 1 h',
    persons: '2 osoby (1 osoba = 2 259,50 Kč), 2 dny',
    daysExtra: '+ další varianty',
    features: ['Platba na zálohu', 'Pojištění storna', 'Změna'],
  },
]

export default function FigmaMobileCestovani({ isOpen, onToggle }: MobileCestovaniProps) {
  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const [heroInput, setHeroInput] = useState('')
  const chat = useChatbot(isOpen)

  const handleHeroSend = () => {
    const text = heroInput.trim()
    if (!text) return
    setHeroInput('')
    onToggle()
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
        setTimeout(() => setIsBlinking(false), 200)
      }, 2000)
    }
    blinkCycle()
    const interval = setInterval(blinkCycle, 2400)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (n: number) => n.toLocaleString('cs-CZ')

  return (
    <div className="relative w-full max-w-[400px] h-[100dvh] bg-white overflow-hidden mx-auto">

      {/* ===== PAGE CONTENT ===== */}
      <div className="h-full overflow-y-auto z-0 bg-[#FCFBFA]">

        {/* Top Header */}
        <Link to="/mobile">
          <img src={`${BASE}assets/top-header.jpg`} alt="Top Header" className="w-full h-auto block" />
        </Link>

        {/* Header image */}
        <img src={`${BASE}assets/header-inspire.jpg`} alt="Header" className="w-full h-auto block" />

        {/* Hero Section with light blue background */}
        <div className="bg-[#E6F7FC]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-[4px] px-[8px] py-[12px] text-[14px] leading-[24px]">
            <Link to="/mobile/inspire" className="text-[#006eb9] cursor-pointer hover:underline">Inspirace</Link>
            <ChevronRight className="w-[10px] h-[10px] text-[#999]" />
            <span className="text-[#006eb9] font-bold cursor-pointer hover:underline">Všechny nabídky</span>
          </div>

          {/* Category Header */}
          <div className="px-[8px]">
            <h1 className="text-[24px] leading-[30px] font-bold text-black mb-[4px]">Cestování</h1>
            <div className="text-[14px] leading-[20px] text-[#333] max-h-[40px] overflow-hidden relative mb-[2px]">
              <p>
                Objevujte svět se Slevomatem. Zamluvte si třeba{' '}
                <span className="text-[#006eb9] underline">wellness pobyt</span>{' '}
                a relaxujte od rána do večera.
              </p>
            </div>
            <button className="text-[14px] leading-[21px] text-[#006eb9] font-medium mb-[8px]">
              Více informací
            </button>
          </div>

          {/* Category Pills */}
          <div className="relative">
            <div className="overflow-x-auto pl-[8px] py-[8px]" style={{ scrollbarWidth: 'none' }}>
              <div className="flex gap-[8px] pr-[24px]">
                {categoryPills.map((pill) => (
                  <button
                    key={pill.name}
                    className="flex-shrink-0 flex items-center gap-[6px] bg-white border border-[#cbccce] rounded-full pl-[5px] pr-[13px] py-[5px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                  >
                    <img src={pill.image} alt={pill.name} className="w-[44px] h-[44px] rounded-full object-cover" />
                    <span className="text-[14px] font-bold text-black leading-[18px] whitespace-nowrap">{pill.name}</span>
                    <span className="bg-[#006eb9] text-white text-[12px] font-bold leading-[18px] rounded-full px-[8px] py-[1px] min-w-[20px] text-center">
                      {pill.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 bottom-0 w-[60px] bg-gradient-to-l from-[#E6F7FC] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-[12px] px-[8px] pt-[12px] pb-[8px]">
          <button className="flex-1 flex items-center justify-center gap-[6px] py-[9px] text-[14px] leading-[22px] text-[#333] border border-[#cbccce] rounded-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <ArrowUpDown className="w-[16px] h-[16px] text-[#333]" />
            Řazení
          </button>
          <button className="flex-1 flex items-center justify-center gap-[6px] py-[9px] text-[14px] leading-[22px] text-[#333] border border-[#cbccce] rounded-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <SlidersHorizontal className="w-[16px] h-[16px] text-[#333]" />
            Filtry
          </button>
          <button className="flex-1 flex items-center justify-center gap-[6px] py-[9px] text-[14px] leading-[22px] text-[#333] border border-[#cbccce] rounded-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <Map className="w-[16px] h-[16px] text-[#333]" />
            Mapa
          </button>
        </div>

        {/* AI Input Section */}
        <div className="px-[8px] pb-[16px]">
          <div className="bg-white border border-[#cbccce] rounded-[12px] overflow-hidden">
            <div className="relative p-[16px]">
              {/* Avatar – right side */}
              <div className="absolute top-[10px] right-[-16px] w-[86px] h-[86px] flex-shrink-0">
                <motion.img
                  src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                  alt="Mrkatko"
                  className="w-full h-full object-contain rounded-full"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: 'easeIn' }}
                />
              </div>
              {/* Title */}
              <p className="text-[16px] leading-[24px] font-bold text-black mb-[8px] pr-[60px]">
                Najdu i podle hodnocení ostatních
              </p>
              {/* Custom placeholder */}
              {!heroInput && (
                <div className="absolute left-[16px] right-[84px] pointer-events-none text-[16px] leading-[24px]" style={{ top: '52px' }}>
                  <span className="italic text-[#6b6b70]">např. </span>
                  <span className="italic font-semibold text-black">hotel s klidným prostředím, čistým wellness, skvělou snídaní a pohodlnými postelemi ...</span>
                </div>
              )}
              <textarea
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleHeroSend() } }}
                rows={3}
                className="w-full bg-transparent pr-[84px] text-[16px] leading-[24px] text-black font-semibold outline-none border-none resize-none"
              />
              {/* Buttons inside – bottom right */}
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
          </div>
        </div>

        {/* Results Count */}
        <div className="px-[8px] pb-[12px]">
          <p className="text-[14px] leading-[20px] text-[#6b6b70]">3 465 nabídek</p>
        </div>

        {/* Product Cards */}
        <div className="flex flex-col">
          {productCards.map((card) => (
            <div key={card.id} className="border-b border-[#e5e7eb]">
              {/* Product Image */}
              <div className="relative">
                <img src={card.image} alt={card.title} className="w-full h-[195px] object-cover" />
                {/* Price Badge */}
                <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[4px]">
                  <div className="bg-[#00a84f] text-white font-bold text-[14px] rounded-[4px] px-[10px] py-[10px] leading-[16px]">
                    {formatPrice(card.price)} Kč
                  </div>
                  {card.originalPrice && (
                    <span className="text-white font-medium text-[12px] line-through opacity-90">
                      {formatPrice(card.originalPrice)} Kč
                    </span>
                  )}
                  {card.discount && (
                    <span className="bg-[#f0c850] text-[#333] font-bold text-[12px] rounded-[3px] px-[4px] py-[3px]">
                      −{card.discount} %
                    </span>
                  )}
                </div>
                {/* Heart */}
                <button className="absolute top-[8px] right-[8px] w-[32px] h-[32px] bg-white/80 rounded-full flex items-center justify-center">
                  <svg className="w-[16px] h-[16px] text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="px-[8px] pt-[24px] pb-[8px]">
                <h2 className="text-[16px] leading-[24px] font-bold text-black mb-[6px]">{card.title}</h2>
                {/* Rating */}
                <div className="flex items-center gap-[4px] mb-[6px] text-[14px] leading-[18px]">
                  {card.ratingLabel && <span className="text-[#00a84f] font-bold">{card.ratingLabel}</span>}
                  <span className="text-[#333]">⭐ {card.rating.toFixed(1).replace('.', ',')} / 5</span>
                  <span className="text-[#999]">({formatPrice(card.reviewCount)} hodnocení)</span>
                </div>
                {/* Provider & Location */}
                <div className="flex items-center gap-[4px] text-[14px] leading-[18px] text-[#333] mb-[2px]">
                  <span>{card.provider}</span>
                  <span className="text-[#999]">📍 {card.location}</span>
                </div>
                {/* Distance */}
                <div className="flex items-center gap-[4px] text-[14px] leading-[18px] text-[#999] mb-[2px]">
                  <span>🚗 {card.distance}</span>
                </div>
                {/* Persons */}
                <p className="text-[14px] leading-[18px] text-[#333]">
                  {card.persons} <span className="text-[#006eb9]">{card.daysExtra}</span>
                </p>
              </div>

              {/* Features */}
              <div className="px-[8px] pb-[12px] flex gap-[0px] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {card.features.map((feat) => (
                  <span
                    key={feat}
                    className="flex-shrink-0 flex items-center gap-[4px] text-[13px] leading-[20px] text-[#006eb9] px-[13px] py-[4px] border border-[#e5e7eb] rounded-full mr-[6px]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom spacer */}
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-2xl z-40 flex flex-col h-[85dvh]"
          >
            {/* Header Bar */}
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
              <h2 className="text-[32px] leading-[38px] font-heading font-bold text-black pt-[26px] pb-[2px] text-center">
                Ahoj, pomůžu najít nabídky, které ti sednou
              </h2>

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

              {chat.isTyping && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-[5px]">
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

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-[#e5e7eb]">
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

              <div className="px-[16px] pb-[14px] pt-[4px]">
                <div className="relative bg-white rounded-[12px] border border-[#d1d5db] focus-within:ring-2 focus-within:ring-[#006eb9]/20 focus-within:border-[#006eb9]/30">
                  <textarea
                    value={chat.inputValue}
                    onChange={(e) => chat.setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chat.sendMessage() } }}
                    placeholder="Popiš svou představu..."
                    rows={3}
                    className="w-full bg-transparent px-[12px] pt-[8px] pb-[32px] text-[16px] leading-[20px] text-black placeholder-[#8e8e93] outline-none border-none resize-none"
                  />
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
                <button onClick={chat.handleDisclaimer} className="mt-[4px] w-full text-center cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="text-[12px] leading-[16px] text-[#8e8e93]">Jsem tu chvilku a učím se. Občas můžu udělat chybku.</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      {!isOpen && <BottomNavBar />}

      {/* Floating Button */}
      <motion.button
        onClick={onToggle}
        className="absolute right-[8px] bottom-[8px] flex items-center p-[6px] rounded-[58px] cursor-pointer z-50"
        animate={
          isOpen
            ? { scale: 0, opacity: 0, backgroundColor: 'transparent' }
            : { scale: 1, opacity: 1, backgroundColor: buttonState === 'default' ? 'rgba(0,110,185,0.07)' : 'rgba(0,110,185,0)' }
        }
        transition={isOpen ? { duration: 0.2 } : { type: 'spring', mass: 1, stiffness: 6400, damping: 120, scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,110,185,0.12)' }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="flex items-center p-[6px] rounded-[50px]"
          animate={{ backgroundColor: buttonState === 'state4' ? 'transparent' : 'rgba(0,110,185,0.16)' }}
          transition={{ type: 'spring', mass: 1, stiffness: 6400, damping: 120 }}
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
                      transition={{ duration: 0.1, ease: 'easeIn' }}
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
