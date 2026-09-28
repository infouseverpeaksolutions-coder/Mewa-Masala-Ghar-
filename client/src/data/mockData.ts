export interface MockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  reviewCount?: number | string;
  image: string;
  link: string;
  weight?: string;
  isBestseller?: boolean;
}

export interface MockCategory {
  id: string;
  name: string;
  image: string;
  link: string;
}

export interface MockReview {
  id: string;
  name: string;
  city: string;
  comment: string;
  rating: number;
  avatar: string;
}

export const HERO_CONTENT = {
  headlineTop: 'Crafted by Nature,',
  headlineToBottom: 'Trusted by Generations of Families',
  supportingLine: 'Premium quality dry fruits, makhana, seeds, spices and healthy foods for a better you.',
  ctaText: 'Shop Now',
  ctaLink: '/shop',
  videoDesktop: '/Nuts_and_raisins_floating_orbiting_20260926133918.mp4',
  videoMobile: '/hero-mobile.mp4',
  posterDesktop: '/hero-poster.jpg',
  posterMobile: '/hero-poster-mobile.jpg',
};

export const TRUST_ROW_ITEMS = [
  { id: 'veg', label: '100% Veg', icon: 'veg' },
  { id: 'colours', label: 'No Artificial Colours', icon: 'colours' },
  { id: 'roasted', label: 'Roasted Not Fried', icon: 'roasted' },
  { id: 'flour', label: 'Stone-Ground Flour', icon: 'flour' },
  { id: 'delivery', label: 'Pan-India Delivery', icon: 'delivery' },
];

export const CATEGORIES_DATA: MockCategory[] = [
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    image: '/foods/foods_dryfruits.jpg',
    link: '/shop?category=dry-fruits',
  },
  {
    id: 'seeds',
    name: 'Seeds',
    image: '/foods/foods_seeds.jpg',
    link: '/shop?category=seeds-mixes',
  },
  {
    id: 'makhana',
    name: 'Makhana',
    image: '/foods/foods_makhana.jpg',
    link: '/shop?category=makhana',
  },
  {
    id: 'spices',
    name: 'Spices',
    image: '/foods/foods_spices.jpg',
    link: '/shop?category=spices-seasonings',
  },
  {
    id: 'aataa-flour',
    name: 'Aataa (Flour)',
    image: '/categories/flour_aata.jpg',
    link: '/shop?category=specialty-flours',
  },
];

export const DRY_FRUITS_PRODUCTS: MockProduct[] = [
  {
    id: 'kaju',
    name: 'Kaju',
    category: 'Dry Fruits',
    price: 799,
    rating: 4.8,
    image: '/products/dry-fruits/cashews_kaju.jpg',
    link: '/product/king-size-w240-kaju-cashews',
  },
  {
    id: 'pista',
    name: 'Pista',
    category: 'Dry Fruits',
    price: 899,
    rating: 4.8,
    image: '/products/dry-fruits/pistachios_pista.jpg',
    link: '/product/afghan-roasted-salted-pista',
  },
  {
    id: 'anjeer',
    name: 'Anjeer',
    category: 'Dry Fruits',
    price: 749,
    rating: 4.7,
    image: '/products/dry-fruits/figs_anjeer.jpg',
    link: '/product/sun-dried-turkish-anjeer-figs',
  },
  {
    id: 'akhrot',
    name: 'Akhrot',
    category: 'Dry Fruits',
    price: 699,
    rating: 4.7,
    image: '/products/dry-fruits/walnuts_akhrot.jpg',
    link: '/product/kashmiri-snow-white-akhrot-giri-walnuts',
  },
  {
    id: 'kismis',
    name: 'Kismis',
    category: 'Dry Fruits',
    price: 499,
    rating: 4.6,
    image: '/products/dry-fruits/raisins_kismis.jpg',
    link: '/product/golden-long-afghan-kismis-raisins',
  },
  {
    id: 'badam',
    name: 'Badam',
    category: 'Dry Fruits',
    price: 749,
    rating: 4.8,
    image: '/products/dry-fruits/almonds_badam.jpg',
    link: '/product/royal-california-badam-almonds',
  },
  {
    id: 'mix-dry-fruits',
    name: 'Mix Dry Fruits',
    category: 'Dry Fruits',
    price: 899,
    rating: 4.7,
    image: '/products/dry-fruits/royal_panch_mewa.jpg',
    link: '/product/royal-panch-mewa-dry-fruit-mix',
  },
];

export const COMBO_PACKS_BANNER = {
  title: 'Combo Packs',
  subtitle: 'of 2 / 4 / 6',
  ctaText: 'Shop Now →',
  image: '/foods/foods_combos.jpg',
  link: '/shop?combo=true',
};

export const FLAVOURED_MAKHANA_PANELS = [
  {
    id: 'peri-peri',
    name: 'Peri-Peri Makhana',
    bgColor: '#8B1E1E',
    image: '/foods/makhana/makhana_peri_peri.jpg',
    link: '/shop?category=makhana',
  },
  {
    id: 'mint-punch',
    name: 'Mint Punch Makhana',
    bgColor: '#2F5D3A',
    image: '/foods/makhana/makhana_mint_punch.jpg',
    link: '/shop?category=makhana',
  },
  {
    id: 'cream-onion',
    name: 'Cream & Onion Makhana',
    bgColor: '#1E6E85',
    image: '/foods/makhana/makhana_cream_onion.jpg',
    link: '/shop?category=makhana',
  },
];

export const SEEDS_AATAA_PRODUCTS: MockProduct[] = [
  {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    category: 'Seeds',
    price: 249,
    image: '/products/seeds-aata/chia_seeds.jpg',
    link: '/product/organic-black-chia-seeds-200g',
  },
  {
    id: 'flax-seeds',
    name: 'Flax Seeds',
    category: 'Seeds',
    price: 199,
    image: '/products/seeds-aata/flax_seeds.jpg',
    link: '/product/organic-roasted-brown-flax-seeds-200g',
  },
  {
    id: 'sunflower-seeds',
    name: 'Sunflower Seeds',
    category: 'Seeds',
    price: 179,
    image: '/products/seeds-aata/sunflower_seeds.jpg',
    link: '/product/raw-hulled-sunflower-seeds-200g',
  },
  {
    id: 'pumpkin-seeds',
    name: 'Pumpkin Seeds',
    category: 'Seeds',
    price: 199,
    image: '/products/seeds-aata/pumpkin_seeds.jpg',
    link: '/product/aaa-grade-green-pumpkin-seeds-200g',
  },
  {
    id: 'mix-seeds',
    name: 'Mix Seeds',
    category: 'Seeds',
    price: 249,
    image: '/products/seeds-aata/mix_seeds.jpg',
    link: '/product/7-in-1-daily-super-seed-mix-200g',
  },
  {
    id: 'wheat-atta',
    name: 'Wheat Atta',
    category: 'Aataa (Flour)',
    price: 299,
    image: '/products/seeds-aata/wheat_atta.jpg',
    link: '/shop?category=specialty-flours',
  },
  {
    id: 'multigrain-atta',
    name: 'Multigrain Atta',
    category: 'Aataa (Flour)',
    price: 349,
    image: '/products/seeds-aata/multigrain_atta.jpg',
    link: '/shop?category=specialty-flours',
  },
];

export const SPICES_PRODUCTS: MockProduct[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    category: 'Spices',
    price: 149,
    image: '/products/spices/haldi.jpg',
    link: '/product/high-curcumin-lakadong-haldi-powder',
  },
  {
    id: 'lal-mirch',
    name: 'Lal Mirch',
    category: 'Spices',
    price: 129,
    image: '/products/spices/lal_mirch.jpg',
    link: '/product/authentic-kashmiri-degi-lal-mirch-powder',
  },
  {
    id: 'dhaniya',
    name: 'Dhaniya',
    category: 'Spices',
    price: 99,
    image: '/products/spices/dhaniya.jpg',
    link: '/product/cold-pounded-green-dhaniya-powder',
  },
];

export const BESTSELLERS_PRODUCTS: MockProduct[] = [
  {
    id: 'bs-cashews',
    name: 'Premium Cashews',
    category: 'Dry Fruits',
    price: 799,
    rating: 4.8,
    reviewCount: '1.2k',
    image: '/products/dry-fruits/cashews_kaju.jpg',
    link: '/product/king-size-w240-kaju-cashews',
  },
  {
    id: 'bs-almonds',
    name: 'Premium Almonds',
    category: 'Dry Fruits',
    price: 749,
    rating: 4.7,
    reviewCount: '980',
    image: '/products/dry-fruits/almonds_badam.jpg',
    link: '/product/royal-california-badam-almonds',
  },
  {
    id: 'bs-makhana',
    name: 'Roasted Makhana',
    category: 'Makhana',
    price: 499,
    rating: 4.6,
    reviewCount: '620',
    image: '/foods/foods_makhana.jpg',
    link: '/product/spicy-peri-peri-roasted-makhana-80g',
  },
  {
    id: 'bs-atta',
    name: 'Multigrain Atta',
    category: 'Aataa (Flour)',
    price: 349,
    rating: 4.8,
    reviewCount: '640',
    image: '/products/seeds-aata/wheat_atta.jpg',
    link: '/shop?category=specialty-flours',
  },
];

export const SISTER_BRAND_BANNER = {
  headline: 'Looking for baby, skincare or pregnancy essentials?',
  subline: 'Discover Jimmi Jaggu, our sister brand.',
  ctaText: 'Explore Jimmi Jaggu →',
  link: '/jimmi-jaggu',
  image: '/categories/baby_products.jpg',
};

export const CUSTOMER_REVIEWS: MockReview[] = [
  {
    id: 'rev-1',
    name: 'Neha S.',
    city: 'Mumbai',
    comment: 'The quality is amazing and packaging is so good. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'rev-2',
    name: 'Rohit K.',
    city: 'Pune',
    comment: 'Fresh, tasty and healthy. My family loves it!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'rev-3',
    name: 'Priya M.',
    city: 'Bengaluru',
    comment: 'Great quality and fast delivery. Will definitely order again.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
];
