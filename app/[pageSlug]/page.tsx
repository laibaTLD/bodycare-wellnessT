import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getPageSeoData } from '@/app/lib/metadata'
import { fetchSiteForMetadata } from '@/app/lib/serverSite'
import type { Page, ServiceAreaPage } from '@/app/lib/types'
import api from '@/app/lib/fetch-api'
import PageSlugClient from './PageSlugClient'

interface PageSlugPageProps {
  params: { pageSlug: string }
}

export async function generateMetadata({ params }: PageSlugPageProps): Promise<Metadata> {
  const { pageSlug } = params

  try {
    const site = await fetchSiteForMetadata()
    if (!site) return fallbackMetadata()

    const pageResponse = await api.get(`/public/sites/${site.slug}/pages/${pageSlug}`, { silent: true })
    if (pageResponse.success && pageResponse.data) {
      return buildMetadata(getPageSeoData(pageResponse.data as Page), site)
    }

    const serviceAreaResponse = await api.get(`/public/sites/${site.slug}/service-areas/${pageSlug}`, {
      silent: true,
    })
    if (serviceAreaResponse.success && serviceAreaResponse.data) {
      return buildMetadata(getPageSeoData(serviceAreaResponse.data as ServiceAreaPage), site)
    }
  } catch {
    /* API unreachable — fallback metadata below */
  }

  return fallbackMetadata()
}

function fallbackMetadata(): Metadata {
  return {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
  }
}

export default function PageSlugPage({ params }: PageSlugPageProps) {
  return <PageSlugClient pageSlug={params.pageSlug} />
}
