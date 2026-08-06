import { Metadata } from 'next'
import { generateMetadata as generatePageMetadata, getPageSeoData } from '@/app/lib/metadata'
import { fetchSiteForMetadata } from '@/app/lib/serverSite'
import api from '@/app/lib/fetch-api'
import ServiceAreaClient from './ServiceAreaClient'

interface ServiceAreaPageProps {
  params: Promise<{ serviceSlug: string; areaSlug: string }>
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { serviceSlug, areaSlug } = await params

  try {
    const site = await fetchSiteForMetadata()
    if (!site) return fallbackMetadata(areaSlug)

    const serviceAreaResponse = await api.get(
      `/public/sites/${site.slug}/service-areas/by-service/${serviceSlug}/${areaSlug}`,
      { silent: true }
    )

    if (serviceAreaResponse.success && serviceAreaResponse.data) {
      return generatePageMetadata(getPageSeoData(serviceAreaResponse.data), site)
    }
  } catch {
    /* API unreachable — fallback metadata below */
  }

  return fallbackMetadata(areaSlug)
}

function fallbackMetadata(areaSlug: string): Metadata {
  const areaName = areaSlug
    ? areaSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Service Area';
  return {
    title: `${areaName} - Construction Services`,
    description: `Professional construction and renovation services in ${areaName}. Contact us for all your building needs.`,
  }
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { serviceSlug, areaSlug } = await params
  return <ServiceAreaClient serviceSlug={serviceSlug} areaSlug={areaSlug} />
}
