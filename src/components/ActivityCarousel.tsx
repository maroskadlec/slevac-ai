import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import type { ActivityCard } from '../data/mockActivities'

const dislikeImg = `${import.meta.env.BASE_URL}assets/dislike.png`

interface ActivityCarouselProps {
  activities: ActivityCard[]
  compact?: boolean
}

export default function ActivityCarousel({ activities, compact = false }: ActivityCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const cardWidth = compact ? 170 : 190
  const gap = compact ? 8 : 10
  // 2 real cards + 1 empty card
  const totalCards = activities.length + 1

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const idx = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(idx, totalCards - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [cardWidth, gap, totalCards])

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
        {/* Real activity cards */}
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="snap-start flex-shrink-0 rounded-[10px] overflow-hidden bg-white cursor-pointer"
            style={{ width: `${cardWidth}px` }}
          >
            {/* Image */}
            <div className={`relative ${compact ? 'h-[100px]' : 'h-[114px]'}`}>
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover rounded-[10px]"
                loading="lazy"
              />
              {/* Price Badge */}
              <div className="absolute bottom-[5px] left-[5px] flex items-center gap-[3px]">
                <div className={`bg-[#00a84f] text-white font-bold rounded-[4px] ${compact ? 'text-[12px] px-[5px] py-[1px]' : 'text-[13px] px-[6px] py-[2px]'}`}>
                  {formatPrice(activity.price)} Kč
                </div>
                {activity.originalPrice && (
                  <span className={`text-white font-medium line-through opacity-90 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                    {formatPrice(activity.originalPrice)} Kč
                  </span>
                )}
                {activity.discount && (
                  <span className={`bg-[#f0c850] text-[#333] font-bold rounded-[3px] ${compact ? 'text-[10px] px-[3px] py-[0.5px]' : 'text-[11px] px-[4px] py-[1px]'}`}>
                    –{activity.discount} %
                  </span>
                )}
              </div>
              {/* Heart Icon */}
              <button className={`absolute top-[5px] right-[5px] bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${compact ? 'w-[22px] h-[22px]' : 'w-[26px] h-[26px]'}`}>
                <Heart className={`text-[#ef4444] transition-colors ${compact ? 'w-[12px] h-[12px]' : 'w-[14px] h-[14px]'}`} />
              </button>
            </div>

            {/* Card Content */}
            <div className={`flex flex-col ${compact ? 'p-[7px] gap-[2px]' : 'p-[9px] gap-[3px]'}`}>
              <p className={`font-bold text-black leading-tight line-clamp-2 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
                {activity.title}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-[3px]">
                <Star className={`text-[#FCD34D] fill-[#FCD34D] ${compact ? 'w-[11px] h-[11px]' : 'w-[12px] h-[12px]'}`} />
                <span className={`text-[#666] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                  {activity.rating.toFixed(1).replace('.', ',')} / 5
                </span>
                <span className={`text-[#999] ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                  ({activity.reviewCount} hodnocení)
                </span>
              </div>
              {/* Provider + Location */}
              <div className={`flex flex-col text-[#8e8e93] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                <span className="truncate">{activity.provider}</span>
                <span className="truncate">{activity.location}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty "no more" card */}
        <div
          className="snap-start flex-shrink-0 rounded-[10px] overflow-hidden bg-[#f5f5f7] cursor-default flex flex-col items-center justify-center"
          style={{ width: `${cardWidth}px`, minHeight: compact ? '180px' : '200px' }}
        >
          <img
            src={dislikeImg}
            alt=""
            className="w-[40px] h-[40px] mb-[8px] opacity-60"
          />
          <p className={`text-[#8e8e93] text-center px-[12px] leading-[16px] ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
            Bohužel jsem více nabídek v okolí nenašel.
          </p>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-[4px]">
        {Array.from({ length: totalCards }).map((_, idx) => (
          <div
            key={idx}
            className={`rounded-full transition-colors ${
              idx === activeIndex ? 'bg-[#006eb9]' : 'bg-[#d4d4d8]'
            } ${compact ? 'w-[4px] h-[4px]' : 'w-[5px] h-[5px]'}`}
          />
        ))}
      </div>
    </motion.div>
  )
}
