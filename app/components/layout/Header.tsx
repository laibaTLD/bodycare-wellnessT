'use client';

import Link from 'next/link';
import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import { useMemo, useState } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getImageSrc } from '@/app/lib/utils';
import {
  getBrandName,
  getHeaderNavItems,
  getTestimonialsNavItem,
  type HeaderNavItem,
} from '@/app/lib/siteContent';
import { resolvePrimaryCta } from '@/app/components/ui/made';

const DESKTOP_LINK_CLASS =
  'text-[#333333] hover:text-[#333333]/70 transition-colors text-sm font-normal';
const MOBILE_LINK_CLASS = 'block px-3 py-2 text-[#333333] hover:text-[#333333]/70 text-sm';

function buildNavItems(pages: ReturnType<typeof useWebBuilder>['pages']): HeaderNavItem[] {
  const items: HeaderNavItem[] = [];
  const seen = new Set<string>();

  const home = pages.find((p) => p.pageType === 'home');
  if (home) {
    items.push({ id: home._id, name: home.name?.trim() || 'Home', href: '/' });
    seen.add('/');
  }

  const testimonials = getTestimonialsNavItem(pages);
  if (!seen.has(testimonials.href)) {
    items.push(testimonials);
    seen.add(testimonials.href);
  }

  for (const item of getHeaderNavItems(pages)) {
    if (seen.has(item.href)) continue;
    items.push(item);
    seen.add(item.href);
  }

  return items;
}

export function Header() {
  const { site, pages } = useWebBuilder();
  const [isOpen, setIsOpen] = useState(false);

  const businessName = getBrandName(site) || 'ClearSky';
  const logoImage = useMemo(() => {
    const url = site?.theme?.logoUrl || site?.footer?.logo?.url;
    return url ? getImageSrc(url) : undefined;
  }, [site?.theme?.logoUrl, site?.footer?.logo?.url]);
  const logoAlt = site?.footer?.logo?.altText?.trim() || `${businessName} logo`;
  const navItems = useMemo(() => buildNavItems(pages), [pages]);
  const homePage = useMemo(() => pages.find((p) => p.pageType === 'home'), [pages]);

  const headerCta = useMemo(() => {
    return (
      resolvePrimaryCta(homePage ?? null, site, pages) ?? {
        href: '/contact-us',
        label: 'Sign in',
      }
    );
  }, [homePage, site, pages]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed w-full z-50 bg-[#f0f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="shrink-0 flex items-center" aria-label={businessName}>
              {logoImage ? (
                <OptimizedImage
                  src={logoImage}
                  alt={logoAlt}
                  width={400}
                  height={120}
                  sizes={IMAGE_SIZES.logo}
                  className="h-9 w-auto max-w-[160px] object-contain sm:h-10 sm:max-w-[200px]"
                  priority
                />
              ) : (
                <span className="text-[#333333] text-xl font-medium">{businessName}</span>
              )}
            </Link>
            <div className="hidden md:flex items-center gap-5 lg:gap-6">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href} className={DESKTOP_LINK_CLASS}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <Link href={headerCta.href} className={DESKTOP_LINK_CLASS}>
              {headerCta.label}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#333333] hover:text-[#333333]/70 focus:outline-none"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  onClick={closeMenu}
                  href={item.href}
                  className={MOBILE_LINK_CLASS}
                >
                  {item.name}
                </Link>
              ))}
              <Link onClick={closeMenu} href={headerCta.href} className={MOBILE_LINK_CLASS}>
                {headerCta.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
