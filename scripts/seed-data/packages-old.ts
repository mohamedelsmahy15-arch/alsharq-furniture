export interface Package {
  slug: string
  title: string
  titleAr: string
  badge?: string
  price: number
  description: string
  descriptionAr: string
  shortDescription: string
  shortDescriptionAr: string
  highlights: string[]
  highlightsAr: string[]
  contents: string[]
  contentsAr: string[]
  benefits: Benefit[]
  benefitsAr: BenefitAr[]
  gallery: string[]
  faqItems: FAQItem[]
  faqItemsAr: FAQItemAr[]
  testimonials: Testimonial[]
  relatedPackages: string[]
}

export interface Benefit {
  title: string
  description: string
  icon: string
}

export interface BenefitAr {
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQItemAr {
  question: string
  answer: string
}

export interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  image?: string
}

export const packages: Record<string, Package> = {
  foundation: {
    slug: 'foundation',
    title: 'Foundation Package',
    titleAr: '🥉 باقة التأسيس',
    price: 65,
    description: 'Start your dream home with the essentials',
    descriptionAr: 'ابدأ بيتك بأهم احتياجاته بأفضل قيمة',
    shortDescription: 'Complete bedroom, kids room, and dining set',
    shortDescriptionAr: 'غرفة نوم كاملة، غرفة أطفال، وسفرة 6 كراسي',
    highlights: [
      'Complete Modern Bedroom',
      'Premium Kids Room',
      '6-Seater Dining Set',
      'Handpicked Materials',
      'Quality Guarantee',
    ],
    highlightsAr: [
      'غرفة نوم مودرن كاملة',
      'غرفة أطفال فاخرة',
      'سفرة 6 كراسي',
      'خامات مختارة بعناية',
      'ضمان على الجودة',
    ],
    contents: [
      'Modern queen bed with upholstered headboard',
      'Two elegant nightstands',
      'Premium dresser with mirror',
      'Kids bedroom complete set',
      'Dining table (seats 6)',
      '6 upholstered dining chairs',
    ],
    contentsAr: [
      'سرير كوين مودرن برأس منجد',
      'كومودينتين أنيقتين',
      'درسوار فاخر مع مرآة',
      'غرفة أطفال كاملة',
      'سفرة (6 كراسي)',
      '6 كراسي منجدة فاخرة',
    ],
    benefits: [
      {
        title: 'Premium Quality',
        description: 'Handpicked materials and expert craftsmanship',
        icon: '✓',
      },
      {
        title: 'Complete Solution',
        description: 'Everything you need in one package',
        icon: '✓',
      },
      {
        title: 'Best Value',
        description: 'Affordable luxury for your family',
        icon: '✓',
      },
      {
        title: 'Free Delivery',
        description: 'Professional delivery and setup included',
        icon: '✓',
      },
    ],
    benefitsAr: [
      {
        title: 'أثاث يعيش معاك سنين',
        description: 'خامات مختارة تتحمل الاستخدام اليومي من غير ما تفقد رونقها',
      },
      {
        title: 'بيتك جاهز من أول يوم',
        description: 'غرفة نوم، غرفة أطفال، وسفرة - كل الأساسيات في باقة واحدة متكاملة',
      },
      {
        title: 'فخامة من غير ما تكسر الميزانية',
        description: 'أفضل قيمة ممكنة من غير ما تتنازل عن مستوى الجودة',
      },
      {
        title: 'يوصلك جاهز ومركب',
        description: 'التوصيل والتركيب الاحترافي مجاني، من غير أي تعب منك',
      },
    ],
    gallery: [
      '/packages/foundation/1-bedroom.png',
      '/packages/foundation/2-kids-room.png',
      '/packages/foundation/3-dining.png',
      '/packages/foundation/4-living-room-detail.png',
      '/packages/foundation/5-bedroom-detail.png',
      '/packages/foundation/6-storage-solution.png',
      '/packages/foundation/7-kids-corner.png',
      '/packages/foundation/8-dining-detail.png',
      '/packages/foundation/9-bedroom-full.png',
      '/packages/foundation/10-collection-overview.png',
    ],
    faqItems: [
      {
        question: 'What materials are used in this package?',
        answer:
          'All pieces feature premium wood frames with high-quality upholstery. We use carefully selected materials that balance durability and luxury.',
      },
      {
        question: 'Is delivery included?',
        answer:
          'Yes, free delivery and professional setup to your home is included for all packages.',
      },
      {
        question: 'What warranty does this package come with?',
        answer:
          'All pieces come with a 3-year warranty on materials and craftsmanship.',
      },
      {
        question: 'Can I customize the colors?',
        answer:
          'Yes, we offer several color options for upholstery and wood finishes. Contact us for available choices.',
      },
    ],
    faqItemsAr: [
      {
        question: 'ما هي المواد المستخدمة في هذه الباقة؟',
        answer:
          'جميع القطع مصنوعة من إطارات خشبية فاخرة مع منجد عالي الجودة. نستخدم مواد مختارة بعناية توازن بين المتانة والفخامة.',
      },
      {
        question: 'هل التوصيل مشمول؟',
        answer:
          'بنسلمك ونركبلك الباقة كاملة في خلال 7 لـ 14 يوم عمل بالظبط.',
      },
      {
        question: 'ما هو الضمان المرفق بهذه الباقة؟',
        answer: 'جميع القطع تأتي مع ضمان 3 سنوات على الخامات والحرفية.',
      },
      {
        question: 'هل يمكنني تخصيص الألوان؟',
        answer:
          'نعم، نقدم عدة خيارات لألوان المنجد وتشطيب الخشب. تواصل معنا للخيارات المتاحة.',
      },
    ],
    testimonials: [
      {
        name: 'أحمد محمود',
        role: 'عميل سعيد',
        text: 'جودة عالية وسعر معقول. فريق التوصيل احترافي جداً. أنصح الجميع.',
        rating: 5,
      },
      {
        name: 'فاطمة علي',
        role: 'صاحبة منزل',
        text: 'أثاث فاخر وجميل جداً. سهل التنظيف وينظر أنيق دائماً.',
        rating: 5,
      },
      {
        name: 'محمد سالم',
        role: 'عميل عائلة',
        text: 'أفضل استثمار لبيتنا. الأطفال يحبون غرفتهم الجديدة.',
        rating: 5,
      },
    ],
    relatedPackages: ['comfort', 'complete-home'],
  },

  comfort: {
    slug: 'comfort',
    title: 'Comfort Package',
    titleAr: '🥈 باقة الراحة',
    badge: '⭐ الأكثر اختياراً',
    price: 85,
    description: 'Everything you need to live comfortably from day one',
    descriptionAr: 'كل ما تحتاجه لتعيش براحة من أول يوم',
    shortDescription: 'Foundation package + modern corner sofa',
    shortDescriptionAr: 'كل باقة التأسيس + ركنة مودرن',
    highlights: [
      'Everything in Foundation Package',
      'Modern Corner Sofa',
      'Best Value for Money',
      'Free Delivery & Setup',
    ],
    highlightsAr: [
      'كل محتويات باقة التأسيس',
      'ركنة مودرن فاخرة',
      'أفضل قيمة مقابل السعر',
      'توصيل وتركيب مجاني',
    ],
    contents: [
      'All Foundation Package items',
      'Modern L-shaped corner sofa',
      'Premium accent chairs (2)',
      'Elegant coffee table',
      'Throw pillows and blankets',
    ],
    contentsAr: [
      'جميع عناص�� باقة التأسيس',
      'ركنة حرف L مودرن',
      'كرسيي لكنة فاخران',
      'طاولة قهوة أنيقة',
      'وسائد وبطاطين ديكور',
    ],
    benefits: [
      {
        title: 'Complete Comfort',
        description: 'More seating and luxury for your family',
        icon: '✓',
      },
      {
        title: 'Modern Design',
        description: 'Contemporary style that never goes out of fashion',
        icon: '✓',
      },
      {
        title: 'Most Popular',
        description: "Trusted by thousands of happy families",
        icon: '✓',
      },
      {
        title: 'Flexible Payment',
        description: 'Affordable payment plans available',
        icon: '✓',
      },
    ],
    benefitsAr: [
      {
        title: 'استقبل ضيوفك بأناقة',
        description: 'ركنة مودرن فاخرة تضيف مساحة راحة حقيقية لأسرتك وضيوفك',
      },
      {
        title: 'تصميم مش بيقدّم',
        description: 'شكل معاصر يفضل عصري مهما اتغيرت الموضة',
      },
      {
        title: 'اختيار آلاف العائلات',
        description: 'الباقة الأكثر طلباً من عملائنا - وفيه سبب واضح',
      },
      {
        title: 'ادفع بالطريقة اللي تريحك',
        description: 'خطط سداد مرنة تتناسب مع ظروفك',
      },
    ],
    gallery: [
      '/packages/comfort/1-bedroom.png',
      '/packages/comfort/2-corner-sofa.png',
      '/packages/comfort/3-living-full.png',
      '/packages/comfort/4-sofa-detail.png',
      '/packages/comfort/5-dining-setup.png',
      '/packages/comfort/6-bedroom-nightstands.png',
      '/packages/comfort/7-complete-view.png',
      '/packages/comfort/8-accent-chairs.png',
      '/packages/comfort/9-coffee-table.png',
      '/packages/comfort/10-family-gathering.png',
    ],
    faqItems: [
      {
        question: 'Why is this package the most popular?',
        answer:
          'It offers the perfect balance of luxury and value, with all essential furniture plus a modern corner sofa for maximum comfort and style.',
      },
      {
        question: 'Can I add more items to this package?',
        answer:
          'Absolutely. We offer customization services to add or modify items based on your needs.',
      },
      {
        question: 'What is the delivery timeline?',
        answer:
          'Delivery typically takes 2-3 weeks from order confirmation. Express delivery is available.',
      },
      {
        question: 'Is financing available?',
        answer:
          'Yes, we offer flexible payment plans with no interest through our partner banks.',
      },
    ],
    faqItemsAr: [
      {
        question: 'لماذا هذه الباقة الأكثر شهرة؟',
        answer:
          'توفر التوازن المثالي بين الفخامة والقيمة، مع كل الأثاث الأساسي بالإضافة إلى ركنة مودرن.',
      },
      {
        question: 'هل يمكنني إضافة عناصر إلى الباقة؟',
        answer:
          'بالتأكيد. نقدم خدمات تخصيص لإضافة أو تعديل العناصر حسب احتياجاتك.',
      },
      {
        question: 'ما هو وقت التوصيل؟',
        answer: 'التوصيل عادة يتم في غضون 2-3 أسابيع من تأكيد الطلب. التوصيل السريع متاح.',
      },
      {
        question: 'هل التمويل متاح؟',
        answer:
          'نعم، نقدم خطط تقسيط مرنة من غير فوائد من خلال شركائنا. تواصل معنا على واتساب لمعرفة التفاصيل.',
      },
    ],
    testimonials: [
      {
        name: 'سارة محمد',
        role: 'صاحبة منزل',
        text: 'الراحة التي حصلت عليها من هذه الباقة لا تضاهى. غيرت حياتنا تماماً.',
        rating: 5,
      },
      {
        name: 'علي إبراهيم',
        role: 'عريس جديد',
        text: 'استثمار حكيم لحياة زوجية سعيدة. شكراً للفريق الاحترافي.',
        rating: 5,
      },
      {
        name: 'ليلى الأحمد',
        role: 'أم منزل',
        text: 'أثاث يتحمل كل شيء ولا يزال يبدو جديداً بعد سنة.',
        rating: 5,
      },
    ],
    relatedPackages: ['foundation', 'complete-home'],
  },

  'complete-home': {
    slug: 'complete-home',
    title: 'Complete Home Package',
    titleAr: '🥇 باقة البيت الكامل',
    badge: '👑 أفضل قيمة',
    price: 115,
    description: 'Furnish your entire home with our most comprehensive package',
    descriptionAr: 'تأثيث المنزل بالكامل بأفضل قيمة مقابل السعر',
    shortDescription:
      'Everything for your complete home - save more than buying separately',
    shortDescriptionAr:
      'كل ما تحتاجه لبيتك - توفير أكبر من شراء القطع منفصلة',
    highlights: [
      'Complete Master Bedroom Suite',
      'Complete Guest Bedroom',
      'Complete Kids Bedroom',
      'Grand Living Room Setup',
      'Formal Dining Set',
      'Entryway Furniture',
      'Everything Coordinated',
      'Maximum Savings',
    ],
    highlightsAr: [
      'غرفة النوم الرئيسية كاملة',
      'غرفة ضيف كاملة',
      'غرفة أطفال كاملة',
      'صالون كبير',
      'سفرة رسمية',
      'أثاث الاستقبال',
      'كل شيء منسق',
      'توفيرات قصوى',
    ],
    contents: [
      'Grand master bedroom with premium bed',
      'Guest bedroom complete set',
      'Kids bedroom complete set',
      'Large corner sofa sectional',
      'Multiple accent chairs',
      'Grand dining table (8 seats)',
      '8 premium dining chairs',
      'Coffee tables and side tables',
      'Bedroom storage solutions',
      'Entryway console and mirror',
    ],
    contentsAr: [
      'غرفة نوم رئيسية بسرير فاخر',
      'غرفة ضيف كاملة',
      'غرفة أطفال كاملة',
      'ركنة كبيرة',
      'عدة كراسي لكنة',
      'سفرة كبيرة (8 أشخاص)',
      '8 كراسي سفرة فاخرة',
      'طاولات قهوة وأنماط',
      'حلول تخزين غرف النوم',
      'كنسول الاستقبال والمرآة',
    ],
    benefits: [
      {
        title: 'Complete Home',
        description: 'Everything coordinated and ready to use',
        icon: '✓',
      },
      {
        title: 'Maximum Savings',
        description: 'Save more than buying separately',
        icon: '✓',
      },
      {
        title: 'Luxury Living',
        description: 'Premium quality in every room',
        icon: '✓',
      },
      {
        title: 'Hassle-Free',
        description: 'One solution for your entire home',
        icon: '✓',
      },
    ],
    benefitsAr: [
      {
        title: 'بيت كامل من غير تعب',
        description: 'من غرفة النوم لحد الاستقبال - كل حاجة منسقة وجاهزة تعيش فيها',
      },
      {
        title: 'توفير حقيقي في جيبك',
        description: 'أرخص بكتير من شراء كل قطعة لوحدها',
      },
      {
        title: 'فخامة في كل ركن',
        description: 'كل غرفة في بيتك تحس فيها بالرقي والاهتمام بالت��اصيل',
      },
      {
        title: 'حل واحد، صداع أقل',
        description: 'من الاختيار للتوصيل للتركيب - إحنا بنتولى كل حاجة',
      },
    ],
    gallery: [
      '/packages/complete-home/1-grand-bedroom.png',
      '/packages/complete-home/2-grand-living.png',
      '/packages/complete-home/3-royal-dining.png',
      '/packages/complete-home/4-kids-luxury.png',
      '/packages/complete-home/5-guest-bedroom.png',
      '/packages/complete-home/6-entryway.png',
      '/packages/complete-home/7-bedroom-closet.png',
      '/packages/complete-home/8-lounge-seating.png',
      '/packages/complete-home/9-artisan-details.png',
      '/packages/complete-home/10-full-home.png',
    ],
    faqItems: [
      {
        question: 'Is it really cheaper to buy the complete package?',
        answer:
          'Yes, you save approximately 20-30% compared to purchasing items separately, plus all items are coordinated.',
      },
      {
        question: 'What if I need to change something later?',
        answer:
          'All items can be modified or replaced within 30 days of purchase. We also offer additional pieces at package prices.',
      },
      {
        question: 'How long does installation take?',
        answer:
          'Professional installation typically takes 2-3 days depending on your space. We handle everything.',
      },
      {
        question: 'Do you offer aftercare service?',
        answer:
          'Yes, we provide free maintenance consultation and cleaning service for the first year.',
      },
    ],
    faqItemsAr: [
      {
        question: 'هل حقاً أشتري الباقة الكاملة أرخص؟',
        answer:
          'نعم، توفر 20-30% مقارنة بشراء منفصل، وجميع القطع منسقة بشكل مثالي.',
      },
      {
        question: 'إذا أردت تغيير شيء ما؟',
        answer:
          'يمكن تعديل أو استبدال أي عنصر خلال 30 يوم. نقدم أيضاً قطع إضافية بأسعار الباقة.',
      },
      {
        question: 'كم يستغرق التركيب؟',
        answer:
          'التركيب الاحترافي عادة يستغرق 2-3 أيام. نحن نتولى كل شيء بنفسنا.',
      },
      {
        question: 'هل تقدمون خدمة ما بعد البيع؟',
        answer:
          'نعم، نقدم استشارة صيانة مجانية وخدمة تنظيف للسنة الأولى.',
      },
    ],
    testimonials: [
      {
        name: 'منى الشرقاوي',
        role: 'ربة منزل',
        text: 'أفضل قرار اتخذته. بيتي الآن يبدو مثل قصر. شكراً لكم.',
        rating: 5,
      },
      {
        name: 'خالد أحمد',
        role: 'رب أسرة',
        text: 'جودة استثنائية وتنسيق مثالي. كل ضيف يتساءل عن المصدر.',
        rating: 5,
      },
      {
        name: 'وفاء علي',
        role: 'عميلة',
        text: 'سهولة في التعامل وأثاث فاخر. استحق كل فلس.',
        rating: 5,
      },
    ],
    relatedPackages: ['foundation', 'comfort'],
  },
}

export function getPackage(slug: string): Package | null {
  return packages[slug] || null
}

export function getAllPackages(): Package[] {
  return Object.values(packages)
}
