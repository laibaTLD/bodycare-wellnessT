'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ServiceNavItem } from '@/app/lib/serviceNav';
import { cn } from '@/app/lib/utils';

const LINK_CLASS =
  'text-[#333333] hover:text-[#333333]/70 transition-colors text-sm font-normal';

type ServicesNavDropdownProps = {
  label?: string;
  servicesHref?: string;
  items: ServiceNavItem[];
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function ServicesNavDropdown({
  label = 'Services',
  servicesHref = '/services',
  items,
  variant = 'desktop',
  onNavigate,
}: ServicesNavDropdownProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (variant !== 'desktop' || !open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHoveredServiceId(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setHoveredServiceId(null);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, variant]);

  const handleNavigate = () => {
    setOpen(false);
    setExpandedServiceId(null);
    setHoveredServiceId(null);
    onNavigate?.();
  };

  if (items.length === 0) {
    return (
      <Link href={servicesHref} className={LINK_CLASS} onClick={handleNavigate}>
        {label}
      </Link>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#333333]"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{label}</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="pb-2 pl-3 pr-1">
            <Link
              href={servicesHref}
              className="block px-3 py-2 text-sm text-[#333333]/80 hover:text-[#333333]"
              onClick={handleNavigate}
            >
              All {label}
            </Link>

            {items.map((service) => {
              const expanded = expandedServiceId === service.id;
              const hasAreas = service.areas.length > 0;

              return (
                <div key={service.id} className="mt-1">
                  <div className="flex items-center">
                    {hasAreas ? (
                      <button
                        type="button"
                        className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center text-[#333333]/60"
                        aria-expanded={expanded}
                        aria-label={`${expanded ? 'Collapse' : 'Expand'} areas for ${service.name}`}
                        onClick={() =>
                          setExpandedServiceId((prev) => (prev === service.id ? null : service.id))
                        }
                      >
                        <ChevronDown
                          className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                        />
                      </button>
                    ) : (
                      <span className="mr-1 w-8 shrink-0" aria-hidden />
                    )}
                    <Link
                      href={service.href}
                      className="flex-1 px-1 py-2 text-sm text-[#333333] hover:text-[#333333]/70"
                      onClick={handleNavigate}
                    >
                      {service.name}
                    </Link>
                  </div>

                  {hasAreas && expanded && (
                    <div className="ml-9 border-l border-gray-200 pl-3">
                      {service.areas.map((area) => (
                        <Link
                          key={`${service.id}-${area.href}`}
                          href={area.href}
                          className="block py-1.5 text-sm text-[#333333]/75 hover:text-[#333333]"
                          onClick={handleNavigate}
                        >
                          {area.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const activeServiceId = hoveredServiceId ?? items.find((item) => item.areas.length > 0)?.id ?? null;
  const activeService = items.find((item) => item.id === activeServiceId);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseLeave={() => setHoveredServiceId(null)}
    >
      <button
        type="button"
        className={cn(LINK_CLASS, 'inline-flex items-center gap-1')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute left-0 top-full z-50 mt-2 flex min-w-[240px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
          onMouseEnter={() => setOpen(true)}
        >
          <div className="min-w-[220px] border-r border-gray-100 py-1">
            <Link
              href={servicesHref}
              className="block px-4 py-2 text-sm font-medium text-[#333333] hover:bg-[#f0f7f5]"
              onClick={handleNavigate}
            >
              All {label}
            </Link>

            {items.map((service) => (
              <div
                key={service.id}
                className="relative"
                onMouseEnter={() => {
                  setHoveredServiceId(service.id);
                }}
              >
                <Link
                  href={service.href}
                  className={cn(
                    'flex items-center justify-between gap-3 px-4 py-2 text-sm text-[#333333] hover:bg-[#f0f7f5]',
                    activeServiceId === service.id && 'bg-[#f0f7f5]'
                  )}
                  onClick={handleNavigate}
                >
                  <span className="truncate">{service.name}</span>
                  {service.areas.length > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#333333]/50" />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {activeService && activeService.areas.length > 0 && (
            <div className="min-w-[200px] max-w-[260px] py-1">
              <p className="px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[#333333]/50">
                Serving Areas
              </p>
              {activeService.areas.map((area) => (
                <Link
                  key={`${activeService.id}-${area.href}`}
                  href={area.href}
                  className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#f0f7f5]"
                  onClick={handleNavigate}
                >
                  {area.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
