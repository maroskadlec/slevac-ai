import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Send, ChevronRight, ChevronLeft, Shield, RefreshCw, Star, Heart } from 'lucide-react'
import BottomNavBar from './BottomNavBar'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useChatbot } from '../hooks/useChatbot'
import { useChatContext } from '../contexts/ChatContext'
import DealCarousel from './DealCarousel'
import ActivityCarousel from './ActivityCarousel'
import { allDeals } from '../data/mockDeals'
import type { DealCard } from '../data/mockDeals'

const mrkatkoImg = `${import.meta.env.BASE_URL}assets/fc1601850dd2f7e663f5b1530e6a54e3bfc3e857.png`
const mrkatkoImgBlink = `${import.meta.env.BASE_URL}assets/76cb4db62fdf61674840e9abfdf6700b478b2a68.png`

interface DealDetailProps {
  isOpen: boolean
  onToggle: () => void
}

interface Variant {
  title: string
  subtitle: string
  price: number
  originalPrice?: number
  persons: string
}

function getVariants(deal: DealCard): Variant[] {
  return [
    {
      title: `Pobyt se snídaní a wellness`,
      subtitle: `${deal.provider} • ${deal.location}`,
      price: deal.price,
      originalPrice: deal.originalPrice,
      persons: '2 osoby, 2 dny (1 noc)',
    },
    {
      title: `Pobyt s polopenzí a wellness`,
      subtitle: `${deal.provider} • ${deal.location}`,
      price: Math.round(deal.price * 1.25),
      persons: '2 osoby, 2 dny (1 noc)',
    },
  ]
}

export default function FigmaMobileDealDetail({ isOpen, onToggle }: DealDetailProps) {
  const navigate = useNavigate()
  const { setIsModalOpen } = useChatContext()
  const [searchParams] = useSearchParams()
  const dealId = searchParams.get('id') || 'd1'

  const deal = allDeals.find(d => d.id === dealId) || allDeals[0]
  const variants = getVariants(deal)

  const [buttonState, setButtonState] = useState<'default' | 'state3' | 'state4' | 'state5'>('default')
  const [isBlinking, setIsBlinking] = useState(false)
  const chat = useChatbot(isOpen)

  const formatPrice = (n: number) => n.toLocaleString('cs-CZ')

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
      return () => { clearTimeout(initialTimeout); clearInterval(interval) }
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

  return (
    <div className="relative w-full max-w-[400px] h-[100dvh] bg-white overflow-hidden mx-auto">

      {/* ===== PAGE CONTENT ===== */}
      <div className="h-full overflow-y-auto z-0 bg-white">

        {/* Top Header */}
        <Link to="/mobile">
          <img src={`${import.meta.env.BASE_URL}assets/top-header.jpg`} alt="Top Header" className="w-full h-auto block" />
        </Link>

        {/* Header image */}
        <img src={`${import.meta.env.BASE_URL}assets/header-inspire.jpg`} alt="Header" className="w-full h-auto block" />

        {/* Hero Image */}
        <div className="relative">
          <img src={deal.image} alt={deal.title} className="w-full h-[220px] object-cover" />
          {/* Back button */}
          <button
            onClick={() => {
              navigate(-1)
              setTimeout(() => setIsModalOpen(true), 100)
            }}
            className="absolute top-[12px] left-[8px] w-[36px] h-[36px] bg-white/90 rounded-full flex items-center justify-center shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-[20px] h-[20px] text-[#333]" />
          </button>
          {/* Heart */}
          <button className="absolute top-[12px] right-[8px] w-[36px] h-[36px] bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-[18px] h-[18px] text-[#999]" />
          </button>
          {/* Photo counter */}
          <div className="absolute bottom-[8px] right-[8px] bg-black/50 text-white text-[12px] px-[8px] py-[2px] rounded-[4px]">
            1 / 12
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-[4px] px-[8px] py-[10px] text-[13px] leading-[20px]">
          <span className="text-[#006eb9] cursor-pointer">Cestování</span>
          <ChevronRight className="w-[10px] h-[10px] text-[#999]" />
          <span className="text-[#006eb9] cursor-pointer">Dovolená</span>
          <ChevronRight className="w-[10px] h-[10px] text-[#999]" />
          <span className="text-[#006eb9] cursor-pointer">S wellness</span>
        </div>

        {/* Title */}
        <div className="px-[8px] pb-[8px]">
          <h1 className="text-[20px] leading-[26px] font-bold text-black">{deal.title}</h1>
        </div>

        {/* Rating & Reviews */}
        <div className="px-[8px] pb-[6px] flex items-center gap-[6px]">
          <div className="flex items-center gap-[2px]">
            <Star className="w-[14px] h-[14px] text-[#FCD34D] fill-[#FCD34D]" />
            <span className="text-[14px] font-bold text-black">{deal.rating.toFixed(1).replace('.', ',')}</span>
            <span className="text-[14px] text-[#333]">/ 5</span>
          </div>
          <span className="text-[14px] text-[#999]">({formatPrice(deal.reviewCount)} hodnocení)</span>
          {deal.ratingLabel && (
            <span className="text-[13px] font-bold text-[#00a84f]">{deal.ratingLabel}</span>
          )}
        </div>

        {/* Provider & Location */}
        <div className="px-[8px] pb-[4px] flex items-center gap-[6px] text-[14px] text-[#333]">
          <span>{deal.provider}</span>
          <span className="text-[#999]">·</span>
          <span className="text-[#006eb9]">{deal.location}</span>
        </div>
        <div className="px-[8px] pb-[8px] text-[14px] text-[#999]">
          🚗 {deal.distance}
        </div>

        {/* Tags */}
        <div className="px-[8px] pb-[12px] flex gap-[6px] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <span className="flex items-center gap-[4px] text-[13px] text-[#006eb9] border border-[#e5e7eb] rounded-full px-[12px] py-[4px] whitespace-nowrap">
            <Shield className="w-[14px] h-[14px]" /> Pojištění storna
          </span>
          <span className="flex items-center gap-[4px] text-[13px] text-[#006eb9] border border-[#e5e7eb] rounded-full px-[12px] py-[4px] whitespace-nowrap">
            <RefreshCw className="w-[14px] h-[14px]" /> Změna rezervace online
          </span>
        </div>

        {/* Separator */}
        <div className="h-[8px] bg-[#f5f5f7]" />

        {/* Variants Section */}
        <div className="px-[8px] pt-[16px] pb-[8px]">
          <h2 className="text-[18px] leading-[24px] font-bold text-black mb-[12px]">Varianty podle vaší volby</h2>

          {/* Variant cards */}
          <div className="flex flex-col gap-[8px]">
            {variants.map((v, i) => (
              <div key={i} className="border border-[#e5e7eb] rounded-[12px] p-[12px]">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] leading-[20px] font-bold text-black mb-[2px]">{v.title}</p>
                    <p className="text-[13px] text-[#999] mb-[4px]">{v.subtitle}</p>
                    <p className="text-[13px] text-[#666]">{v.persons}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 ml-[12px]">
                    <span className="text-[18px] font-bold text-[#00a84f]">{formatPrice(v.price)} Kč</span>
                    {v.originalPrice && (
                      <span className="text-[13px] text-[#999] line-through">{formatPrice(v.originalPrice)} Kč</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Comparison Card */}
        <div className="px-[8px] pb-[12px]">
          <div className="bg-white rounded-[16px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.18)] p-[16px] flex items-start gap-[12px]">
            <div className="flex-1">
              <p className="text-[16px] leading-[22px] font-bold text-black mb-[12px]">
                Chcete se na něco k nabídce optat?
              </p>
              <button
                onClick={onToggle}
                className="bg-[#006eb9] text-white font-bold text-[14px] px-[20px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#005a9a] transition-colors"
              >
                Pustit se do toho
              </button>
            </div>
            <div className="w-[76px] h-[76px] flex-shrink-0 -mr-[20px]">
              <motion.img
                src={isBlinking ? mrkatkoImgBlink : mrkatkoImg}
                alt="Mrkatko"
                className="w-full h-full object-contain"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: 'easeIn' }}
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[8px] bg-[#f5f5f7]" />

        {/* Description Section */}
        <div className="px-[8px] pt-[16px] pb-[12px]">
          <h2 className="text-[18px] leading-[24px] font-bold text-black mb-[8px]">Ubytujte se ve wellness</h2>
          <p className="text-[14px] leading-[22px] text-[#333] mb-[12px]">
            Využijte neomezený vstup do bazénu a saunového světa. K dispozici máte vnitřní bazén, 
            whirlpool, finskou saunu, parní saunu a odpočívárnu s lehátky. Relaxujte od rána do večera 
            a dopřejte si zasloužený odpočinek v příjemném prostředí.
          </p>
          <p className="text-[14px] leading-[22px] text-[#333] mb-[12px]">
            Snídaně se podávají formou bufetu v hotelové restauraci. Při zvolení varianty s polopenzí 
            si navíc vychutnáte tříchodovou večeři. Jídelníček se obměňuje a kuchaři dbají na kvalitní 
            a čerstvé suroviny.
          </p>
        </div>

        {/* Separator */}
        <div className="h-[8px] bg-[#f5f5f7]" />

        {/* What's included */}
        <div className="px-[8px] pt-[16px] pb-[12px]">
          <h2 className="text-[18px] leading-[24px] font-bold text-black mb-[8px]">Co je v ceně</h2>
          <ul className="text-[14px] leading-[24px] text-[#333] list-disc pl-[20px]">
            <li>Ubytování pro 2 osoby v dvoulůžkovém pokoji</li>
            <li>Snídaně formou bufetu</li>
            <li>Neomezený vstup do bazénu</li>
            <li>Neomezený vstup do saunového světa</li>
            <li>Parkování zdarma</li>
            <li>WiFi na pokoji i ve společných prostorách</li>
          </ul>
        </div>

        {/* Separator */}
        <div className="h-[8px] bg-[#f5f5f7]" />

        {/* Conditions */}
        <div className="px-[8px] pt-[16px] pb-[12px]">
          <h2 className="text-[18px] leading-[24px] font-bold text-black mb-[8px]">Urcité pokoje a strava</h2>
          <p className="text-[14px] leading-[22px] text-[#333] mb-[8px]">
            Ke každému pobytu je automaticky přidáno pojištění storna. Voucher můžete do 6 měsíců 
            vyměnit za jiný nebo vrátit. Rezervace je možná online, telefonicky nebo e-mailem.
          </p>
          <p className="text-[14px] leading-[22px] text-[#333]">
            Check-in je od 14:00, check-out do 10:00. Při předčasném odjezdu se nevyužité noci nevrací.
          </p>
        </div>

        {/* Separator */}
        <div className="h-[8px] bg-[#f5f5f7]" />

        {/* Reviews preview */}
        <div className="px-[8px] pt-[16px] pb-[16px]">
          <h2 className="text-[18px] leading-[24px] font-bold text-black mb-[8px]">
            Co říkají ostatní ({formatPrice(deal.reviewCount)} hodnocení)
          </h2>
          <div className="flex flex-col gap-[8px]">
            <div className="bg-[#f9f9fb] rounded-[10px] p-[12px]">
              <div className="flex items-center gap-[4px] mb-[4px]">
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <span className="text-[12px] text-[#999] ml-[4px]">před 2 týdny</span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#333]">
                Krásný hotel, čisté pokoje, skvělá snídaně. Wellness je opravdu příjemné. Doporučujeme!
              </p>
            </div>
            <div className="bg-[#f9f9fb] rounded-[10px] p-[12px]">
              <div className="flex items-center gap-[4px] mb-[4px]">
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#FCD34D] fill-[#FCD34D]" />
                <Star className="w-[12px] h-[12px] text-[#d4d4d8]" />
                <span className="text-[12px] text-[#999] ml-[4px]">před měsícem</span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#333]">
                Pobyt se nám líbil. Poloha hotelu je ideální pro výlety do okolí. Jídlo velmi dobré.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-[8px] pb-[20px]">
          <div className="bg-[#f5f5f7] rounded-[12px] p-[16px] flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#666]">Cena od</p>
              <p className="text-[22px] font-bold text-[#00a84f]">{formatPrice(deal.price)} Kč</p>
              {deal.originalPrice && (
                <p className="text-[14px] text-[#999] line-through">{formatPrice(deal.originalPrice)} Kč</p>
              )}
            </div>
            <button className="bg-[#00a84f] text-white font-bold text-[16px] px-[24px] py-[14px] rounded-[8px] cursor-pointer hover:bg-[#009240] transition-colors">
              Koupit
            </button>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-[80px]" />
      </div>

      {/* ===== CHATBOT OVERLAY ===== */}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-2xl z-40 flex flex-col h-[85dvh]"
          >
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
