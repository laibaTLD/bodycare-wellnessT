/** Drop baked-in area lists so sections resolve live areas from WebBuilder. */
export function stripStaticAreasFromConfig(service: unknown): unknown {
  if (!service || typeof service !== 'object') return service;
  const { areas, serviceAreas, items, locations, ...cms } = service as Record<string, unknown>;
  return cms;
}
