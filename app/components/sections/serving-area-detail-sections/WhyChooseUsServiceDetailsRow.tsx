'use client';

import { cn } from '@/app/lib/utils';
import { WhyChooseUs } from './WhyChooseUs';
import { ServiceDetails } from './ServiceDetails';

interface WhyChooseUsServiceDetailsRowProps {
  whyChooseUs?: unknown;
  serviceDetails?: unknown;
  className?: string;
}

/** Equal-height side-by-side: Why Choose Us (left) + Service Details (right). */
export function WhyChooseUsServiceDetailsRow({
  whyChooseUs,
  serviceDetails,
  className,
}: WhyChooseUsServiceDetailsRowProps) {
  const hasWhy =
    whyChooseUs != null &&
    typeof whyChooseUs === 'object' &&
    (whyChooseUs as { enabled?: boolean }).enabled !== false;
  const hasDetails =
    serviceDetails != null &&
    typeof serviceDetails === 'object' &&
    (serviceDetails as { enabled?: boolean }).enabled !== false;

  if (!hasWhy && !hasDetails) return null;

  const both = hasWhy && hasDetails;

  return (
    <section className={cn('relative w-full', className)}>
      <div
        className={cn(
          'grid w-full items-stretch',
          both ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {hasWhy ? (
          <div className="h-full min-h-[320px] lg:min-h-[420px]">
            <WhyChooseUs whyChooseUs={whyChooseUs} className="h-full" />
          </div>
        ) : null}
        {hasDetails ? (
          <div className="h-full min-h-[320px] lg:min-h-[420px]">
            <ServiceDetails details={serviceDetails} className="h-full" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default WhyChooseUsServiceDetailsRow;
