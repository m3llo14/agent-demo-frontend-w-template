import { TenantType } from 'types/auth';

export const SECTOR_REGISTRY: Record<string, TenantType> = {
  '68645009154a41b93e41c6eb': 'barber',
  '68e5330855f9c86283f52a75': 'tourism',
  '68abcd12345abcd67890ef': 'hotel',
  '695d707148535c58d5beda7d': 'clinic'
};

const SECTOR_TYPE_REGISTRY: Record<string, TenantType> = {
  hotel: 'hotel',
  tourism: 'tourism',
  barber: 'barber',
  clinic: 'clinic',
  appointment: 'barber'
};

const normalizeSectorType = (value?: string) => String(value ?? '').trim().toLowerCase();

export const resolveTenantType = (params: { sectorId?: string; sectorType?: string }): TenantType | undefined => {
  if (params.sectorId && SECTOR_REGISTRY[params.sectorId]) {
    return SECTOR_REGISTRY[params.sectorId];
  }
  const normalizedType = normalizeSectorType(params.sectorType);
  if (normalizedType && SECTOR_TYPE_REGISTRY[normalizedType]) {
    return SECTOR_TYPE_REGISTRY[normalizedType];
  }
  return undefined;
};