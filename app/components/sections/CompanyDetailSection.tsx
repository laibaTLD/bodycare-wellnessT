'use client';

import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface CompanyDetailSectionProps {
  companyDetailSection?: Page['companyDetailSection'];
  className?: string;
}

type DetailBlock = {
  heading: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
};

function normalizeDetailBlocks(
  companyDetailSection?: Page['companyDetailSection']
): DetailBlock[] {
  if (!companyDetailSection?.details?.length) return [];

  const blocks: DetailBlock[] = [];

  companyDetailSection.details.forEach((detail, index) => {
    const heading = tiptapToText(detail.title) || detail.label?.trim() || '';
    const description =
      tiptapToText(detail.description) ||
      (!detail.title && !detail.description ? tiptapToText(detail.value) : '');
    const imageUrl = detail.image?.url ? getImageSrc(detail.image.url) : undefined;
    const imageAlt =
      detail.image?.altText?.trim() || heading || `Company detail ${index + 1}`;

    if (!heading && !description && !imageUrl) return;

    blocks.push({ heading, description, imageUrl, imageAlt });
  });

  return blocks;
}

export function CompanyDetailSection({
  companyDetailSection,
  className,
}: CompanyDetailSectionProps) {
  const theme = useSectionTheme();

  const heading = useMemo(
    () => tiptapToText(companyDetailSection?.title),
    [companyDetailSection?.title]
  );
  const description = useMemo(
    () => tiptapToText(companyDetailSection?.description),
    [companyDetailSection?.description]
  );
  const sections = useMemo(
    () => normalizeDetailBlocks(companyDetailSection),
    [companyDetailSection]
  );

  const { ref: headingRef, isVisible: headingVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: sectionsRef, visibleItems } = useStaggeredAnimation(sections.length, 200);

  if (!companyDetailSection || companyDetailSection.enabled === false) return null;
  if (!heading && !description && sections.length === 0) return null;

  return (
    <section
      className={cn('py-20 lg:py-32 relative overflow-hidden', className)}
      style={{ fontFamily: theme.fonts.body }}
    >
      <div className="absolute inset-0" style={theme.styles.sectionGradientBgAlt} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${5 + i * 6}%`,
              top: `${10 + i * 6}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-24 left-8 w-16 h-16 opacity-15">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-sway"
          style={{ color: theme.colors.primaryButton }}
        >
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.8" className="animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-24 right-8 w-14 h-14 opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-breathe"
          style={{ color: theme.colors.primaryButton }}
        >
          <path d="M30,50 Q40,20 50,50 Q60,20 70,50 Q60,80 50,50 Q40,80 30,50" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20 lg:mb-28">
          <div
            className={`inline-flex items-center justify-center w-18 h-18 rounded-full mb-8 shadow-lg transition-all duration-1000 ${
              headingVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {heading && (
            <h2
              ref={headingRef}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 transition-all duration-1000',
                headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
            >
              {heading}
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

        {sections.length > 0 && (
          <div ref={sectionsRef} className="space-y-20 lg:space-y-32">
            {sections.map((section, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={`${section.heading}-${index}`}
                  className={`transition-all duration-1000 ${
                    visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`grid lg:grid-cols-5 gap-12 lg:gap-16 items-center ${
                      isEven ? 'lg:grid-flow-col' : 'lg:grid-flow-col-dense'
                    }`}
                  >
                    {section.imageUrl && (
                      <div className={`lg:col-span-3 ${!isEven ? 'lg:col-start-3' : ''}`}>
                        <div className="relative group">
                          <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105">
                            <div className="aspect-[16/10] relative">
                              <OptimizedImage
                                src={section.imageUrl}
                                alt={section.imageAlt}
                                fill
                                sizes={IMAGE_SIZES.sectionWide}
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent transition-all duration-500"
                                style={{
                                  background: `linear-gradient(to bottom right, transparent, color-mix(in srgb, ${theme.colors.primaryButton} 10%, transparent))`,
                                }}
                              />
                            </div>
                          </div>

                          <div
                            className="absolute -top-4 -right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center animate-float"
                            style={{ animationDelay: `${index * 0.5}s` }}
                          >
                            <svg className="w-6 h-6" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>

                          <div
                            className="absolute -bottom-6 -left-6 w-8 h-8 rounded-full shadow-md animate-pulse"
                            style={{ ...theme.styles.floatingDot, animationDelay: `${index * 0.7}s` }}
                          />
                          <div
                            className="absolute top-1/4 -left-3 w-3 h-3 bg-white rounded-full shadow-sm animate-ping"
                            style={{ animationDelay: `${index * 0.9}s` }}
                          />
                          <div
                            className="absolute bottom-1/3 -right-2 w-4 h-4 rounded-full animate-bounce"
                            style={{ backgroundColor: theme.colors.hoverActive, opacity: 0.7, animationDelay: `${index * 1.1}s` }}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`lg:col-span-2 space-y-6 ${
                        isEven ? 'lg:col-start-4' : 'lg:col-start-1'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={theme.styles.iconBadge}
                        >
                          <span
                            className="text-white text-lg font-bold"
                            style={{ fontFamily: theme.fonts.heading }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1 h-px" style={theme.styles.dividerLine} />
                      </div>

                      {section.heading && (
                        <h3
                          className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight transition-colors duration-300 group-hover:text-[var(--wb-primary)]"
                          style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
                        >
                          {section.heading}
                        </h3>
                      )}

                      {section.description && (
                        <p className="text-lg leading-relaxed wb-text-on-light-secondary">
                          {section.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-3 pt-4">
                        <div className="w-3 h-3 rounded-full animate-pulse" style={theme.styles.dividerDot} />
                        <div className="w-6 h-px" style={theme.styles.dividerLine} />
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: theme.colors.hoverActive, animationDelay: '0.5s' }}
                        />
                        <div className="w-4 h-px" style={{ ...theme.styles.dividerLine, opacity: 0.65 }} />
                        <div
                          className="w-1 h-1 rounded-full animate-pulse"
                          style={{ backgroundColor: theme.colors.primaryButton, opacity: 0.6, animationDelay: '1s' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            transform: translateY(-10px) rotate(1deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
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
          animation: sway 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
