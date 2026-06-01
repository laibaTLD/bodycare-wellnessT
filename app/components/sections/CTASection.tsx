'use client';

import { OptimizedImage, IMAGE_QUALITY_HIGH, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

const FALLBACK_CTA_IMAGE =
  'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg';

type CtaSectionInput = Page['ctaSection'] & {
  subtitle?: unknown;
  label?: unknown;
  image?: { url?: string } | string;
  mediaItems?: Array<{ url?: string }>;
  ctaButton?: { text?: string; url?: string; label?: string; href?: string };
};

interface CTASectionProps {
  ctaSection?: Page['ctaSection'];
  className?: string;
}

function resolveCtaBackgroundImage(cta?: CtaSectionInput): string {
  if (!cta) return FALLBACK_CTA_IMAGE;

  const raw =
    cta.backgroundImage ??
    (typeof cta.image === 'string' ? cta.image : cta.image?.url) ??
    cta.mediaItems?.[0]?.url;

  if (!raw) return FALLBACK_CTA_IMAGE;
  if (typeof raw === 'string') return getImageSrc(raw);
  return FALLBACK_CTA_IMAGE;
}

function resolveCtaButton(cta?: CtaSectionInput): { label: string; href: string } | null {
  if (!cta) return null;

  const primary = cta.primaryButton;
  if (primary?.label?.trim()) {
    return {
      label: primary.label.trim(),
      href: primary.href?.trim() || '/',
    };
  }

  const legacy = cta.ctaButton;
  const label = legacy?.text?.trim() || legacy?.label?.trim();
  if (label) {
    return {
      label,
      href: legacy?.url?.trim() || legacy?.href?.trim() || '/contact-us',
    };
  }

  return null;
}

export function CTASection({ ctaSection, className }: CTASectionProps) {
  const theme = useSectionTheme();
  const cta = ctaSection as CtaSectionInput | undefined;

  const subHeading = useMemo(
    () => tiptapToText(cta?.subtitle) || tiptapToText(cta?.label) || '',
    [cta?.subtitle, cta?.label]
  );
  const heading = useMemo(() => tiptapToText(cta?.title), [cta?.title]);
  const description = useMemo(() => tiptapToText(cta?.description), [cta?.description]);
  const ctaButton = useMemo(() => resolveCtaButton(cta), [cta]);
  const ctaImage = useMemo(() => resolveCtaBackgroundImage(cta), [cta]);

  const { ref: contentRef, isVisible: contentVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { ref: buttonRef, isVisible: buttonVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  if (!ctaSection || ctaSection.enabled === false) return null;
  if (!heading && !description && !subHeading && !ctaButton) return null;

  const ctaIsExternal =
    ctaButton &&
    (ctaButton.href.startsWith('http') ||
      ctaButton.href.startsWith('mailto:') ||
      ctaButton.href.startsWith('tel:'));

  const ctaLinkClassName =
    'inline-flex items-center px-10 py-5 text-sm font-medium tracking-wide uppercase rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 group relative overflow-hidden';

  const ctaLinkContent = (label: string) => (
    <>
      <span className="relative z-10 flex items-center">
        {label}
        <svg
          className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
      <div
        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
        style={{
          background: `linear-gradient(to right, ${theme.colors.primaryButton}, ${theme.colors.hoverActive})`,
        }}
      />
      <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
    </>
  );

  return (
    <section
      className={cn(
        'py-20 lg:py-32 relative overflow-hidden min-h-[600px] flex items-center',
        className
      )}
      style={cta?.backgroundColor ? { backgroundColor: cta.backgroundColor } : undefined}
    >
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={theme.styles.sectionGradientBg}
      />

      <div className="absolute inset-0 opacity-120">
        <OptimizedImage
          src={ctaImage}
          alt="CTA background"
          fill
          quality={IMAGE_QUALITY_HIGH}
          sizes={IMAGE_SIZES.fullWidth}
          className="object-cover"
          priority
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, color-mix(in srgb, ${theme.colors.pageBackground} 90%, transparent), color-mix(in srgb, ${theme.colors.sectionBackgroundLight} 80%, transparent), color-mix(in srgb, ${theme.colors.primaryButton} 20%, transparent))`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '73.25%', top: '29.10%', animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '82.38%', top: '14.00%', animationDelay: '0.5s', animationDuration: '6.4s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '73.25%', top: '49.34%', animationDelay: '1s', animationDuration: '6.8s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '66.96%', top: '29.37%', animationDelay: '1.5s', animationDuration: '7.2s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '7.86%', top: '23.60%', animationDelay: '2s', animationDuration: '7.6s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '96.88%', top: '45.12%', animationDelay: '2.5s', animationDuration: '8s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '42.53%', top: '87.65%', animationDelay: '3s', animationDuration: '8.4s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '15.27%', top: '63.91%', animationDelay: '3.5s', animationDuration: '8.8s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '24.18%', top: '32.74%', animationDelay: '4s', animationDuration: '9.2s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '58.63%', top: '76.29%', animationDelay: '4.5s', animationDuration: '9.6s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '35.42%', top: '18.53%', animationDelay: '5s', animationDuration: '10s' }} />
        <div className="absolute w-1 h-1 rounded-full opacity-40 animate-float" style={{ ...theme.styles.floatingDot, left: '89.71%', top: '82.16%', animationDelay: '5.5s', animationDuration: '10.4s' }} />
      </div>

      <div className="absolute top-10 left-10 w-32 h-32 opacity-50 animate-sway" style={theme.styles.accentText}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,90 Q20,60 30,30 Q40,20 50,40 Q60,20 70,30 Q80,60 50,90" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-15 animate-sway" style={{ animationDelay: '3s', ...theme.styles.accentText }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5" className="animate-pulse" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center" ref={contentRef}>
          {subHeading && (
            <p
              className={`text-sm font-semibold uppercase tracking-wider mb-6 transition-all duration-1000 ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ ...theme.styles.accentText, fontFamily: theme.fonts.body }}
            >
              {subHeading}
            </p>
          )}

          {heading && (
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-8 leading-tight transition-all duration-1000 delay-200 ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: theme.fonts.heading, ...theme.styles.titleGradient }}
            >
              {heading}
            </h2>
          )}

          {description && (
            <p
              className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 wb-text-on-light-secondary ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: theme.fonts.body }}
            >
              {description}
            </p>
          )}

          {ctaButton &&
            (ctaIsExternal ? (
              <div
                ref={buttonRef}
                className={`transition-all duration-1000 delay-600 ${
                  buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <a
                  href={ctaButton.href}
                  className={ctaLinkClassName}
                  style={{ ...theme.styles.primaryCta, fontFamily: theme.fonts.body }}
                >
                  {ctaLinkContent(ctaButton.label)}
                </a>
              </div>
            ) : (
              <div
                ref={buttonRef}
                className={`transition-all duration-1000 delay-600 ${
                  buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link
                  href={ctaButton.href}
                  className={ctaLinkClassName}
                  style={{ ...theme.styles.primaryCta, fontFamily: theme.fonts.body }}
                >
                  {ctaLinkContent(ctaButton.label)}
                </Link>
              </div>
            ))}

          <div className="mt-12 flex justify-center gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  buttonVisible ? 'opacity-60' : 'opacity-0'
                }`}
                style={{
                  ...theme.styles.dividerDot,
                  animationDelay: `${1000 + i * 200}ms`,
                  animation: buttonVisible ? `pulse 2s ease-in-out ${i * 0.3}s infinite` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ color: theme.colors.pageBackground }}>
        <svg viewBox="0 0 1440 120" className="w-full h-20">
          <path
            fill="currentColor"
            d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,64 L1440,120 L0,120 Z"
            className="animate-wave"
          />
        </svg>
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

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(-5deg) translateX(0);
          }
          50% {
            transform: rotate(5deg) translateX(10px);
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

        @keyframes wave {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 6s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
