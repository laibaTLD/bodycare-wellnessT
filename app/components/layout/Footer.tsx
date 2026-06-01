'use client';

import Link from 'next/link';
import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import { Manrope, Cormorant } from 'next/font/google';
import { useMemo } from 'react';
import type { BusinessHours, Site } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import {
  getBrandName,
  getCopyrightText,
  getFooterDescriptionContent,
  getFooterNavLinks,
} from '@/app/lib/siteContent';
import { getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const DEFAULT_BUSINESS_HOURS = [
  { day: 'Monday–Friday', hours: '9 AM – 6 PM', isClosed: false },
  { day: 'Saturday', hours: '10 AM – 4 PM', isClosed: false },
  { day: 'Sunday', hours: 'Closed', isClosed: true },
];

type FooterHoursRow = {
  day: string;
  hours: string;
  isClosed: boolean;
};

function formatTime(time: string, displayFormat?: '12h' | '24h') {
  if (!time) return '';
  if (displayFormat === '12h') {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  return time;
}

function formatDayHours(dayHours: BusinessHours, displayFormat?: '12h' | '24h') {
  if (!dayHours.isOpen) return 'Closed';
  if (dayHours.is24Hours) return 'Open 24 hours';
  if (dayHours.timeRanges?.length) {
    return dayHours.timeRanges
      .map((range) => `${formatTime(range.openTime, displayFormat)} – ${formatTime(range.closeTime, displayFormat)}`)
      .join(', ');
  }
  return '';
}

function getFooterBusinessHours(site?: Site | null): FooterHoursRow[] {
  const businessHours = site?.business?.businessHours;
  if (businessHours?.isEnabled && businessHours.hours?.length) {
    return businessHours.hours.map((dayHours) => {
      const formatted = formatDayHours(dayHours, businessHours.displayFormat);
      return {
        day: DAY_LABELS[dayHours.day] || dayHours.day,
        hours: formatted,
        isClosed: !dayHours.isOpen || formatted === 'Closed',
      };
    });
  }

  const legacy = site?.business?.hours;
  if (legacy?.length) {
    return legacy.map((entry) => ({
      day: entry.day,
      hours: entry.hours,
      isClosed: entry.isClosed,
    }));
  }

  return DEFAULT_BUSINESS_HOURS;
}

function normalizeHref(href: string): string {
  const t = href.trim();
  if (t.startsWith('http') || t.startsWith('mailto:') || t.startsWith('tel:') || t.startsWith('#')) {
    return t;
  }
  return t.startsWith('/') ? t : `/${t}`;
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  switch (p) {
    case 'facebook':
      return (
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.991 4.388 10.967 10.125 11.854v-8.385H7.078V12.07h3.047V9.412c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.513c-1.492 0-1.955.927-1.955 1.878v2.261h3.328l-.532 3.472h-2.796v8.385C19.612 23.04 24 18.064 24 12.073z" />
      );
    case 'instagram':
      return (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 0 1 1.775 1.153 4.92 4.92 0 0 1 1.153 1.775c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.775 4.92 4.92 0 0 1-1.775 1.153c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.775-1.153 4.92 4.92 0 0 1-1.153-1.775c-.163-.457-.347-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427A4.92 4.92 0 0 1 3.789 2.948 4.92 4.92 0 0 1 5.564 1.795c.457-.163 1.257-.347 2.427-.403C9.256 1.334 9.636 1.322 12 1.322zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm7.2-1.442a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      );
    case 'twitter':
    case 'x':
      return (
        <path d="M23.643 4.937a9.64 9.64 0 0 1-2.828.797 4.93 4.93 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.917 4.917 0 0 0-8.38 4.482A13.944 13.944 0 0 1 1.671 3.149a4.917 4.917 0 0 0 1.523 6.56 4.897 4.897 0 0 1-2.228-.616v.062a4.917 4.917 0 0 0 3.946 4.818 4.9 4.9 0 0 1-2.224.085 4.918 4.918 0 0 0 4.59 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.513 14.01-14.01 0-.213-.004-.425-.014-.636a10.005 10.005 0 0 0 2.099-2.169z" />
      );
    case 'linkedin':
      return (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.943v5.663H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" />
      );
    case 'youtube':
      return (
        <path d="M23.498 6.186A3.016 3.016 0 0 0 20.5 3.545C19.505 3.5 12 3.5 12 3.5s-7.505 0-8.5.045A3.017 3.017 0 0 0 .502 6.186 31.34 31.34 0 0 0 .5 12c0 3.914.002 5.814.002 5.814a3.017 3.017 0 0 0 3.0 2.64c.995.045 8.496.045 8.496.045s7.505 0 8.5-.045a3.016 3.016 0 0 0 2.998-2.64C23.998 17.814 24 15.914 24 12s-.002-5.814-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z" />
      );
    default:
      return null;
  }
}

export function Footer() {
  const { site, pages } = useWebBuilder();
  const { ref: footerRef, isVisible: footerVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const businessName = useMemo(() => getBrandName(site), [site]);
  const businessDescription = useMemo(() => tiptapToText(getFooterDescriptionContent(site)), [site]);
  const logoImage = useMemo(() => {
    const url = site?.footer?.logo?.url || site?.theme?.logoUrl;
    return url ? getImageSrc(url) : undefined;
  }, [site?.footer?.logo?.url, site?.theme?.logoUrl]);
  const hoursToShow = useMemo(() => getFooterBusinessHours(site), [site]);
  const quickLinks = useMemo(() => {
    const column = site?.footer?.columns?.[0];
    if (column?.links?.length) {
      return column.links
        .filter((link) => link?.label?.trim() && link?.url?.trim())
        .map((link, index) => ({
          id: `footer-col-${index}`,
          label: link.label.trim(),
          href: normalizeHref(link.url),
        }));
    }
    return getFooterNavLinks(pages);
  }, [site?.footer?.columns, pages]);
  const quickLinksTitle = site?.footer?.columns?.[0]?.title?.trim() || 'Quick Links';
  const socialLinks = useMemo(() => {
    if (site?.footer?.showSocialLinks === false) return [];
    return site?.socialLinks?.filter((s) => s?.url?.trim()) ?? [];
  }, [site?.footer?.showSocialLinks, site?.socialLinks]);
  const copyright = useMemo(() => {
    const fromCms = getCopyrightText(site);
    if (fromCms && fromCms.length > 8) return fromCms;
    return `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`.trim();
  }, [site, businessName]);

  const phone = site?.business?.phone?.trim();
  const email = site?.business?.email?.trim();
  const address = site?.business?.address;
  const hasAddress = Boolean(address?.street || address?.city || address?.state || address?.zipCode);

  const floatingDots = useMemo(() => Array.from({ length: 12 }), []);

  const legalLinks = useMemo(() => {
    const links: { label: string; href: string }[] = [];
    if (site?.legal?.privacyPolicy) {
      links.push({ label: 'Privacy Policy', href: '/privacy-policy' });
    }
    if (site?.legal?.termsOfService) {
      links.push({ label: 'Terms of Service', href: '/terms-of-service' });
    }
    if (site?.files?.sitemap) {
      links.push({ label: 'Sitemap', href: '/sitemap.xml' });
    }
    return links;
  }, [site?.legal, site?.files?.sitemap]);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className={`relative py-16 lg:py-24 overflow-hidden ${manrope.variable}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f8f5] via-[#e8f0ea] to-[#f0f4f1] animate-gradient-slow" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-10 left-10 w-40 h-40 text-[#7A9A5C]/15 transform rotate-12"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M42.7,-73.2C55.9,-65.7,67.7,-55.1,76.3,-41.9C84.9,-28.7,90.4,-14.4,89.8,-0.3C89.3,13.7,82.7,27.4,74.1,39.7C65.5,52,55,62.8,42.2,70.8C29.4,78.8,14.7,84,0.1,83.8C-14.5,83.7,-29,78.3,-42.2,70.3C-55.4,62.3,-67.2,52,-76.3,41.9C-85.4,31.8,-91.1,21.4,-91.1,10.7C-91.1,0,-85.4,-10,-76.9,-19.5C-68.3,-29.1,-57.2,-38.3,-44,-46.3C-30.7,-54.3,-15.3,-61,0.1,-60.8C15.5,-60.7,31,-55.3,42.7,-47.7Z" />
        </svg>

        <svg
          className="absolute bottom-10 right-10 w-48 h-48 text-[#7A9A5C]/15 transform -rotate-6"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M47.7,-79.1C62.9,-71.9,77.2,-61.3,84.2,-47.2C91.3,-33.1,91.1,-16.5,85.6,-0.5C80.3,13.7,73.7,27.3,65.5,39.1C57.2,50.9,47.9,60.8,35.1,68.8C22.3,76.8,5.3,82.0,-14.9,84.5C-35.2,87.0,-58.7,86.7,-73.6,75.9C-88.5,65.1,-94.9,43.7,-95.2,22.0C-95.5,0.3,-89.7,-21.6,-78.9,-38.6C-68.1,-55.6,-52.2,-67.7,-35.6,-75.1C-18.9,-82.5,-9.4,-85.2,2.0,-88.0C13.4,-90.8,26.8,-93.8,39.5,-89.1Z" />
        </svg>

        {floatingDots.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${8 + (i % 3) * 2}px`,
              height: `${7 + (i % 4) * 2}px`,
              backgroundColor:
                i % 3 === 0
                  ? `rgba(122, 154, 92, ${0.15 + (i % 5) * 0.03})`
                  : i % 3 === 1
                    ? `rgba(36, 42, 38, ${0.08 + (i % 4) * 0.02})`
                    : `rgba(232, 240, 234, ${0.3 + (i % 5) * 0.05})`,
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 6) % 70}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div
            className={`lg:col-span-2 order-2 ${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-1000`}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50">
              <h4 className={`${cormorant.className} text-2xl font-semibold text-[#242A26] mb-4`}>
                Business Hours
              </h4>
              <ul className="space-y-3">
                {hoursToShow.map((bh, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7A9A5C]/10 flex items-center justify-center text-[#7A9A5C]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                        </svg>
                      </div>
                      <span className="text-[#242A26]/80">{bh.day}</span>
                    </div>
                    <span className="text-[#242A26]/70">{bh.isClosed ? 'Closed' : bh.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`lg:col-span-3 order-1 ${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-1000`}
          >
            <div className="flex flex-col items-center lg:items-start">
              <div className="mb-6 transform hover:scale-105 transition-all duration-300">
                {logoImage ? (
                  <OptimizedImage
                    src={logoImage}
                    alt={site?.footer?.logo?.altText || `${businessName} logo`}
                    width={400}
                    height={140}
                    sizes={IMAGE_SIZES.logo}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  businessName && (
                    <h2 className={`${cormorant.className} text-4xl font-bold text-[#242A26] tracking-tight`}>
                      {businessName}
                    </h2>
                  )
                )}
              </div>

              {businessDescription && (
                <p className="text-[#242A26]/70 text-base leading-relaxed mb-8 max-w-lg text-center lg:text-left">
                  {businessDescription}
                </p>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {socialLinks.map((social, index) => {
                    const iconPath = getSocialIcon(social.platform);
                    return (
                      <a
                        key={`${social.platform}-${index}`}
                        href={social.url}
                        className="text-[#242A26]/60 hover:text-[#7A9A5C] transition-all p-3 rounded-full bg-white/30 hover:bg-white/70 hover:shadow-lg hover:scale-110 duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Follow us on ${social.platform}`}
                      >
                        {iconPath && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {iconPath}
                          </svg>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-16 pb-16">
          <div
            className={`${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-1000 delay-100 lg:order-1`}
          >
            <h4
              className={`${cormorant.className} text-xl font-semibold text-[#242A26] mb-6 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-[#7A9A5C] after:mt-2`}
            >
              {quickLinksTitle}
            </h4>
            <nav className="flex flex-col space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[#242A26]/80 hover:text-[#7A9A5C] transition-all duration-200 flex items-center group"
                >
                  <svg className="w-4 h-4 mr-2 text-[#7A9A5C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div
            className={`${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-1000 delay-200 lg:order-2 text-center`}
          >
            <h4
              className={`${cormorant.className} text-xl font-semibold text-[#242A26] mb-6 text-center relative after:content-[''] after:block after:w-12 after:h-1 after:bg-[#7A9A5C] after:mt-2 after:mx-auto`}
            >
              Contact Us
            </h4>
            <div className="space-y-5 flex flex-col items-center">
              {phone && (
                <div className="flex items-center justify-center space-x-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#7A9A5C]/10 flex items-center justify-center text-[#7A9A5C] group-hover:bg-[#7A9A5C]/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 0121 19.72V21a2 2 0 01-2 2h-1a16 16 0 01-16-16V5z"
                      />
                    </svg>
                  </div>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-[#242A26]/80 hover:text-[#7A9A5C] transition-colors">
                    {phone}
                  </a>
                </div>
              )}

              {email && (
                <div className="flex items-center justify-center space-x-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#7A9A5C]/10 flex items-center justify-center text-[#7A9A5C] group-hover:bg-[#7A9A5C]/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <a href={`mailto:${email}`} className="text-[#242A26]/80 hover:text-[#7A9A5C] transition-colors">
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div
            className={`${
              footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-1000 delay-300 lg:order-3 text-right`}
          >
            <h4
              className={`${cormorant.className} text-xl font-semibold text-[#242A26] mb-6 relative text-right after:content-[''] after:block after:w-12 after:h-1 after:bg-[#7A9A5C] after:mt-2 after:ml-auto`}
            >
              Visit Us
            </h4>
            {hasAddress && address && (
              <div className="flex items-start justify-end space-x-3 group">
                <div className="w-10 h-10 rounded-full bg-[#7A9A5C]/10 flex items-center justify-center text-[#7A9A5C] mt-1 group-hover:bg-[#7A9A5C]/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <address className="not-italic text-[#242A26]/80 leading-relaxed">
                    {address.street && (
                      <>
                        {address.street}
                        <br />
                      </>
                    )}
                    {[address.city, address.state].filter(Boolean).join(', ')}
                    {address.zipCode ? ` ${address.zipCode}` : ''}
                  </address>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-[#7A9A5C] hover:text-[#5D6939] group"
                  >
                    <span className="border-b border-transparent group-hover:border-[#7A9A5C] transition-colors">
                      Get directions
                    </span>
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-[#7A9A5C]/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#242A26]/60 text-sm mb-6 md:mb-0">{copyright}</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[#242A26]/60">
              {legalLinks.length > 0 ? (
                legalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-[#7A9A5C] transition-colors">
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <span className="text-[#242A26]/40">Privacy Policy</span>
                  <span className="text-[#242A26]/40">Terms of Service</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
          75% {
            transform: translateY(-5px) rotate(1deg);
          }
        }

        @keyframes gradient-slow {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 50% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 50% 50%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-gradient-slow {
          background-size: 300% 300%;
          animation: gradient-slow 15s ease infinite;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
