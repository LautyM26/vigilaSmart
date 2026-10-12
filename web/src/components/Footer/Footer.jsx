import { PHONE_DISPLAY, PHONE_TEL } from '../../config/contact.js'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contacto" className={styles.foot}>
      <p className={styles.line}>VigilaSmart - Tu seguridad en buenas manos.</p>
      <p className={styles.line}>
        <a className={styles.phone} href={PHONE_TEL}>
          {PHONE_DISPLAY}
        </a>{' '}
        · © {year}
      </p>
    </footer>
  )
}
