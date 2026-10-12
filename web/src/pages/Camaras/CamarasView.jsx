import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroButton from '../../components/HeroButton/HeroButton.jsx'
import { ArrowIcon } from '../../components/icons/icons.jsx'
import { WHATSAPP_URL, buildWhatsAppUrl } from '../../config/contact.js'
import { CAMERAS, CAMERA_CAPABILITIES } from '../../data/cameras.js'
import {
  ENVIRONMENT_FILTERS,
  ENVIRONMENT_PARAM,
  filterCameras,
  formatModelCount,
  parseEnvironmentFilter,
} from './cameraFilters.js'
import content from '../ContentPage.module.css'
import styles from './CamarasView.module.css'

const STORAGE_LABELS = { microsd: 'microSD', cloud: 'Nube', nvr: 'Grabador (NVR)' }
const MAX_HIGHLIGHTS = 3
const NEW_TAB_NOTICE = '(se abre en una pestaña nueva)'

const environmentLabel = (environment) =>
  ENVIRONMENT_FILTERS.find((filter) => filter.value === environment).label

const storageText = ({ storage, maxMicroSdGb }) =>
  storage
    .map((type) =>
      type === 'microsd' && maxMicroSdGb ? `microSD (hasta ${maxMicroSdGb} GB)` : STORAGE_LABELS[type],
    )
    .join(' · ')

const consultUrl = (cameraName) =>
  buildWhatsAppUrl(`Hola, vengo de la web VigilaSmart y quiero consultar por el modelo ${cameraName}`)

/** Link externo a WhatsApp con aviso de pestaña nueva para lectores de pantalla (BTN-10). */
function WhatsAppLink({ href, className, children, hiddenContext = '' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden">
        {hiddenContext}
        {` ${NEW_TAB_NOTICE}`}
      </span>
      <ArrowIcon className={styles.linkArrow} />
    </a>
  )
}

/** Un modelo del catálogo. Su único estado: si la foto falló, se oculta (CAM-03). */
function CameraItem({ camera }) {
  const [hasImage, setHasImage] = useState(true)
  const { id, name, environment, resolution, nightVisionRangeM, highlights = [], image } = camera

  return (
    <li id={`camara-${id}`} className={styles.item}>
      {hasImage && (
        <div className={styles.media}>
          <img
            className={styles.image}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            onError={() => setHasImage(false)}
          />
        </div>
      )}

      <div className={styles.body}>
        <p className={styles.environment}>{environmentLabel(environment)}</p>
        <h3 className={styles.name}>{name}</h3>

        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt>Resolución</dt>
            <dd>{resolution}</dd>
          </div>
          {nightVisionRangeM !== null && (
            <div className={styles.spec}>
              <dt>Visión nocturna</dt>
              <dd>{`Hasta ${nightVisionRangeM} m`}</dd>
            </div>
          )}
          <div className={styles.spec}>
            <dt>Almacenamiento</dt>
            <dd>{storageText(camera)}</dd>
          </div>
        </dl>

        {highlights.length > 0 && (
          <ul className={styles.highlights}>
            {highlights.slice(0, MAX_HIGHLIGHTS).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}

        <WhatsAppLink className={styles.consult} href={consultUrl(name)} hiddenContext={`: ${name}`}>
          Consultar este modelo
        </WhatsAppLink>
      </div>
    </li>
  )
}

/**
 * Vista /camaras: catálogo con filtro por ambiente, capacidades generales y CTA.
 * El filtro vive en la URL (?ambiente=) para poder compartirlo y respetar Atrás/Adelante.
 */
export default function CamarasView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const environmentFilter = parseEnvironmentFilter(searchParams.get(ENVIRONMENT_PARAM))
  const visibleCameras = filterCameras(CAMERAS, environmentFilter)

  // replace: cambiar de filtro no agrega entradas al historial (CAM-05)
  const selectFilter = (param) => setSearchParams({ [ENVIRONMENT_PARAM]: param }, { replace: true })

  return (
    <article className={content.page}>
      <title>Cámaras — VigilaSmart</title>
      <meta
        name="description"
        content="Catálogo de cámaras de seguridad VigilaSmart: especificaciones, almacenamiento continuo y visión nocturna. Consultá cada modelo por WhatsApp."
      />

      <h1 className={content.title} tabIndex={-1}>
        Cámaras
      </h1>
      <p className={content.intro}>Equipos para vigilar tu hogar o negocio las 24 horas.</p>

      <div className={content.sections}>
        {Object.values(CAMERA_CAPABILITIES).map(({ title, text }) => (
          <section key={title} className={content.section}>
            <h2 className={content.sectionTitle}>{title}</h2>
            <p className={content.sectionText}>{text}</p>
          </section>
        ))}
      </div>

      <section className={styles.catalogSection} aria-labelledby="modelos">
        <h2 id="modelos" className={styles.catalogTitle}>
          Modelos
        </h2>

        {CAMERAS.length === 0 ? (
          <div className={styles.notice}>
            <p>Consultanos por WhatsApp los modelos disponibles.</p>
            <WhatsAppLink className={styles.noticeLink} href={WHATSAPP_URL}>
              Abrir WhatsApp
            </WhatsAppLink>
          </div>
        ) : (
          <>
            <div className={styles.toolbar}>
              <div className={styles.filters} role="group" aria-label="Filtrar por ambiente">
                {ENVIRONMENT_FILTERS.map(({ value, param, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={styles.filter}
                    aria-pressed={environmentFilter === value}
                    onClick={() => selectFilter(param)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className={styles.count} role="status" aria-live="polite">
                {formatModelCount(visibleCameras.length)}
              </p>
            </div>

            {visibleCameras.length > 0 ? (
              <ul className={styles.catalog} aria-label="Modelos">
                {visibleCameras.map((camera) => (
                  <CameraItem key={camera.id} camera={camera} />
                ))}
              </ul>
            ) : (
              <div className={styles.notice}>
                <p>No hay modelos para este ambiente.</p>
                <div className={styles.noticeActions}>
                  <button type="button" className={styles.filter} onClick={() => selectFilter('todas')}>
                    Ver todas
                  </button>
                  <WhatsAppLink className={styles.noticeLink} href={WHATSAPP_URL}>
                    Consultanos por WhatsApp
                  </WhatsAppLink>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <div className={content.cta}>
        <HeroButton icon={<ArrowIcon />} text="Solicitar Presupuesto" url={WHATSAPP_URL} />
      </div>
    </article>
  )
}
