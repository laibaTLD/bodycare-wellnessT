import { Metadata } from 'next'
import { generateMetadata, getServiceSeoData } from '@/app/lib/metadata'
import { fetchSiteForMetadata } from '@/app/lib/serverSite'
import type { Service } from '@/app/lib/types'
import api from '@/app/lib/fetch-api'
import ServiceClient from './ServiceClient'

interface ServicePageProps {
  params: { serviceSlug: string }
}

export async function generateServiceMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = params

  try {
    const site = await fetchSiteForMetadata()
    if (!site) return fallbackMetadata()

    const servicesResponse = await api.get(`/public/sites/${site.slug}/services`, { silent: true })

    if (servicesResponse.success && servicesResponse.data) {
      const services: Service[] = servicesResponse.data
      const service = services.find((s) => s.slug === serviceSlug)
      if (service) return generateMetadata(getServiceSeoData(service), site)
    }
  } catch {
    /* API unreachable — fallback metadata below */
  }

  return fallbackMetadata()
}

function fallbackMetadata(): Metadata {
  return {
    title: 'Service Not Found',
    description: 'The requested service could not be found.',
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  return <ServiceClient serviceSlug={params.serviceSlug} />
}
