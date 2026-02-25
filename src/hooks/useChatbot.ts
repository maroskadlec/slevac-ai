import { useCallback, useRef, useEffect } from 'react'
import { useChatContext } from '../contexts/ChatContext'
import type { DealCard } from '../data/mockDeals'
import { pickRandomDeals } from '../data/mockDeals'
import type { ActivityCard } from '../data/mockActivities'
import { getActivities } from '../data/mockActivities'

export interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'bot'
  deals?: DealCard[]
  activities?: ActivityCard[]
  image?: string
}

// ─── Typing indicator texts ────────────────────────────────────────

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

const THINKING_TYPING_TEXTS = [
  'Musím to promyslet',
  'Chvilku, mrknu na to',
  'Hned to bude',
  'Moment…',
  'Přemýšlím…',
  'Dej mi vteřinku',
]

// ─── Response pools ────────────────────────────────────────────────

const HOW_I_RECOMMEND_RESPONSES = [
  'Prošel jsem nabídky na Slevomatu a hlavně jsem pročetl hodnocení a recenze od zákazníků, kteří už nabídku vyzkoušeli. Na jejich zkušenostech mi záleží nejvíc – díky nim vím, co opravdu stojí za to.',
  'Čerpám přímo z nabídek na Slevomatu. Ke každé nabídce si pročtu, co zákazníci napsali v recenzích – jejich hodnocení je pro mě klíčové. Právě díky tomu ti doporučuji to, co má ověřenou kvalitu od skutečných lidí.',
  'Můj hlavní zdroj jsou hodnocení zákazníků na Slevomatu. Pročetl jsem recenze lidí, kteří nabídky už využili, a podle jejich zkušeností vybírám. K tomu samozřejmě znám detaily každé nabídky – co obsahuje, kde se nachází a za kolik.',
  'Vycházím z toho, co říkají ostatní zákazníci. Na Slevomatu si ke každé nabídce pročtu hodnocení a recenze – a právě ty jsou pro mě rozhodující. Když lidi chválí, doporučím i tobě. 😊',
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

// ─── Non-repeating random picker ───────────────────────────────────

const usedSearchTypingTexts: Set<number> = new Set()
const usedThinkingTypingTexts: Set<number> = new Set()
const usedOffTopicTexts: Set<number> = new Set()
const usedHowIRecommendTexts: Set<number> = new Set()

function pickUnused(pool: string[], used: Set<number>): string {
  if (used.size >= pool.length) used.clear()
  const available = pool.map((_, i) => i).filter(i => !used.has(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  used.add(idx)
  return pool[idx]
}

function getSearchTypingText(): string { return pickUnused(SEARCH_TYPING_TEXTS, usedSearchTypingTexts) }
function getThinkingTypingText(): string { return pickUnused(THINKING_TYPING_TEXTS, usedThinkingTypingTexts) }
function getOffTopicResponse(): string { return pickUnused(OFF_TOPIC_RESPONSES, usedOffTopicTexts) }
function getHowIRecommendResponse(): string { return pickUnused(HOW_I_RECOMMEND_RESPONSES, usedHowIRecommendTexts) }

// ─── Fuzzy matching utilities ──────────────────────────────────────

/** Levenshtein distance between two strings */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return dp[m][n]
}

/** Normalize text: lowercase, remove diacritics */
function norm(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

/** Split text into words */
function words(text: string): string[] {
  return norm(text).split(/\s+/).filter(Boolean)
}

/**
 * Check if any word in the text fuzzy-matches any of the target keywords.
 * For short keywords (<=4 chars): exact match only.
 * For medium keywords (5-7 chars): allow distance 1.
 * For long keywords (>=8 chars): allow distance 2.
 * Also checks 2-word and 3-word n-grams for multi-word keywords.
 */
function fuzzyMatch(text: string, keywords: string[]): boolean {
  const n = norm(text)
  const ws = words(text)

  // Build n-grams (1-word, 2-word, 3-word)
  const grams: string[] = [...ws]
  for (let i = 0; i < ws.length - 1; i++) grams.push(ws[i] + ' ' + ws[i + 1])
  for (let i = 0; i < ws.length - 2; i++) grams.push(ws[i] + ' ' + ws[i + 1] + ' ' + ws[i + 2])

  for (const kw of keywords) {
    const nkw = norm(kw)
    // Direct substring check first (fastest)
    if (n.includes(nkw)) return true

    // Fuzzy check on n-grams
    const maxDist = nkw.length <= 4 ? 0 : nkw.length <= 7 ? 1 : 2
    for (const g of grams) {
      if (levenshtein(g, nkw) <= maxDist) return true
    }
  }
  return false
}

/**
 * Check if any "don't care" expression is in the text.
 */
function isDontCare(text: string): boolean {
  return fuzzyMatch(text, [
    'je mi to jedno', 'jedno', 'nezalezi', 'neres', 'neresim',
    'cokoliv', 'cokoli', 'jakkoliv', 'jakkoli', 'jakekoli', 'jakykoli',
    'uplne jedno', 'fakt jedno', 'vsechno', 'nemusí', 'nemusi',
    'nemam preferenc', 'nemam pozadav', 'bez preference',
    'neni to dulezite', 'neni dulezite', 'nevadi', 'necham na tobe',
    'vyber sam', 'vyber ty', 'je to fuk', 'neni podstatne',
    'bez narok', 'zadne narok', 'nic specialni', 'nic extra',
  ])
}

// ─── Synonym-based extraction ──────────────────────────────────────

interface ConversationState {
  location: string | null
  people: string | null
  dates: string | null
  meals: string | null
  amenities: string | null
}

// --- LOCATION ---

const LOCATION_MAP: [string[], string][] = [
  [['krkonose', 'krkonos', 'krkonosi', 'spindleruv mlyn', 'spindl', 'harrachov', 'pec pod snezkou', 'pec pod snezk', 'snezka', 'rokytnice', 'rokytnic'], 'Krkonoše'],
  [['beskydy', 'beskyd', 'pustevny', 'pustevn', 'radhost', 'lysá hora', 'lysa hora', 'frenstat'], 'Beskydy'],
  [['sumava', 'sumav', 'lipno', 'kvilda', 'kvild', 'zelezna ruda', 'modrava'], 'Šumava'],
  [['jeseniky', 'jesenik', 'praded', 'karlova studanka', 'karlova studank'], 'Jeseníky'],
  [['cesky raj', 'český ráj'], 'Český ráj'],
  [['vysocina', 'vysočina'], 'Vysočina'],
  [['praha', 'prague'], 'Praha'],
  [['brno'], 'Brno'],
  [['jizni morava', 'jizni morav', 'palava', 'lednice', 'valtice', 'mikulov'], 'Jižní Morava'],
  [['orlicke hory', 'orlicke hor', 'destne', 'ricky'], 'Orlické hory'],
]

function extractLocation(text: string): string | null {
  for (const [keywords, label] of LOCATION_MAP) {
    if (fuzzyMatch(text, keywords)) return label
  }
  return null
}

// --- PEOPLE ---

const PEOPLE_TWO_KEYWORDS = [
  's partnerkou', 's partnerem', 's manzelkou', 's manzelem',
  's pritelkyni', 's pritelem', 's frajerkou', 's frajerem',
  's kamaradkou', 's kamaradem', 's kolegyni', 's kolegou',
  've dvou', 'pro dva', 'pro dve', 'dva lidi', 'dve osoby',
  '2 osoby', '2 lidi', 'ja a partner', 'ja a manz', 'ja s partner',
  'jedeme ve dvou', 'jedeme spolu', 'jsme dva', 'jsme dve',
  'ja a on', 'ja a ona', 'ja s nim', 'ja s ni',
]

const PEOPLE_ONE_KEYWORDS = [
  'sam', 'sama', 'solo', 'jen ja', 'jedna osoba', '1 osoba',
  'jednoho', 'single', 'ja sam', 'ja sama', 'jedu sam', 'jedu sama',
  'pojedu sam', 'pojedu sama',
]

const PEOPLE_FAMILY_KEYWORDS = [
  's detmi', 's rodinou', 'rodina', 'rodinny', 'rodinn',
  's ditetem', 'cela rodina', 'rodice a det', 's malym', 's malou',
  'rodinne', 's nasima detma', 's nasi rodinou',
]

const TEXT_NUMBERS: [string[], number][] = [
  [['dva', 'dve', 'dvou', 'dvema'], 2],
  [['tri', 'trech', 'tremi', 'trem'], 3],
  [['ctyri', 'ctyr', 'ctyrech', 'ctyrmi', 'ctyrem'], 4],
  [['pet', 'peti', 'petice'], 5],
  [['sest', 'sesti'], 6],
  [['sedm', 'sedmi'], 7],
  [['osm', 'osmi'], 8],
]

function peopleSuffix(n: number): string {
  return n === 1 ? 'osoba' : n < 5 ? 'osoby' : 'osob'
}

function extractPeople(text: string): string | null {
  if (fuzzyMatch(text, PEOPLE_TWO_KEYWORDS)) return '2 osoby'
  if (fuzzyMatch(text, PEOPLE_ONE_KEYWORDS)) return '1 osoba'
  if (fuzzyMatch(text, PEOPLE_FAMILY_KEYWORDS)) return 'rodina'

  const n = norm(text)

  // "pro X osob", "X lidí", etc.
  const numContextMatch = n.match(/(\d+)\s*(osob|lid|osoby|lidi|clov|dospel|lide)/)
  if (numContextMatch) {
    const num = parseInt(numContextMatch[1])
    return `${num} ${peopleSuffix(num)}`
  }
  const proMatch = n.match(/pro\s+(\d+)/)
  if (proMatch) {
    const num = parseInt(proMatch[1])
    return `${num} ${peopleSuffix(num)}`
  }

  // Textual numbers with context
  for (const [kws, num] of TEXT_NUMBERS) {
    if (fuzzyMatch(text, kws) && !n.match(/\b(strav|penz|snidan|noc|den|dni|tydn)/)) {
      return `${num} ${peopleSuffix(num)}`
    }
  }

  // Standalone digit (answering "how many people?")
  const standalone = n.match(/^\s*(\d+)\s*$/)
  if (standalone) {
    const num = parseInt(standalone[1])
    if (num >= 1 && num <= 20) return `${num} ${peopleSuffix(num)}`
  }

  return null
}

// --- DATES ---

const MONTH_KEYWORDS = [
  'leden', 'unor', 'brezen', 'duben', 'kveten', 'cerven',
  'cervenec', 'srpen', 'zari', 'rijen', 'listopad', 'prosinec',
  'ledna', 'unora', 'brezna', 'dubna', 'kvetna', 'cervna',
  'cervence', 'srpna', 'zari', 'rijna', 'listopadu', 'prosince',
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

const RELATIVE_TIME_KEYWORDS = [
  'pristi vikend', 'tento vikend', 'pristi tyden', 'tento tyden',
  'za tyden', 'za dva tydny', 'za mesic', 'za 14 dni', 'za ctrnact dni',
  'zitra', 'pozitri', 'dneska', 'dnes', 'co nejdriv', 'hned',
  'brzy', 'v brzke dobe',
]

const SEASON_KEYWORDS = [
  'jaro', 'leto', 'podzim', 'zima',
  'jarni', 'letni', 'podzimni', 'zimni',
  'prazdniny', 'prazdnin', 'svatky', 'svatk',
  'velikonoce', 'velikonoc', 'vanoce', 'vanoc', 'silvestr',
  'o prazdninach', 'behem leta', 'behem prazdnin',
  'na jare', 'na podzim', 'v lete', 'v zime',
]

function extractDates(text: string): string | null {
  const n = norm(text)

  // Specific date patterns: "15.3.", "15. března", "15.3.2026", "15.3. - 18.3."
  if (n.match(/\d{1,2}\.\s*\d{1,2}\./)) return text.trim()

  // "na X nocí/dní", "na víkend", "na týden"
  if (n.match(/na\s+\d+\s*(noc|den|dni|dnu)/)) return text.trim()
  if (n.match(/na\s+vikend/)) return text.trim()
  if (n.match(/na\s+tyden/)) return text.trim()

  // Months
  if (fuzzyMatch(text, MONTH_KEYWORDS)) return text.trim()
  // Relative
  if (fuzzyMatch(text, RELATIVE_TIME_KEYWORDS)) return text.trim()
  // Season
  if (fuzzyMatch(text, SEASON_KEYWORDS)) return text.trim()

  // "víkend v ...", "první týden v ..."
  if (n.match(/vikend/) && n.match(/(v|na|behem|kolem)/)) return text.trim()
  if (n.match(/tyden/) && n.match(/(v|na|behem|kolem|prvni|druhy|treti|posledni)/)) return text.trim()

  // "kdykoliv" / "nemám termín"
  if (fuzzyMatch(text, ['kdykoliv', 'kdykoli', 'nemam termin', 'bez terminu', 'nezalezi na terminu'])) return 'kdykoliv'

  return null
}

// --- MEALS ---

const MEALS_MAP: [string[], string][] = [
  [['plna penze', 'plnou penzi', 'plna penzi', 'plnou penz', 'full board', 'trikrat denne', '3x denne', 'snidane obed vecere'], 'plná penze'],
  [['polopenze', 'polopenzi', 'polopenz', 'half board', 'snidane a vecere', 'snidane vecere', 'rano a vecer', 'rano vecer'], 'polopenze'],
  [['snidane', 'se snidani', 'vcetne snidane', 'jen snidani', 'snidanovy', 'rano jidlo', 'ranni jidlo'], 'se snídaní'],
  [['vlastni stravovani', 'bez stravy', 'bez stravovani', 'stravovani vlastni', 'sam si', 'sami si', 'bez jidla', 'neresim stravu', 'jidlo nepotrebuju', 'varime si', 'uvarime si', 'strava vlastni', 'vlastni strava'], 'vlastní stravování'],
  [['all inclusive', 'all-inclusive', 'all in', 'vse v cene', 'vsechno v cene', 'vsetko v cene'], 'all inclusive'],
]

function extractMeals(text: string): string | null {
  for (const [keywords, label] of MEALS_MAP) {
    if (fuzzyMatch(text, keywords)) return label
  }
  return null
}

// --- AMENITIES ---

const AMENITY_MAP: [string[], string][] = [
  [['bazen', 'bazenu', 'bazene', 'plavani', 'aquapark', 'tobogan', 'vodni', 'plavecky'], 'bazén'],
  [['wellness', 'spa', 'relaxace', 'relaxacni', 'odpocinek', 'odpocinkovy', 'virivka', 'virivku', 'sauna', 'saunu', 'sauny', 'masaz', 'masaze', 'masazni', 'parnich lazni', 'parni lazne', 'whirlpool'], 'wellness'],
  [['detsky koutek', 'detsky kout', 'herna', 'pro deti', 'detske hriste', 'animacni program', 'detsky bazen', 'detska zona', 'pro male deti'], 'dětský koutek'],
  [['pet friendly', 'pet-friendly', 'se psem', 'se psy', 'se zviret', 'mazlicek', 'mazlick', 'pejsek', 'pejsk', 'psa', 'zvire', 'domaci zvirat', 'se zviratem'], 'pet friendly'],
  [['restaurace', 'restauraci', 'stravovani na miste', 'jidelna', 'bufet'], 'restaurace'],
  [['parkovani', 'parkovan', 'parking', 'garaz', 'garaze', 'misto na auto', 'parkoviste'], 'parkování'],
  [['fitness', 'posilovna', 'posilovn', 'gym', 'kardio', 'cviceni'], 'fitness'],
  [['wifi', 'internet', 'pripojeni'], 'WiFi'],
  [['klimatizace', 'klimatizac', 'klima'], 'klimatizace'],
]

function extractAmenities(text: string): string | null {
  const found: string[] = []
  for (const [keywords, label] of AMENITY_MAP) {
    if (fuzzyMatch(text, keywords)) found.push(label)
  }
  if (found.length > 0) return found.join(', ')
  if (isDontCare(text)) return 'bez preference'
  return null
}

// ─── Sentence splitting for multi-extraction ───────────────────────

/**
 * Split user message into logical segments for independent extraction.
 * Splits on commas, semicolons, line breaks, and common Czech conjunctions.
 */
function splitIntoSegments(text: string): string[] {
  // Split on punctuation separators and conjunctions
  const parts = text
    .split(/[,;.\n]+|(?:\s+a\s+)|(?:\s+dále\s+)|(?:\s+taky\s+)|(?:\s+také\s+)|(?:\s+plus\s+)|(?:\s+ještě\s+)/i)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  return parts.length > 0 ? parts : [text]
}

// ─── State extraction from full conversation ───────────────────────

function extractFullState(messages: ChatMessage[]): ConversationState {
  const state: ConversationState = {
    location: null,
    people: null,
    dates: null,
    meals: null,
    amenities: null,
  }

  for (const m of messages) {
    if (m.sender !== 'user') continue

    // Split each user message into segments and extract from each
    const segments = splitIntoSegments(m.text)
    const allAmenities: string[] = []

    for (const seg of segments) {
      const loc = extractLocation(seg)
      const ppl = extractPeople(seg)
      const dt = extractDates(seg)
      const ml = extractMeals(seg)
      const am = extractAmenities(seg)

      // Always overwrite with the latest value (allows parameter changes)
      if (loc) state.location = loc
      if (ppl) state.people = ppl
      if (dt) state.dates = dt
      if (ml) state.meals = ml
      if (am && am !== 'bez preference') allAmenities.push(am)
      if (am === 'bez preference' && allAmenities.length === 0) allAmenities.push(am)
    }

    // Also try extraction on the full message (catches multi-word phrases broken by splitting)
    const fullLoc = extractLocation(m.text)
    const fullPpl = extractPeople(m.text)
    const fullDt = extractDates(m.text)
    const fullMl = extractMeals(m.text)
    const fullAm = extractAmenities(m.text)

    if (fullLoc) state.location = fullLoc
    if (fullPpl) state.people = fullPpl
    if (fullDt) state.dates = fullDt
    if (fullMl) state.meals = fullMl
    if (fullAm && !state.amenities) {
      if (allAmenities.length > 0) {
        const unique = [...new Set(allAmenities.flatMap(a => a.split(', ')))]
        state.amenities = unique.join(', ')
      } else {
        state.amenities = fullAm
      }
    }
    if (allAmenities.length > 0 && !state.amenities) {
      const unique = [...new Set(allAmenities.flatMap(a => a.split(', ')))]
      state.amenities = unique.join(', ')
    }
  }

  return state
}

/**
 * Check what fields the bot last asked about (can be multiple).
 */
function getBotAskedFields(messages: ChatMessage[]): Set<string> {
  const fields = new Set<string>()
  const botMessages = messages.filter(m => m.sender === 'bot')
  if (botMessages.length === 0) return fields
  const last = norm(botMessages[botMessages.length - 1].text)

  if (last.includes('lokalit') || last.includes('kam') || last.includes('oblast')) fields.add('location')
  if (last.includes('kolik') || last.includes('pojed') || last.includes('osob') || last.includes('vas')) fields.add('people')
  if (last.includes('termin') || last.includes('kdy') || last.includes('datum') || last.includes('obdobi')) fields.add('dates')
  if (last.includes('strav') || last.includes('penz') || last.includes('snidan')) fields.add('meals')
  if (last.includes('vybaven') || last.includes('bazen') || last.includes('koutek') || last.includes('wellness') || last.includes('hotel')) fields.add('amenities')

  return fields
}

/** Detect if user already got deals shown (to handle post-deal conversation) */
function dealsWereShown(messages: ChatMessage[]): boolean {
  return messages.some(m => m.sender === 'bot' && m.deals && m.deals.length > 0)
}

/** Detect if activities were already shown */
function activitiesWereShown(messages: ChatMessage[]): boolean {
  return messages.some(m => m.sender === 'bot' && m.activities && m.activities.length > 0)
}

/** Check if user is asking for activities/trips in the area */
function isActivityRequest(text: string): boolean {
  return fuzzyMatch(text, [
    'vylet v okoli', 'vylety v okoli', 'co delat v okoli', 'co je v okoli',
    'co navstivit', 'co se da delat', 'kam na vylet', 'tipy na vylet',
    'tipy na vylety', 'zajimavosti v okoli', 'pamatky v okoli', 'co videt',
    'co podniknout', 'aktivity v okoli', 'kam zajit', 'co stoji za to',
    'co je pobliz', 'co se da videt', 'kam na prochazku', 'kam na turu',
    'turisticke trasy', 'rozhledna', 'rozhledny', 'muzeum', 'hrad', 'zamek',
    'co navstivit v okoli', 'vylety pobliz', 'kam v okoli',
    'co se da podniknout', 'doporucis vylet', 'doporuc mi vylet',
    'jake jsou vylety', 'jake jsou aktivity', 'kam na vychazku',
    'chci vylety', 'chci vylet', 'vylety', 'aktivity', 'co v okoli',
    'chci vylety v okoli', 'ukazat vylety', 'ukaz vylety',
  ])
}

/** Check if user is asking for stay/accommodation offers (not activities) */
function isStayRequest(text: string): boolean {
  return fuzzyMatch(text, [
    'nabidky pobytu', 'pobyty', 'ubytovani', 'hotel', 'hotely',
    'dalsi pobyty', 'jine pobyty', 'ukaz pobyty', 'chci pobyt',
    'chci pobyty', 'nabidky ubytovani', 'zpet na pobyty', 'pobytove nabidky',
    'dovolena', 'dovolenou', 'chci ubytovani', 'ukazat pobyty',
    'nabidky hotelu', 'dalsi nabidky pobytu', 'jine hotely',
  ])
}

/** Detect if user wants to change a parameter */
function detectParameterChange(text: string): { field: string; value: string } | null {
  const n = norm(text)

  // "vlastně/radši/změň/jiný termín/stravu/..."
  const changeSignals = n.match(/\b(vlastne|radsi|radeji|zmen|zmenil|zmenim|zmena|jiny|jine|jinou|prece jen|nakonec|ne |ne,)/);
  if (!changeSignals && !n.match(/\b(chci zmenit|zmenit na|prepis|uprav)/)) return null

  const loc = extractLocation(text)
  if (loc) return { field: 'location', value: loc }
  const ppl = extractPeople(text)
  if (ppl) return { field: 'people', value: ppl }
  const dt = extractDates(text)
  if (dt) return { field: 'dates', value: dt }
  const ml = extractMeals(text)
  if (ml) return { field: 'meals', value: ml }
  const am = extractAmenities(text)
  if (am) return { field: 'amenities', value: am }

  return null
}

// ─── Travel intent detection ───────────────────────────────────────

function hasTravelIntent(text: string): boolean {
  return fuzzyMatch(text, [
    'hotel', 'ubytovani', 'dovolena', 'dovolenou', 'pobyt', 'pobytovy',
    'chata', 'chalupa', 'wellness', 'hory', 'cestovani', 'vylet',
    'chci jet', 'jedeme', 'planuji', 'planujeme', 'hledam', 'hledame',
    'chci vyrazit', 'chteli bychom', 'chtel bych', 'chtela bych',
    'radi bychom', 'rada bych', 'zajima me', 'zajimaji me',
    'potrebuji', 'potrebujeme', 'objednat', 'zarezervovat',
    'kam jet', 'kde bydlet', 'kde spat',
    'krkonose', 'beskydy', 'sumava', 'jeseniky',
  ])
}

/**
 * Check if the current user message contains ANY travel-related extractable info
 * (location, people, dates, meals, amenities) or travel intent keywords.
 * Used to distinguish between on-topic and off-topic messages.
 */
function messageHasTravelContent(text: string): boolean {
  if (extractLocation(text)) return true
  if (extractPeople(text)) return true
  if (extractDates(text)) return true
  if (extractMeals(text)) return true
  if (extractAmenities(text)) return true
  if (hasTravelIntent(text)) return true
  if (isActivityRequest(text)) return true
  if (isStayRequest(text)) return true
  if (isDontCare(text)) return true // "je mi to jedno" is a valid answer
  // Also check for deal-related keywords (user talking about offers)
  if (fuzzyMatch(text, [
    'nabidka', 'nabidky', 'cena', 'ceny', 'sleva', 'slevy',
    'kolik stoji', 'kolik to stoji', 'za kolik', 'levnejsi', 'drazsi',
    'recenze', 'hodnoceni', 'hvezdicky', 'jak hodnotite',
    'objednat', 'rezervovat', 'koupit', 'zaplatit',
    'dalsi nabidky', 'jine nabidky', 'vice moznosti',
    'libi', 'nelibi', 'zaujalo', 'nezaujalo',
  ])) return true
  return false
}

// ─── Main response logic ───────────────────────────────────────────

interface BotResponse {
  text: string
  deals?: DealCard[]
  activities?: ActivityCard[]
}

function getBotResponse(userMessage: string, conversationHistory: ChatMessage[]): BotResponse {
  const msg = norm(userMessage)
  const userMsgCount = conversationHistory.filter(m => m.sender === 'user').length

  // Previous bot context
  const prevBotMessages = conversationHistory.filter(m => m.sender === 'bot')
  const lastBotMsg = prevBotMessages.length > 0 ? norm(prevBotMessages[prevBotMessages.length - 1].text) : ''

  // ─── Special intents (always available) ────────────────────────

  // Greetings (only on first message)
  if (msg.match(/\b(ahoj|cau|cus|dobr[ye]|hey|hi|hello|zdar|nazdar|hej|hoj)\b/) && userMsgCount <= 1) {
    return { text: 'Ahoj! 👋 Rád tě vidím. Řekni mi, kam chceš vyrazit, a já ti najdu ty nejlepší nabídky.' }
  }

  // Name question
  if (fuzzyMatch(userMessage, ['jak se jmenujes', 'tve jmeno', 'tvoje jmeno', 'kdo jsi', 'jak ti rikaji'])) {
    return { text: 'Ve Slevomatu mi říkají Kolečko 😊 A jsem tu, abych ti pomohl najít ten nejlepší zážitek nebo dovolenou!' }
  }

  // How did you recommend / on what basis
  if (fuzzyMatch(userMessage, [
    'jak jsi doporucil', 'jak jsi vybral', 'jak jsi vybiral',
    'na zaklade ceho', 'podle ceho', 'jak vybiras', 'proc zrovna',
    'jak to vybiras', 'jak doporucujes', 'z ceho cerpas',
    'odkud beres', 'odkud mas', 'odkud to vis', 'jak to vis',
    'proc tyto nabidky', 'proc zrovna tyto', 'proc zrovna tyhle',
    'jak jsi je vybral', 'jak jsi je nasel', 'na cem to stavis',
    'co je zdrojem', 'jaky je zdroj', 'kde beres informace',
    'kde cerpas', 'jak doporucujes', 'jak ses rozhodl',
    'proc zrovna tohle', 'jak je hodnotis', 'jak vyhodnocujes',
  ])) {
    return { text: getHowIRecommendResponse() }
  }

  // Reklamace
  if (fuzzyMatch(userMessage, [
    'reklamace', 'reklamaci', 'reklamovat', 'reklamuju', 'reklamuji',
    'chci reklamovat', 'potrebuji reklamaci', 'pomoz s reklamaci',
    'reklamacni', 'reklamacni rizeni', 'vratit penize', 'vraceni penez',
  ])) {
    return { text: 'Reklamaci zatím neumím vyřídit tak dobře jako můj chatbotí kolega Slávek. **Klikni sem** a já ti Slávka spustím. Řeknu mu rovnou, co potřebuješ a budete pokračovat spolu.' }
  }

  // Trips / activities in the area
  if (isActivityRequest(userMessage)) {
    // If activities were already shown, user wants more → we don't have more
    if (activitiesWereShown(conversationHistory)) {
      return { text: 'Bohužel víc výletů v okolí momentálně nemám. Ale pokud chceš, můžu ti ukázat další nabídky pobytů! 🏨' }
    }
    // If deals were shown (or not), show activities
    return {
      text: 'Jasně! Mrkl jsem, co se dá v okolí podniknout. Tady je pár tipů:',
      activities: getActivities(),
    }
  }

  // After activities were shown: user asks for stay offers → show stays
  if (activitiesWereShown(conversationHistory) && isStayRequest(userMessage)) {
    return {
      text: 'Jasně, tady jsou nabídky pobytů:',
      deals: pickRandomDeals(5),
    }
  }

  // Help / capabilities
  if (fuzzyMatch(userMessage, ['co umis', 'pomoc', 'help', 'co delas', 'jak fungujes', 'co jsi', 'co vse umis', 'co muzes', 'co dokazes', 'co zvladnes'])) {
    return { text: 'Jsem tu, abych ti usnadnil výběr z nabídek na Slevomatu. Řekni mi kam chceš jet, s kolika lidmi, kdy a jakou preferuješ stravu – a já ti najdu to nejlepší! 🏖️' }
  }

  // Thanks
  if (fuzzyMatch(userMessage, ['dekuji', 'diky', 'dik', 'dikes', 'moc dik', 'super dik', 'diky moc', 'dekuju'])) {
    // Only if not providing other info at the same time
    if (msg.length < 20) {
      return { text: 'Rádo se stalo! 😊 Pokud budeš potřebovat cokoliv dalšího, jsem tu pro tebe.' }
    }
  }

  // Post-dislike: user is explaining what was wrong
  const isAfterDislike = lastBotMsg.includes('pomoz mi pochopit') || lastBotMsg.includes('udelal chybku')
  if (isAfterDislike) {
    return { text: 'Rozumím, díky za vysvětlení! Beru si to k srdci a příště budu chytřejší. Chceš, abych to zkusil znovu s jinými nabídkami?' }
  }

  // More offers / different offers
  if (fuzzyMatch(userMessage, ['dalsi nabidky', 'jine nabidky', 'neco jineho', 'dalsi moznosti', 'vice moznosti', 'zkus jine', 'ukaz dalsi', 'jeste dalsi', 'nemas jine', 'vic nabidek', 'jeste neco', 'ukazat jine'])) {
    // Check if the last bot message with content was activities → user wants more activities
    const lastBotWithContent = [...conversationHistory].reverse().find(m => m.sender === 'bot' && (m.activities || m.deals))
    if (lastBotWithContent?.activities) {
      return { text: 'Bohužel víc výletů v okolí momentálně nemám. Ale pokud chceš, můžu ti ukázat další nabídky pobytů! 🏨' }
    }
    return {
      text: 'Jasně, tady je další várka nabídek. Snad tady najdeš, co hledáš:',
      deals: pickRandomDeals(5),
    }
  }

  // Positive confirmation after deals (wants more / activity)
  if (dealsWereShown(conversationHistory) && fuzzyMatch(userMessage, ['super', 'parada', 'skvele', 'nadhera', 'krasne', 'perfektni', 'top', 'to se mi libi'])) {
    return { text: 'To mě těší! 😊 Pokud budeš chtít další nabídky nebo máš jiný dotaz, klidně piš.' }
  }

  // ─── Parameter change detection ──────────────────────────────────

  const paramChange = detectParameterChange(userMessage)

  // ─── State extraction ────────────────────────────────────────────

  const state = extractFullState(conversationHistory)
  const askedFields = getBotAskedFields(conversationHistory)

  // Apply parameter change if detected
  if (paramChange) {
    switch (paramChange.field) {
      case 'location': state.location = paramChange.value; break
      case 'people': state.people = paramChange.value; break
      case 'dates': state.dates = paramChange.value; break
      case 'meals': state.meals = paramChange.value; break
      case 'amenities': state.amenities = paramChange.value; break
    }
    // If all fields are now filled, show deals with updated summary
    const missing = getMissing(state)
    if (missing.length === 0) {
      return buildDealsResponse(state, `Jasně, změněno! Hledám znovu s novými parametry.`)
    }
    return { text: `Jasně, změněno! ${buildMissingQuestions(state, missing)}` }
  }

  // Handle "je mi to jedno" when bot asked about specific fields
  if (isDontCare(userMessage) && askedFields.size > 0) {
    if (askedFields.has('meals') && !state.meals) state.meals = 'bez preference'
    if (askedFields.has('amenities') && !state.amenities) state.amenities = 'bez preference'
    if (askedFields.has('dates') && !state.dates) state.dates = 'kdykoliv'
    if (askedFields.has('people') && !state.people) state.people = 'bez preference'

    // If "je mi to jedno" applies to ALL remaining missing fields
    const remaining = getMissing(state)
    if (remaining.length > 0 && msg.length < 25) {
      // Apply "dont care" to all remaining
      for (const f of remaining) {
        if (f === 'meals' && !state.meals) state.meals = 'bez preference'
        if (f === 'amenities' && !state.amenities) state.amenities = 'bez preference'
        if (f === 'dates' && !state.dates) state.dates = 'kdykoliv'
        if (f === 'people' && !state.people) state.people = 'bez preference'
      }
    }
  }

  // Also extract from the current message (segments for multi-extraction)
  const segments = splitIntoSegments(userMessage)
  const currentAmenities: string[] = []

  for (const seg of segments) {
    const loc = extractLocation(seg)
    const ppl = extractPeople(seg)
    const dt = extractDates(seg)
    const ml = extractMeals(seg)
    const am = extractAmenities(seg)

    if (loc) state.location = loc
    if (ppl) state.people = ppl
    if (dt) state.dates = dt
    if (ml) state.meals = ml
    if (am && am !== 'bez preference') currentAmenities.push(am)
    if (am === 'bez preference') state.amenities = 'bez preference'
  }

  // Also full-message extraction (catches multi-word phrases)
  const fullLoc = extractLocation(userMessage)
  const fullPpl = extractPeople(userMessage)
  const fullDt = extractDates(userMessage)
  const fullMl = extractMeals(userMessage)
  const fullAm = extractAmenities(userMessage)

  if (fullLoc) state.location = fullLoc
  if (fullPpl) state.people = fullPpl
  if (fullDt) state.dates = fullDt
  if (fullMl) state.meals = fullMl
  if (fullAm) {
    if (currentAmenities.length > 0) {
      const unique = [...new Set(currentAmenities.flatMap(a => a.split(', ')))]
      state.amenities = unique.join(', ')
    } else {
      state.amenities = fullAm
    }
  }

  // Handle contextual short answers to bot's questions
  if (askedFields.size > 0 && msg.length < 60) {
    // If bot asked about dates and we didn't extract a date, accept the raw text as date
    if (askedFields.has('dates') && !state.dates && !fullLoc && !fullPpl && !fullMl && !fullAm) {
      if (!isDontCare(userMessage) && msg.length > 2) {
        state.dates = userMessage.trim()
      }
    }
    // If bot asked about meals and we didn't extract, accept raw text
    if (askedFields.has('meals') && !state.meals && !fullLoc && !fullPpl && !fullDt && !fullAm) {
      if (!isDontCare(userMessage) && msg.length > 2) {
        state.meals = userMessage.trim()
      }
    }
    // If bot asked about amenities and we didn't extract, accept raw text
    if (askedFields.has('amenities') && !state.amenities && !fullLoc && !fullPpl && !fullDt && !fullMl) {
      if (!isDontCare(userMessage) && msg.length > 2) {
        state.amenities = userMessage.trim()
      }
    }
  }

  // ─── Off-topic detection (works at ANY point in conversation) ────

  const hasAnyTravelContent = messageHasTravelContent(userMessage)
  const alreadyShowedDeals = dealsWereShown(conversationHistory)

  // If message has no travel content AND is not a short contextual answer, it's off-topic
  if (!hasAnyTravelContent && msg.length > 3 && !msg.match(/^\s*\d+\s*$/) && askedFields.size === 0) {
    // After deals were shown, ALWAYS catch off-topic (don't show more deals)
    if (alreadyShowedDeals) {
      return { text: getOffTopicResponse() }
    }
    // Before deals, catch obvious off-topic (longer messages that aren't answers to bot questions)
    if (msg.length > 8 && !msg.match(/\b(ahoj|cau|hej|hi|hello|zdar|ano|jo|jasne|ok|dobre|nj)\b/)) {
      return { text: getOffTopicResponse() }
    }
  }

  // ─── Determine what's missing and respond ────────────────────────

  // No location yet → ask or detect off-topic
  if (!state.location) {
    if (hasTravelIntent(userMessage)) {
      return { text: 'To zní skvěle! 🏔️ Kam by ses chtěl/a podívat? Třeba Krkonoše, Beskydy, Šumava…?' }
    }
    return { text: 'Super, rád pomůžu! Řekni mi, kam to má být – jaká lokalita tě láká? 🗺️' }
  }

  // Collect missing
  const missing = getMissing(state)

  if (missing.length > 0) {
    // Acknowledge what we understood so far
    const ack = buildAcknowledgement(state, userMessage)
    const questions = buildMissingQuestions(state, missing)
    return { text: `${ack}\n\n${questions}` }
  }

  // ─── All criteria gathered → show deals! ─────────────────────────

  // If deals were already shown and user is providing new travel info (e.g. parameter change without explicit "change" signal)
  if (alreadyShowedDeals) {
    // Check if the current message actually adds NEW information vs. repeating what we already had
    const prevState = extractFullState(conversationHistory.filter(m => !(m.sender === 'user' && m.text === userMessage)))
    const hasNewInfo = (fullLoc && fullLoc !== prevState.location) ||
                       (fullPpl && fullPpl !== prevState.people) ||
                       (fullDt && fullDt !== prevState.dates) ||
                       (fullMl && fullMl !== prevState.meals) ||
                       (fullAm && fullAm !== prevState.amenities)

    if (hasNewInfo) {
      return buildDealsResponse(state, 'Rozumím, hledám s novými parametry!')
    }

    // No new info, but has travel content → user is talking about travel in general
    if (hasAnyTravelContent) {
      return { text: 'Chceš, abych ti ukázal další nabídky? Nebo chceš změnit některý z parametrů? Klidně řekni, co potřebuješ. 😊' }
    }

    // Fallback: off-topic
    return { text: getOffTopicResponse() }
  }

  return buildDealsResponse(state)
}

// ─── Helper functions for response building ────────────────────────

function getMissing(state: ConversationState): string[] {
  const missing: string[] = []
  if (!state.people) missing.push('people')
  if (!state.dates) missing.push('dates')
  if (!state.meals) missing.push('meals')
  if (!state.amenities) missing.push('amenities')
  return missing
}

function buildAcknowledgement(state: ConversationState, currentMessage: string): string {
  const parts: string[] = []
  const hasNewLocation = extractLocation(currentMessage)

  if (hasNewLocation) {
    parts.push(`${state.location} – skvělá volba! 🏔️`)
  }

  // Mention what we already know
  const known: string[] = []
  if (state.location && !hasNewLocation) known.push(`📍 ${state.location}`)
  if (state.people) known.push(`👥 ${state.people}`)
  if (state.dates) known.push(`📅 ${state.dates}`)
  if (state.meals) known.push(`🍽️ ${state.meals}`)
  if (state.amenities && state.amenities !== 'bez preference') known.push(`🏨 ${state.amenities}`)

  if (known.length > 0 && !hasNewLocation) {
    parts.push('Díky, rozumím!')
  }

  return parts.length > 0 ? parts.join(' ') : 'Díky za info!'
}

function buildMissingQuestions(_state: ConversationState, missing: string[]): string {
  const parts: string[] = []

  if (missing.length === 1) {
    // Single missing field → ask nicely
    if (missing[0] === 'people') return 'Ještě mi řekni, kolik vás pojede? 👥'
    if (missing[0] === 'dates') return 'A kdy chceš jet? 📅'
    if (missing[0] === 'meals') return 'Jaké stravování by ti vyhovovalo? (polopenze, plná penze, snídaně, vlastní…) 🍽️'
    if (missing[0] === 'amenities') return 'Je pro tebe důležité nějaké vybavení hotelu? Třeba bazén, wellness, dětský koutek… nebo je ti to jedno? 🏨'
  }

  parts.push('Ještě potřebuji vědět:')
  const questions: string[] = []
  if (missing.includes('people')) questions.push('👥 Kolik vás pojede?')
  if (missing.includes('dates')) questions.push('📅 Kdy chceš jet?')
  if (missing.includes('meals')) questions.push('🍽️ Jaké stravování? (vlastní, snídaně, polopenze, plná penze, all inclusive)')
  if (missing.includes('amenities')) questions.push('🏨 Vybavení hotelu? (bazén, wellness, dětský koutek, pet friendly… nebo je ti to jedno)')

  parts.push(questions.join('\n'))
  if (missing.length > 1) parts.push('\nKlidně napiš vše najednou v jedné zprávě!')

  return parts.join('\n\n')
}

function buildDealsResponse(state: ConversationState, prefix?: string): BotResponse {
  const summaryParts: string[] = []
  summaryParts.push(`📍 ${state.location}`)
  if (state.people && state.people !== 'bez preference') summaryParts.push(`👥 ${state.people}`)
  if (state.dates && state.dates !== 'kdykoliv') summaryParts.push(`📅 ${state.dates}`)
  if (state.meals && state.meals !== 'bez preference') summaryParts.push(`🍽️ ${state.meals}`)
  if (state.amenities && state.amenities !== 'bez preference') summaryParts.push(`🏨 ${state.amenities}`)

  const summary = summaryParts.join('\n')
  const intro = prefix || 'Paráda, mám vše!'

  return {
    text: `${intro}\n\n${summary}\n\nNašel jsem podle toho, co ti nejvíc sedne.`,
    deals: pickRandomDeals(5),
  }
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useChatbot(isOpen?: boolean) {
  const { messages, setMessages, inputValue, setInputValue, isTyping, setIsTyping, typingText, setTypingText, nextIdRef } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [isOpen])

  const sendMessageInternal = useCallback((text: string) => {
    if (!text || isTyping) return

    const userMsgId = nextIdRef.current++
    const newMessages: ChatMessage[] = [...messages, { id: userMsgId, text, sender: 'user' }]
    setMessages(newMessages)
    setInputValue('')

    const response = getBotResponse(text, newMessages)
    const hasContent = response.deals || response.activities
    const typingLabel = hasContent ? getSearchTypingText() : getThinkingTypingText()

    setIsTyping(true)
    setTypingText(typingLabel)

    const baseDelay = hasContent ? 1200 : 800
    const delay = baseDelay + Math.random() * 800

    setTimeout(() => {
      const botMsgId = nextIdRef.current++
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: response.text,
        sender: 'bot',
        deals: response.deals,
        activities: response.activities,
      }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [isTyping, messages, setMessages, setInputValue, setIsTyping, setTypingText, nextIdRef])

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
  }, [isTyping, setIsTyping, setTypingText, setMessages, nextIdRef])

  const handleFeedback = useCallback((type: 'up' | 'down') => {
    setIsTyping(true)
    setTypingText(getThinkingTypingText())

    const delay = 600 + Math.random() * 600

    setTimeout(() => {
      const botMsgId = nextIdRef.current++
      const text = type === 'up'
        ? 'Děkuju, to je milé.'
        : 'To mne mrzí. Pomoz mi pochopit, kde jsem udělal chybku. Školím se a ty mi pomůžeš být příště lepším.'
      const image = type === 'up'
        ? `${import.meta.env.BASE_URL}assets/like.png`
        : `${import.meta.env.BASE_URL}assets/dislike.png`
      setMessages(prev => [...prev, { id: botMsgId, text, sender: 'bot', image }])
      setIsTyping(false)
      setTypingText('')
    }, delay)
  }, [setIsTyping, setTypingText, setMessages, nextIdRef])

  // ─── Quick Tags (contextual shortcuts above input) ──────────────
  const quickTags: { label: string; value: string }[] = (() => {
    if (isTyping) return []
    if (messages.length === 0) return []

    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || lastMsg.sender !== 'bot') return []

    const lastBotText = norm(lastMsg.text)

    if (lastBotText.includes('pomoz mi pochopit') || lastBotText.includes('udelal chybku')) {
      return [
        { label: '💰 Příliš drahé', value: 'Příliš drahé' },
        { label: '📍 Moc daleko', value: 'Moc daleko' },
        { label: '📋 Málo nabídek', value: 'Málo nabídek' },
      ]
    }

    if (lastBotText.includes('beru si to k srdci') || lastBotText.includes('zkusil znovu')) {
      return [
        { label: '👍 Ano', value: 'Ano' },
      ]
    }

    if (
      lastBotText.includes('kolik vas') || lastBotText.includes('kolik') ||
      lastBotText.includes('kdy chces') || lastBotText.includes('termin') ||
      lastBotText.includes('stravovan') || lastBotText.includes('jake stravovan') ||
      lastBotText.includes('vybaveni hotel') ||
      lastBotText.includes('potrebuji vedet')
    ) {
      return [
        { label: '🤷 Je mi to jedno', value: 'Je mi to jedno' },
      ]
    }

    if (dealsWereShown(messages)) {
      return [
        { label: '🗺️ Chci výlety v okolí', value: 'Chci výlety v okolí' },
        { label: '📦 Více nabídek', value: '__fakedoor__' },
      ]
    }

    return []
  })()

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    typingText,
    messagesEndRef,
    scrollContainerRef,
    sendMessage,
    sendMessageWithText,
    handleKeyDown,
    handleFeedback,
    handleDisclaimer,
    quickTags,
  }
}
