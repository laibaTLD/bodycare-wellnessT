import { Metadata } from 'next'
import { generateMetadata as generatePageMetadata, getPageSeoData } from '@/app/lib/metadata'
import { fetchSiteForMetadata } from '@/app/lib/serverSite'
import api from '@/app/lib/fetch-api'
import ServiceAreaClient from './ServiceAreaClient'

interface ServiceAreaPageProps {
  params: Promise<{ serviceSlug: string; citySlug: string }>
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { serviceSlug, citySlug } = await params

  try {
    const site = await fetchSiteForMetadata()
    if (!site) return fallbackMetadata()

    const serviceAreaResponse = await api.get(
      `/public/sites/${site.slug}/service-areas/by-service/${serviceSlug}/${citySlug}`,
      { silent: true }
    )

    if (serviceAreaResponse.success && serviceAreaResponse.data) {
      return generatePageMetadata(getPageSeoData(serviceAreaResponse.data), site)
    }
  } catch {
    /* API unreachable — fallback metadata below */
  }

  return fallbackMetadata()
}

function fallbackMetadata(): Metadata {
  return {
    title: 'Service Area Not Found',
    description: 'The requested service area page could not be found.',
  }
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { serviceSlug, citySlug } = await params
  return <ServiceAreaClient serviceSlug={serviceSlug} citySlug={citySlug} />
}
