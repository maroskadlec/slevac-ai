import { useState, useCallback, useRef, useEffect } from 'react'
import type { DealCard } from '../data/mockDeals'
import { pickRandomDeals } from '../data/mockDeals'

export interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
  deals?: DealCard[]
}

// Typing texts when chatbot is searching through offers
const SEARCH_TYPING_TEXTS = [
  'Koumám, co ti nabídnout',
  'Vybírám z nabídek',
  'Hledám to nejlepší',
  'Přemýšlím nad možnostmi',
  'Dávám to dohromady',
  'Procházím nabídky pro tebe',
  'Šťourám se v nabídkách',
  'Moment, ladím detaily',
]

// Typing texts for general conversation / thinking (no search context)
const THINKING_TYPING_TEXTS = [
  'Musím to promyslet',
  'Chvilku, mrknu na to',
  'Hned to bude',
  'Moment…',
  'Přemýšlím…',
  'Dej mi vteřinku',
]

const HOW_I_RECOMMEND_RESPONSES = [
  'Prošel jsem nabídky a vybral ty, které mají dobré hodnocení od ostatních zákazníků. Beru v potaz popis, co v nabídce dostaneš, a taky to, jak ji hodnotí lidi, co ji už vyzkoušeli.',
  'Při výběru jsem se díval na dvě věci – co nabídka obsahuje a jak ji hodnotí ostatní zákazníci. U každé nabídky znám detaily jako lokalitu, co je v ceně, a další důležité info. K tomu přidávám recenze lidí, kteří už nabídku využili. Díky tomu ti můžu doporučit to, co opravdu stojí za to.',
  'Výběr není náhodný. Každou nabídku znám do detailu – vím, co obsahuje, kde se nachází a za kolik. Navíc se dívám na hodnocení a recenze od zákazníků, kteří už nabídku vyzkoušeli. Takže ti doporučuji jen to, co má ověřenou kvalitu.',
]

const OFF_TOPIC_RESPONSES = [
  'Tohle bohužel není moje parketa. Ale cestování a zážitky – tam se vyznám!',
  'Na tohle ti neporadím, ale zkus se mě zeptat na dovolenou nebo zážitky.',
  'Tady jsem mimo. Pojďme radši na to, co umím – nabídky cestování a zážitků!',
  'Ajaj, tohle je nad moje síly. Ale najít ti super zážitek nebo dovolenou? To zvládnu!',
  'Hmm, tohle není úplně můj obor. Jsem specialista na cestování a zážitky ze Slevomatu.',
  'Promiň, ale tady ti nepomůžu. Zkus se zeptat na nějaký výlet nebo zážitek!',
  'Tohle mám zakázané téma 😅 Radši mi řekni, kam chceš vyrazit nebo co chceš zažít.',
  'Na tohle odpověď nemám. Ale co třeba wellness víkend nebo adrenalinový zážitek?',
  'Tady ti neporadím. Moje doména jsou slevomatí zážitky a cestování – co tě láká?',
]

// Tracks which texts have been used in this session to avoid repetition
const usedSearchTypingTexts: Set<number> = new Set()
const usedThinkingTypingTexts: Set<number> = new Set()
const usedOffTopicTexts: Set<number> = new Set()
const usedHowIRecommendTexts: Set<number> = new Set()

function pickUnused(pool: string[], used: Set<number>): string {
  if (used.size >= pool.length) {
    used.clear()
  }
  const available = pool.map((_, i) => i).filter(i => !used.has(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  used.add(idx)
  return pool[idx]
}

function getSearchTypingText(): string {
  return pickUnused(SEARCH_TYPING_TEXTS, usedSearchTypingTexts)
}

function getThinkingTypingText(): string {
  return pickUnused(THINKING_TYPING_TEXTS, usedThinkingTypingTexts)
}

function getOffTopicResponse(): string {
  return pickUnused(OFF_TOPIC_RESPONSES, usedOffTopicTexts)
}

function getHowIRecommendResponse(): string {
  return pickUnused(HOW_I_RECOMMEND_RESPONSES, usedHowIRecommendTexts)
}

// ─── Conversation state tracking ───────────────────────────────────
interface ConversationState {
  location: string | null
  people: string | null
  dates: string | null
  meals: string | null
  amenities: string | null        // null = not yet asked, value = answered
  amenitiesAsked: boolean         // whether the bot already asked about amenities
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Extract location from text */
function extractLocation(text: string): string | null {
  const n = normalize(text)
  if (n.match(/\b(krkonos|spindl|harrachov|pec pod|snezk)/)) return 'Krkonoše'
  if (n.match(/\b(beskydy|pustevn|radhost)/)) return 'Beskydy'
  if (n.match(/\b(sumav|lipno|kvild)/)) return 'Šumava'
  if (n.match(/\b(jeseniky|praded|karlova studank)/)) return 'Jeseníky'
  if (n.match(/\b(cesky raj)/)) return 'Český ráj'
  if (n.match(/\b(vysocin)/)) return 'Vysočina'
  if (n.match(/\b(praha)/)) return 'Praha'
  if (n.match(/\b(brno)/)) return 'Brno'
  return null
}

/** Extract number of people from text */
function extractPeople(text: string): string | null {
  const n = normalize(text)
  // "já s partnerkou/partnerem", "s manželkou/manželem", "ve dvou", "pro dva"
  if (n.match(/\b(s partnerkou|s partnerem|s manzelkou|s manzelem|ve dvou|pro dva|pro dve|dva lidi|dve osoby|2 osoby|2 lidi)\b/)) return '2 osoby'
  if (n.match(/\b(sam\b|sama\b|solo\b|jen ja\b|jedna osoba|1 osoba|jednoho)\b/)) return '1 osoba'
  if (n.match(/\b(s det|s rodinou|rodina|rodinny|rodinn)\b/)) return 'rodina'
  // "pro X", "X osob/lidí/osoby/lidi", or just a digit in relevant context
  const numMatch = n.match(/\b(pro|pocet)\s*(\d+)/) || n.match(/(\d+)\s*(osob|lid|osoby|lidi|clov|dospel)/) || n.match(/\b(\d+)\s*a\s*(\d+)\s*(det|dite)/)
  if (numMatch) {
    // Try to figure out the number
    const digits = n.match(/\d+/g)
    if (digits) {
      const total = digits.map(Number).reduce((a, b) => a + b, 0)
      return `${total} ${total === 1 ? 'osoba' : total < 5 ? 'osoby' : 'osob'}`
    }
  }
  // Simple number standalone in a short message (probably answering "how many people")
  const simpleNum = n.match(/^\s*(\d+)\s*$/)
  if (simpleNum) {
    const num = parseInt(simpleNum[1])
    return `${num} ${num === 1 ? 'osoba' : num < 5 ? 'osoby' : 'osob'}`
  }
  // Textual numbers
  if (n.match(/\b(tri|tři|3)\b/) && !n.match(/\b(strav|penz|snidan)/)) return '3 osoby'
  if (n.match(/\b(ctyri|čtyři|4)\b/) && !n.match(/\b(strav|penz|snidan)/)) return '4 osoby'
  if (n.match(/\b(pet|pět|5)\b/) && !n.match(/\b(strav|penz|snidan)/)) return '5 osob'
  return null
}

/** Extract dates/period from text */
function extractDates(text: string): string | null {
  const n = normalize(text)
  // Specific date patterns: "15.3.", "15. března", "15.3.2026", "15.3. - 18.3."
  if (n.match(/\d{1,2}\.\s*\d{1,2}\./)) return text.trim()
  // Month mentions
  if (n.match(/\b(leden|unor|brezen|duben|kveten|cerven|cervenec|srpen|zari|rijen|listopad|prosinec|ledna|unora|brezna|dubna|kvetna|cervna|cervence|srpna|zari|rijna|listopadu|prosince)\b/)) return text.trim()
  // Relative time
  if (n.match(/\b(pristi vikend|tento vikend|pristi tyden|tento tyden|za tyden|za dva tydny|za mesic)\b/)) return text.trim()
  // Season / vague
  if (n.match(/\b(jaro|leto|podzim|zima|jarni|letni|podzimni|zimni|prazdnin|prazdniny|svatk|velikonoc|vanoce|silvestr)\b/)) return text.trim()
  // "víkend v červnu", "první týden v srpnu" etc.
  if (n.match(/\b(vikend|tyden|mesic)\b/) && n.match(/\b(v|na|behem|kolem|zacatek|konec|polovina)\b/)) return text.trim()
  // "na 3 noci", "na víkend", "na týden"
  if (n.match(/\b(na\s+\d+\s*(noc|den|dni))\b/)) return text.trim()
  if (n.match(/\bna vikend\b/)) return text.trim()
  if (n.match(/\bna tyden\b/)) return text.trim()
  return null
}

/** Extract meal preference from text */
function extractMeals(text: string): string | null {
  const n = normalize(text)
  if (n.match(/\b(plna penze|plnou penzi|plna penzi)\b/)) return 'plná penze'
  if (n.match(/\b(polopenze|polopenzi)\b/)) return 'polopenze'
  if (n.match(/\b(snidane|se snidani|vcetne snidane)\b/)) return 'se snídaní'
  if (n.match(/\b(vlastni stravovani|bez stravy|bez stravovani|stravovani vlastni|sam si|sami si)\b/)) return 'vlastní stravování'
  if (n.match(/\b(all inclusive|all-inclusive|all in)\b/)) return 'all inclusive'
  // Generic "strava" mentions when answering the bot's question
  if (n.match(/\b(strav)\b/) && n.length < 40) {
    if (n.match(/\b(neres|jedno|nemusí|nepotreb|bez)\b/)) return 'bez preference'
  }
  // "je mi to jedno" in context of meals question
  if (n.match(/\b(jedno|neres|nemusí|jakakoli|jakakoliv|cokoliv|nezalezi)\b/) && n.length < 30) return null // will be handled contextually
  return null
}

/** Extract hotel amenities from text */
function extractAmenities(text: string): string | null {
  const n = normalize(text)
  const found: string[] = []
  if (n.match(/\b(bazen|bazén)\b/)) found.push('bazén')
  if (n.match(/\b(wellness|spa|virivk|vířivk|saun)\b/)) found.push('wellness')
  if (n.match(/\b(detsky koutek|detsky kout|hern|pro deti)\b/)) found.push('dětský koutek')
  if (n.match(/\b(pet friendly|zvire|pes |psa |pejsk|mazlicek|se psem)\b/)) found.push('pet friendly')
  if (n.match(/\b(restaurac|restauraci)\b/)) found.push('restaurace')
  if (n.match(/\b(parkovani|parking|garaz)\b/)) found.push('parkování')
  if (n.match(/\b(fitness|posilovna|gym)\b/)) found.push('fitness')
  if (found.length > 0) return found.join(', ')
  // "je mi to jedno" / "bez preference" / "neřeším"
  if (n.match(/\b(jedno|neres|nemusí|cokoliv|nezalezi|nic extra|nic specialni|zadne|nemam pozadavk|nemam preference|nepotreb|nevyzaduj|neni to pro)\b/)) return 'bez preference'
  return null
}

/** Extract conversation state from the entire history */
function extractConversationState(messages: ChatMessage[]): ConversationState {
  const state: ConversationState = {
    location: null,
    people: null,
    dates: null,
    meals: null,
    amenities: null,
    amenitiesAsked: false,
  }

  const botMessages = messages.filter(m => m.sender === 'bot')

  // Check if amenities were already asked by the bot
  for (const bm of botMessages) {
    const bn = normalize(bm.text)
    if (bn.includes('vybaveni') || bn.includes('bazen') && bn.includes('wellness') && (bn.includes('?') || bn.includes('koutek'))) {
      state.amenitiesAsked = true
    }
  }

  // Go through user messages and extract information
  for (const m of messages) {
    if (m.sender !== 'user') continue
    const text = m.text

    if (!state.location) state.location = extractLocation(text)
    if (!state.people) state.people = extractPeople(text)
    if (!state.dates) state.dates = extractDates(text)
    if (!state.meals) state.meals = extractMeals(text)
    if (!state.amenities) state.amenities = extractAmenities(text)
  }

  return state
}

/** Check what the bot last asked about, to handle contextual short answers */
function getLastBotQuestion(messages: ChatMessage[]): 'location' | 'people' | 'dates' | 'meals' | 'amenities' | null {
  const botMessages = messages.filter(m => m.sender === 'bot')
  if (botMessages.length === 0) return null
  const last = normalize(botMessages[botMessages.length - 1].text)
  
  if (last.includes('lokalit') || last.includes('kam') || last.includes('oblast') || last.includes('mist')) return 'location'
  if (last.includes('kolik') && (last.includes('osob') || last.includes('lid') || last.includes('vas') || last.includes('pojed'))) return 'people'
  if (last.includes('termin') || last.includes('kdy') || last.includes('datum') || last.includes('obdobi')) return 'dates'
  if (last.includes('strav') || last.includes('penz') || last.includes('snidan')) return 'meals'
  if (last.includes('vybaven') || last.includes('bazen') || last.includes('koutek')) return 'amenities'
  return null
}

// ─── Main response logic ───────────────────────────────────────────

interface BotResponse {
  text: string
  deals?: DealCard[]
}

function getBotResponse(userMessage: string, conversationHistory: ChatMessage[]): BotResponse {
  const msg = normalize(userMessage)

  // Check conversation context
  const prevBotMessages = conversationHistory.filter(m => m.sender === 'bot')
  const lastBotMsg = prevBotMessages.length > 0
    ? normalize(prevBotMessages[prevBotMessages.length - 1].text)
    : ''

  // --- Greetings (no deals) ---
  if (msg.match(/\b(ahoj|cau|dobr[ye]|hey|hi|hello|zdar|nazdar)\b/) && conversationHistory.filter(m => m.sender === 'user').length <= 1) {
    return { text: 'Ahoj! 👋 Rád tě vidím. Řekni mi, kam chceš vyrazit, a já ti najdu ty nejlepší nabídky.' }
  }

  // --- Name question ---
  if (msg.match(/\b(jak se jmenuj|tve jmeno|tvoje jmeno|kdo jsi|jak ti rikaj)/)) {
    return { text: 'Ve Slevomatu mi říkají Kolečko 😊 A jsem tu, abych ti pomohl najít ten nejlepší zážitek nebo dovolenou!' }
  }

  // --- How did you recommend / on what basis ---
  if (msg.match(/\b(jak jsi.*doporuc|jak jsi.*vyber|jak jsi.*vybir|na zaklade|podle ceho|jak vyber|jak vybir|proc zrovna|jak to vyber|jak to vybir|jak doporuc)/)) {
    return { text: getHowIRecommendResponse() }
  }

  // --- Help / capabilities (no deals) ---
  if (msg.match(/\b(co umis|pomoc|help|co delas|jak funguj|co jsi|co vse|co muzes|co dokazes|co zvlad)/)) {
    return { text: 'Jsem tu, abych ti usnadnil výběr z nabídek na Slevomatu. Řekni mi kam chceš jet, s kolika lidmi, kdy a jakou preferuješ stravu – a já ti najdu to nejlepší! 🏖️' }
  }

  // --- Thanks (no deals) ---
  if (msg.match(/\b(dekuj|diky|dik|dikes)\b/)) {
    return { text: 'Rádo se stalo! 😊 Pokud budeš potřebovat cokoliv dalšího, jsem tu pro tebe.' }
  }

  // --- Post-dislike: user is explaining what was wrong ---
  const isAfterDislike = lastBotMsg.includes('pomoz mi pochopit') || lastBotMsg.includes('udelal chybku')
  if (isAfterDislike) {
    return { text: 'Rozumím, díky za vysvětlení! Beru si to k srdci a příště budu chytřejší. Chceš, abych to zkusil znovu s jinými nabídkami?' }
  }

  // --- More offers / different offers ---
  if (msg.match(/\b(vic nabid|dalsi nabid|jeste nec|jine nabid|neco jineho|dalsi moznost|vice moznost|zkus jine|ukaz dalsi|jeste dalsi)/)) {
    return {
      text: 'Jasně, tady je další várka nabídek. Snad tady najdeš, co hledáš:',
      deals: pickRandomDeals(5),
    }
  }

  // ─── Gather information flow ─────────────────────────────────────
  // Extract current state from the full conversation (including this new message)
  const state = extractConversationState(conversationHistory)
  const lastQuestion = getLastBotQuestion(conversationHistory)

  // Also try to extract from the current message specifically
  const currentLocation = extractLocation(userMessage)
  const currentPeople = extractPeople(userMessage)
  const currentDates = extractDates(userMessage)
  const currentMeals = extractMeals(userMessage)
  const currentAmenities = extractAmenities(userMessage)

  // Merge current extractions into state
  if (currentLocation) state.location = currentLocation
  if (currentPeople) state.people = currentPeople
  if (currentDates) state.dates = currentDates
  if (currentMeals) state.meals = currentMeals
  if (currentAmenities) state.amenities = currentAmenities

  // Handle contextual short answers based on what the bot last asked
  if (lastQuestion && !currentLocation && !currentPeople && !currentDates && !currentMeals && !currentAmenities) {
    const isShortAnswer = msg.length < 50

    if (isShortAnswer) {
      // "je mi to jedno" type answers
      const isDontCare = msg.match(/\b(jedno|neres|nemusí|cokoliv|nezalezi|jakkoliv|jakykoliv|jakakoli|jakakoliv|uplne jedno|je to jedno|fakt jedno|vzdycky|vse|vsechno)\b/)

      switch (lastQuestion) {
        case 'people':
          if (!state.people) {
            const p = extractPeople(userMessage)
            if (p) { state.people = p; break }
            // Try to interpret the answer loosely
            if (msg.match(/\d/)) {
              const num = parseInt(msg.match(/\d+/)![0])
              state.people = `${num} ${num === 1 ? 'osoba' : num < 5 ? 'osoby' : 'osob'}`
            }
          }
          break
        case 'dates':
          if (!state.dates) {
            // Accept any answer as a date description
            state.dates = userMessage.trim()
          }
          break
        case 'meals':
          if (!state.meals) {
            if (isDontCare) {
              state.meals = 'bez preference'
            } else {
              // Try to interpret
              state.meals = userMessage.trim()
            }
          }
          break
        case 'amenities':
          if (!state.amenities) {
            if (isDontCare) {
              state.amenities = 'bez preference'
            } else {
              state.amenities = userMessage.trim()
            }
          }
          break
      }
    }
  }

  // ─── Determine what to ask next ──────────────────────────────────

  // 1. Location
  if (!state.location) {
    // Check if the message has travel-related content but no location
    if (msg.match(/\b(hotel|ubytovan|dovolen|pobyt|chata|chalup|wellness|hory|cestovan)/)) {
      return { text: 'To zní skvěle! 🏔️ A kam by ses chtěl/a podívat? Třeba Krkonoše, Beskydy, Šumava…?' }
    }
    // If nothing travel-related detected, it might be off-topic or the user just started
    if (conversationHistory.filter(m => m.sender === 'user').length <= 1 && !msg.match(/\b(krkonos|beskydy|sumav|hotel|pobyt|dovolen)/)) {
      // Check if it's genuinely off-topic
      if (msg.length > 5 && !msg.match(/\b(jet|jedeme|chci|chteli|chtela|chtel|hledam|hledame|zajimat|zajima|planuji|planujeme|radi|rada|bychom|potreb)/)) {
        return { text: getOffTopicResponse() }
      }
    }
    return { text: 'Super, rád pomůžu! Nejdřív mi řekni, kam to má být – jaká lokalita tě láká? 🗺️' }
  }

  // Acknowledge location if just provided
  const locationJustProvided = currentLocation && !extractPeople(userMessage) && !extractDates(userMessage) && !extractMeals(userMessage)

  // 2. Number of people
  if (!state.people) {
    if (locationJustProvided) {
      return { text: `${state.location} – skvělá volba! 🏔️ A kolik vás pojede? Jen ty, ve dvou, nebo víc?` }
    }
    return { text: 'Kolik vás pojede? Sám/sama, ve dvou, nebo víc lidí?' }
  }

  // Acknowledge people if just provided
  const peopleJustProvided = currentPeople && !extractDates(userMessage) && !extractMeals(userMessage)

  // 3. Date/period
  if (!state.dates) {
    if (peopleJustProvided) {
      return { text: `Dobře, ${state.people}. A kdy byste chtěli jet? Může být konkrétní datum, víkend, nebo třeba „během léta" – cokoli mi pomůže. 📅` }
    }
    return { text: 'A kdy by se ti to hodilo? Napiš mi termín, období nebo třeba jen měsíc. 📅' }
  }

  // Acknowledge dates if just provided
  const datesJustProvided = currentDates && !extractMeals(userMessage)

  // 4. Meals
  if (!state.meals) {
    if (datesJustProvided) {
      return { text: 'Výborně! A co stravování? Preferuješ vlastní stravování, snídani, polopenzi, plnou penzi, nebo all inclusive? 🍽️' }
    }
    return { text: 'Jaké stravování by ti vyhovovalo? Třeba polopenze, plná penze, se snídaní, nebo vlastní stravování? 🍽️' }
  }

  // Acknowledge meals if just provided
  const mealsJustProvided = currentMeals || (lastQuestion === 'meals' && !state.amenitiesAsked)

  // 5. Hotel amenities
  if (!state.amenities) {
    if (!state.amenitiesAsked || mealsJustProvided) {
      return { text: 'Ještě poslední věc – je pro tebe důležité nějaké vybavení hotelu? Třeba bazén, wellness, dětský koutek, pet friendly, restaurace, parkování…? Nebo ti to je jedno? 🏊' }
    }
    // If amenities were asked and user responded with something we couldn't parse, treat as provided
    if (state.amenitiesAsked) {
      state.amenities = 'bez preference'
    }
  }

  // ─── All criteria gathered → show deals! ─────────────────────────

  // Build a nice summary
  const summaryParts: string[] = []
  summaryParts.push(`📍 ${state.location}`)
  summaryParts.push(`👥 ${state.people}`)
  summaryParts.push(`📅 ${state.dates}`)
  summaryParts.push(`🍽️ ${state.meals}`)
  if (state.amenities && state.amenities !== 'bez preference') {
    summaryParts.push(`🏨 ${state.amenities}`)
  }

  const summary = summaryParts.join('\n')

  return {
    text: `Mám vše, co potřebuji! Tady je shrnutí:\n\n${summary}\n\nA tady jsou nabídky, které jsem pro tebe vybral:`,
    deals: pickRandomDeals(5),
  }
}

// ─── Short messages ---
// Moved inside the main logic as needed

// ─── Hook ──────────────────────────────────────────────────────────

export function useChatbot(_isOpen?: boolean) {
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

  const sendMessageInternal = useCallback((text: string) => {
    if (!text || isTyping) return

    const userMsgId = nextIdRef.current++
    const newMessages: ChatMessage[] = [...messages, { id: userMsgId, text, sender: 'user' }]
    setMessages(newMessages)
    setInputValue('')

    // Compute response first to pick contextual typing text
    const response = getBotResponse(text, newMessages)
    const typingLabel = response.deals ? getSearchTypingText() : getThinkingTypingText()

    setIsTyping(true)
    setTypingText(typingLabel)

    // Longer delay when deals are included (simulating search)
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
  }, [isTyping, messages])

  const sendMessage = useCallback(() => {
    const text = inputValue.trim()
    sendMessageInternal(text)
  }, [inputValue, sendMessageInternal])

  const sendMessageWithText = useCallback((text: string) => {
    sendMessageInternal(text.trim())
  }, [sendMessageInternal])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const handleDisclaimer = useCallback(() => {
    if (isTyping) return
    setIsTyping(true)
    setTypingText(getThinkingTypingText())

    const delay = 500 + Math.random() * 500
    setTimeout(() => {
      const botMsgId = nextIdRef.current++
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: 'Jsem tu teprve chvilku a učím se za pochodu. Doporučení dávám podle tvých odpovědí, ale občas se můžu splést.',
        sender: 'bot',
      }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [isTyping])

  const handleFeedback = useCallback((type: 'up' | 'down') => {
    setIsTyping(true)
    setTypingText(getThinkingTypingText())

    const delay = 600 + Math.random() * 600

    setTimeout(() => {
      const botMsgId = nextIdRef.current++
      const text = type === 'up'
        ? 'Děkuju, to je milé. 😊'
        : 'To mne mrzí. Pomoz mi pochopit, kde jsem udělal chybku. Školím se a ty mi pomůžeš být příště lepším.'
      setMessages(prev => [...prev, { id: botMsgId, text, sender: 'bot' }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [])

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    typingText,
    messagesEndRef,
    sendMessage,
    sendMessageWithText,
    handleKeyDown,
    handleFeedback,
    handleDisclaimer,
  }
}
