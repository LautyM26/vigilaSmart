import ContentPage from '../components/ContentPage.jsx'

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
    <ContentPage
      title="Instalación"
      docTitle="Instalación — VigilaSmart"
      description="Cómo es el servicio de instalación de cámaras VigilaSmart: proceso, zonas de cobertura y garantía."
      intro="Del primer mensaje a ver tus cámaras en el celular."
      sections={SECTIONS}
    />
  )
}
