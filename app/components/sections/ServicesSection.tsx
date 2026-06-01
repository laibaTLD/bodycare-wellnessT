'use client';

import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Page, Service } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';
import { resolveServiceSlug } from '@/app/lib/serviceAreaSlugs';

const FALLBACK_SERVICE_IMAGE =
  'https://images.pexels.com/photos/6195895/pexels-photo-6195895.jpeg';

interface ServicesSectionProps {
  servicesSection?: Page['servicesSection'];
  companyDetailSection?: Page['companyDetailSection'];
  ctaSection?: Page['ctaSection'];
  page?: Page | null;
  className?: string;
}

type DisplayService = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

function formatServicePrice(service: Service): string {
  if (service.price?.trim()) return service.price.trim();
  if (service.priceType === 'quote') return 'Quote';
  if (service.priceType === 'range') return 'Custom';
  return '';
}

function mapServiceToDisplay(service: Service): DisplayService {
  const imageUrl = service.thumbnailImage?.url
    ? getImageSrc(service.thumbnailImage.url)
    : service.galleryImages?.[0]?.url
      ? getImageSrc(service.galleryImages[0].url)
      : FALLBACK_SERVICE_IMAGE;

  const imageAlt =
    service.thumbnailImage?.altText ||
    service.galleryImages?.[0]?.altText ||
    service.name;

  return {
    id: service._id,
    name: service.name,
    description: tiptapToText(service.shortDescription) || '',
    price: formatServicePrice(service),
    imageUrl,
    imageAlt,
    href: `/service/${resolveServiceSlug(service)}`,
  };
}

function ServiceCard({
  service,
  index,
  visible,
}: {
  service: DisplayService;
  index: number;
  visible: boolean;
}) {
  const theme = useSectionTheme();

  const card = (
    <div
      className={`group relative h-[750px] transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 180}ms` }}
    >
      <div
        className="relative flex h-full min-h-full flex-col bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 hover:scale-105 border group"
        style={theme.styles.card}
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
          <OptimizedImage
            src={service.imageUrl}
            alt={service.imageAlt}
            fill
            sizes={IMAGE_SIZES.card}
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 transition-all duration-500" style={theme.styles.imageOverlay} />
          {service.price && (
            <div
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg animate-bounce"
              style={{ animationDelay: `${index * 0.3}s`, animationDuration: '3s' }}
            >
              <span
                className="wb-text-on-light font-bold text-lg"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {service.price}
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md animate-pulse">
            <svg className="w-6 h-6" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-8">
          <h3
            className="text-2xl md:text-3xl font-semibold leading-tight group-hover:text-[var(--wb-primary)] transition-colors duration-300"
            style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
          >
            {service.name}
          </h3>

          {service.description && (
            <p className="mt-6 flex-1 leading-relaxed wb-text-on-light-secondary">
              {service.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-center space-x-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-2 h-2 rounded-full animate-ping" style={{ ...theme.styles.floatingDot, animationDelay: '0s' }} />
            <div className="w-8 h-px" style={theme.styles.dividerLine} />
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.hoverActive }} />
            <div className="w-8 h-px" style={theme.styles.dividerLine} />
            <div
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: theme.colors.primaryButton, opacity: 0.6, animationDelay: '0.5s' }}
            />
          </div>
        </div>

        <div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-lg animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ ...theme.styles.floatingDot, animationDelay: `${index * 0.2}s` }}
        />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full shadow-md animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );

  return (
    <Link href={service.href} className="block h-full w-[300px] md:w-[350px]">
      {card}
    </Link>
  );
}

export function ServicesSection({
  servicesSection,
  className,
}: ServicesSectionProps) {
  const { services: allServices } = useWebBuilder();
  const theme = useSectionTheme();

  const title = useMemo(() => tiptapToText(servicesSection?.title), [servicesSection?.title]);
  const description = useMemo(
    () => tiptapToText(servicesSection?.description),
    [servicesSection?.description]
  );

  const displayServices = useMemo(() => {
    const ids = servicesSection?.serviceIds ?? [];
    const selected =
      ids.length > 0
        ? ids
            .map((id) => allServices.find((s) => s._id === id))
            .filter((s): s is Service => Boolean(s))
        : allServices.filter((s) => s.status === 'published');

    return selected.map(mapServiceToDisplay);
  }, [servicesSection?.serviceIds, allServices]);

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: gridRef, visibleItems } = useStaggeredAnimation(displayServices.length, 180);

  if (!servicesSection || servicesSection.enabled === false) return null;
  if (!title && !description && displayServices.length === 0) return null;

  return (
    <section
      id="services"
      className={cn('py-20 lg:py-32 relative overflow-hidden', className)}
      style={{ fontFamily: theme.fonts.body }}
    >
      <div className="absolute inset-0" style={theme.styles.sectionGradientBg} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${4 + i * 5.3}%`,
              top: `${8 + i * 5.1}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${5 + i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-10 w-16 h-16 opacity-15">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-sway"
          style={{ color: theme.colors.primaryButton }}
        >
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-14 h-14 opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-breathe"
          style={{ color: theme.colors.primaryButton }}
        >
          <path
            d="M25,50 Q37,25 50,50 Q63,25 75,50 Q63,75 50,50 Q37,75 25,50"
            fill="currentColor"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20 lg:mb-24">
          <div
            className={`inline-flex items-center justify-center w-18 h-18 rounded-full mb-8 shadow-lg transition-all duration-1000 ${
              titleVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'
            }`}
            style={theme.styles.iconBadge}
          >
            <svg
              className="w-9 h-9 animate-pulse"
              style={{ color: 'var(--wb-text-on-dark, #fff)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          {title && (
            <h2
              ref={titleRef}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 transition-all duration-1000',
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
            >
              {title}
            </h2>
          )}

          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px" style={theme.styles.dividerLine} />
            <div className="w-4 h-4 rounded-full mx-6 animate-pulse" style={theme.styles.dividerDot} />
            <div className="w-16 h-px" style={theme.styles.dividerLine} />
          </div>

          {description && (
            <p
              ref={descRef}
              className={cn(
                'text-lg md:text-xl max-w-4xl mx-auto leading-relaxed wb-text-on-light-secondary transition-all duration-1000 delay-300',
                descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {description}
            </p>
          )}
        </div>

        {displayServices.length > 0 && (
          <div ref={gridRef} className="flex flex-wrap items-stretch justify-center gap-8 lg:gap-10">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                visible={visibleItems.includes(index)}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default ServicesSection;
