export interface DealCard {
  id: string
  image: string
  title: string
  price: number
  rating: number
  reviewCount: number
  provider: string
  distance: string
}

// Reliable Unsplash images for each category
const IMG = {
  spa1: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
  spa2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
  spa3: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop',
  mountain1: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  mountain2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  mountain3: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop',
  restaurant1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  restaurant2: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  restaurant3: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
  chalet1: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop',
  chalet2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  romantic1: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop',
  romantic2: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
  family1: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop',
  family2: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop',
  sport1: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=300&fit=crop',
  sport2: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=300&fit=crop',
}

export const wellnessDeals: DealCard[] = [
  {
    id: 'w1',
    image: IMG.spa1,
    title: 'Resort Špindl pod Medvědínem: jídlo i aquapark',
    price: 5760,
    rating: 5.0,
    reviewCount: 255,
    provider: 'Resort Špindl - Špindlerův Mlýn',
    distance: 'cca 150 km / 2 h',
  },
  {
    id: 'w2',
    image: IMG.spa2,
    title: 'Pobyt ve Špindlerově Mlýně s polopenzí a wellness',
    price: 6344,
    rating: 4.7,
    reviewCount: 876,
    provider: 'Hotel Lesana - Špindlerův Mlýn',
    distance: 'cca 150 km / 2 h',
  },
  {
    id: 'w3',
    image: IMG.spa3,
    title: 'Wellness Hotel Nové Lázně: relaxační víkend',
    price: 4890,
    rating: 4.8,
    reviewCount: 432,
    provider: 'Nové Lázně - Mariánské Lázně',
    distance: 'cca 180 km / 2,5 h',
  },
]

export const krkonoseDeals: DealCard[] = [
  {
    id: 'k1',
    image: IMG.mountain1,
    title: 'Resort Špindl pod Medvědínem: jídlo i aquapark',
    price: 5760,
    rating: 5.0,
    reviewCount: 255,
    provider: 'Resort Špindl - Špindlerův Mlýn',
    distance: 'cca 150 km / 2 h',
  },
  {
    id: 'k2',
    image: IMG.mountain2,
    title: 'Pobyt v Harrachově s wellness a polopenzí',
    price: 3990,
    rating: 4.5,
    reviewCount: 312,
    provider: 'Hotel Sklář - Harrachov',
    distance: 'cca 140 km / 2 h',
  },
  {
    id: 'k3',
    image: IMG.mountain3,
    title: 'Horský wellness pobyt v srdci Krkonoš',
    price: 4490,
    rating: 4.6,
    reviewCount: 189,
    provider: 'Hotel Pecr - Pec pod Sněžkou',
    distance: 'cca 160 km / 2,5 h',
  },
]

export const restaurantDeals: DealCard[] = [
  {
    id: 'r1',
    image: IMG.restaurant1,
    title: 'Degustační menu pro 2 v La Degustation',
    price: 2990,
    rating: 4.9,
    reviewCount: 312,
    provider: 'La Degustation - Praha 1',
    distance: 'cca 5 km / 15 min',
  },
  {
    id: 'r2',
    image: IMG.restaurant2,
    title: 'Zážitková večeře s vinným párováním',
    price: 1890,
    rating: 4.6,
    reviewCount: 198,
    provider: 'Bellevue Restaurant - Praha',
    distance: 'cca 3 km / 10 min',
  },
  {
    id: 'r3',
    image: IMG.restaurant3,
    title: '5chodové menu s výhledem na Prahu',
    price: 2490,
    rating: 4.8,
    reviewCount: 156,
    provider: 'Aureole Fusion - Praha 8',
    distance: 'cca 8 km / 20 min',
  },
]

export const travelDeals: DealCard[] = [
  {
    id: 't1',
    image: IMG.chalet1,
    title: 'Romantický pobyt na zámku Chateau Herálec',
    price: 3490,
    rating: 4.9,
    reviewCount: 423,
    provider: 'Chateau Herálec - Vysočina',
    distance: 'cca 120 km / 1,5 h',
  },
  {
    id: 't2',
    image: IMG.chalet2,
    title: 'Horská chata v Beskydech s polopenzí',
    price: 2890,
    rating: 4.4,
    reviewCount: 267,
    provider: 'Chata Prašivá - Beskydy',
    distance: 'cca 300 km / 3,5 h',
  },
  {
    id: 't3',
    image: IMG.mountain3,
    title: 'Pobyt v Českém ráji s výlety a wellness',
    price: 3290,
    rating: 4.7,
    reviewCount: 345,
    provider: 'Hotel & Resort Nový Svět',
    distance: 'cca 100 km / 1,5 h',
  },
]

export const romanticDeals: DealCard[] = [
  {
    id: 'ro1',
    image: IMG.romantic1,
    title: 'Romantický wellness víkend pro dva',
    price: 4290,
    rating: 4.8,
    reviewCount: 534,
    provider: 'Chateau St. Havel - Praha',
    distance: 'cca 10 km / 20 min',
  },
  {
    id: 'ro2',
    image: IMG.romantic2,
    title: 'Večeře při svíčkách a privátní spa',
    price: 3690,
    rating: 4.7,
    reviewCount: 289,
    provider: 'Wine & Spa Resort - Lednice',
    distance: 'cca 250 km / 2,5 h',
  },
  {
    id: 'ro3',
    image: IMG.spa1,
    title: 'Luxusní pobyt s degustací a masáží',
    price: 5190,
    rating: 4.9,
    reviewCount: 178,
    provider: 'Savoy Hotel - Karlovy Vary',
    distance: 'cca 130 km / 1,5 h',
  },
]

export const familyDeals: DealCard[] = [
  {
    id: 'f1',
    image: IMG.family1,
    title: 'Rodinný pobyt s aquaparkem a animacemi',
    price: 6990,
    rating: 4.6,
    reviewCount: 412,
    provider: 'Aquapalace Hotel - Praha',
    distance: 'cca 15 km / 25 min',
  },
  {
    id: 'f2',
    image: IMG.family2,
    title: 'Dětský ráj: pobyt s all-inclusive programem',
    price: 5490,
    rating: 4.5,
    reviewCount: 367,
    provider: 'Family Resort - Lipno',
    distance: 'cca 200 km / 2,5 h',
  },
  {
    id: 'f3',
    image: IMG.spa2,
    title: 'Rodinný wellness se saunovým světem',
    price: 4790,
    rating: 4.7,
    reviewCount: 234,
    provider: 'Hotel Nová Živohošť',
    distance: 'cca 60 km / 1 h',
  },
]

export const sportDeals: DealCard[] = [
  {
    id: 's1',
    image: IMG.sport1,
    title: 'Lyžařský pobyt s wellness a skipasem',
    price: 4590,
    rating: 4.5,
    reviewCount: 289,
    provider: 'Hotel Start - Špindlerův Mlýn',
    distance: 'cca 150 km / 2 h',
  },
  {
    id: 's2',
    image: IMG.sport2,
    title: 'Golfový balíček s ubytováním a green fee',
    price: 3890,
    rating: 4.6,
    reviewCount: 156,
    provider: 'Ještěd Golf Resort - Liberec',
    distance: 'cca 110 km / 1,5 h',
  },
  {
    id: 's3',
    image: IMG.chalet2,
    title: 'Cyklistický víkend v Jeseníkách',
    price: 2690,
    rating: 4.4,
    reviewCount: 198,
    provider: 'Hotel Praděd - Jeseníky',
    distance: 'cca 280 km / 3 h',
  },
]

export const cheapDeals: DealCard[] = [
  {
    id: 'ch1',
    image: IMG.mountain3,
    title: 'Wellness víkend v Jizerských horách',
    price: 1890,
    rating: 4.3,
    reviewCount: 567,
    provider: 'Pension Jizera - Bedřichov',
    distance: 'cca 120 km / 1,5 h',
  },
  {
    id: 'ch2',
    image: IMG.chalet1,
    title: 'Pobyt na chatě s polopenzí',
    price: 1490,
    rating: 4.2,
    reviewCount: 234,
    provider: 'Chata u Potoka - Šumava',
    distance: 'cca 180 km / 2 h',
  },
  {
    id: 'ch3',
    image: IMG.restaurant3,
    title: 'Degustační menu pro 2 s vínem',
    price: 990,
    rating: 4.5,
    reviewCount: 445,
    provider: 'Vinný Bar U Tří Knížat - Brno',
    distance: 'cca 210 km / 2 h',
  },
]
