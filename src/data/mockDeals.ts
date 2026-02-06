export interface DealCard {
  id: string
  image: string
  title: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  ratingLabel?: string
  reviewCount: number
  provider: string
  location: string
  distance: string
}

const BASE = import.meta.env.BASE_URL

// All 11 real deals – chatbot randomly picks 5 for each recommendation
export const allDeals: DealCard[] = [
  {
    id: 'd1',
    image: `${BASE}assets/deals/d1.jpg`,
    title: 'Pobyt ve Špindlerově Mlýně s polopenzí a wellness',
    price: 2290,
    rating: 4.4,
    reviewCount: 3330,
    provider: 'Hotel Lesana',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd2',
    image: `${BASE}assets/deals/d2.jpg`,
    title: 'Relax ve Špindlu: jídlo, bazén a neomezený wellness',
    price: 3980,
    originalPrice: 4200,
    discount: 5,
    rating: 4.6,
    ratingLabel: 'Skvělé',
    reviewCount: 261,
    provider: 'Hotel Adam',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd3',
    image: `${BASE}assets/deals/d3.jpg`,
    title: 'Pobyt ve Vrchlabí: možnost wellness i romantické večeře',
    price: 2540,
    originalPrice: 2978,
    discount: 14,
    rating: 4.7,
    ratingLabel: 'Skvělé',
    reviewCount: 309,
    provider: 'Wellness hotel Gendorf',
    location: 'Krkonoše',
    distance: 'cca 25 km / 30 min',
  },
  {
    id: 'd4',
    image: `${BASE}assets/deals/d4.jpg`,
    title: 'Pobyt ve Špindlerově Mlýně s polopenzí i wellness',
    price: 6580,
    rating: 4.7,
    ratingLabel: 'Skvělé',
    reviewCount: 455,
    provider: 'Hotel Astra',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd5',
    image: `${BASE}assets/deals/d5.jpg`,
    title: 'Horský hotel u Pece pod Sněžkou s jídlem a wellness',
    price: 1899,
    originalPrice: 2900,
    discount: 34,
    rating: 4.7,
    ratingLabel: 'Skvělé',
    reviewCount: 67,
    provider: 'Hotel Tetřeví Boudy',
    location: 'Krkonoše',
    distance: 'cca 30 km / 30 min',
  },
  {
    id: 'd6',
    image: `${BASE}assets/deals/d6.jpg`,
    title: 'Pobyt ve Špindlu s polopenzí a neomezeným wellness',
    price: 5990,
    originalPrice: 6660,
    discount: 10,
    rating: 4.5,
    reviewCount: 928,
    provider: 'Hotel Praha****',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd7',
    image: `${BASE}assets/deals/d7.jpg`,
    title: 'Wellness pobyt v Peci pod Sněžkou s polopenzí',
    price: 3290,
    rating: 4.7,
    ratingLabel: 'Skvělé',
    reviewCount: 457,
    provider: 'Bouda Máma',
    location: 'Pec pod Sněžkou',
    distance: 'cca 60 km / 1 h 15 min',
  },
  {
    id: 'd8',
    image: `${BASE}assets/deals/d8.jpg`,
    title: 'Resort Špindl pod Medvědínem: jídlo i aquapark',
    price: 2600,
    rating: 4.6,
    reviewCount: 2,
    provider: 'Resort Špindl (ex. Hotel Aqua Park)',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd9',
    image: `${BASE}assets/deals/d9.jpg`,
    title: 'Pobyt ve Špindlu až pro 5 osob: jídlo i wellness',
    price: 1790,
    rating: 4.6,
    ratingLabel: 'Skvělé',
    reviewCount: 619,
    provider: 'Alpský Hotel',
    location: 'Špindlerův Mlýn',
    distance: 'cca 40 km / 45 min',
  },
  {
    id: 'd10',
    image: `${BASE}assets/deals/d10.jpg`,
    title: 'Pobyt v Krkonoších: jídlo i neomezený wellness',
    price: 2290,
    originalPrice: 2744,
    discount: 16,
    rating: 4.5,
    reviewCount: 695,
    provider: 'Grund Resort ****',
    location: 'Krkonoše',
    distance: 'cca 45 km / 1 h',
  },
  {
    id: 'd11',
    image: `${BASE}assets/deals/d11.jpg`,
    title: 'Harrachov: apartmán s vlastní vířivkou i saunou, jídlo',
    price: 8190,
    originalPrice: 8506,
    discount: 3,
    rating: 4.9,
    ratingLabel: 'Mimořádné',
    reviewCount: 310,
    provider: 'GRAND Harrachov Pension',
    location: 'Harrachov',
    distance: 'cca 35 km / 30 min',
  },
]

/** Pick `count` random deals from the pool without repeating */
export function pickRandomDeals(count: number = 5): DealCard[] {
  const shuffled = [...allDeals].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
