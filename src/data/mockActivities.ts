export interface ActivityCard {
  id: string
  image: string
  title: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  provider: string
  location: string
}

const BASE = import.meta.env.BASE_URL

export const allActivities: ActivityCard[] = [
  {
    id: 'a1',
    image: `${BASE}assets/activities/a1.jpeg`,
    title: 'Let balónem pro 2 osoby nad Krkonošemi',
    price: 4990,
    originalPrice: 5990,
    discount: 16,
    rating: 4.8,
    reviewCount: 214,
    provider: 'Balóny nad Krkonošemi',
    location: 'Špindlerův Mlýn',
  },
  {
    id: 'a2',
    image: `${BASE}assets/activities/a2.jpeg`,
    title: '2 hodiny bowlingu s občerstvením ve Špindlu',
    price: 690,
    originalPrice: 890,
    discount: 22,
    rating: 4.5,
    reviewCount: 87,
    provider: 'Bowling Špindl Arena',
    location: 'Špindlerův Mlýn',
  },
]

export function getActivities(): ActivityCard[] {
  return [...allActivities]
}
