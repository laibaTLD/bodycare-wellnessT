'use client';

import { useMemo } from 'react';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { pageSurfaceToneFromBackground } from '@/app/lib/utils';

export function useSectionTheme() {
  const baseColors = useThemeColors();
  const { site } = useWebBuilder();

  return useMemo(() => {
    const sectionBg =
      site?.theme?.sectionBackgroundColorLight ||
      site?.theme?.sectionBackgroundColorDark ||
      '';
    const sectionTone = pageSurfaceToneFromBackground(sectionBg || undefined);
    const isDarkSection = sectionTone === 'dark';

    // Section copy on dark/sage BGs uses on-dark (white) tokens from the site builder.
    const sectionText = isDarkSection ? baseColors.darkPrimaryText : baseColors.mainText;
    const sectionTextSecondary = isDarkSection
      ? baseColors.darkSecondaryText
      : baseColors.secondaryText;

    // Light cards/panels inside dark sections still need dark ink.
    const cardText = baseColors.lightPrimaryText;
    const cardTextSecondary = baseColors.lightSecondaryText;

    const colors = {
      ...baseColors,
      mainText: sectionText,
      secondaryText: sectionTextSecondary,
      cardText,
      cardTextSecondary,
    };

    return {
      colors,
      sectionTone,
      isDarkSection,
      fonts: {
        heading: 'var(--wb-heading-font, Georgia, serif)',
        body: 'var(--wb-body-font, inherit)',
      },
      text: {
        onLight: {
          primary: baseColors.lightPrimaryText,
          secondary: baseColors.lightSecondaryText,
        },
        onDark: {
          primary: baseColors.darkPrimaryText,
          secondary: baseColors.darkSecondaryText,
        },
        onCardSurface: {
          primary: baseColors.darkPrimaryText,
          secondary: baseColors.darkSecondaryText,
        },
        onSection: {
          primary: sectionText,
          secondary: sectionTextSecondary,
        },
      },
      styles: {
        titleGradient: {
          background: isDarkSection
            ? `linear-gradient(135deg, ${sectionText} 0%, color-mix(in srgb, ${sectionText} 70%, white) 100%)`
            : `linear-gradient(135deg, ${baseColors.mainText} 0%, ${baseColors.primaryButton} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        } as React.CSSProperties,
        iconBadge: {
          background: `linear-gradient(135deg, ${colors.primaryButton}, ${colors.hoverActive})`,
        } as React.CSSProperties,
        sectionGradientBg: {
          background: `linear-gradient(135deg, ${colors.sectionBackgroundLight} 0%, ${colors.pageBackground} 50%, color-mix(in srgb, ${colors.primaryButton} 8%, ${colors.pageBackground}) 100%)`,
          color: sectionText,
        } as React.CSSProperties,
        sectionGradientBgAlt: {
          background: `linear-gradient(135deg, ${colors.pageBackground} 0%, ${colors.sectionBackgroundLight} 100%)`,
          color: sectionText,
        } as React.CSSProperties,
        sectionGradientBgSoft: {
          background: `linear-gradient(135deg, ${colors.sectionBackgroundLight} 0%, ${colors.pageBackground} 100%)`,
          color: sectionText,
        } as React.CSSProperties,
        card: {
          borderColor: 'color-mix(in srgb, var(--wb-primary) 10%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--wb-card-bg-light) 90%, transparent)',
          color: cardText,
        } as React.CSSProperties,
        cardSolid: {
          borderColor: 'color-mix(in srgb, var(--wb-primary) 10%, transparent)',
          backgroundColor: colors.cardBackground,
          color: cardText,
        } as React.CSSProperties,
        imagePlaceholder: {
          backgroundColor: colors.sectionBackgroundLight,
        } as React.CSSProperties,
        imageOverlay: {
          background: `linear-gradient(to top, color-mix(in srgb, ${colors.primaryButton} 60%, transparent), transparent)`,
        } as React.CSSProperties,
        imageOverlayHover: {
          background: `linear-gradient(to top, color-mix(in srgb, ${colors.primaryButton} 80%, transparent), transparent)`,
        } as React.CSSProperties,
        dividerDot: { backgroundColor: colors.primaryButton } as React.CSSProperties,
        dividerLine: {
          backgroundColor: 'color-mix(in srgb, var(--wb-primary) 30%, transparent)',
        } as React.CSSProperties,
        dividerGradient: {
          background: `linear-gradient(90deg, ${colors.primaryButton}, transparent)`,
        } as React.CSSProperties,
        primaryCta: {
          backgroundColor: colors.primaryButton,
          color: 'var(--wb-text-on-dark, #fff)',
          border: 'none',
          boxShadow: 'none',
        } as React.CSSProperties,
        statCircle: {
          background: `linear-gradient(135deg, ${colors.primaryButton}, ${colors.hoverActive})`,
        } as React.CSSProperties,
        accentText: { color: colors.primaryButton } as React.CSSProperties,
        floatingDot: { backgroundColor: colors.primaryButton } as React.CSSProperties,
      },
    };
  }, [baseColors, site?.theme?.sectionBackgroundColorLight, site?.theme?.sectionBackgroundColorDark]);
}
