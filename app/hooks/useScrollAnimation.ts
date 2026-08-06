'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  /** Re-run observer when this value changes (e.g. async content length). */
  watch?: unknown;
}

function isInViewport(node: HTMLElement, rootMargin = '0px 0px -50px 0px'): boolean {
  const margins = rootMargin.split(/\s+/).map((v) => parseInt(v, 10) || 0);
  const [top = 0, , bottom = 0] =
    margins.length === 1
      ? [margins[0], 0, margins[0], 0]
      : margins.length === 2
        ? [margins[0], 0, margins[1], 0]
        : margins;
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight - bottom && rect.bottom > top;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true, watch } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (isInViewport(node, rootMargin)) {
      setIsVisible(true);
      if (triggerOnce) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    // Async layout (Lenis, late-mounted grids): re-check after paint.
    const raf = requestAnimationFrame(() => {
      if (isInViewport(node, rootMargin)) setIsVisible(true);
    });
    const timer = window.setTimeout(() => {
      if (isInViewport(node, rootMargin)) setIsVisible(true);
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, watch]);

  return { ref, isVisible };
}

/**
 * Staggers item reveal on scroll. Once items have been shown they stay shown —
 * avoids the “appear then vanish” flicker when `itemCount` changes (async data / polls).
 */
export function useStaggeredAnimation(itemCount: number, delay = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const { ref, isVisible } = useScrollAnimation({ watch: itemCount });
  const revealedCountRef = useRef(0);

  useEffect(() => {
    if (!isVisible || itemCount <= 0) return;

    // Already revealed this many (or more): keep them visible, fill any new indices.
    if (revealedCountRef.current >= itemCount) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i));
      return;
    }

    const startIndex = revealedCountRef.current;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (let i = startIndex; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => (prev.includes(i) ? prev : [...prev, i]));
        revealedCountRef.current = Math.max(revealedCountRef.current, i + 1);
      }, (i - startIndex) * delay);
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isVisible, itemCount, delay]);

  // If count shrinks (temporary empty fetch), don't wipe revealed progress to 0 forever —
  // next time items return, show them immediately.
  useEffect(() => {
    if (itemCount === 0) return;
    if (revealedCountRef.current > 0 && visibleItems.length === 0 && isVisible) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i));
      revealedCountRef.current = itemCount;
    }
  }, [itemCount, visibleItems.length, isVisible]);

  return { ref, visibleItems, isVisible };
}
