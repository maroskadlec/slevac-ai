import { useState, useCallback, useRef, useEffect } from 'react'
import type { DealCard } from '../data/mockDeals'
import { pickRandomDeals } from '../data/mockDeals'

export interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
  deals?: DealCard[]
}

const TYPING_TEXTS = [
  'Musím to promyslet',
  'Koumám, co ti nabídnout',
  'Vybírám z nabídek',
  'Hledám to nejlepší',
  'Chvilku, mrknu na to',
  'Přemýšlím nad možnostmi',
  'Dávám to dohromady',
  'Procházím nabídky pro tebe',
  'Šťourám se v nabídkách',
  'Moment, ladím detaily',
  'Hned to bude',
]

// Tracks which texts have been used in this session to avoid repetition
const usedTypingTexts: Set<number> = new Set()

function getTypingText(): string {
  // If all texts have been used, reset
  if (usedTypingTexts.size >= TYPING_TEXTS.length) {
    usedTypingTexts.clear()
  }
  // Pick a random unused text
  const available = TYPING_TEXTS.map((_, i) => i).filter(i => !usedTypingTexts.has(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  usedTypingTexts.add(idx)
  return TYPING_TEXTS[idx]
}

interface BotResponse {
  text: string
  deals?: DealCard[]
}

function getBotResponse(userMessage: string, conversationHistory: ChatMessage[]): BotResponse {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Check conversation context - what was the previous topic
  const prevBotMessages = conversationHistory.filter(m => m.sender === 'bot')
  const lastBotMsg = prevBotMessages.length > 0
    ? prevBotMessages[prevBotMessages.length - 1].text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : ''
  const prevUserMessages = conversationHistory.filter(m => m.sender === 'user')
  const allUserText = prevUserMessages.map(m => m.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')).join(' ')

  // --- Greetings (no deals) ---
  if (msg.match(/\b(ahoj|cau|dobr[ye]|hey|hi|hello|zdar|nazdar)\b/)) {
    return { text: 'Ahoj! 👋 Rád tě vidím. Jak ti mohu dnes pomoci s výběrem nabídky na Sleváči?' }
  }

  // --- Help (no deals) ---
  if (msg.match(/\b(co umis|pomoc|help|co delas|jak funguj|co jsi)/)) {
    return { text: 'Jsem tvůj AI asistent pro Sleváč! 🤖 Mohu ti pomoci s:\n• Výběrem restaurací a jídla\n• Hledáním dovolených a pobytů\n• Wellness a relax nabídkami\n• Najít nejlepší slevy a akce\n\nProstě se zeptej!' }
  }

  // --- Thanks (no deals) ---
  if (msg.match(/\b(dekuj|diky|dik|dikes|super|parad|skvel)/)) {
    return { text: 'Rádo se stalo! 😊 Pokud budeš potřebovat cokoliv dalšího, jsem tu pro tebe.' }
  }

  // --- Specific location: Krkonoše → show deals ---
  if (msg.match(/\b(krkonos|spindl|harrachov|pec|snezk)/)) {
    return {
      text: 'Našel jsem pár wellness pobytů, kde si užiješ vířivku s výhledem přímo do přírody nebo na klidnou hladinu jezera. Ideální víkend ve dvou s polopenzí, saunou a jen kousek autem od tebe. Který se ti líbí nejvíc?',
      deals: pickRandomDeals(5),
    }
  }

  // --- Specific location: Beskydy, Šumava, other mountains → show deals ---
  if (msg.match(/\b(beskydy|sumav|lipno|jeseniky|cesky raj|vysocin)/)) {
    return {
      text: 'Skvělá volba! Našel jsem pro tebe nabídky v této oblasti. Podívej se, co jsem vybral:',
      deals: pickRandomDeals(5),
    }
  }

  // --- Wellness with enough context → show deals ---
  if (msg.match(/\b(wellness|relax|masaz|spa|bazen|saun|virivk)/)) {
    if (allUserText.match(/\b(krkonos|beskydy|sumav|praha|brno|lipno|jeseniky)/) || prevUserMessages.length >= 2) {
      return {
        text: 'Našel jsem pár wellness pobytů, kde si užiješ vířivku s výhledem přímo do přírody nebo na klidnou hladinu jezera. Ideální víkend ve dvou s polopenzí, saunou a jen kousek autem od tebe.',
        deals: pickRandomDeals(5),
      }
    }
    return { text: 'Moc rád. Vidím do celé nabídky Slevomatu a pomůžu ti vybrat nejvhodnější zážitek podle preferencí. Uvažuješ o nějaké konkrétní lokalitě?' }
  }

  // --- Restaurant with enough context → show deals ---
  if (msg.match(/\b(jidlo|restaurac|jist|obed|vecere|snidane|kuchyn|gastr|menu|degustac)/)) {
    if (prevUserMessages.length >= 1 || msg.length > 20) {
      return {
        text: 'Tady jsou moje top doporučení. Všechny mají skvělé hodnocení a nabízí nezapomenutelný zážitek:',
        deals: pickRandomDeals(5),
      }
    }
    return { text: 'Skvělá volba! Máme úžasné nabídky restaurací. Hledáš spíš degustační menu, zážitkovou večeři, nebo něco jiného?' }
  }

  // --- Travel/Hotel → context determines ---
  if (msg.match(/\b(hotel|ubytovan|dovolen|cestovan|vylet|pobyt|chata|chalup)/)) {
    if (allUserText.match(/\b(krkonos|beskydy|sumav|lipno|jeseniky|cesky raj)/) || prevUserMessages.length >= 2) {
      return {
        text: 'Tady jsou nabídky pobytů, které jsem pro tebe vybral. Všechny mají výborné hodnocení:',
        deals: pickRandomDeals(5),
      }
    }
    return { text: 'Cestování je moje specialita! Máme nabídky od horských chat po luxusní resorty. Kam by ses chtěl/a podívat?' }
  }

  // --- Price focused → show deals ---
  if (msg.match(/\b(cena|levn|slev|akce|vyhod|peniz|korun|kc|czk|lacin)/)) {
    if (prevUserMessages.length >= 1) {
      return {
        text: 'Tady jsou nejlepší nabídky s výborným poměrem cena/výkon. Všechny pod super cenou:',
        deals: pickRandomDeals(5),
      }
    }
    return { text: 'Rozumím, hledáš nejlepší poměr cena/výkon! Momentálně máme akce až -60% na vybrané pobyty. O jaký typ zážitku máš zájem?' }
  }

  // --- Romantic → show deals ---
  if (msg.match(/\b(romanticke|partner|dvou|valentyn|vyrocí|ve dvou)/)) {
    return {
      text: 'Romantický pobyt pro dva? Mám pro tebe skvělé tipy – privátní wellness, večeře při svíčkách a krásné prostředí:',
      deals: pickRandomDeals(5),
    }
  }

  // --- Family → show deals ---
  if (msg.match(/\b(rodina|deti|dite|rodinny|rodinn)/)) {
    return {
      text: 'Pro rodiny s dětmi mám super tipy! Aquaparky, animační programy a pobyty, kde si užijí malí i velcí:',
      deals: pickRandomDeals(5),
    }
  }

  // --- Sports → show deals ---
  if (msg.match(/\b(sport|aktivit|kolo|lyzov|bruslen|turistik|golf|cykl)/)) {
    return {
      text: 'Sportovní nabídky jsou super! Tady je pár tipů, co jsem pro tebe našel:',
      deals: pickRandomDeals(5),
    }
  }

  // --- Views / nature → show deals ---
  if (msg.match(/\b(vyhled|prirod|hory|more|krajin|les)/)) {
    return {
      text: 'Krásné výhledy a příroda – to je přesně to, co máme. Podívej se na tyto nabídky:',
      deals: pickRandomDeals(5),
    }
  }

  // --- Confirmations: "Ano", "Chci" etc. → check context and show relevant deals ---
  if (msg.match(/\b(ano|jo|jasne|urcite|rad|bych|chci|chtel|chtela|davej|ukazat|zobraz)/)) {
    // Determine which deals based on conversation history
    if (allUserText.match(/\b(wellness|relax|masaz|spa|restaurac|jidlo|vecere|obed|romanticke|partner|dvou|rodina|deti|rodinny|cena|levn|slev)/)) {
      return {
        text: 'Tady jsou moje top doporučení pro tebe:',
        deals: pickRandomDeals(5),
      }
    }
    // Default: show general deals
    if (lastBotMsg.includes('aktivit') || lastBotMsg.includes('pripojime')) {
      return {
        text: 'Mám pro tebe pár tipů na aktivity a výlety v okolí:',
        deals: pickRandomDeals(5),
      }
    }
    return { text: 'Připojíme k tomu nějakou aktivitu v okolí?' }
  }

  // --- Short messages ---
  if (msg.length < 5) {
    return { text: 'Můžeš mi říct trochu víc? Rád ti pomohu najít perfektní nabídku na Sleváči!' }
  }

  // --- Default ---
  return { text: 'Zajímavé! Rád ti s tím pomohu. Zkus se mě zeptat na jídlo, cestování, wellness nebo aktuální slevy – a já ti najdu ty nejlepší nabídky.' }
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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const sendMessage = useCallback(() => {
    const text = inputValue.trim()
    if (!text || isTyping) return

    const userMsgId = nextIdRef.current++
    const newMessages: ChatMessage[] = [...messages, { id: userMsgId, text, sender: 'user' }]
    setMessages(newMessages)
    setInputValue('')
    setIsTyping(true)
    setTypingText(getTypingText())

    // Longer delay when deals are included (simulating search)
    const response = getBotResponse(text, newMessages)
    const baseDelay = response.deals ? 1200 : 800
    const delay = baseDelay + Math.random() * 800

    setTimeout(() => {
      const botMsgId = nextIdRef.current++
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: response.text,
        sender: 'bot',
        deals: response.deals,
      }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [inputValue, isTyping, messages])

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
