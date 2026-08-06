/** Site slug from `.env` — use instead of hardcoded `default`. */
export function getWebBuilderSiteSlug(): string | undefined {
  const slug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG?.trim();
  return slug || undefined;
}
