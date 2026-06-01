'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Page } from '@/app/lib/types';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

type GalleryImage = {
  id: string;
  title: string;
  altText: string;
  imageUrl: string;
};

const FALLBACK_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'fallback-1',
    title: 'Morning Meditation',
    altText: 'Person meditating at sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
  {
    id: 'fallback-2',
    title: 'Yoga Practice',
    altText: 'Yoga pose in nature',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  },
  {
    id: 'fallback-3',
    title: 'Spa Relaxation',
    altText: 'Spa stones and candles',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
  },
  {
    id: 'fallback-4',
    title: 'Mindful Breathing',
    altText: 'Person practicing breathing exercises',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
  {
    id: 'fallback-5',
    title: 'Nature Therapy',
    altText: 'Peaceful nature scene',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
  },
];

interface GallerySectionProps {
  gallerySection?: Page['gallerySection'];
  className?: string;
}

function normalizeGalleryImages(gallerySection?: Page['gallerySection']): GalleryImage[] {
  const cmsImages =
    gallerySection?.images
      ?.filter((img) => img?.url?.trim())
      .map((img, index) => {
        const caption = tiptapToText(img.caption);
        return {
          id: `gallery-${index}`,
          title: caption || `Gallery image ${index + 1}`,
          altText: img.altText?.trim() || caption || 'Gallery image',
          imageUrl: getImageSrc(img.url),
        };
      }) ?? [];

  return cmsImages.length > 0 ? cmsImages : FALLBACK_GALLERY_IMAGES;
}

export function GallerySection({ gallerySection, className }: GallerySectionProps) {
  const theme = useSectionTheme();
  const { colors, fonts, styles } = theme;

  const title = useMemo(() => tiptapToText(gallerySection?.title), [gallerySection?.title]);
  const description = useMemo(
    () => tiptapToText(gallerySection?.description),
    [gallerySection?.description]
  );
  const galleryImages = useMemo(() => normalizeGalleryImages(gallerySection), [gallerySection]);

  const [selectedImage, setSelectedImage] = useState<GalleryImage>(galleryImages[0]);

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.3 });
  const { ref: descriptionRef, isVisible: descriptionVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.3 });
  const { ref: galleryRef, isVisible: galleryVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages]);

  if (!gallerySection || gallerySection.enabled === false) return null;

  const hasCmsImages = (gallerySection.images?.filter((img) => img?.url?.trim()).length ?? 0) > 0;
  if (!title && !description && !hasCmsImages) return null;

  const accentBorder = { borderColor: colors.primaryButton };
  const accentBorderMuted = {
    borderColor: 'color-mix(in srgb, var(--wb-primary) 30%, transparent)',
  };

  return (
    <section
      id="gallery"
      className={cn('py-20 lg:py-32 relative overflow-hidden', className)}
      style={{ fontFamily: fonts.body }}
    >
      <div className="absolute inset-0 animate-gradient-shift" style={styles.sectionGradientBg} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          ['48.04%', '22.77%', '0s', '5s'],
          ['61.51%', '75.31%', '0.7s', '5.5s'],
          ['89.64%', '45.23%', '1.4s', '6s'],
          ['33.01%', '43.08%', '2.1s', '6.5s'],
          ['25.40%', '82.39%', '2.8s', '7s'],
          ['46.07%', '12.54%', '3.5s', '7.5s'],
          ['78.92%', '67.18%', '4.2s', '8s'],
          ['12.35%', '55.67%', '4.9s', '8.5s'],
          ['67.83%', '34.92%', '5.6s', '9s'],
          ['5.19%', '91.45%', '6.3s', '9.5s'],
        ].map(([left, top, delay, duration], i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20 animate-float"
            style={{
              ...styles.floatingDot,
              left,
              top,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        ))}
      </div>

      <div className="absolute top-10 right-10 w-32 h-32 opacity-10 animate-sway">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: colors.primaryButton }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="animate-breathe" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          {title && (
            <h2
              ref={titleRef}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 transition-all duration-1000',
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ fontFamily: fonts.heading, ...styles.titleGradient }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              ref={descriptionRef}
              className={cn(
                'text-base md:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300',
                descriptionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ color: colors.secondaryText }}
            >
              {description}
            </p>
          )}
        </div>

        <div ref={galleryRef} className="flex flex-col lg:flex-row items-start gap-8">
          <div
            className={cn(
              'flex-1 relative group transition-all duration-1000',
              galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm p-2">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText}
                  width={800}
                  height={500}
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to top, color-mix(in srgb, ${colors.mainText} 20%, transparent), transparent)`,
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3
                    className="text-3xl font-semibold text-white drop-shadow-lg"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {selectedImage.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={accentBorder} />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={accentBorder} />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={accentBorder} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={accentBorder} />
          </div>

          <div className="flex lg:flex-col gap-4 w-full lg:w-72">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={cn(
                  'relative rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 group',
                  selectedImage.id === image.id
                    ? 'scale-105 shadow-2xl'
                    : 'border-transparent hover:scale-105 hover:shadow-xl',
                  galleryVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                )}
                style={{
                  transitionDelay: `${600 + index * 100}ms`,
                  ...(selectedImage.id === image.id ? accentBorder : {}),
                }}
              >
                <div className="relative">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText}
                    width={256}
                    height={112}
                    className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="256px"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, color-mix(in srgb, ${colors.mainText} 80%, transparent), color-mix(in srgb, ${colors.mainText} 40%, transparent), transparent)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium px-4 text-center drop-shadow-lg">
                      {image.title}
                    </p>
                  </div>
                  {selectedImage.id === image.id && (
                    <div
                      className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse shadow-lg"
                      style={styles.dividerDot}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div
            className="w-32 h-1 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, color-mix(in srgb, ${colors.primaryButton} 30%, transparent), transparent)`,
            }}
          />
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

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
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
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
    </section>
  );
}
