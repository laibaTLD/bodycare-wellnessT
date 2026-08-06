'use client';

import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { resolvePrimaryCta } from '@/app/components/ui/made';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface AboutSectionProps {
  aboutSection?: Page['aboutSection'];
  page?: Page | null;
  className?: string;
}

export function AboutSection({ aboutSection, page, className }: AboutSectionProps) {
  const { site, pages } = useWebBuilder();
  const theme = useSectionTheme();

  const title = useMemo(() => tiptapToText(aboutSection?.title), [aboutSection?.title]);
  const description = useMemo(
    () => tiptapToText(aboutSection?.description),
    [aboutSection?.description]
  );
  const features = useMemo(
    () => aboutSection?.features?.filter((f) => f?.label?.trim()).map((f) => f.label.trim()) ?? [],
    [aboutSection?.features]
  );
  const ctaButton = useMemo(
    () => resolvePrimaryCta(page ?? null, site, pages) ?? { href: '#contact', label: 'Learn More' },
    [page, site, pages]
  );
  const image = useMemo(() => {
    const url = aboutSection?.image?.url;
    return url ? getImageSrc(url) : undefined;
  }, [aboutSection?.image?.url]);
  const imageAlt = aboutSection?.image?.altText?.trim() || 'About us';

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: featuresRef, visibleItems } = useStaggeredAnimation(features.length, 100);
  const { ref: imageRef, isVisible: imageVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  if (!aboutSection || aboutSection.enabled === false) return null;
  if (!title && !description && !image && features.length === 0) return null;

  const ctaIsExternal =
    ctaButton.href.startsWith('http') ||
    ctaButton.href.startsWith('mailto:') ||
    ctaButton.href.startsWith('tel:');

  const ctaClassName = cn(
    'inline-flex w-fit items-center px-6 sm:px-10 py-4 sm:py-5 font-medium text-sm tracking-wide uppercase no-underline transition-opacity duration-300 hover:opacity-90 rounded-xl',
    descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  );
  const ctaStyle = {
    ...theme.styles.primaryCta,
    fontFamily: theme.fonts.body,
    transitionDelay: `${900 + features.length * 120}ms`,
  };

  return (
    <section
      id="about"
      className={cn('py-16 sm:py-20 lg:py-32 relative overflow-hidden', className)}
      style={{ fontFamily: theme.fonts.body }}
    >
      <div className="absolute inset-0" style={theme.styles.sectionGradientBg} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-25 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${8 + i * 9}%`,
              top: `${12 + i * 8}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-16 left-6 w-20 h-20 opacity-15">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-sway"
          style={{ color: theme.colors.primaryButton }}
        >
          <path d="M25,75 Q35,25 50,45 Q65,25 75,75" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="30" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(-25 30 40)" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
          <ellipse cx="50" cy="30" rx="6" ry="12" fill="currentColor" transform="rotate(0 50 30)" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
          <ellipse cx="70" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(25 70 40)" className="animate-pulse" style={{ animationDelay: '1.8s' }} />
        </svg>
      </div>

      <div className="absolute bottom-16 right-6 w-18 h-18 opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-breathe"
          style={{ color: theme.colors.primaryButton }}
        >
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-ping" style={{ animationDelay: '0s' }} />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" className="animate-ping" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div
            ref={imageRef}
            className={cn(
              'w-full min-w-0 transition-all duration-1000 delay-500',
              imageVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            )}
          >
            {image ? (
              <div className="relative group w-full">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <OptimizedImage
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes={IMAGE_SIZES.portrait}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0" style={theme.styles.imageOverlay} />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom right, transparent, color-mix(in srgb, ${theme.colors.mainText} 10%, transparent))`,
                    }}
                  />
                </div>

                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3s' }}>
                  <svg className="w-5 h-5" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full animate-pulse" style={theme.styles.floatingDot} />
              </div>
            ) : (
              <div className="relative w-full">
                <div
                  className="aspect-[4/5] w-full rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                  style={theme.styles.sectionGradientBgSoft}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <svg className="w-10 h-10 animate-pulse" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="font-medium text-xs" style={theme.styles.accentText}>Wellness</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0 flex flex-col justify-center items-start lg:items-end gap-6 sm:gap-8">
            {title && (
              <h2
                ref={titleRef}
                className={cn(
                  'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] w-full max-w-xl text-left lg:text-right transition-all duration-1000',
                  titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                ref={descRef}
                className={cn(
                  'text-base sm:text-lg md:text-xl leading-relaxed w-full max-w-xl text-left lg:text-right transition-all duration-1000 delay-300',
                  descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ color: theme.colors.secondaryText, fontFamily: theme.fonts.body }}
              >
                {description}
              </p>
            )}

            {ctaButton &&
              (ctaIsExternal ? (
                <div className="w-full max-w-xl flex justify-start lg:justify-end">
                  <a href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                    {ctaButton.label} →
                  </a>
                </div>
              ) : (
                <div className="w-full max-w-xl flex justify-start lg:justify-end">
                  <Link href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                    {ctaButton.label} →
                  </Link>
                </div>
              ))}

            {features.length > 0 && (
              <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl">
                {features.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className={cn(
                      'group flex items-start space-x-4 p-5 sm:p-6 rounded-2xl backdrop-blur-sm shadow-lg border transition-all duration-500 hover:bg-white hover:shadow-xl hover:scale-105 hover:-translate-y-2',
                      visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    )}
                    style={{ ...theme.styles.card, transitionDelay: `${700 + index * 120}ms` }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                      style={theme.styles.iconBadge}
                    >
                      <svg
                        className="w-6 h-6 group-hover:animate-pulse"
                        style={{ color: 'var(--wb-text-on-dark, #fff)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="wb-text-on-light font-medium leading-relaxed group-hover:text-[var(--wb-primary)] transition-colors block">
                        {feature}
                      </span>
                      <div className="w-8 h-px mt-3 opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" style={theme.styles.dividerLine} />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            transform: translateY(-12px) rotate(2deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(2deg);
          }
          75% {
            transform: rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
