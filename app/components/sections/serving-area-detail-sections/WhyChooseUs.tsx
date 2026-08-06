'use client';

import { useMemo } from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { cn } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface WhyChooseUsProps {
  whyChooseUs: unknown;
  className?: string;
}

type SectionData = {
  title?: unknown;
  description?: unknown;
};

function normalizeWhyChooseUs(whyChooseUs: unknown): SectionData | null {
  if (!whyChooseUs || typeof whyChooseUs !== 'object') return null;

  const data = whyChooseUs as Record<string, unknown>;
  if (data.enabled === false) return null;

  const title = data.title;
  const description = data.description ?? data.subtitle;

  if (!title && !description) return null;

  return { title, description };
}

function hasRichContent(content: unknown): boolean {
  if (content == null || content === '') return false;
  if (typeof content === 'object') return Boolean(tiptapToText(content));
  return Boolean(String(content).trim());
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ whyChooseUs, className }) => {
  const theme = useSectionTheme();
  const { colors, fonts } = theme;

  const section = useMemo(() => normalizeWhyChooseUs(whyChooseUs), [whyChooseUs]);

  const titleText = useMemo(() => tiptapToText(section?.title), [section?.title]);
  const descriptionText = useMemo(
    () => tiptapToText(section?.description),
    [section?.description]
  );

  if (!section) return null;

  const showTitle = hasRichContent(section.title) || Boolean(titleText);
  const showDescription = hasRichContent(section.description) || Boolean(descriptionText);
  const textColor = colors.darkPrimaryText;
  const subtextColor = colors.darkSecondaryText;

  return (
    <section
      className={cn('relative flex h-full min-h-full flex-col wb-surface-lux', className)}
      style={{
        fontFamily: fonts.body,
      }}
    >
      <div className="wb-surface-lux-inner flex h-full flex-1 flex-col justify-center px-6 py-12 text-center sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <header className="mx-auto w-full max-w-lg">
          <p
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em]"
            style={{ fontFamily: fonts.body }}
          >
            <span style={{ color: subtextColor }}>[ </span>
            <span style={{ color: textColor }}>Why Choose Us</span>
            <span style={{ color: subtextColor }}> ]</span>
          </p>

          {showTitle && (
            <h2
              className="text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal leading-[1.25] tracking-tight"
              style={{ fontFamily: fonts.heading, color: textColor }}
            >
              {hasRichContent(section.title) ? (
                <TiptapRenderer content={section.title} as="inline" />
              ) : (
                titleText
              )}
            </h2>
          )}

          {showDescription && hasRichContent(section.description) && (
            <div
              className={cn(
                'mt-5 text-sm leading-relaxed sm:mt-6 sm:text-[0.9375rem] [&_h1]:mt-3 [&_h1]:font-bold [&_h2]:mt-3 [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:font-bold [&_strong]:font-semibold',
                !showTitle && 'mt-0'
              )}
              style={{ color: subtextColor }}
            >
              <TiptapRenderer content={section.description} className="text-inherit" />
            </div>
          )}

          {showDescription && !hasRichContent(section.description) && descriptionText && (
            <p
              className={cn(
                'mt-5 text-sm leading-relaxed sm:mt-6 sm:text-[0.9375rem]',
                !showTitle && 'mt-0'
              )}
              style={{ color: subtextColor }}
            >
              {descriptionText}
            </p>
          )}
        </header>
      </div>
    </section>
  );
};

export default WhyChooseUs;
