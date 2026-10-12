import { describe, expect, it } from 'vitest'
import { WHATSAPP_URL, buildWhatsAppUrl } from './contact.js'

describe('buildWhatsAppUrl', () => {
  it('arma el link de wa.me con el mensaje codificado', () => {
    expect(buildWhatsAppUrl('Hola, quiero la cámara X')).toBe(
      'https://wa.me/5492613648258?text=Hola%2C%20quiero%20la%20c%C3%A1mara%20X',
    )
  })

  it('codifica caracteres que romperían la query', () => {
    expect(buildWhatsAppUrl('a&b=c #1')).toBe('https://wa.me/5492613648258?text=a%26b%3Dc%20%231')
  })

  it('mantiene WHATSAPP_URL igual que antes (regresión)', () => {
    expect(WHATSAPP_URL).toBe(
      'https://wa.me/5492613648258?text=Hola%2C%20vengo%20de%20la%20web%20VigilaSmart%20y%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto%20para%20c%C3%A1maras%20de%20seguridad',
    )
  })
})
