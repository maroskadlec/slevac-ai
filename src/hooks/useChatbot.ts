import { useState, useCallback, useRef, useEffect } from 'react'

export interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
}

const GREETING = 'Ahoj! 👋 Jsem Lupičko, váš osobní asistent na Sleváči. Zeptejte se mě na cokoliv ohledně nabídek, jídla, cestování nebo wellness!'

function getBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (msg.match(/\b(ahoj|cau|dobr[yý]|hey|hi|hello|zdar|nazdar)\b/)) {
    return 'Ahoj! 👋 Rád vás vidím. Jak vám mohu dnes pomoci s výběrem nabídky na Sleváči?'
  }

  if (msg.match(/\b(jidlo|restaurac|jist|obed|vecere|snidane|kuchyn|gastr)/)) {
    return '🍽 Mám pro vás skvělé nabídky restaurací! Momentálně frčí degustační menu a zážitkové večeře. Záleží vám víc na kvalitě kuchyně, nebo hledáte dobrou cenu?'
  }

  if (msg.match(/\b(hotel|ubytovan|dovolen|cestovan|vylet|pobyt|chata|chalup)/)) {
    return '🏨 Cestování je moje specialita! Máme nabídky od horských chat po luxusní resorty. Momentálně jsou super akce na Šumavu a Beskydy. Kam byste chtěli jet?'
  }

  if (msg.match(/\b(vyhled|prirod|hory|more|krajin|les)/)) {
    return '🏞 Krásné výhledy máme v nabídce! Doporučuji horské hotely v Beskydech, Krkonoších nebo wellness u Lipna s výhledem na přehradu.'
  }

  if (msg.match(/\b(cena|levn|slev|akce|vyhod|peniz|korun|kc|czk)/)) {
    return '💰 Rozumím, hledáte nejlepší poměr cena/výkon! Momentálně máme akce až -60% na vybrané pobyty. Mám vám doporučit top nabídky pod 2000 Kč?'
  }

  if (msg.match(/\b(wellness|relax|masaz|spa|bazen|saun|virivk)/)) {
    return '🧖 Wellness pobyty jsou hit sezóny! Mám přes 200 wellness nabídek. Preferujete jednodenní relax, nebo víkendový pobyt s polopenzí?'
  }

  if (msg.match(/\b(dekuj|diky|dik|dikes|super|parad|skvel)/)) {
    return 'Rádo se stalo! 😊 Pokud budete potřebovat cokoliv dalšího, jsem tu pro vás. Stačí napsat!'
  }

  if (msg.match(/\b(co umis|pomoc|help|co delas|jak funguj|co jsi)/)) {
    return 'Jsem váš AI asistent pro Sleváč! 🤖 Mohu vám pomoci s:\n• Výběrem restaurací a jídla\n• Hledáním dovolených a pobytů\n• Wellness a relax nabídkami\n• Najít nejlepší slevy a akce\n\nProstě se zeptejte!'
  }

  if (msg.match(/\b(rodina|deti|dite|rodinny)/)) {
    return '👨‍👩‍👧‍👦 Pro rodiny s dětmi mám skvělé tipy! Aquaparky, dětské zážitkové parky a rodinné pobyty s all-inclusive. Kolik je dětem?'
  }

  if (msg.match(/\b(romanticke|partner|dvou|valentyn|vyrocí)/)) {
    return '💕 Romantický pobyt? Mám pro vás privátní wellness, večeře při svíčkách a víkendové pobyty pro dva. Chcete něco blízko, nebo spíš dál od města?'
  }

  if (msg.match(/\b(sport|aktivit|kolo|turistik|lyzov|bruslen)/)) {
    return '⛷ Sportovní nabídky jsou super! Máme lyžařské pobyty, cyklistické výlety i golfové balíčky. Jaký sport vás zajímá?'
  }

  if (msg.length < 5) {
    return '🤔 Můžete mi říct trochu víc? Rád vám pomohu najít perfektní nabídku na Sleváči!'
  }

  return 'Zajímavé! 🤔 Rád vám s tím pomohu. Zkuste se mě zeptat konkrétněji – třeba na jídlo, cestování, wellness nebo aktuální slevy na Sleváči.'
}

export function useChatbot(isOpen: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(1)
  const hasGreetedRef = useRef(false)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  // Send greeting when modal opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreetedRef.current) {
      hasGreetedRef.current = true
      const id = nextIdRef.current++
      setTimeout(() => {
        setMessages([{ id, text: GREETING, sender: 'bot' }])
      }, 400)
    }
  }, [isOpen])

  const sendMessage = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return

    const userMsgId = nextIdRef.current++
    setMessages(prev => [...prev, { id: userMsgId, text, sender: 'user' }])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot typing delay
    const delay = 600 + Math.random() * 800
    setTimeout(() => {
      const botResponse = getBotResponse(text)
      const botMsgId = nextIdRef.current++
      setMessages(prev => [...prev, { id: botMsgId, text: botResponse, sender: 'bot' }])
      setIsTyping(false)
    }, delay)
  }, [inputValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    messagesEndRef,
    sendMessage,
    handleKeyDown,
  }
}
