'use client';

import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { cn } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface TestimonialsSectionProps {
  testimonialsSection?: Page['testimonialsSection'];
  className?: string;
}

type DisplayTestimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
};

type TestimonialInput = {
  name?: string;
  role?: string;
  company?: string;
  text?: unknown;
  content?: unknown;
};

function mapTestimonial(item: TestimonialInput, index: number): DisplayTestimonial | null {
  const name = item.name?.trim() ?? '';
  const text =
    tiptapToText(item.text) ||
    tiptapToText(item.content) ||
    (typeof item.text === 'string' ? item.text.trim() : '') ||
    (typeof item.content === 'string' ? item.content.trim() : '');

  if (!name && !text) return null;

  return {
    id: `${name}-${index}`,
    name: name || 'Client',
    role: item.role?.trim() ?? '',
    company: item.company?.trim() ?? '',
    text,
  };
}

export function TestimonialsSection({ testimonialsSection, className }: TestimonialsSectionProps) {
  const theme = useSectionTheme();
  const { testimonials: globalTestimonials } = useWebBuilder();

  const title = useMemo(() => {
    const pageTitle = tiptapToText(testimonialsSection?.title);
    if (pageTitle) return pageTitle;
    return globalTestimonials?.title?.trim() ?? '';
  }, [testimonialsSection?.title, globalTestimonials?.title]);

  const description = useMemo(() => {
    const pageDescription = tiptapToText(testimonialsSection?.description);
    if (pageDescription) return pageDescription;
    return globalTestimonials?.description?.trim() ?? '';
  }, [testimonialsSection?.description, globalTestimonials?.description]);

  const displayTestimonials = useMemo(() => {
    const pageItems = (testimonialsSection?.testimonials ?? [])
      .map((item, index) => mapTestimonial(item, index))
      .filter((item): item is DisplayTestimonial => Boolean(item));

    if (pageItems.length > 0) return pageItems;

    return (globalTestimonials?.testimonials ?? [])
      .map((item, index) => mapTestimonial(item, index))
      .filter((item): item is DisplayTestimonial => Boolean(item));
  }, [testimonialsSection?.testimonials, globalTestimonials?.testimonials]);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.3,
  });
  const { ref: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation<HTMLParagraphElement>({
    threshold: 0.3,
  });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });

  if (testimonialsSection?.enabled === false) return null;
  if (!title && !description && displayTestimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className={cn('py-20 lg:py-32 relative overflow-hidden', className)}
    >
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={theme.styles.sectionGradientBg}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-30 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${10 + i * 11}%`,
              top: `${15 + i * 8}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${5 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-10 left-10 w-24 h-24 opacity-20 animate-sway" style={theme.styles.accentText}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,90 Q30,50 40,20 Q50,10 60,20 Q70,50 50,90" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div
        className="absolute bottom-10 right-10 w-32 h-32 opacity-15 animate-sway"
        style={{ animationDelay: '2s', ...theme.styles.accentText }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="animate-breathe" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          {title && (
            <h2
              ref={titleRef}
              className={`text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 transition-all duration-1000 ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: theme.fonts.heading, ...theme.styles.titleGradient }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              ref={descriptionRef}
              className={`text-base md:text-lg max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 wb-text-on-light-secondary ${
                descriptionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: theme.fonts.body }}
            >
              {description}
            </p>
          )}
        </div>

        {displayTestimonials.length > 0 && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`group relative backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ ...theme.styles.card, transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"
                  style={{
                    background: `linear-gradient(to bottom right, color-mix(in srgb, var(--wb-primary) 5%, transparent), transparent)`,
                  }}
                />

                <div
                  className="absolute top-4 right-6 text-6xl font-serif animate-float opacity-10"
                  style={{ ...theme.styles.accentText, animationDelay: `${index * 0.5}s` }}
                >
                  &ldquo;
                </div>

                <div className="relative z-10">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 relative">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center font-semibold text-lg shadow-lg group-hover:animate-pulse"
                        style={{ ...theme.styles.iconBadge, color: 'var(--wb-text-on-dark, #fff)' }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div
                        className="absolute inset-0 w-14 h-14 rounded-full border-2 opacity-0 group-hover:opacity-30 group-hover:animate-ping"
                        style={{ borderColor: theme.colors.primaryButton }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg wb-text-on-light" style={{ fontFamily: theme.fonts.body }}>
                        {testimonial.name}
                      </h4>
                      {testimonial.role && (
                        <p className="text-sm wb-text-on-light-secondary" style={{ fontFamily: theme.fonts.body }}>
                          {testimonial.role}
                        </p>
                      )}
                      {testimonial.company && (
                        <p className="text-sm font-medium" style={{ ...theme.styles.accentText, fontFamily: theme.fonts.body }}>
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {testimonial.text && (
                    <blockquote
                      className="italic leading-relaxed mb-6 wb-text-on-light-secondary"
                      style={{ fontFamily: theme.fonts.body }}
                    >
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current group-hover:animate-pulse"
                        style={{ ...theme.styles.accentText, animationDelay: `${i * 0.1}s` }}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
