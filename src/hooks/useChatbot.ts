import { useState, useCallback, useRef, useEffect } from 'react'

export interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
}

function getTypingText(userMessage: string): string {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (msg.match(/\b(jidlo|restaurac|jist|obed|vecere|snidane|kuchyn|gastr)/)) return 'Hledám restaurace'
  if (msg.match(/\b(hotel|ubytovan|dovolen|cestovan|vylet|pobyt|chata|chalup)/)) return 'Koumám výlety'
  if (msg.match(/\b(wellness|relax|masaz|spa|bazen|saun|virivk)/)) return 'Hledám wellness'
  if (msg.match(/\b(cena|levn|slev|akce|vyhod|peniz|korun)/)) return 'Počítám slevy'
  if (msg.match(/\b(sport|aktivit|kolo|lyzov|turistik|bruslen)/)) return 'Hledám aktivity'
  if (msg.match(/\b(rodina|deti|dite|rodinny)/)) return 'Hledám rodinné nabídky'
  if (msg.match(/\b(romanticke|partner|dvou|valentyn)/)) return 'Hledám romantické nabídky'
  if (msg.match(/\b(vyhled|prirod|hory|more|krajin)/)) return 'Koumám lokality'
  return 'Přemýšlím'
}

function getBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (msg.match(/\b(ahoj|cau|dobr[ye]|hey|hi|hello|zdar|nazdar)\b/)) {
    return 'Ahoj! 👋 Rád tě vidím. Jak ti mohu dnes pomoci s výběrem nabídky na Sleváči?'
  }

  if (msg.match(/\b(jidlo|restaurac|jist|obed|vecere|snidane|kuchyn|gastr)/)) {
    return 'Moc rád. Vidím do celé nabídky Slevomatu a pomůžu ti vybrat nejvhodnější zážitek podle preferencí. Máš chuť na nějakou konkrétní kuchyni, nebo spíš degustační menu?'
  }

  if (msg.match(/\b(hotel|ubytovan|dovolen|cestovan|vylet|pobyt|chata|chalup)/)) {
    return 'Našel jsem pár skvělých pobytů, kde si užiješ relax i zážitky. Ideální víkend ve dvou s polopenzí a jen kousek autem od tebe. Uvažuješ o nějaké konkrétní lokalitě?'
  }

  if (msg.match(/\b(vyhled|prirod|hory|more|krajin|les)/)) {
    return 'Krásné výhledy máme v nabídce! Doporučuji horské hotely v Beskydech, Krkonoších nebo wellness u Lipna s výhledem na přehradu. Který se ti líbí nejvíc?'
  }

  if (msg.match(/\b(cena|levn|slev|akce|vyhod|peniz|korun|kc|czk)/)) {
    return 'Rozumím, hledáš nejlepší poměr cena/výkon! Momentálně máme akce až -60% na vybrané pobyty. Mám ti doporučit top nabídky pod 2000 Kč?'
  }

  if (msg.match(/\b(wellness|relax|masaz|spa|bazen|saun|virivk)/)) {
    return 'Našel jsem pár wellness pobytů, kde si užiješ vířivku s výhledem přímo do přírody nebo na klidnou hladinu jezera. Ideální víkend ve dvou s polopenzí, saunou a jen kousek autem od tebe. Který se ti líbí nejvíc?'
  }

  if (msg.match(/\b(dekuj|diky|dik|dikes|super|parad|skvel)/)) {
    return 'Rádo se stalo! 😊 Pokud budeš potřebovat cokoliv dalšího, jsem tu pro tebe.'
  }

  if (msg.match(/\b(co umis|pomoc|help|co delas|jak funguj|co jsi)/)) {
    return 'Jsem tvůj AI asistent pro Sleváč! 🤖 Mohu ti pomoci s:\n• Výběrem restaurací a jídla\n• Hledáním dovolených a pobytů\n• Wellness a relax nabídkami\n• Najít nejlepší slevy a akce\n\nProstě se zeptej!'
  }

  if (msg.match(/\b(rodina|deti|dite|rodinny)/)) {
    return 'Pro rodiny s dětmi mám skvělé tipy! Aquaparky, dětské zážitkové parky a rodinné pobyty s all-inclusive. Kolik je dětem?'
  }

  if (msg.match(/\b(romanticke|partner|dvou|valentyn|vyrocí)/)) {
    return 'Romantický pobyt? Mám pro tebe privátní wellness, večeře při svíčkách a víkendové pobyty pro dva. Chceš něco blízko, nebo spíš dál od města?'
  }

  if (msg.match(/\b(sport|aktivit|kolo|turistik|lyzov|bruslen)/)) {
    return 'Sportovní nabídky jsou super! Máme lyžařské pobyty, cyklistické výlety i golfové balíčky. Jaký sport tě zajímá?'
  }

  if (msg.match(/\b(krkonos|spindl|harrachov|pec|snezk)/)) {
    return 'Krkonoše jsou skvělá volba! Našel jsem pár wellness pobytů, kde si užiješ vířivku s výhledem přímo do přírody nebo na klidnou hladinu jezera. Ideální víkend ve dvou s polopenzí, saunou a jen kousek autem od tebe.'
  }

  if (msg.match(/\b(ano|jo|jasne|urcite|rad|bych|chci|chtel)/)) {
    return 'Připojíme k tomu nějakou aktivitu v okolí?'
  }

  if (msg.length < 5) {
    return 'Můžeš mi říct trochu víc? Rád ti pomohu najít perfektní nabídku na Sleváči!'
  }

  return 'Zajímavé! Rád ti s tím pomohu. Zkus se mě zeptat konkrétněji – třeba na jídlo, cestování, wellness nebo aktuální slevy na Sleváči.'
}

export function useChatbot(isOpen: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(1)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const sendMessage = useCallback(() => {
    const text = inputValue.trim()
    if (!text || isTyping) return

    const userMsgId = nextIdRef.current++
    setMessages(prev => [...prev, { id: userMsgId, text, sender: 'user' }])
    setInputValue('')
    setIsTyping(true)
    setTypingText(getTypingText(text))

    // Simulate bot typing delay
    const delay = 800 + Math.random() * 1000
    setTimeout(() => {
      const botResponse = getBotResponse(text)
      const botMsgId = nextIdRef.current++
      setMessages(prev => [...prev, { id: botMsgId, text: botResponse, sender: 'bot' }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [inputValue, isTyping])

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
    typingText,
    messagesEndRef,
    sendMessage,
    handleKeyDown,
  }
}
