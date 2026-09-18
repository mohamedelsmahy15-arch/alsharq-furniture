// بيانات تصنيفات المنتجات — بديهي إضافة منتجات حقيقية لاحقًا بنفس الشكل
// كل تصنيف فيه منتجات تجريبية دلوقتي (نفس صور الباقات) لحد ما تضيف صور منتجاتك الحقيقية

export interface Product {
  id: string
  name: string
  image: string
  note?: string        // ملاحظة قصيرة زي "الأكثر طلباً" أو "خامة زان"
  price: number        // السعر الحالي (بالجنيه)
  originalPrice: number // السعر قبل التخفيض
  inStock: boolean     // متوفر / نفذت الكمية
}

export interface ProductCategory {
  slug: string
  name: string
  heroImage: string
  description: string
  products: Product[]
  relatedCategories: string[]
}

export const productCategories: Record<string, ProductCategory> = {
  bedrooms: {
    slug: 'bedrooms',
    name: 'غرف نوم',
    heroImage: '/product-bedroom.png',
    description:
      'غرف نوم فاخرة بتصاميم متعددة، من الكلاسيك لحد المودرن، بخامات تتحمل سنين الاستخدام اليومي.',
    products: [
      { id: 'bedroom-classic', name: 'غرفة نوم كلاسيك', image: '/packages/complete-home/1-grand-bedroom.png', note: 'خشب زان طبيعي', price: 28000, originalPrice: 35000, inStock: true },
      { id: 'bedroom-modern', name: 'غرفة نوم مودرن', image: '/packages/foundation/1-bedroom.png', note: 'الأكثر طلباً', price: 22000, originalPrice: 28000, inStock: true },
      { id: 'bedroom-guest', name: 'غرفة نوم ضيف', image: '/packages/complete-home/5-guest-bedroom.png', price: 18000, originalPrice: 23000, inStock: true },
      { id: 'bedroom-storage', name: 'تشطيب ودولاب', image: '/packages/foundation/6-storage-solution.png', price: 9500, originalPrice: 13000, inStock: false },
    ],
    relatedCategories: ['kids', 'lounges'],
  },
  corners: {
    slug: 'corners',
    name: 'ركنات',
    heroImage: '/product-corner-sofa.png',
    description:
      'ركنات مودرن بمساحات جلوس واسعة، مثالية لاستقبال الضيوف براحة وفخامة.',
    products: [
      { id: 'corner-l-shape', name: 'ركنة حرف L', image: '/packages/comfort/2-corner-sofa.png', note: 'الأكثر طلباً', price: 16500, originalPrice: 21000, inStock: true },
      { id: 'corner-large', name: 'ركنة كبيرة فاخرة', image: '/packages/complete-home/8-lounge-seating.png', price: 22000, originalPrice: 28000, inStock: true },
      { id: 'corner-accent', name: 'كراسي لكنة', image: '/packages/comfort/8-accent-chairs.png', price: 8500, originalPrice: 11000, inStock: false },
      { id: 'corner-fabric', name: 'ركنة قماش مخمل', image: '/packages/comfort/4-sofa-detail.png', price: 19000, originalPrice: 24500, inStock: true },
    ],
    relatedCategories: ['living-rooms', 'lounges'],
  },
  'living-rooms': {
    slug: 'living-rooms',
    name: 'انتريهات',
    heroImage: '/product-living.png',
    description:
      'انتريهات متكاملة تجمع بين الأناقة والراحة، مناسبة لكل أحجام الصالات.',
    products: [
      { id: 'living-full', name: 'انتريه كامل', image: '/packages/comfort/3-living-full.png', note: 'تصميم مودرن', price: 24000, originalPrice: 31000, inStock: true },
      { id: 'living-complete', name: 'صالة متكاملة', image: '/packages/comfort/7-complete-view.png', note: 'أفضل قيمة', price: 32000, originalPrice: 42000, inStock: true },
      { id: 'living-coffee-table', name: 'طاولة وسط', image: '/packages/comfort/9-coffee-table.png', price: 4500, originalPrice: 6000, inStock: true },
    ],
    relatedCategories: ['corners', 'lounges'],
  },
  lounges: {
    slug: 'lounges',
    name: 'صالونات',
    heroImage: '/packages/complete-home/2-grand-living.png',
    description:
      'صالونات استقبال فاخرة بتصاميم كلاسيك ومودرن، لإطلالة مميزة تليق بضيوفك.',
    products: [
      { id: 'lounge-grand', name: 'صالون كبير فاخر', image: '/packages/complete-home/2-grand-living.png', note: 'أفضل قيمة', price: 38000, originalPrice: 49000, inStock: true },
      { id: 'lounge-entryway', name: 'صالون استقبال', image: '/packages/complete-home/6-entryway.png', price: 26000, originalPrice: 34000, inStock: true },
      { id: 'lounge-artisan', name: 'صالون نحت يدوي', image: '/packages/complete-home/9-artisan-details.png', price: 44000, originalPrice: 57000, inStock: false },
    ],
    relatedCategories: ['corners', 'living-rooms'],
  },
  dining: {
    slug: 'dining',
    name: 'سفر',
    heroImage: '/product-dining.png',
    description:
      'طاولات وسفر بأحجام مختلفة (6 و8 أشخاص)، مناسبة للعائلات والمناسبات.',
    products: [
      { id: 'dining-6', name: 'سفرة 6 كراسي', image: '/packages/foundation/3-dining.png', note: 'الأكثر طلباً', price: 11000, originalPrice: 15000, inStock: true },
      { id: 'dining-8', name: 'سفرة 8 كراسي', image: '/packages/complete-home/3-royal-dining.png', note: 'للمناسبات', price: 17500, originalPrice: 23000, inStock: true },
      { id: 'dining-chairs', name: 'كراسي منجدة', image: '/packages/foundation/8-dining-detail.png', price: 5500, originalPrice: 7500, inStock: false },
    ],
    relatedCategories: ['living-rooms', 'bedrooms'],
  },
  kids: {
    slug: 'kids',
    name: 'غرف أطفال',
    heroImage: '/product-kids.png',
    description:
      'غرف أطفال آمنة ومريحة بألوان وتصاميم تكبر مع أولادك، بخامات صحية ومضمونة.',
    products: [
      { id: 'kids-complete', name: 'غرفة أطفال كاملة', image: '/packages/foundation/2-kids-room.png', note: 'الأكثر طلباً', price: 13500, originalPrice: 18000, inStock: true },
      { id: 'kids-luxury', name: 'غرفة أطفال فاخرة', image: '/packages/complete-home/4-kids-luxury.png', price: 19000, originalPrice: 25000, inStock: true },
      { id: 'kids-corner', name: 'سرير أطفال مع دولاب', image: '/packages/foundation/7-kids-corner.png', price: 8000, originalPrice: 11000, inStock: false },
    ],
    relatedCategories: ['bedrooms', 'dining'],
  },
}

export function getProductCategory(slug: string): ProductCategory | null {
  return productCategories[slug] || null
}

export function getAllProductCategories(): ProductCategory[] {
  return Object.values(productCategories)
}
