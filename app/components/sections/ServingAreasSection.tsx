'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Page, Service, ServiceAreaPage } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getBusinessTagline, getPageHref } from '@/app/lib/siteContent';
import { cn } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';
import {
  findServiceAreaPage,
  getAreaCity,
  getAreaRegion,
  getServiceAreaPageHref,
  normalizeSlug,
  resolveServiceSlug,
} from '@/app/lib/serviceAreaSlugs';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';

interface ServingAreasSectionProps {
  servingAreasSection?: Page['servingAreasSection'];
  className?: string;
}

type DisplayArea = {
  city: string;
  region: string;
  description: string;
  href?: string;
};

function normalizeServiceArea(area: unknown): Omit<DisplayArea, 'href'> | null {
  const city = getAreaCity(area);
  if (!city) return null;

  const region = getAreaRegion(area);
  let description = '';
  if (area && typeof area === 'object' && 'description' in area) {
    description = tiptapToText((area as { description?: unknown }).description);
  }

  return { city, region, description };
}

function areaKey(area: Pick<DisplayArea, 'city' | 'region'>): string {
  return `${area.city.toLowerCase()}|${area.region.toLowerCase()}`;
}

function enrichArea(
  area: Omit<DisplayArea, 'href'>,
  serviceSlug: string,
  serviceAreaPages: ServiceAreaPage[] | undefined,
  fallbackDescription: string
): DisplayArea {
  const page = findServiceAreaPage(serviceAreaPages, serviceSlug, area) as ServiceAreaPage | undefined;
  const description =
    area.description ||
    (page
      ? tiptapToText(page.hero?.description) ||
        tiptapToText(page.about?.description) ||
        page.seo?.description ||
        ''
      : '') ||
    fallbackDescription;

  return {
    ...area,
    description,
    href: getServiceAreaPageHref(serviceSlug, area, serviceAreaPages),
  };
}

function AreaCard({ area, index }: { area: DisplayArea; index: number }) {
  const theme = useSectionTheme();
  const { colors, fonts, styles } = theme;
  const content = (
    <>
      <div className="flex items-start">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 mr-4"
          style={styles.imagePlaceholder}
        >
          <svg className="w-6 h-6 " style={{ color: colors.primaryButton }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold " style={{ fontFamily: fonts.heading, color: colors.mainText }}>{area.city}</h3>
          {area.region && <p className="text-sm font-medium mb-4" style={{ ...styles.accentText, fontFamily: fonts.body }}>{area.region}</p>}
        </div>
      </div>
      {area.description && (
        <p className="text-sm leading-relaxed mt-4" style={{ color: colors.mainText, opacity: 0.8, fontFamily: fonts.body }}>{area.description}</p>
      )}
    </>
  );

  const className =
    'rounded-xl p-6 md:p-8 shadow-lg animate-fade-in-up transform hover:scale-105 transition-all duration-300 block text-left w-full';

  if (area.href) {
    return (
      <Link
        key={areaKey(area)}
        href={area.href}
        className={className}
        style={{ ...styles.cardSolid, animationDelay: `${400 + index * 100}ms` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div key={areaKey(area)} className={className} style={{ ...styles.cardSolid, animationDelay: `${400 + index * 100}ms` }}>
      {content}
    </div>
  );
}

export function ServingAreasSection({ servingAreasSection, className }: ServingAreasSectionProps) {
  const theme = useSectionTheme();
  const { colors, fonts, styles } = theme;
  const { site, services, pages, serviceAreaPages } = useWebBuilder();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const fallbackDescription = useMemo(
    () => getBusinessTagline(site) || 'Professional services available in this area.',
    [site]
  );

  const serviceAreas = useMemo<DisplayArea[]>(() => {
    const result: DisplayArea[] = [];
    const seen = new Set<string>();

    const addArea = (area: unknown, serviceSlug: string) => {
      const normalized = normalizeServiceArea(area);
      if (!normalized) return;
      const key = areaKey(normalized);
      if (seen.has(key)) return;
      seen.add(key);
      result.push(enrichArea(normalized, serviceSlug, serviceAreaPages, fallbackDescription));
    };

    const sectionSlug = servingAreasSection?.serviceSlug?.trim();
    if (sectionSlug) {
      const match = services.find(
        (s: Service) => resolveServiceSlug(s) === normalizeSlug(sectionSlug)
      );
      const slug = match ? resolveServiceSlug(match) : normalizeSlug(sectionSlug);
      (match?.serviceAreas ?? []).forEach((area) => addArea(area, slug));
      if (result.length > 0) return result;
    }

    const published = services.filter((s) => s.status === 'published');
    for (const service of published) {
      const slug = resolveServiceSlug(service);
      (service.serviceAreas ?? []).forEach((area) => addArea(area, slug));
    }
    if (result.length > 0) return result;

    const defaultSlug = published[0] ? resolveServiceSlug(published[0]) : 'service';
    (site?.serviceAreas ?? []).forEach((area) => addArea(area, defaultSlug));

    if (result.length === 0 && serviceAreaPages?.length) {
      serviceAreaPages
        .filter((p) => p.status === 'published')
        .forEach((page) => {
          let slug = '';
          if (page.serviceId && typeof page.serviceId === 'object' && page.serviceId.slug) {
            slug = resolveServiceSlug({ slug: page.serviceId.slug });
          } else if (typeof page.serviceId === 'string') {
            const svc = services.find((s) => s._id === page.serviceId);
            slug = svc ? resolveServiceSlug(svc) : '';
          }
          addArea({ city: page.city, region: page.region, description: '' }, slug || 'service');
        });
    }

    return result;
  }, [
    servingAreasSection?.serviceSlug,
    services,
    site?.serviceAreas,
    serviceAreaPages,
    fallbackDescription,
  ]);

  const sectionTitle = useMemo(() => {
    const text = tiptapToText(servingAreasSection?.title);
    return text || 'Our Service Areas';
  }, [servingAreasSection?.title]);

  const sectionDescription = useMemo(() => {
    const text = tiptapToText(servingAreasSection?.description);
    return (
      text ||
      'We proudly serve communities across the region, bringing our professional services directly to you.'
    );
  }, [servingAreasSection?.description]);

  const contactHref = useMemo(() => {
    const contactPage = pages?.find((p) => p.pageType === 'contact');
    return contactPage ? getPageHref(contactPage) : '/contact-us';
  }, [pages]);

  if (!servingAreasSection || servingAreasSection.enabled === false) return null;
  if (serviceAreas.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={cn('relative py-20 lg:py-32 overflow-hidden', className)}
      style={{ fontFamily: fonts.body }}
    >
      <div className="absolute inset-0 animate-gradient-shift" style={styles.sectionGradientBg} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-float"
            style={{
              ...styles.floatingDot,
              left: `${15 + i * 12}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4 animate-fade-in-up"
            style={{ fontFamily: fonts.heading, ...styles.titleGradient, animationDelay: '0s' }}
          >
            {sectionTitle}
          </h2>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto animate-fade-in-up"
            style={{ color: colors.secondaryText, fontFamily: fonts.body, animationDelay: '200ms' }}
          >
            {sectionDescription}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceAreas.map((area, index) => (
            <AreaCard key={areaKey(area)} area={area} index={index} />
          ))}
        </div>

        <div
          className="text-center mt-12 sm:mt-16 animate-fade-in-up"
          style={{ animationDelay: `${400 + serviceAreas.length * 100}ms` }}
        >
          <div className="rounded-xl p-8 shadow-lg max-w-2xl mx-auto" style={styles.cardSolid}>
            <h3 className={`text-xl sm:text-2xl font-semibold mb-4`}
              style={{ fontFamily: fonts.heading, color: colors.mainText }}>
              Don&apos;t See Your Area?
            </h3>
            <p className="mb-6 max-w-xl mx-auto" style={{ color: colors.secondaryText, fontFamily: fonts.body }}>
              We&apos;re always expanding our service areas. Contact us to find out if we can serve your
              location.
            </p>
            <Link
              href={contactHref}
              className="inline-block px-8 py-4 font-medium text-sm tracking-wide uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 group relative overflow-hidden"
              style={{ fontFamily: fonts.body, backgroundColor: colors.mainText, color: 'var(--wb-text-on-dark, #fff)' }}
            >
              <span className="relative z-10 group-hover:animate-pulse">Get in Touch →</span>
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" style={{ background: `linear-gradient(to right, ${colors.primaryButton}, ${colors.hoverActive})` }} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

export default ServingAreasSection;
