import type { Service, ServiceAreaPage } from '@/app/lib/types';
import {
  getAreaCity,
  getAreaRegion,
  getServiceAreaPageHref,
  getServiceSlugFromAreaPage,
  normalizeSlug,
  resolveServiceSlug,
} from '@/app/lib/serviceAreaSlugs';

export type ServiceNavArea = {
  label: string;
  href: string;
};

export type ServiceNavItem = {
  id: string;
  name: string;
  href: string;
  areas: ServiceNavArea[];
};

function isVisibleService(service: Service): boolean {
  return service.status !== 'draft' && service.status !== 'archived';
}

function formatAreaLabel(city: string, region: string): string {
  if (!region) return city;
  if (city.toLowerCase().includes(region.toLowerCase())) return city;
  return `${city}, ${region}`;
}

function resolveSlugForAreaPage(
  page: ServiceAreaPage,
  services: Service[]
): string {
  const serviceRef = page.serviceId as string | { slug?: string } | undefined;
  if (serviceRef && typeof serviceRef === 'object' && serviceRef.slug) {
    return resolveServiceSlug({ slug: serviceRef.slug });
  }
  if (typeof serviceRef === 'string') {
    const svc = services.find((s) => s._id === serviceRef);
    if (svc) return resolveServiceSlug(svc);
  }
  return getServiceSlugFromAreaPage(page) || 'service';
}

export function getServingAreasForService(
  service: Service,
  serviceAreaPages: ServiceAreaPage[],
  services: Service[]
): ServiceNavArea[] {
  const slug = resolveServiceSlug(service);
  const seen = new Set<string>();
  const areas: ServiceNavArea[] = [];

  const addArea = (area: unknown) => {
    const city = getAreaCity(area);
    if (!city) return;
    const region = getAreaRegion(area);
    const key = `${city.toLowerCase()}|${region.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    areas.push({
      label: formatAreaLabel(city, region),
      href: getServiceAreaPageHref(slug, { city, region }, serviceAreaPages),
    });
  };

  const addFromPages = (publishedOnly: boolean) => {
    serviceAreaPages.forEach((page) => {
      if (publishedOnly && page.status !== 'published') return;
      if (!page.city?.trim()) return;
      const pageSlug = getServiceSlugFromAreaPage(page) || resolveSlugForAreaPage(page, services);
      if (normalizeSlug(pageSlug) !== slug) return;
      addArea({ city: page.city, region: page.region });
    });
  };

  addFromPages(true);
  if (areas.length === 0) addFromPages(false);
  if (areas.length === 0) {
    (service.serviceAreas ?? []).forEach(addArea);
  }

  return areas;
}

export function buildServicesNavItems(
  services: Service[],
  serviceAreaPages: ServiceAreaPage[]
): ServiceNavItem[] {
  return services.filter(isVisibleService).map((service) => ({
    id: service._id,
    name: service.name,
    href: `/service/${resolveServiceSlug(service)}`,
    areas: getServingAreasForService(service, serviceAreaPages, services),
  }));
}
