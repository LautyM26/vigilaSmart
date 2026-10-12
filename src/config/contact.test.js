import { describe, expect, it } from 'vitest'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL, buildWhatsAppUrl } from './contact.js'

describe('contact', () => {
  it('arma el link de presupuesto idéntico al del sitio estático', () => {
    expect(WHATSAPP_URL).toBe(
      'https://wa.me/5492613648258?text=Hola%2C%20vengo%20de%20la%20web%20VigilaSmart%20y%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto%20para%20c%C3%A1maras%20de%20seguridad',
    )
  })

  it('codifica cualquier mensaje para la URL de WhatsApp', () => {
    expect(buildWhatsAppUrl('¿Hola & chau?')).toBe('https://wa.me/5492613648258?text=%C2%BFHola%20%26%20chau%3F')
  })

  it('expone el teléfono para llamar y para mostrar', () => {
    expect(PHONE_TEL).toBe('tel:+5492613648258')
    expect(PHONE_DISPLAY).toBe('261-364-8258')
  })
})
