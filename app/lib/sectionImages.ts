import type { Page } from '@/app/lib/types';
import { getImageSrc } from '@/app/lib/utils';

export type CmsImageRef = {
  url: string;
  altText?: string;
};

const IMAGE_FIELD_KEYS = [
  'image',
  'backgroundImage',
  'thumbnailImage',
  'media',
  'coverImage',
  'heroImage',
  'photo',
] as const;

function normalizeImageRef(raw: unknown): CmsImageRef | undefined {
  if (!raw) return undefined;

  if (typeof raw === 'string' && raw.trim()) {
    return { url: raw.trim() };
  }

  if (typeof raw !== 'object') return undefined;

  const record = raw as Record<string, unknown>;

  if (typeof record.url === 'string' && record.url.trim()) {
    return {
      url: record.url.trim(),
      altText: typeof record.altText === 'string' ? record.altText.trim() : undefined,
    };
  }

  if (record.image) {
    const nested = normalizeImageRef(record.image);
    if (nested) return nested;
  }

  if (record.media) {
    const nested = normalizeImageRef(record.media);
    if (nested) return nested;
  }

  return undefined;
}

/** Resolve `{ url, altText }` from common CMS section image fields. */
export function resolveSectionImageFromRecord(record: unknown): CmsImageRef | undefined {
  if (!record || typeof record !== 'object') return undefined;

  const data = record as Record<string, unknown>;

  for (const key of IMAGE_FIELD_KEYS) {
    const ref = normalizeImageRef(data[key]);
    if (ref?.url) return ref;
  }

  if (Array.isArray(data.mediaItems) && data.mediaItems.length > 0) {
    const ref = normalizeImageRef(data.mediaItems[0]);
    if (ref?.url) return ref;
  }

  if (Array.isArray(data.images) && data.images.length > 0) {
    const ref = normalizeImageRef(data.images[0]);
    if (ref?.url) return ref;
  }

  for (const key of ['imageUrl', 'backgroundImageUrl'] as const) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) {
      return { url: value.trim() };
    }
  }

  return undefined;
}

export function resolveSectionImageUrl(
  record: unknown,
  fallbacks: CmsImageRef[] = []
): string | undefined {
  const direct = resolveSectionImageFromRecord(record);
  const candidates = direct ? [direct, ...fallbacks] : fallbacks;

  for (const ref of candidates) {
    if (ref?.url?.trim()) return getImageSrc(ref.url);
  }

  return undefined;
}

export type ServiceAreaImageFallbackKey =
  | 'hero'
  | 'cta'
  | 'about'
  | 'homeAbout'
  | 'homeCta';

export function collectServiceAreaImageFallbacks(
  serviceAreaPage: Record<string, unknown> | null,
  pages: Page[] | undefined,
  keys: ServiceAreaImageFallbackKey[]
): CmsImageRef[] {
  const result: CmsImageRef[] = [];
  const seen = new Set<string>();

  const push = (ref: CmsImageRef | undefined) => {
    if (!ref?.url?.trim()) return;
    const normalized = getImageSrc(ref.url);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push({
      url: ref.url,
      altText: ref.altText,
    });
  };

  const home = pages?.find((page) => page.pageType === 'home');

  for (const key of keys) {
    switch (key) {
      case 'hero':
        push(resolveSectionImageFromRecord(serviceAreaPage?.hero));
        break;
      case 'cta':
        push(resolveSectionImageFromRecord(serviceAreaPage?.cta));
        break;
      case 'about':
        push(resolveSectionImageFromRecord(serviceAreaPage?.about));
        break;
      case 'homeAbout':
        push(home?.aboutSection?.image);
        break;
      case 'homeCta': {
        const cta = home?.ctaSection;
        if (typeof cta?.backgroundImage === 'string' && cta.backgroundImage.trim()) {
          push({ url: cta.backgroundImage.trim() });
        } else {
          push(resolveSectionImageFromRecord(cta));
        }
        break;
      }
    }
  }

  return result;
}
