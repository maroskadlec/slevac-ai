import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Info, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { DealCard } from '../data/mockDeals'

interface DealCarouselProps {
  deals: DealCard[]
  compact?: boolean
}

export default function DealCarousel({ deals, compact = false }: DealCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const cardWidth = compact ? 148 : 164
  const gap = compact ? 6 : 8

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
      {/* Section Header */}
      <div className="flex items-center gap-[4px]">
        <p className={`text-[#8e8e93] font-medium ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
          Nabídky, které by ti mohli sednout
        </p>
        <Info className={`text-[#b0b0b5] flex-shrink-0 ${compact ? 'w-[10px] h-[10px]' : 'w-[12px] h-[12px]'}`} />
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-[8px] overflow-x-auto snap-x snap-mandatory pb-[4px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {deals.map((deal) => (
          <div
            key={deal.id}
            className={`snap-start flex-shrink-0 rounded-[10px] overflow-hidden bg-white border border-[#e8e8ed] cursor-pointer hover:border-[#c8c8cd] transition-colors`}
            style={{ width: `${cardWidth}px` }}
          >
            {/* Image */}
            <div className={`relative ${compact ? 'h-[88px]' : 'h-[100px]'}`}>
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Price Badge */}
              <div className={`absolute bottom-[5px] left-[5px] bg-[#00a84f] text-white font-bold rounded-[4px] ${compact ? 'text-[10px] px-[5px] py-[1px]' : 'text-[11px] px-[6px] py-[2px]'}`}>
                {formatPrice(deal.price)} Kč
              </div>
              {/* Heart Icon */}
              <button className={`absolute top-[5px] right-[5px] bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors ${compact ? 'w-[20px] h-[20px]' : 'w-[24px] h-[24px]'}`}>
                <Heart className={`text-[#ccc] hover:text-red-400 transition-colors ${compact ? 'w-[10px] h-[10px]' : 'w-[12px] h-[12px]'}`} />
              </button>
            </div>

            {/* Card Content */}
            <div className={`flex flex-col ${compact ? 'p-[6px] gap-[2px]' : 'p-[8px] gap-[3px]'}`}>
              <p className={`font-bold text-black leading-tight line-clamp-2 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                {deal.title}
              </p>
              <div className="flex items-center gap-[3px]">
                <Star className={`text-[#FCD34D] fill-[#FCD34D] ${compact ? 'w-[9px] h-[9px]' : 'w-[10px] h-[10px]'}`} />
                <span className={`text-[#666] ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                  {deal.rating.toFixed(1).replace('.', ',')} / 5 ({deal.reviewCount} hodnocení)
                </span>
              </div>
              <p className={`text-[#8e8e93] truncate ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                {deal.provider}
              </p>
              <p className={`text-[#8e8e93] ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                {deal.distance}
              </p>
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

      {/* Feedback Row */}
      <div className="flex items-center justify-between">
        <span className={`text-[#8e8e93] ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
          Vyhovují vám doporučení
        </span>
        <div className="flex gap-[8px]">
          <button className="hover:scale-110 transition-transform">
            <ThumbsUp className={`text-[#b0b0b5] hover:text-[#006eb9] transition-colors ${compact ? 'w-[13px] h-[13px]' : 'w-[15px] h-[15px]'}`} />
          </button>
          <button className="hover:scale-110 transition-transform">
            <ThumbsDown className={`text-[#b0b0b5] hover:text-red-400 transition-colors ${compact ? 'w-[13px] h-[13px]' : 'w-[15px] h-[15px]'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
