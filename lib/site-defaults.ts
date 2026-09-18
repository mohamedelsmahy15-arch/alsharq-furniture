export const defaultWhatsapp = '201221250044'
export const phone = '01221250044'
export const address = '3 شارع فرنسا ,المنشية، الإسكندرية (ممر الشرق الأوسط)'
export const mapLink = 'https://maps.app.goo.gl/Qo428sMaCiDVau5E9'
export function waLink(message: string, whatsapp = defaultWhatsapp) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}
