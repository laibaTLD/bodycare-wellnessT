'use client';

import { OptimizedImage, IMAGE_QUALITY_HIGH, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { resolvePrimaryCta } from '@/app/components/ui/made';
import {
  getHeroDescriptionExcerpt,
  getHeroTitleText,
} from '@/app/lib/siteContent';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface HeroSectionProps {
  hero?: Page['hero'];
  page?: Page | null;
  className?: string;
}

function getHeroGalleryImages(hero?: Page['hero']): { url: string; alt: string }[] {
  if (!hero) return [];

  const rawItems: Array<{ url?: string; altText?: string }> = [];
  if (hero.media?.url) rawItems.push(hero.media);
  if (hero.mediaItems?.length) rawItems.push(...hero.mediaItems);

  const h = hero as Page['hero'] & { images?: Array<{ url?: string; altText?: string } | string> };
  if (h.images?.length) {
    for (const item of h.images) {
      if (typeof item === 'string') rawItems.push({ url: item });
      else if (item?.url) rawItems.push(item);
    }
  }

  const seen = new Set<string>();
  const result: { url: string; alt: string }[] = [];

  for (const item of rawItems) {
    if (!item?.url || seen.has(item.url)) continue;
    seen.add(item.url);
    result.push({
      url: getImageSrc(item.url),
      alt: item.altText?.trim() || 'Wellness hero',
    });
    if (result.length >= 3) break;
  }

  return result;
}

function HeroMeditationFigure() {
  const theme = useSectionTheme();
  const { colors } = theme;

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="w-32 h-40 bg-gradient-to-b from-[#f4d1c9] to-[#e8b5a8] rounded-full relative group-hover:animate-pulse">
        {/* Animated meditation person */}
        <div 
          className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full animate-breathe"
          style={{ backgroundColor: '#d49a8a' }}
        />
        <div 
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-20 h-24 rounded-t-full"
          style={{
            background: `linear-gradient(to bottom, color-mix(in srgb, ${colors.primaryButton} 90%, white), color-mix(in srgb, ${colors.primaryButton} 75%, black))`,
          }}
        />
        {/* Floating meditation aura */}
        <div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 border-2 rounded-full opacity-30 animate-ping"
          style={{ borderColor: colors.primaryButton }}
        />
      </div>
      <div 
        className="absolute top-4 right-4 text-xs opacity-60 animate-bounce"
        style={{ color: colors.primaryButton, animationDelay: '1s' }}
      >
        Meditate
      </div>
      {/* Floating zen particles */}
      <div 
        className="absolute top-12 left-8 w-2 h-2 rounded-full opacity-50 animate-float"
        style={{ backgroundColor: colors.primaryButton, animationDelay: '0.5s' }}
      />
      <div 
        className="absolute bottom-20 right-8 w-1 h-1 rounded-full opacity-40 animate-float"
        style={{ backgroundColor: colors.primaryButton, animationDelay: '1.5s' }}
      />
    </div>
  );
}

function HeroImagePlaceholder({ variant }: { variant: 'yoga' | 'relax' }) {
  const theme = useSectionTheme();
  const { colors } = theme;

  if (variant === 'yoga') {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-24 h-32 relative group-hover:animate-bounce">
          {/* Animated yoga pose */}
          <div 
            className="absolute top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full animate-pulse"
            style={{ backgroundColor: '#d49a8a' }}
          />
          <div 
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-16 rounded-t-lg"
            style={{
              background: `linear-gradient(to bottom, ${colors.mainText}, color-mix(in srgb, ${colors.mainText} 80%, black))`,
            }}
          />
          <div 
            className="absolute top-16 left-3 w-6 h-12 rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-1000"
            style={{ backgroundColor: '#d49a8a' }}
          />
          <div 
            className="absolute top-16 right-3 w-6 h-12 rounded-full transform -rotate-45 group-hover:-rotate-90 transition-transform duration-1000"
            style={{ backgroundColor: '#d49a8a' }}
          />
          {/* Energy lines */}
          <div 
            className="absolute inset-0 border rounded-full opacity-20 animate-spin"
            style={{ borderColor: colors.primaryButton, animationDuration: '8s' }}
          />
        </div>
        <div className="absolute bottom-4 left-4 text-xs opacity-60 animate-pulse" style={{ color: colors.primaryButton }}>
          Yoga
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-20 h-24 relative">
        {/* Animated spa wellness illustration */}
        <div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 opacity-60 group-hover:animate-spin"
          style={{
            backgroundColor: colors.sectionBackgroundLight,
            borderColor: colors.primaryButton,
            animationDuration: '3s',
          }}
        />
        <div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full animate-pulse"
          style={{ backgroundColor: colors.primaryButton }}
        />
        {/* Floating spa bubbles */}
        <div 
          className="absolute bottom-2 left-2 w-3 h-3 rounded-full opacity-40 animate-bounce"
          style={{ backgroundColor: colors.primaryButton, animationDelay: '0.3s' }}
        />
        <div 
          className="absolute bottom-4 right-2 w-2 h-2 rounded-full opacity-60 animate-bounce"
          style={{ backgroundColor: colors.primaryButton, animationDelay: '0.7s' }}
        />
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-80 animate-bounce"
          style={{ backgroundColor: colors.primaryButton, animationDelay: '1.1s' }}
        />
        {/* Ripple effect */}
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 rounded-full opacity-20 animate-ping"
          style={{ borderColor: colors.primaryButton }}
        />
      </div>
      <div className="absolute bottom-4 right-4 text-xs opacity-60 animate-pulse" style={{ color: colors.primaryButton }}>
        Relax
      </div>
    </div>
  );
}

export function HeroSection({ hero, page, className }: HeroSectionProps) {
  const theme = useSectionTheme();
  const { colors, fonts, styles } = theme;
  const { site, pages } = useWebBuilder();

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.3 });
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.3 });
  const { ref: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation<HTMLParagraphElement>({ threshold: 0.3 });
  const { ref: imageGridRef, isVisible: imageGridVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  const title = useMemo(() => getHeroTitleText(hero, site), [hero, site]);
  const subtitle = useMemo(() => tiptapToText(hero?.subtitle), [hero?.subtitle]);
  const description = useMemo(
    () => tiptapToText(hero?.description) || getHeroDescriptionExcerpt(hero, 500),
    [hero]
  );
  const ctaButton = useMemo(
    () => resolvePrimaryCta(page ?? null, site, pages) ?? { href: '#contact', label: 'Learn More' },
    [page, site, pages]
  );
  const galleryImages = useMemo(() => getHeroGalleryImages(hero), [hero]);

  if (!hero || hero.enabled === false) return null;
  if (!title && !subtitle && !description) return null;

  const ctaIsExternal =
    ctaButton.href.startsWith('http') ||
    ctaButton.href.startsWith('mailto:') ||
    ctaButton.href.startsWith('tel:');

  const ctaClassName = cn(
    'inline-flex w-fit self-start items-center px-8 py-4 font-medium text-sm tracking-wide uppercase no-underline transition-opacity duration-300 hover:opacity-90',
    descriptionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  );

  const ctaStyle: React.CSSProperties = {
    ...styles.primaryCta,
    fontFamily: fonts.body,
    transitionDelay: '700ms',
  };

  const renderGalleryCell = (
    index: number,
    variant: 'yoga' | 'relax',
    cellClassName: string,
    delay: string,
    bgStyle?: React.CSSProperties
  ) => {
    const image = index > 0 ? galleryImages[index] : undefined;
    return (
      <div
        className={`${cellClassName} ${imageGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: delay, ...bgStyle }}
      >
        {index === 0 ? (
          <HeroMeditationFigure />
        ) : image ? (
          <div className="relative w-full h-full min-h-[12rem]">
            <OptimizedImage
              src={image.url}
              alt={image.alt}
              fill
              quality={IMAGE_QUALITY_HIGH}
              sizes={IMAGE_SIZES.heroCell}
              className="object-cover"
              priority={index === 1}
            />
          </div>
        ) : (
          <HeroImagePlaceholder variant={variant} />
        )}
      </div>
    );
  };

  const gridCellBase =
    'h-full min-h-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 group';

  return (
    <section
      className={cn('relative pt-0 pb-4 lg:pb-8 overflow-hidden', className)}
      style={{ fontFamily: fonts.body }}
    >
      {/* Animated Background gradient driven by site engine state styles */}
      <div className="absolute inset-0 animate-gradient-shift" style={styles.sectionGradientBg} />

      {/* Floating particles inside client sandbox layout bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-float"
            style={{
              backgroundColor: colors.primaryButton,
              left: `${15 + i * 12}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch py-4 sm:py-6">
          
          {/* Left Column - Dynamic Builder Content Engine */}
          <div className="flex h-full min-w-0 flex-col justify-center space-y-4 sm:space-y-6">
            <h1
              ref={titleRef}
              className={cn(
                'text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold leading-[1.15] break-words transition-all duration-1000 hover:scale-105 cursor-default',
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ 
                fontFamily: fonts.heading, 
                background: `linear-gradient(135deg, ${colors.mainText} 0%, ${colors.primaryButton} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <h2
                ref={subtitleRef}
                className={cn(
                  'text-base sm:text-lg md:text-xl font-normal leading-relaxed transition-all duration-1000 delay-300',
                  subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ color: colors.mainText, opacity: 0.8 }}
              >
                {subtitle}
              </h2>
            )}

            {description && (
              <p
                ref={descriptionRef}
                className={cn(
                  'text-base leading-relaxed max-w-md transition-all duration-1000 delay-500',
                  descriptionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ color: colors.secondaryText }}
              >
                {description}
              </p>
            )}

            {ctaButton &&
              (ctaIsExternal ? (
                <a href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                  {ctaButton.label} →
                </a>
              ) : (
                <Link href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                  {ctaButton.label} →
                </Link>
              ))}
          </div>

          {/* Right Column - Premium Graphic Matrix Shell */}
          <div className="relative flex h-full min-h-[280px] sm:min-h-[340px] lg:min-h-full min-w-0 flex-col overflow-hidden" ref={imageGridRef}>
            {/* Animated decorative plant elements */}
            <div
              className={cn(
                'absolute -top-10 -right-10 z-10 w-32 h-32 opacity-30 transition-all duration-1000 hidden sm:block pointer-events-none',
                imageGridVisible ? 'animate-sway rotate-12' : 'opacity-0 scale-50'
              )}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: colors.primaryButton }}>
                <path d="M20,80 Q30,20 50,40 Q70,20 80,80" fill="none" stroke="currentColor" strokeWidth="2" />
                <ellipse cx="25" cy="35" rx="8" ry="15" fill="currentColor" transform="rotate(-45 25 35)" className="animate-pulse" />
                <ellipse cx="35" cy="45" rx="6" ry="12" fill="currentColor" transform="rotate(-30 35 45)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <ellipse cx="50" cy="30" rx="7" ry="14" fill="currentColor" transform="rotate(0 50 30)" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <ellipse cx="65" cy="45" rx="6" ry="12" fill="currentColor" transform="rotate(30 65 45)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                <ellipse cx="75" cy="35" rx="8" ry="15" fill="currentColor" transform="rotate(45 75 35)" className="animate-pulse" style={{ animationDelay: '2s' }} />
              </svg>
            </div>

            {/* Bottom left plant with breathing animation */}
            <div
              className={cn(
                'absolute -bottom-5 -left-5 z-10 w-24 h-24 opacity-40 transition-all duration-1000 hidden sm:block pointer-events-none',
                imageGridVisible ? 'animate-breathe' : 'opacity-0 scale-50'
              )}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: colors.primaryButton }}>
                <path d="M50,90 Q20,60 30,30 Q40,20 50,40 Q60,20 70,30 Q80,60 50,90" fill="currentColor" className="animate-pulse" />
                <ellipse cx="40" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(-20 40 40)" />
                <ellipse cx="60" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(20 60 40)" />
              </svg>
            </div>

            {/* Image Grid — fills the column so both sides match height */}
            <div className="grid h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] grid-cols-2 gap-3 sm:gap-4">
              {renderGalleryCell(
                0,
                'yoga',
                `row-span-2 ${gridCellBase}`,
                '200ms',
                {
                  background: `linear-gradient(to bottom right, ${colors.sectionBackgroundLight}, color-mix(in srgb, ${colors.primaryButton} 15%, ${colors.sectionBackgroundLight}))`,
                }
              )}
              {renderGalleryCell(
                1,
                'yoga',
                cn(gridCellBase, 'hover:rotate-1'),
                '400ms',
                {
                  background: `linear-gradient(to bottom right, ${colors.pageBackground}, ${colors.sectionBackgroundLight})`,
                }
              )}
              {renderGalleryCell(
                2,
                'relax',
                cn(gridCellBase, 'hover:-rotate-1'),
                '600ms',
                {
                  background: `linear-gradient(to bottom right, ${colors.pageBackground}, color-mix(in srgb, ${colors.sectionBackgroundLight} 80%, ${colors.pageBackground}))`,
                }
              )}
            </div>

            {/* Enhanced floating decorative theme indicators */}
            <div className="absolute top-1/3 -right-6 w-4 h-4 rounded-full opacity-30 animate-float pointer-events-none" style={{ backgroundColor: colors.primaryButton, animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute bottom-1/3 -left-3 w-3 h-3 rounded-full opacity-40 animate-float pointer-events-none" style={{ backgroundColor: colors.primaryButton, animationDelay: '1s', animationDuration: '4s' }} />
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-50 animate-float pointer-events-none" style={{ backgroundColor: colors.primaryButton, animationDelay: '2s', animationDuration: '5s' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-breathe { animation: breathe 3s ease-in-out infinite; }
        .animate-sway { animation: sway 6s ease-in-out infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
      `}</style>
    </section>
  );
}