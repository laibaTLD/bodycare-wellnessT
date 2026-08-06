import api from '@/app/lib/fetch-api';
import { getWebBuilderSiteSlug } from '@/app/lib/siteSlug';
import type { Site } from '@/app/lib/types';

/** Load site for SSR metadata; returns null when env/API unavailable. */
export async function fetchSiteForMetadata(): Promise<Site | null> {
  const slug = getWebBuilderSiteSlug();
  if (!slug) return null;

  try {
    const response = await api.get(`/public/sites/${slug}`, { silent: true });
    if (response?.success && response.data) return response.data as Site;
    if (response?.data && typeof response.data === 'object') return response.data as Site;
    return null;
  } catch {
    return null;
  }
}
