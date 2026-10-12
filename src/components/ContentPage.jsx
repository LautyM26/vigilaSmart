import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../config/contact.js'
import { useDocumentMeta } from '../hooks/useDocumentMeta.js'
import { ArrowIcon } from './icons.jsx'

export const NEW_TAB_NOTICE = ' (se abre en una pestaña nueva)'

/**
 * Esqueleto de las páginas de lectura (Cámaras, Instalación): título, bajada,
 * secciones separadas por filetes, contenido extra, CTA y pie. Estilos en pages.css.
 * @param {{ title: string, docTitle: string, description: string, intro: string,
 *           sections: Array<{ title: string, text: string }>, children?: React.ReactNode }} props
 */
export default function ContentPage({ title, docTitle, description, intro, sections, children }) {
  useDocumentMeta(docTitle, description)

  return (
    <>
      <main className="doc-main">
        <article className="doc-page">
          <h1 className="doc-title">{title}</h1>
          <p className="doc-intro">{intro}</p>

          <div className="doc-sections">
            {sections.map((section) => (
              <section key={section.title} className="doc-section">
                <h2 className="doc-section-title">{section.title}</h2>
                <p className="doc-section-text">{section.text}</p>
              </section>
            ))}
          </div>

          {children}

          <div className="doc-cta">
            <a className="btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Solicitar Presupuesto<span className="visually-hidden">{NEW_TAB_NOTICE}</span>{' '}
              <ArrowIcon />
            </a>
          </div>
        </article>
      </main>

      <footer className="doc-foot">
        <span>VigilaSmart - Tu seguridad en buenas manos.</span>
        <span>
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> · © <time id="year">{new Date().getFullYear()}</time>
        </span>
      </footer>
    </>
  )
}
