// Datos de contacto: única fuente para Navbar, Home, páginas y Footer.
export const PHONE_E164 = '+5492613648258'
export const PHONE_DISPLAY = '261-364-8258'
export const PHONE_TEL = `tel:${PHONE_E164}`

/** Link de WhatsApp con un mensaje ya escrito (se codifica para la URL). */
export function buildWhatsAppUrl(message) {
  return `https://wa.me/${PHONE_E164.slice(1)}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_URL = buildWhatsAppUrl(
  'Hola, vengo de la web VigilaSmart y me gustaría solicitar un presupuesto para cámaras de seguridad',
)
