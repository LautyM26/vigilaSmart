import ContentPage, { NEW_TAB_NOTICE } from '../components/ContentPage.jsx'
import { ArrowIcon } from '../components/icons.jsx'
import { WHATSAPP_MODELS_URL } from '../config/contact.js'

const SECTIONS = [
  {
    title: 'Almacenamiento continuo',
    text: 'Grabación permanente para que puedas revisar lo que pasó en cualquier momento, desde donde estés.',
  },
  {
    title: 'Visión nocturna',
    text: 'Imagen nítida también de noche, para que la vigilancia no se corte cuando baja la luz.',
  },
]

export default function Camaras() {
  return (
    <ContentPage
      title="Cámaras"
      docTitle="Cámaras — VigilaSmart"
      description="Cámaras de seguridad VigilaSmart: almacenamiento continuo y visión nocturna. Consultá los modelos disponibles por WhatsApp."
      intro="Equipos para vigilar tu hogar o negocio las 24 horas."
      sections={SECTIONS}
    >
      {/* Sin catálogo cargado todavía: se invita a consultar en lugar de inventar modelos */}
      <section className="doc-block" aria-labelledby="modelos">
        <h2 id="modelos" className="doc-block-title">
          Modelos
        </h2>
        <div className="doc-notice">
          <p>Consultanos por WhatsApp los modelos disponibles.</p>
          <a className="doc-link" href={WHATSAPP_MODELS_URL} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp<span className="visually-hidden">{NEW_TAB_NOTICE}</span>{' '}
            <ArrowIcon />
          </a>
        </div>
      </section>
    </ContentPage>
  )
}
