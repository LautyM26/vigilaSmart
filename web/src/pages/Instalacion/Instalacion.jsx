import HeroButton from '../../components/HeroButton/HeroButton.jsx'
import { ArrowIcon } from '../../components/icons/icons.jsx'
import { WHATSAPP_URL } from '../../config/contact.js'
import styles from '../ContentPage.module.css'

// Contenido de la página: cada entrada es una sección (título + texto)
const SECTIONS = [
  {
    title: 'Cómo es el servicio',
    text: 'Coordinamos por WhatsApp, te pasamos el presupuesto y dejamos las cámaras instaladas y configuradas, con el acceso funcionando en tu celular.',
  },
  {
    title: 'Zonas de cobertura',
    text: 'Escribinos con tu ubicación y te confirmamos si llegamos a tu zona.',
  },
  {
    title: 'Garantía',
    text: 'Junto con el presupuesto te detallamos las condiciones de garantía de los equipos y de la instalación.',
  },
]

export default function Instalacion() {
  return (
    <article className={styles.page}>
      <title>Instalación — VigilaSmart</title>
      <meta
        name="description"
        content="Cómo es el servicio de instalación de cámaras VigilaSmart: proceso, zonas de cobertura y garantía."
      />

      <h1 className={styles.title}>Instalación</h1>
      <p className={styles.intro}>Del primer mensaje a ver tus cámaras en el celular.</p>

      <div className={styles.sections}>
        {SECTIONS.map(({ title, text }) => (
          <section key={title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <p className={styles.sectionText}>{text}</p>
          </section>
        ))}
      </div>

      <div className={styles.cta}>
        <HeroButton icon={<ArrowIcon />} text="Solicitar Presupuesto" url={WHATSAPP_URL} />
      </div>
    </article>
  )
}
