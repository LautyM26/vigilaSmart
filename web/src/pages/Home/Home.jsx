import HeroButton from '../../components/HeroButton/HeroButton.jsx'
import { ArrowIcon, ChevronIcon } from '../../components/icons/icons.jsx'
import { WHATSAPP_URL } from '../../config/contact.js'
import styles from './Home.module.css'

const FEATURES = ['Monitoreo 24/7', 'Almacenamiento Continuo', 'Visión Nocturna', 'Acceso desde el Celular']

export default function Home() {
  return (
    <section className={styles.hero}>
      <title>VigilaSmart — Instalación de Cámaras de Seguridad</title>
      <meta
        name="description"
        content="Instalación de cámaras de seguridad para hogares y negocios. Monitoreo 24/7, visión nocturna y acceso desde tu celular. Pedí tu presupuesto por WhatsApp."
      />

      <h1 className={styles.title}>
        <span>Seguridad Inteligente</span>
        <span>en Alta Definición.</span>
      </h1>

      <p className={styles.sub}>
        <span>Protegé tu hogar o negocio</span>
        <span>con monitoreo 24/7 directo en tu celular.</span>
      </p>

      <div className={styles.cta}>
        <HeroButton icon={<ArrowIcon />} text="Solicitar Presupuesto" url={WHATSAPP_URL} />
      </div>

      <ul className={styles.feats}>
        {FEATURES.map((feature) => (
          <li key={feature} className={styles.feat}>
            <ChevronIcon className={styles.chev} />
            {feature}
          </li>
        ))}
      </ul>

      <span className={styles.rule} aria-hidden="true" />
    </section>
  )
}
