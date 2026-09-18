// بيانات المعرض — يمكن تعديلها بسهولة من مكان واحد
export const site = {
  name: 'الشرق الأوسط للأثاث',
  city: 'الإسكندرية',
  // رقم الواتساب الحقيقي — بصيغة دولية بدون + أو مسافات
  whatsapp: '201221250044',
  phoneDisplay: '01221250044',
  address: '3 شارع فرنسا ,المنشية، الإسكندرية\n(ممر الشرق الأوسط)',
  hours: 'يوميًا من 11 صباحًا حتى 11 مساءً',
  // رابط "افتح الاتجاهات" الحقيقي
  mapLink: 'https://maps.app.goo.gl/Qo428sMaCiDVau5E9',
  // إمبيد الخريطة — place ID حقيقي من Google Maps لموقع المعرض بالظبط
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452!2d29.9087!3d31.2001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c3e55b6f7177%3A0x82e69528eb0c5395!2z2YXZg9iq2KjZhyDYp9mE2LTYsdmC+YlYt9mF2Kc!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg',
}

export const phone = site.phoneDisplay
export const address = site.address

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
