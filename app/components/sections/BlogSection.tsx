'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import type { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useScrollAnimation, useStaggeredAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { CardLoader } from '@/app/components/ui/SkeletonLoader';
import { tiptapToText } from '@/app/lib/seo';

type BlogSectionInput = NonNullable<Page['blogSection']> & {
  heading?: unknown;
  subtitle?: unknown;
};

function pickSectionField(
  section: BlogSectionInput | undefined,
  primary: 'title' | 'description'
): unknown {
  if (!section) return undefined;
  const alt = primary === 'title' ? section.heading : section.subtitle;
  const value = section[primary] ?? alt;
  if (value == null || value === '') return undefined;
  return value;
}

function hasTiptapContent(content: unknown): boolean {
  if (content == null || content === '') return false;
  if (typeof content === 'object') return Boolean(tiptapToText(content));
  return Boolean(String(content).trim());
}

function resolvePostImageRaw(post: {
  featuredImage?: unknown;
  seo?: { ogImageUrl?: string };
}): string | undefined {
  const img = post?.featuredImage;
  if (typeof img === 'string' && img.trim()) return img;
  if (img && typeof img === 'object' && (img as { url?: string }).url) {
    return (img as { url: string }).url;
  }
  if (post?.seo?.ogImageUrl) return post.seo.ogImageUrl;
  return undefined;
}

function getPostImageSrc(post: {
  featuredImage?: unknown;
  seo?: { ogImageUrl?: string };
}): string {
  const raw = resolvePostImageRaw(post);
  return raw ? getImageSrc(raw) : '';
}

function getPostImageAlt(post: { featuredImage?: unknown; title?: string }): string {
  const img = post?.featuredImage;
  if (img && typeof img === 'object' && (img as { altText?: string }).altText) {
    return (img as { altText: string }).altText;
  }
  return post?.title || '';
}

function formatPostDate(iso: string | undefined, show: boolean): string | null {
  if (!show || !iso) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

interface BlogSectionProps {
  blogSection?: Page['blogSection'];
  className?: string;
}

type BlogPostItem = {
  _id: string;
  slug: string;
  title?: string;
  excerpt?: unknown;
  publishedAt?: string;
  createdAt?: string;
  author?: { name?: string };
  categories?: string[];
  featuredImage?: unknown;
  seo?: { ogImageUrl?: string };
};

export const BlogSection: React.FC<BlogSectionProps> = ({ blogSection, className }) => {
  const theme = useSectionTheme();
  const { colors, fonts, styles } = theme;
  const { blogPosts, loading, pages } = useWebBuilder();

  const sectionData = useMemo(() => {
    const fallback = pages.find((p) => p.pageType === 'blog-list')?.blogSection as
      | BlogSectionInput
      | undefined;
    const current = blogSection as BlogSectionInput | undefined;
    if (!current && !fallback) return undefined;

    return {
      enabled: current?.enabled ?? fallback?.enabled ?? false,
      postsToShow: current?.postsToShow ?? fallback?.postsToShow ?? 3,
      showExcerpt: current?.showExcerpt ?? fallback?.showExcerpt ?? true,
      showDate: current?.showDate ?? fallback?.showDate ?? true,
      title: pickSectionField(current, 'title') ?? pickSectionField(fallback, 'title'),
      description:
        pickSectionField(current, 'description') ??
        pickSectionField(fallback, 'description'),
    };
  }, [blogSection, pages]);

  const titleContent = sectionData?.title;
  const descriptionContent = sectionData?.description;
  const hasTitle = hasTiptapContent(titleContent);
  const hasDescription = hasTiptapContent(descriptionContent);

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  if (!sectionData?.enabled) return null;

  const count = Math.min(Math.max(sectionData.postsToShow || 3, 1), 12);
  const displayPosts = blogPosts.slice(0, count) as BlogPostItem[];
  const showExcerpt = Boolean(sectionData.showExcerpt);
  const showDate = Boolean(sectionData.showDate);

  const { ref: gridRef, visibleItems, isVisible: gridVisible } = useStaggeredAnimation(
    displayPosts.length > 1 ? displayPosts.length - 1 : 0,
    120
  );

  if (loading && blogPosts.length === 0) {
    return (
      <section
        className={cn('relative overflow-hidden py-16 sm:py-20 lg:py-28', className)}
        id="blog"
        style={{ fontFamily: fonts.body }}
      >
        <div className="absolute inset-0" style={styles.sectionGradientBgSoft} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-3xl border p-4" style={styles.card}>
                <CardLoader />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0 && !hasTitle && !hasDescription) {
    return null;
  }

  const [featured, ...rest] = displayPosts;

  return (
    <section
      id="blog"
      className={cn('relative overflow-hidden py-16 sm:py-20 lg:py-28', className)}
      style={{ fontFamily: fonts.body }}
    >
      <div className="absolute inset-0" style={styles.sectionGradientBgSoft} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full opacity-25 animate-float"
            style={{
              ...styles.floatingDot,
              left: `${10 + i * 11}%`,
              top: `${12 + i * 9}%`,
              animationDelay: `${i * 0.55}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {hasTitle && (
              <h2
                ref={titleRef}
                className={cn(
                  'text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl transition-all duration-1000',
                  titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ fontFamily: fonts.heading, ...styles.titleGradient }}
              >
                <TiptapRenderer content={titleContent} as="inline" />
              </h2>
            )}

            {hasDescription && (
              <div
                ref={descRef}
                className={cn(
                  'mt-4 text-base leading-relaxed sm:text-lg transition-all duration-1000 delay-200',
                  descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ color: colors.secondaryText, fontFamily: fonts.body }}
              >
                <TiptapRenderer content={descriptionContent} as="inline" />
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3 text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg lg:self-auto"
            style={styles.primaryCta}
          >
            View all articles
            <span aria-hidden>→</span>
          </Link>
        </div>

        {displayPosts.length === 0 ? (
          <p className="text-center text-sm" style={{ color: colors.secondaryText }}>
            No published posts yet. Add posts in the builder to show them here.
          </p>
        ) : (
          <div className="space-y-8 lg:space-y-10">
            {featured && (
              <FeaturedPostCard
                post={featured}
                showExcerpt={showExcerpt}
                showDate={showDate}
                visible
              />
            )}

            {rest.length > 0 && (
              <div
                ref={gridRef}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              >
                {rest.map((post, index) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    showExcerpt={showExcerpt}
                    showDate={showDate}
                    visible={gridVisible && visibleItems.includes(index)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 4.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

function PostMeta({
  post,
  showDate,
  className,
}: {
  post: BlogPostItem;
  showDate: boolean;
  className?: string;
}) {
  const { colors, fonts } = useSectionTheme();
  const dateLabel = formatPostDate(post.publishedAt || post.createdAt, showDate);
  const author = post.author?.name?.trim();
  const category = post.categories?.[0];

  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wide', className)}
      style={{ fontFamily: fonts.body, color: colors.secondaryText }}
    >
      {category && (
        <span
          className="rounded-full px-2.5 py-0.5 font-medium uppercase"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--wb-primary) 14%, transparent)',
            color: colors.primaryButton,
          }}
        >
          {category}
        </span>
      )}
      {dateLabel && <time dateTime={post.publishedAt || post.createdAt}>{dateLabel}</time>}
      {author && <span>by {author}</span>}
    </div>
  );
}

function FeaturedPostCard({
  post,
  showExcerpt,
  showDate,
  visible,
}: {
  post: BlogPostItem;
  showExcerpt: boolean;
  showDate: boolean;
  visible: boolean;
}) {
  const { colors, fonts, styles } = useSectionTheme();
  const imgSrc = getPostImageSrc(post);

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-3xl border shadow-lg transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ ...styles.card, fontFamily: fonts.body }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="grid no-underline lg:grid-cols-2 lg:min-h-[360px]"
      >
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-full" style={styles.imagePlaceholder}>
          {imgSrc ? (
            <OptimizedImage
              src={imgSrc}
              alt={getPostImageAlt(post)}
              fill
              sizes={IMAGE_SIZES.sectionHalf}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div
              className="flex h-full min-h-[220px] items-center justify-center lg:min-h-full"
              style={{ color: 'color-mix(in srgb, var(--wb-primary) 35%, transparent)' }}
            >
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={styles.imageOverlay} />
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
          <PostMeta post={post} showDate={showDate} />
          {post.title && (
            <h3
              className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl transition-colors group-hover:text-[var(--wb-primary)]"
              style={{ fontFamily: fonts.heading, color: colors.cardText }}
            >
              {post.title}
            </h3>
          )}
          {showExcerpt && Boolean(post.excerpt) && (
            <div
              className="line-clamp-3 text-sm leading-relaxed sm:text-base"
              style={{ color: colors.cardTextSecondary }}
            >
              <TiptapRenderer content={post.excerpt} as="inline" />
            </div>
          )}
          <span
            className="mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide"
            style={{ color: colors.primaryButton }}
          >
            Read article
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}

function PostCard({
  post,
  showExcerpt,
  showDate,
  visible,
  index,
}: {
  post: BlogPostItem;
  showExcerpt: boolean;
  showDate: boolean;
  visible: boolean;
  index: number;
}) {
  const { colors, fonts, styles } = useSectionTheme();
  const imgSrc = getPostImageSrc(post);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-3xl border shadow-md transition-all duration-700 hover:-translate-y-1.5 hover:shadow-xl',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{
        ...styles.card,
        fontFamily: fonts.body,
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col no-underline">
        <div className="relative aspect-[16/11] overflow-hidden" style={styles.imagePlaceholder}>
          {imgSrc ? (
            <OptimizedImage
              src={imgSrc}
              alt={getPostImageAlt(post)}
              fill
              sizes={IMAGE_SIZES.card}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: 'color-mix(in srgb, var(--wb-primary) 35%, transparent)' }}
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={styles.imageOverlay} />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <PostMeta post={post} showDate={showDate} />
          {post.title && (
            <h3
              className="text-lg font-semibold leading-snug sm:text-xl transition-colors group-hover:text-[var(--wb-primary)]"
              style={{ fontFamily: fonts.heading, color: colors.cardText }}
            >
              {post.title}
            </h3>
          )}
          {showExcerpt && Boolean(post.excerpt) && (
            <div
              className="line-clamp-2 flex-1 text-sm leading-relaxed"
              style={{ color: colors.cardTextSecondary }}
            >
              <TiptapRenderer content={post.excerpt} as="inline" />
            </div>
          )}
          <span
            className="mt-auto pt-2 text-xs font-medium uppercase tracking-wide"
            style={{ color: colors.primaryButton }}
          >
            Read →
          </span>
        </div>
      </Link>
    </article>
  );
}

export default BlogSection;
