import fs from 'node:fs/promises'
import path from 'node:path'
import { db } from '@/lib/db'
import {
  siteSettings as siteSettingsTable,
  packages as packagesTable,
  packageHighlights,
  packageContents,
  packageBenefits,
  packageGallery,
  packageFaq,
  productCategories as productCategoriesTable,
  products as productsTable,
  productGallery,
  productSpecs,
  customerReviews,
  deliveryShowcase,
  packageFurnitureCategories,
  furnitureOptions,
} from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export interface SiteSettingsMap {
  name: string
  logoImage: string
  city: string
  phoneDisplay: string
  whatsapp: string
  whatsappDefaultMessage: string
  address: string
  hours: string
  mapLink: string
  mapEmbed: string
  footerText: string

  // Hero
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroVideo: string
  heroPoster: string
  heroWhatsappText: string
  heroOffersText: string

  // Offers
  offersSectionBadge: string
  offersSectionTitle: string
  offersSectionDesc: string

  // Guarantees (JSON array)
  guarantees: string

  // Why Us
  whyUsBadge: string
  whyUsTitle: string
  whyUsReasons: string

  // Products
  productsComingSoon: string
  productsSectionBadge: string
  productsSectionTitle: string
  productsSectionDesc: string

  // Showcase & Reviews
  showcaseBadge: string
  showcaseTitle: string
  showcaseDesc: string

  // Visit
  visitBadge: string
  visitTitle: string
  visitDesc: string

  [key: string]: string
}

export interface PackageData {
  id: number
  slug: string
  title: string
  titleAr: string
  badge?: string | null
  price: number
  description: string
  descriptionAr: string
  shortDescription: string
  shortDescriptionAr: string
  image: string
  highlightsAr: string[]
  contentsAr: string[]
  benefitsAr: { title: string; description: string; icon?: string }[]
  gallery: string[]
  faqItemsAr: { question: string; answer: string }[]
  sortOrder: number
}

export interface ProductData {
  id: number
  categoryId: number
  name: string
  image: string
  note?: string | null
  price: number
  originalPrice: number
  inStock: boolean
  longDescription: string
  gallery: string[]
  specs: { label: string; value: string }[]
  sortOrder: number
}

export interface CategoryData {
  id: number
  slug: string
  name: string
  heroImage: string
  description: string
  sortOrder: number
}

export interface ReviewData {
  id: number
  customerName: string
  location: string
  quote: string
  rating: number
  poster: string
  videoUrl: string
  showOnSite: boolean
  sortOrder: number
}

export interface DeliveryData {
  id: number
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  packageName: string
  showOnSite: boolean
  sortOrder: number
}

export interface FurnitureOptionData {
  id: number
  categoryId: number
  categorySlug?: string
  name: string
  description: string
  imageUrl: string
  features: string[]
  specs: string[]
  media: string[]
  videoUrl: string
  sortOrder: number
}

export interface FullSiteData {
  settings: SiteSettingsMap
  packages: PackageData[]
  categories: CategoryData[]
  products: ProductData[]
  reviews: ReviewData[]
  deliveries: DeliveryData[]
  furnitureOptions: FurnitureOptionData[]
}

const DEFAULT_SETTINGS: SiteSettingsMap = {
  name: 'الشرق الأوسط للأثاث',
  logoImage: '',
  city: 'الإسكندرية',
  phoneDisplay: '01221250044',
  whatsapp: '201221250044',
  whatsappDefaultMessage: 'السلام عليكم، أرغب في الاستفسار عن الأثاث والعروض المتاحة.',
  address: '3 شارع فرنسا ,المنشية، الإسكندرية\n(ممر الشرق الأوسط)',
  hours: 'يوميًا من 11 صباحًا حتى 11 مساءً',
  mapLink: 'https://maps.app.goo.gl/Qo428sMaCiDVau5E9',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452!2d29.9087!3d31.2001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c3e55b6f7177%3A0x82e69528eb0c5395!2z2YXZg9iq2KjZhyDYp9mE2LTYsdmC+YlYt9mF2Kc!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg',
  footerText: 'جميع الحقوق محفوظة للمعرض.',

  heroBadge: 'معرض الأثاث الأول في الإسكندرية',
  heroTitle: 'بيتك يبدأ من هنا',
  heroDescription: 'غرف نوم، ركنات، انتريهات، سفر، غرف أطفال، صالونات',
  heroVideo: '/hero-video.mp4',
  heroPoster: '/hero-living-room.png',
  heroWhatsappText: 'تواصل عبر واتساب',
  heroOffersText: 'مشاهدة العروض',

  offersSectionBadge: 'باقات البيت الفاخر',
  offersSectionTitle: 'باقات العرسان والأسرة',
  offersSectionDesc: 'اختر الباقة التي تناسبك — كل واحدة مصممة لتحويل بيتك إلى حلم يعيش فيه.',

  guarantees: JSON.stringify([
    { title: 'توصيل وتركيب', description: 'إلى باب منزلك مع تركيب احترافي', icon: 'Truck' },
    { title: 'ضمان على الجودة', description: 'ضمان شامل على جميع المنتجات', icon: 'Shield' },
    { title: 'أنظمة سداد', description: 'خطط دفع مرنة تناسب ميزانيتك', icon: 'CreditCard' },
    { title: 'استشارة مجانية', description: 'فريق متخصص يساعدك في الاختيار', icon: 'Phone' },
  ]),

  whyUsBadge: 'لماذا نحن',
  whyUsTitle: 'لماذا الشرق الأوسط للأثاث؟',
  whyUsReasons: JSON.stringify([
    {
      title: 'الثقة',
      desc: 'سمعة بُنيت على مدار سنوات وآلاف العملاء الراضين عن جودة وخدمة المعرض.',
      icon: 'ShieldCheck',
    },
    {
      title: 'الخامات',
      desc: 'أفضل أنواع الأخشاب والأقمشة المختارة بعناية لتدوم معك لسنوات طويلة.',
      icon: 'Gem',
    },
    {
      title: 'الخبرة',
      desc: 'فريق متخصص في تصميم وتجهيز البيوت يساعدك على اختيار الأنسب لمساحتك.',
      icon: 'Award',
    },
    {
      title: 'خدمة ما بعد البيع',
      desc: 'متابعة وصيانة وضمان حقيقي بعد الاستلام — راحتك تهمنا دائمًا.',
      icon: 'Headphones',
    },
  ]),

  productsComingSoon: 'false',
  productsSectionBadge: 'تشكيلتنا',
  productsSectionTitle: 'منتجاتنا',
  productsSectionDesc: 'كل ما يحتاجه بيتك من قطع أثاث فاخرة بأفضل الخامات وأدق التفاصيل.',

  showcaseBadge: 'ثقة تتسلمها بإيدك',
  showcaseTitle: 'شغلنا وقت التسليم وآراء عملائنا',
  showcaseDesc: 'شوف النتيجة الحقيقية واسمع من عملائنا قبل ما تاخد قرارك.',

  visitBadge: 'زرنا الآن',
  visitTitle: 'المعرض',
  visitDesc: 'ندعوك لزيارة المعرض ومعاينة القطع على الطبيعة، أو تواصل معنا مباشرة عبر الواتساب.',
}

const DEFAULT_PACKAGES: PackageData[] = [
  {
    id: 1,
    slug: 'foundation',
    title: 'Foundation Package',
    titleAr: '🥉 باقة التأسيس',
    badge: null,
    price: 65,
    description: 'Start your home essentials with the best value',
    descriptionAr: 'ابدأ بيتك بأهم احتياجاته بأفضل قيمة',
    shortDescription: 'Basic modern setup for bedroom, kids room and dining',
    shortDescriptionAr: 'تأسيس متكامل يشمل غرفة نوم، غرفة أطفال، وسفرة 6 كراسي',
    image: '/package-1-collage.png',
    highlightsAr: [
      'غرفة نوم مودرن كاملة',
      'غرفة أطفال كاملة',
      'سفرة 6 كراسي',
      'خامات مختارة بعناية',
      'ضمان على الجودة',
    ],
    contentsAr: [
      'غرفة نوم كاملة (دولاب + سرير + تسريحة + 2 كومود)',
      'غرفة أطفال كاملة (دولاب + 2 سرير + كومود)',
      'سفرة كاملة مع 6 كراسي متينة',
    ],
    benefitsAr: [
      { title: 'توفير حقيقي', description: 'سعر الباقة أوفر بنسبة كبيرة من شراء كل غرفة لوحدها' },
      { title: 'جودة وخامات ممتازة', description: 'أخشاب زان طبيعي وتشطيبات بأعلى معايير الدقة' },
      { title: 'توصيل وتركيب', description: 'فريق محترف يقوم بالتسليم والتركيب في منزلك' },
    ],
    gallery: [
      '/packages/foundation/1-bedroom.png',
      '/packages/foundation/2-kids-room.png',
      '/packages/foundation/3-dining.png',
      '/packages/foundation/4-detail-wood.png',
      '/packages/foundation/5-craftsmanship.png',
      '/packages/foundation/6-storage-solution.png',
    ],
    faqItemsAr: [
      {
        question: 'هل يمكن تعديل ألوان أو مقاسات الغرف؟',
        answer: 'نعم بالتأكيد، يمكنك اختيار درجات الألوان ونوع الأقمشة والمقاسات بما يناسب مساحة بيتك.',
      },
      {
        question: 'ما هي مدة التسليم؟',
        answer: 'يتم التسليم خلال المدة المتفق عليها في العقد مع الالتزام التام بالمواعيد.',
      },
    ],
    sortOrder: 1,
  },
  {
    id: 2,
    slug: 'comfort',
    title: 'Comfort Package',
    titleAr: '🥈 باقة الراحة',
    badge: '⭐ الأكثر اختياراً',
    price: 85,
    description: 'Everything you need to live comfortably from day one',
    descriptionAr: 'كل ما تحتاجه لتعيش براحة من أول يوم',
    shortDescription: 'Full setup plus modern corner or luxury salon',
    shortDescriptionAr: 'كل محتويات التأسيس بالإضافة لركنة مودرن فخمة أو انتريه متكامل',
    image: '/package-2-collage.png',
    highlightsAr: [
      'كل محتويات باقة التأسيس',
      'ركنة مودرن أو انتريه فاخر',
      'أفضل قيمة مقابل السعر',
      'توصيل وتركيب مجاني',
    ],
    contentsAr: [
      'غرفة نوم مودرن رئيسية متكاملة',
      'غرفة أطفال/شباب كاملة',
      'سفرة عصرية مع كراسي مريحة',
      'ركنة مريحة جداً أو طقم انتريه فاخر',
    ],
    benefitsAr: [
      { title: 'أعلى راحة ممكنة', description: 'إسفنج عالي الكثافة وأقمشة معالجة ضد الاتساخ' },
      { title: 'تنسيق ألوان متكامل', description: 'تطابق انسيابي بين ألوان الصالة وغرف النوم' },
      { title: 'خدمة صيانة ومتابعة', description: 'ضمان شامل ومتابعة دورية بعد الاستلام' },
    ],
    gallery: [
      '/packages/comfort/1-hero-living.png',
      '/packages/comfort/2-corner-sofa.png',
      '/packages/comfort/3-living-full.png',
      '/packages/comfort/4-sofa-detail.png',
      '/packages/comfort/5-bedroom-set.png',
      '/packages/comfort/6-dining-comfort.png',
    ],
    faqItemsAr: [
      {
        question: 'هل الركنة قابلة للفك والتركيب بسهولة؟',
        answer: 'نعم، مصممة بأنظمة شاسيهات ذكية لسهولة النقل والتنظيف.',
      },
    ],
    sortOrder: 2,
  },
  {
    id: 3,
    slug: 'complete-home',
    title: 'Complete Home Package',
    titleAr: '🥇 باقة البيت الكامل',
    badge: '👑 أفضل قيمة',
    price: 115,
    description: 'Furnish your entire home with royal luxury',
    descriptionAr: 'تأثيث المنزل بالكامل بأفضل قيمة مقابل السعر',
    shortDescription: 'Bedroom + Kids + Dining + Corner + Living salon',
    shortDescriptionAr: 'تأثيث شامل لكل ركن في بيتك بأعلى مواصفات الرفاهية',
    image: '/package-3-living.png',
    highlightsAr: [
      'غرفة نوم ماستر فخمة',
      'غرفة أطفال مودرن',
      'سفرة كلاسيك أو مودرن راقية',
      'ركنة كبيرة + انتريه استقبال',
      'توفير استثنائي مقارنة بالشراء المنفرد',
    ],
    contentsAr: [
      'غرفة نوم ماستر ملكية كاملة',
      'غرفة أطفال/شباب راقية بتشطيب ممتاز',
      'سفرة 8 كراسي مع نيش وبوفيه',
      'ركنة استقبال حرف L أو انتريه كامل',
      'صالون إضافي بتصميم استثنائي',
    ],
    benefitsAr: [
      { title: 'بيت كامل جاهز', description: 'استلم شقتك مفروشة بالكامل دون أي تعب أو حيرة' },
      { title: 'أعلى توفير مالي', description: 'خصم خاص جداً وتوفير يتجاوز 30% من الأسعار الفردية' },
    ],
    gallery: [
      '/packages/complete-home/1-grand-bedroom.png',
      '/packages/complete-home/2-grand-living.png',
      '/packages/complete-home/3-royal-dining.png',
      '/packages/complete-home/4-kids-luxury.png',
      '/packages/complete-home/5-guest-bedroom.png',
    ],
    faqItemsAr: [
      {
        question: 'هل يمكن الدفع بنظام التقسيط؟',
        answer: 'نعم يتوفر لدينا أنظمة سداد ودفع مرنة تناسب ميزانيتك.',
      },
    ],
    sortOrder: 3,
  },
]

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: 1,
    slug: 'bedrooms',
    name: 'غرف نوم',
    heroImage: '/product-bedroom.png',
    description: 'غرف نوم فاخرة بتصاميم متعددة، من الكلاسيك للمودرن، بخامات تدوم لسنوات.',
    sortOrder: 1,
  },
  {
    id: 2,
    slug: 'corners',
    name: 'ركنات',
    heroImage: '/product-corner-sofa.png',
    description: 'ركنات مودرن بمساحات جلوس واسعة وأقمشة مريحة وعملية.',
    sortOrder: 2,
  },
  {
    id: 3,
    slug: 'living-rooms',
    name: 'انتريهات',
    heroImage: '/product-living.png',
    description: 'انتريهات متكاملة تجمع بين الأناقة والراحة، مناسبة لكافة المساحات.',
    sortOrder: 3,
  },
  {
    id: 4,
    slug: 'kids',
    name: 'غرف أطفال وشباب',
    heroImage: '/product-kids.png',
    description: 'غرف أطفال عصرية ومبهجة مع حلول تخزين ذكية وعملية.',
    sortOrder: 4,
  },
  {
    id: 5,
    slug: 'dining',
    name: 'سفرة وترابيزات',
    heroImage: '/product-dining.png',
    description: 'سفرات راقية بكراسي مريحة وأخشاب زان قوية للمناسبات والجمعات.',
    sortOrder: 5,
  },
]

const DEFAULT_PRODUCTS: ProductData[] = [
  {
    id: 1,
    categoryId: 1,
    name: 'غرفة نوم كلاسيك ملكية',
    image: '/packages/complete-home/1-grand-bedroom.png',
    note: 'خشب زان طبيعي',
    price: 28000,
    originalPrice: 35000,
    inStock: true,
    longDescription: 'غرفة نوم كاملة مصنوعة من خشب الزان الروماني، بتشطيب دوكو فاخر واكسسوارات مستوردة.',
    gallery: ['/packages/complete-home/1-grand-bedroom.png', '/packages/foundation/1-bedroom.png'],
    specs: [
      { label: 'الخامة', value: 'خشب زان أحمر طبيعي' },
      { label: 'الضمان', value: '5 سنوات شامل' },
    ],
    sortOrder: 1,
  },
  {
    id: 2,
    categoryId: 1,
    name: 'غرفة نوم مودرن أنيقة',
    image: '/packages/foundation/1-bedroom.png',
    note: 'الأكثر طلباً',
    price: 22000,
    originalPrice: 28000,
    inStock: true,
    longDescription: 'تصميم أوروبي انسيابي مع إضاءة ليد مخفية وسرير كابوتنيه فاخر.',
    gallery: ['/packages/foundation/1-bedroom.png'],
    specs: [{ label: 'الخامة', value: 'MDF تايلاندي مع زان' }],
    sortOrder: 2,
  },
  {
    id: 3,
    categoryId: 2,
    name: 'ركنة حرف L مودرن',
    image: '/packages/comfort/2-corner-sofa.png',
    note: 'أقمشة ضد الاتساخ',
    price: 16500,
    originalPrice: 21000,
    inStock: true,
    longDescription: 'ركنة عصرية مريحة جداً تناسب الاستخدام اليومي مع إسفنج سوفت ريبوند طبي.',
    gallery: ['/packages/comfort/2-corner-sofa.png', '/packages/comfort/4-sofa-detail.png'],
    specs: [
      { label: 'القماش', value: 'كتان تركي معالج' },
      { label: 'المقاس', value: '3 متر × 2 متر' },
    ],
    sortOrder: 3,
  },
  {
    id: 4,
    categoryId: 3,
    name: 'انتريه فاخر كامل',
    image: '/packages/comfort/3-living-full.png',
    note: 'طقم كنب وكراسي',
    price: 24000,
    originalPrice: 31000,
    inStock: true,
    longDescription: 'كنبة ثلاثية + كنبة ثنائية + 2 فوتيه راقي بألوان متناسقة وتصميم عصري جذاب.',
    gallery: ['/packages/comfort/3-living-full.png'],
    specs: [{ label: 'الشاسيه', value: 'زان أحمر مجفف' }],
    sortOrder: 4,
  },
]

const DEFAULT_REVIEWS: ReviewData[] = [
  {
    id: 1,
    customerName: 'أحمد وسارة',
    location: 'سموحة، الإسكندرية',
    quote: 'أثثنا بيت العمر بالكامل من المعرض. الخامات ممتازة والتعامل راقٍ جدًا والالتزام في الموعد يفوق التوقعات.',
    rating: 5,
    poster: '/offer-2.png',
    videoUrl: '',
    showOnSite: true,
    sortOrder: 1,
  },
  {
    id: 2,
    customerName: 'منة الله',
    location: 'العصافرة، الإسكندرية',
    quote: 'غرفة النوم طلعت أحلى من الصور بكتير. شكرًا على الذوق والصبر معايا في الاختيار وتركيب كل حاجة بدقة.',
    rating: 5,
    poster: '/product-bedroom.png',
    videoUrl: '',
    showOnSite: true,
    sortOrder: 2,
  },
  {
    id: 3,
    customerName: 'محمود فؤاد',
    location: 'المنتزه، الإسكندرية',
    quote: 'الركنة فخمة وعملية جداً، والسعر كان أفضل بكثير من أي مكان زرته. بنصح أي مقبل على الزواج يزورهم.',
    rating: 5,
    poster: '/product-corner-sofa.png',
    videoUrl: '',
    showOnSite: true,
    sortOrder: 3,
  },
]

const DEFAULT_DELIVERIES: DeliveryData[] = [
  {
    id: 1,
    title: 'تسليم شقة عريس كاملة - لوران',
    description: 'تسليم باقة البيت الكامل مع تشطيب راقي وغرف نوم وسفرة وركنة مريحة.',
    imageUrl: '/package-1-collage.png',
    videoUrl: '',
    packageName: 'باقة البيت الكامل',
    showOnSite: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: 'تسليم ركنة وصالة - سيدي بشر',
    description: 'تسليم فوري لتركيب ركنة مودرن فاخرة مع ترابيزة تقديم أنيقة.',
    imageUrl: '/package-2-collage.png',
    videoUrl: '',
    packageName: 'باقة الراحة',
    showOnSite: true,
    sortOrder: 2,
  },
  {
    id: 3,
    title: 'تسليم غرفة نوم ماستر وسفرة - ميامي',
    description: 'معاينة وتركيب دقيق لغرفة نوم رئيسية من خشب الزان وسفرة عصرية.',
    imageUrl: '/package-3-living.png',
    videoUrl: '',
    packageName: 'باقة التأسيس',
    showOnSite: true,
    sortOrder: 3,
  },
]

const DEFAULT_FURNITURE_OPTIONS: FurnitureOptionData[] = [
  {
    id: 1,
    categoryId: 1,
    categorySlug: 'bedroom',
    name: 'غرفة نوم مودرن كلاسيك',
    description: 'سرير كابوتنيه فاخر، دولاب جرار مساحة واسعة، تسريحة 6 أدراج مع مرآة، 2 كومود.',
    imageUrl: '/packages/foundation/1-bedroom.png',
    features: ['خشب زان طبيعي', 'جرارات إيطالية صامتة', 'إضاءة مخفية'],
    specs: ['سرير 160 سم', 'دولاب 260 سم'],
    media: [
      '/packages/foundation/1-bedroom.png',
      '/packages/complete-home/1-grand-bedroom.png',
      '/packages/complete-home/5-guest-bedroom.png',
    ],
    videoUrl: '',
    sortOrder: 1,
  },
  {
    id: 2,
    categoryId: 2,
    categorySlug: 'kids-room',
    name: 'غرفة أطفال سحابية',
    description: 'دولاب واسع، 2 سرير 120 سم مع مراتب سوفت، كومود ومكتب دراسة متناسق.',
    imageUrl: '/packages/foundation/2-kids-room.png',
    features: ['ألوان دهانات مائية صديقة للبيئة', 'حواف آمنة للأطفال'],
    specs: ['2 سرير 120 سم', 'دولاب 2 متر'],
    media: [
      '/packages/foundation/2-kids-room.png',
      '/packages/complete-home/4-kids-luxury.png',
      '/packages/foundation/7-kids-corner.png',
    ],
    videoUrl: '',
    sortOrder: 2,
  },
  {
    id: 3,
    categoryId: 3,
    categorySlug: 'dining',
    name: 'سفرة 6 كراسي فاخرة',
    description: 'طاولة خشب زان متينة مع 6 كراسي تنجيد مريح وإسفنج عالي الكثافة.',
    imageUrl: '/packages/foundation/3-dining.png',
    features: ['قماش ضد البقع', 'خشب زان مكبوس قشرة أرو'],
    specs: ['طاولة 160×90 سم', '6 كراسي كابوتنيه'],
    media: [
      '/packages/foundation/3-dining.png',
      '/packages/complete-home/3-royal-dining.png',
      '/packages/foundation/8-dining-detail.png',
    ],
    videoUrl: '',
    sortOrder: 3,
  },
]

const STORE_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.json')

let memoryStore: FullSiteData | null = null

async function loadLocalStore(): Promise<FullSiteData> {
  try {
    const raw = await fs.readFile(STORE_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<FullSiteData>
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      packages: parsed.packages?.length ? parsed.packages : DEFAULT_PACKAGES,
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      products: parsed.products?.length ? parsed.products : DEFAULT_PRODUCTS,
      reviews: parsed.reviews?.length ? parsed.reviews : DEFAULT_REVIEWS,
      deliveries: parsed.deliveries?.length ? parsed.deliveries : DEFAULT_DELIVERIES,
      furnitureOptions: parsed.furnitureOptions?.length
        ? parsed.furnitureOptions
        : DEFAULT_FURNITURE_OPTIONS,
    }
  } catch {
    const initial: FullSiteData = {
      settings: { ...DEFAULT_SETTINGS },
      packages: [...DEFAULT_PACKAGES],
      categories: [...DEFAULT_CATEGORIES],
      products: [...DEFAULT_PRODUCTS],
      reviews: [...DEFAULT_REVIEWS],
      deliveries: [...DEFAULT_DELIVERIES],
      furnitureOptions: [...DEFAULT_FURNITURE_OPTIONS],
    }
    await saveLocalStore(initial)
    return initial
  }
}

async function saveLocalStore(data: FullSiteData): Promise<void> {
  memoryStore = data
  try {
    await fs.mkdir(path.dirname(STORE_FILE_PATH), { recursive: true })
    await fs.writeFile(STORE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[content-store] Warning saving to disk:', err)
  }
}

export async function getFullSiteData(): Promise<FullSiteData> {
  if (memoryStore) {
    return memoryStore
  }

  // Try DB first if DATABASE_URL is configured
  if (process.env.DATABASE_URL) {
    try {
      const [settingRows, pkgRows, catRows, prodRows, revRows, delRows] = await Promise.all([
        db.select().from(siteSettingsTable),
        db.select().from(packagesTable).orderBy(asc(packagesTable.sortOrder)),
        db.select().from(productCategoriesTable).orderBy(asc(productCategoriesTable.sortOrder)),
        db.select().from(productsTable).orderBy(asc(productsTable.sortOrder)),
        db.select().from(customerReviews).orderBy(asc(customerReviews.sortOrder)),
        db.select().from(deliveryShowcase).orderBy(asc(deliveryShowcase.sortOrder)),
      ])

      const dbSettings: Record<string, string> = {}
      for (const row of settingRows) {
        dbSettings[row.key] = row.value
      }

      const mergedSettings: SiteSettingsMap = {
        ...DEFAULT_SETTINGS,
        ...dbSettings,
      }

      const local = await loadLocalStore()

      // Hydrate packages if DB has any
      const packages: PackageData[] =
        pkgRows.length > 0
          ? pkgRows.map((p) => {
              const localPkg = local.packages.find((lp) => lp.id === p.id || lp.slug === p.slug)
              return {
                id: p.id,
                slug: p.slug,
                title: p.title,
                titleAr: p.titleAr,
                badge: p.badge,
                price: p.price,
                description: p.description,
                descriptionAr: p.descriptionAr,
                shortDescription: p.shortDescription,
                shortDescriptionAr: p.shortDescriptionAr,
                image: dbSettings[`package.${p.slug}.image`] || localPkg?.image || '/placeholder.svg',
                highlightsAr: localPkg?.highlightsAr ?? [],
                contentsAr: localPkg?.contentsAr ?? [],
                benefitsAr: localPkg?.benefitsAr ?? [],
                gallery: localPkg?.gallery ?? [],
                faqItemsAr: localPkg?.faqItemsAr ?? [],
                sortOrder: p.sortOrder,
              }
            })
          : local.packages

      const categories: CategoryData[] =
        catRows.length > 0
          ? catRows.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              heroImage: c.heroImage,
              description: c.description,
              sortOrder: c.sortOrder,
            }))
          : local.categories

      const products: ProductData[] =
        prodRows.length > 0
          ? prodRows.map((pr) => {
              const localPr = local.products.find((lp) => lp.id === pr.id)
              return {
                id: pr.id,
                categoryId: pr.categoryId,
                name: pr.name,
                image: pr.image,
                note: pr.note,
                price: pr.price,
                originalPrice: pr.originalPrice,
                inStock: pr.inStock,
                longDescription: pr.longDescription,
                gallery: localPr?.gallery ?? [pr.image],
                specs: localPr?.specs ?? [],
                sortOrder: pr.sortOrder,
              }
            })
          : local.products

      const reviews: ReviewData[] =
        revRows.length > 0
          ? revRows.map((r) => ({
              id: r.id,
              customerName: r.customerName,
              location: r.location,
              quote: r.quote,
              rating: r.rating,
              poster: r.poster,
              videoUrl: r.videoUrl,
              showOnSite: r.showOnSite,
              sortOrder: r.sortOrder,
            }))
          : local.reviews

      const deliveries: DeliveryData[] =
        delRows.length > 0
          ? delRows.map((d) => ({
              id: d.id,
              title: d.title,
              description: d.description,
              imageUrl: d.imageUrl,
              videoUrl: d.videoUrl,
              packageName: d.packageName,
              showOnSite: d.showOnSite,
              sortOrder: d.sortOrder,
            }))
          : local.deliveries

      memoryStore = {
        settings: mergedSettings,
        packages,
        categories,
        products,
        reviews,
        deliveries,
        furnitureOptions: local.furnitureOptions,
      }
      return memoryStore
    } catch (err) {
      console.warn('[content-store] DB read failed, using JSON fallback:', err)
    }
  }

  memoryStore = await loadLocalStore()
  return memoryStore
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const all = await getFullSiteData()
  return all.settings
}

export async function saveSiteSettings(values: Record<string, string>): Promise<void> {
  const store = await getFullSiteData()
  store.settings = { ...store.settings, ...values }
  await saveLocalStore(store)

  if (process.env.DATABASE_URL) {
    try {
      for (const [key, value] of Object.entries(values)) {
        await db
          .insert(siteSettingsTable)
          .values({ key, value: String(value ?? '') })
          .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: String(value ?? '') } })
      }
    } catch (err) {
      console.warn('[content-store] DB write error for siteSettings:', err)
    }
  }
}

export async function saveAllPackages(packages: PackageData[]): Promise<void> {
  const store = await getFullSiteData()
  store.packages = packages
  await saveLocalStore(store)

  if (process.env.DATABASE_URL) {
    try {
      for (const pkg of packages) {
        await db
          .insert(packagesTable)
          .values({
            id: pkg.id,
            slug: pkg.slug,
            title: pkg.title,
            titleAr: pkg.titleAr,
            badge: pkg.badge,
            price: pkg.price,
            description: pkg.description,
            descriptionAr: pkg.descriptionAr,
            shortDescription: pkg.shortDescription,
            shortDescriptionAr: pkg.shortDescriptionAr,
            sortOrder: pkg.sortOrder,
          })
          .onConflictDoUpdate({
            target: packagesTable.id,
            set: {
              titleAr: pkg.titleAr,
              badge: pkg.badge,
              price: pkg.price,
              descriptionAr: pkg.descriptionAr,
              shortDescriptionAr: pkg.shortDescriptionAr,
              sortOrder: pkg.sortOrder,
            },
          })
      }
    } catch (err) {
      console.warn('[content-store] DB write error for packages:', err)
    }
  }
}

export async function saveAllProducts(products: ProductData[]): Promise<void> {
  const store = await getFullSiteData()
  store.products = products
  await saveLocalStore(store)

  if (process.env.DATABASE_URL) {
    try {
      for (const pr of products) {
        await db
          .insert(productsTable)
          .values({
            id: pr.id,
            categoryId: pr.categoryId,
            name: pr.name,
            image: pr.image,
            note: pr.note,
            price: pr.price,
            originalPrice: pr.originalPrice,
            inStock: pr.inStock,
            longDescription: pr.longDescription,
            sortOrder: pr.sortOrder,
          })
          .onConflictDoUpdate({
            target: productsTable.id,
            set: {
              name: pr.name,
              image: pr.image,
              note: pr.note,
              price: pr.price,
              originalPrice: pr.originalPrice,
              inStock: pr.inStock,
              longDescription: pr.longDescription,
              sortOrder: pr.sortOrder,
            },
          })
      }
    } catch (err) {
      console.warn('[content-store] DB write error for products:', err)
    }
  }
}

export async function saveAllCategories(categories: CategoryData[]): Promise<void> {
  const store = await getFullSiteData()
  store.categories = categories
  await saveLocalStore(store)

  if (process.env.DATABASE_URL) {
    try {
      for (const cat of categories) {
        await db
          .insert(productCategoriesTable)
          .values({
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            heroImage: cat.heroImage,
            description: cat.description,
            sortOrder: cat.sortOrder,
          })
          .onConflictDoUpdate({
            target: productCategoriesTable.id,
            set: {
              name: cat.name,
              heroImage: cat.heroImage,
              description: cat.description,
              sortOrder: cat.sortOrder,
            },
          })
      }
    } catch (err) {
      console.warn('[content-store] DB write error for categories:', err)
    }
  }
}

export async function saveAllReviews(reviews: ReviewData[]): Promise<void> {
  const store = await getFullSiteData()
  store.reviews = reviews
  await saveLocalStore(store)
}

export async function saveAllDeliveries(deliveries: DeliveryData[]): Promise<void> {
  const store = await getFullSiteData()
  store.deliveries = deliveries
  await saveLocalStore(store)
}

export async function saveAllFurnitureOptions(options: FurnitureOptionData[]): Promise<void> {
  const store = await getFullSiteData()
  store.furnitureOptions = options
  await saveLocalStore(store)
}

export async function restoreEntireStore(data: FullSiteData): Promise<void> {
  await saveLocalStore(data)
  if (data.settings) await saveSiteSettings(data.settings)
  if (data.packages) await saveAllPackages(data.packages)
  if (data.categories) await saveAllCategories(data.categories)
  if (data.products) await saveAllProducts(data.products)
}
