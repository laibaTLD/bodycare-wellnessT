'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Page } from '@/app/lib/types';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getPageHref } from '@/app/lib/siteContent';
import { cn } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface FAQSectionProps {
  faqSection?: Page['faqSection'];
  className?: string;
}

export function FAQSection({ faqSection, className }: FAQSectionProps) {
  const theme = useSectionTheme();
  const { site, pages } = useWebBuilder();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = useMemo(() => tiptapToText(faqSection?.title), [faqSection?.title]);
  const description = useMemo(() => tiptapToText(faqSection?.description), [faqSection?.description]);
  const questions = useMemo(
    () =>
      (faqSection?.items ?? [])
        .map((item) => ({
          question: tiptapToText(item?.question),
          answer: tiptapToText(item?.answer),
        }))
        .filter((item) => item.question || item.answer),
    [faqSection?.items]
  );

  const phoneNumber = site?.business?.phone?.trim();
  const contactPage = pages?.find((p) => p.pageType === 'contact');
  const footerCta = useMemo(() => {
    if (phoneNumber) {
      return {
        href: `tel:${phoneNumber.replace(/\s/g, '')}`,
        label: 'Call Our Team',
        external: true,
      };
    }
    if (contactPage) {
      return {
        href: getPageHref(contactPage),
        label: contactPage.name?.trim() || 'Contact Us',
        external: false,
      };
    }
    return null;
  }, [phoneNumber, contactPage]);

  if (!faqSection || faqSection.enabled === false) return null;
  if (!title && !description && questions.length === 0) return null;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const ctaButtonClassName =
    'inline-block px-8 py-4 font-medium text-sm tracking-wide uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 group relative overflow-hidden';

  const ctaButtonInner = (label: string) => (
    <>
      <span className="relative z-10 group-hover:animate-pulse">{label} →</span>
      <div
        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
        style={{
          background: `linear-gradient(to right, ${theme.colors.primaryButton}, ${theme.colors.hoverActive})`,
        }}
      />
    </>
  );

  return (
    <section className={cn('relative py-20 lg:py-32 overflow-hidden', className)}>
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={theme.styles.sectionGradientBg}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
              transform: 'rotate(45deg)',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-12 sm:mb-16">
          {title && (
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4 animate-fade-in-up"
              style={{ fontFamily: theme.fonts.heading, ...theme.styles.titleGradient }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto animate-fade-in-up wb-text-on-light-secondary"
              style={{ animationDelay: '200ms', fontFamily: theme.fonts.body }}
            >
              {description}
            </p>
          )}
        </div>

        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((faq, index) => (
              <div
                key={`${faq.question}-${index}`}
                className="rounded-xl overflow-hidden shadow-lg animate-fade-in-up"
                style={{ ...theme.styles.cardSolid, animationDelay: `${400 + index * 100}ms` }}
              >
                <button
                  type="button"
                  className="w-full px-6 py-5 text-left transition-colors duration-300 flex justify-between items-center group"
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={openIndex === index}
                >
                  <span
                    className="font-semibold text-base sm:text-lg pr-4 wb-text-on-light"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 transform group-hover:scale-110 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    style={theme.styles.accentText}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openIndex === index && faq.answer && (
                  <div
                    className="px-6 py-4 border-t animate-fade-in-down"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--wb-primary) 10%, transparent)',
                      backgroundColor: theme.colors.cardBackground,
                    }}
                  >
                    <p className="leading-relaxed wb-text-on-light-secondary" style={{ fontFamily: theme.fonts.body }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {footerCta && (
          <div
            className="text-center mt-12 sm:mt-16 animate-fade-in-up"
            style={{ animationDelay: `${400 + questions.length * 100}ms` }}
          >
            <p className="mb-4 text-lg wb-text-on-light-secondary" style={{ fontFamily: theme.fonts.body }}>
              Still have questions? We&apos;re here to help!
            </p>
            {footerCta.external ? (
              <a
                href={footerCta.href}
                className={ctaButtonClassName}
                style={{ ...theme.styles.primaryCta, fontFamily: theme.fonts.body }}
              >
                {ctaButtonInner(footerCta.label)}
              </a>
            ) : (
              <Link
                href={footerCta.href}
                className={ctaButtonClassName}
                style={{ ...theme.styles.primaryCta, fontFamily: theme.fonts.body }}
              >
                {ctaButtonInner(footerCta.label)}
              </Link>
            )}
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

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
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

        .animate-fade-in-down {
          animation: fade-in-down 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
