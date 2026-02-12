import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { DealCard } from '../data/mockDeals'

// 20 badge labels for "Líbilo se: XX"
const BADGE_LABELS = [
  'Snídaně',
  'Luxusní interiér',
  'Výhled',
  'Skvělý personál',
  'Klidné místo',
  'Čistota',
  'Wellness',
  'Poloha',
  'Pohodlné postele',
  'Krásné okolí',
  'Milý přístup',
  'Atmosféra',
  'Bazén',
  'Restaurace',
  'Prostorné pokoje',
  'Sauna',
  'Jídlo',
  'Domácí prostředí',
  'Příjemná obsluha',
  'Parkoviště',
]

/** Pick a consistent badge for a deal based on its id */
function getBadgeLabel(dealId: string): string {
  let hash = 0
  for (let i = 0; i < dealId.length; i++) {
    hash = ((hash << 5) - hash) + dealId.charCodeAt(i)
    hash |= 0
  }
  return BADGE_LABELS[Math.abs(hash) % BADGE_LABELS.length]
}

interface DealCarouselProps {
  deals: DealCard[]
  compact?: boolean
  onFeedback?: (type: 'up' | 'down') => void
}

export default function DealCarousel({ deals, compact = false, onFeedback }: DealCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [feedback, setFeedback] = useState<'none' | 'up' | 'down'>('none')

  const cardWidth = compact ? 170 : 190
  const gap = compact ? 8 : 10

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const idx = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(idx, deals.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [cardWidth, gap, deals.length])

  const formatPrice = (price: number) => {
    return price.toLocaleString('cs-CZ')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-[6px] w-full"
    >
      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-[10px] overflow-x-auto snap-x snap-mandatory pb-[4px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="snap-start flex-shrink-0 rounded-[10px] overflow-hidden bg-white cursor-pointer"
            style={{ width: `${cardWidth}px` }}
          >
            {/* Image */}
            <div className={`relative ${compact ? 'h-[100px]' : 'h-[114px]'}`}>
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover rounded-[10px]"
                loading="lazy"
              />
              {/* Price Badge Area */}
              <div className="absolute bottom-[5px] left-[5px] flex items-center gap-[3px]">
                <div className={`bg-[#00a84f] text-white font-bold rounded-[4px] ${compact ? 'text-[12px] px-[5px] py-[1px]' : 'text-[13px] px-[6px] py-[2px]'}`}>
                  {formatPrice(deal.price)} Kč
                </div>
                {deal.originalPrice && (
                  <span className={`text-white font-medium line-through opacity-90 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                    {formatPrice(deal.originalPrice)} Kč
                  </span>
                )}
                {deal.discount && (
                  <span className={`bg-[#f0c850] text-[#333] font-bold rounded-[3px] ${compact ? 'text-[10px] px-[3px] py-[0.5px]' : 'text-[11px] px-[4px] py-[1px]'}`}>
                    –{deal.discount} %
                  </span>
                )}
              </div>
              {/* Heart Icon – white bg, red */}
              <button className={`absolute top-[5px] right-[5px] bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${compact ? 'w-[22px] h-[22px]' : 'w-[26px] h-[26px]'}`}>
                <Heart className={`text-[#ef4444] transition-colors ${compact ? 'w-[12px] h-[12px]' : 'w-[14px] h-[14px]'}`} />
              </button>
            </div>

            {/* Card Content */}
            <div className={`flex flex-col ${compact ? 'p-[7px] gap-[2px]' : 'p-[9px] gap-[3px]'}`}>
              <p className={`font-bold text-black leading-tight line-clamp-2 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
                {deal.title}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-[3px]">
                <Star className={`text-[#FCD34D] fill-[#FCD34D] ${compact ? 'w-[11px] h-[11px]' : 'w-[12px] h-[12px]'}`} />
                <span className={`text-[#666] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                  {deal.rating.toFixed(1).replace('.', ',')} / 5
                </span>
                <span className={`text-[#999] ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                  ({deal.reviewCount} hodnocení)
                </span>
              </div>
              {/* Provider + Location */}
              <div className={`flex items-center gap-[4px] text-[#8e8e93] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                <span className="truncate">{deal.provider}</span>
                <span className="flex-shrink-0 opacity-50">·</span>
                <span className="truncate">{deal.location}</span>
              </div>
              {/* Distance */}
              <div className={`flex items-center gap-[3px] text-[#8e8e93] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                <span>{deal.distance}</span>
              </div>
              {/* Badge: "Líbilo se: XX" */}
              <div className="mt-[2px]">
                <span className={`inline-block bg-[#E5F0F7] text-[#006eb9] rounded-[4px] font-medium ${compact ? 'text-[10px] px-[4px] py-[1px]' : 'text-[11px] px-[5px] py-[1.5px]'}`}>
                  Líbilo se: {getBadgeLabel(deal.id)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-[4px]">
        {deals.map((_, idx) => (
          <div
            key={idx}
            className={`rounded-full transition-colors ${
              idx === activeIndex ? 'bg-[#006eb9]' : 'bg-[#d4d4d8]'
            } ${compact ? 'w-[4px] h-[4px]' : 'w-[5px] h-[5px]'}`}
          />
        ))}
      </div>

      {/* "Více nabídek" link */}
      <div className="flex justify-center">
        <a href="#" className="text-[#006eb9] text-[14px] hover:underline" onClick={(e) => e.preventDefault()}>
          Více nabídek
        </a>
      </div>

      {/* Feedback Row */}
      {feedback === 'none' && (
        <div className="flex items-center justify-between border border-[#e8e8ed] rounded-[10px] px-[10px] py-[8px]">
          <span className="text-[#1a1a1a] text-[14px] leading-[22px]">
            Vyhovují ti doporučení? Koukal jsem, co o nich říkají ostatní.
          </span>
          <div className="flex gap-[8px] flex-shrink-0 ml-[8px]">
            <button
              onClick={() => { setFeedback('up'); onFeedback?.('up') }}
              className="hover:scale-110 transition-transform cursor-pointer"
            >
              <ThumbsUp className={`text-[#22c55e] hover:text-[#16a34a] transition-colors ${compact ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]'}`} />
            </button>
            <button
              onClick={() => { setFeedback('down'); onFeedback?.('down') }}
              className="hover:scale-110 transition-transform cursor-pointer"
            >
              <ThumbsDown className={`text-[#ef4444] hover:text-[#dc2626] transition-colors ${compact ? 'w-[14px] h-[14px]' : 'w-[16px] h-[16px]'}`} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
