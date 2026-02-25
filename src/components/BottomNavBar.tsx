import { ArrowUpFromLine, MessageCircle, MapPin, Heart } from 'lucide-react'

export default function BottomNavBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#E5F0F7] border-t border-[#d0dfe9] px-[12px] py-[10px] flex items-center gap-[24px]">
      <button className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer">
        <ArrowUpFromLine className="w-[22px] h-[22px] text-[#006eb9]" />
      </button>
      <button className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer">
        <MessageCircle className="w-[22px] h-[22px] text-[#006eb9] fill-[#006eb9]" />
      </button>
      <button className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer">
        <MapPin className="w-[22px] h-[22px] text-[#006eb9]" />
      </button>
      <button className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer">
        <Heart className="w-[22px] h-[22px] text-[#e74c3c]" />
      </button>
    </div>
  )
}
