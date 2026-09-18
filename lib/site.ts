import { getSiteSettings, type SiteSettingsMap } from '@/lib/content-store'

export interface SiteSettings {
  name: string
  logoImage?: string
  city: string
  whatsapp: string
  phoneDisplay: string
  address: string
  hours: string
  mapLink: string
  mapEmbed: string
}

const defaults: SiteSettings = {
  name: 'الشرق الأوسط للأثاث',
  logoImage: '',
  city: 'الإسكندرية',
  whatsapp: '201221250044',
  phoneDisplay: '01221250044',
  address: '3 شارع فرنسا ,المنشية، الإسكندرية\n(ممر الشرق الأوسط)',
  hours: 'يوميًا من 11 صباحًا حتى 11 مساءً',
  mapLink: 'https://maps.app.goo.gl/Qo428sMaCiDVau5E9',
  mapEmbed: '',
}

export const site: SiteSettings = defaults

export async function getSite(): Promise<SiteSettings> {
  const settings = await getSiteSettings()
  return {
    name: settings.name || defaults.name,
    logoImage: settings.logoImage || '',
    city: settings.city || defaults.city,
    whatsapp: settings.whatsapp || defaults.whatsapp,
    phoneDisplay: settings.phoneDisplay || defaults.phoneDisplay,
    address: settings.address || defaults.address,
    hours: settings.hours || defaults.hours,
    mapLink: settings.mapLink || defaults.mapLink,
    mapEmbed: settings.mapEmbed || defaults.mapEmbed,
  }
}

export const phone = defaults.phoneDisplay
export const address = defaults.address

export function waLink(message: string, whatsapp = defaults.whatsapp) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}
